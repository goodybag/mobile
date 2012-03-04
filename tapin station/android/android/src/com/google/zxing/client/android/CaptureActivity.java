/*
 * Copyright (C) 2008 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Modified by Goodybag, Inc. 2012
 */

package com.google.zxing.client.android;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.Result;
import com.google.zxing.ResultMetadataType;
import com.google.zxing.ResultPoint;
import com.google.zxing.client.android.camera.CameraManager;
import com.google.zxing.client.android.common.BuildInfo;
import com.google.zxing.client.android.common.GPSInfo;
import com.google.zxing.client.android.common.rest.RequestMethod;
import com.google.zxing.client.android.common.rest.RestClient;
import com.google.zxing.client.android.history.HistoryItem;
import com.google.zxing.client.android.history.HistoryManager;
import com.google.zxing.client.android.result.ResultButtonListener;
import com.google.zxing.client.android.result.ResultHandler;
import com.google.zxing.client.android.result.ResultHandlerFactory;
import com.google.zxing.client.android.result.supplement.SupplementalInfoRetriever;
import com.google.zxing.client.android.tapin.ChangeImageAndEnableCaptureThread;
import com.google.zxing.client.android.tapin.Constants;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnPreparedListener;
import android.media.RingtoneManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.preference.PreferenceManager;
import android.text.ClipboardManager;
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.IOException;
import java.text.DateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * This activity opens the camera and does the actual scanning on a background
 * thread. It draws a viewfinder to help the user place the barcode correctly,
 * shows feedback as the image processing is happening, and then overlays the
 * results when a scan is successful.
 * 
 * @author dswitkin@google.com (Daniel Switkin)
 * @author Sean Owen
 * @author Lalit Kapoor (I Made customizations to the awesome work of the
 *         authors above)
 */
public final class CaptureActivity extends Activity implements SurfaceHolder.Callback {

  private static final String TAG = CaptureActivity.class.getSimpleName();

  private static final int SHARE_ID = Menu.FIRST;
  private static final int HISTORY_ID = Menu.FIRST + 1;
  private static final int SETTINGS_ID = Menu.FIRST + 2;
  private static final int HELP_ID = Menu.FIRST + 3;
  private static final int ABOUT_ID = Menu.FIRST + 4;

  private static final long DEFAULT_INTENT_RESULT_DURATION_MS = 1500L;
  private static final long BULK_MODE_SCAN_DELAY_MS = 2000L;

  private static final String PACKAGE_NAME = "com.google.zxing.client.android";
  private static final String PRODUCT_SEARCH_URL_PREFIX = "http://www.google";
  private static final String PRODUCT_SEARCH_URL_SUFFIX = "/m/products/scan";
  private static final String[] ZXING_URLS = { "http://zxing.appspot.com/scan", "zxing://scan/" };
  private static final String RETURN_CODE_PLACEHOLDER = "{CODE}";
  private static final String RETURN_URL_PARAM = "ret";

  public static final int HISTORY_REQUEST_CODE = 0x0000bacc;

  private static final Set<ResultMetadataType> DISPLAYABLE_METADATA_TYPES = EnumSet.of(ResultMetadataType.ISSUE_NUMBER,
      ResultMetadataType.SUGGESTED_PRICE, ResultMetadataType.ERROR_CORRECTION_LEVEL, ResultMetadataType.POSSIBLE_COUNTRY);

  private CameraManager cameraManager;
  private CaptureActivityHandler handler;
  private Result savedResultToShow;
  private ViewfinderView viewfinderView;
  private TextView statusView;
  private View resultView;
  private Result lastResult;
  private boolean hasSurface;
  private boolean copyToClipboard;
  private IntentSource source;
  private String sourceUrl;
  private String returnUrlTemplate;
  private Collection<BarcodeFormat> decodeFormats;
  private String characterSet;
  private String versionName;
  private HistoryManager historyManager;
  private InactivityTimer inactivityTimer;
  private BeepManager beepManager;

  private HashMap<String, String> heartbeatDataMap = new HashMap<String, String>();

  private final DialogInterface.OnClickListener aboutListener = new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialogInterface, int i) {
      Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(getString(R.string.zxing_url)));
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
      startActivity(intent);
    }
  };

  ViewfinderView getViewfinderView() {
    return viewfinderView;
  }

  public Handler getHandler() {
    return handler;
  }

  CameraManager getCameraManager() {
    return cameraManager;
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);

    // This will prvent the app from ever closing (it relaunches it)
    if (!hasFocus) {
      Log.w("SYSTEM-WIDE", "FOCUS HAS BEEN LOST");
      Log.w("SYSTEM-WIDE", "RE-LAUNCING APPLICATION");
      Intent intent = new Intent("android.intent.action.MAIN");
      intent.setComponent(ComponentName.unflattenFromString("com.google.zxing.client.android/.CaptureActivity"));
      intent.addCategory("android.intent.category.LAUNCHER");
      startActivity(intent);
    } else {
      Log.w("SYSTEM-WIDE", "FOCUS HAS BEEN RESTORED");
    }
  }
  
  public boolean isOnline() {
    ConnectivityManager cm =
        (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

    return cm.getActiveNetworkInfo().isConnectedOrConnecting();
}

  @Override
  public void onCreate(Bundle icicle) {
    Log.i("SYSTEM-WIDE", "CREATE");
    super.onCreate(icicle);

    // onStart();

    // setup databases and tables if non-existent
    setupDB();

    // launch thread to resubmit pending codes every 10 seconds with doubled
    // growth till 10 minutes of gap between sends if data sends
    // successfully then gradually decrement this value until 10 seconds
    submitPendingCodes();

    BuildInfo build = BuildInfo.getInstance(this, icicle);

    
    Log.i("device-info", build.toString());
    //Log.i("network-info", wifiManager.getConnectionInfo().toString());

    // the device sends periodic updates about itself to a remote server

    heartbeatDataMap.put("build", build.toString());
    // heartbeatDataMap.put("network",
    // wifiManager.getConnectionInfo().toString());

    submitHeartbeat(heartbeatDataMap);

    Window window = getWindow();
    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    setContentView(R.layout.capture);

    hasSurface = false;
    historyManager = new HistoryManager(this);
    historyManager.trimHistory();
    inactivityTimer = new InactivityTimer(this);
    beepManager = new BeepManager(this);

    PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

    // showHelpOnFirstLaunch();
  }

  public void submitHeartbeat(HashMap<String, String> data) {
    class SendHeartBeat implements Runnable {

      HashMap<String, String> data;

      public SendHeartBeat(HashMap<String, String> data) {
        this.data = data;
      }

      @Override
      public void run() {
        try {
          while (true) {
            SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
            String businessId = preference.getString(Constants.KEY_BUSINESS_ID, null);
            String registerId = preference.getString(Constants.KEY_REGISTER_ID, null);
            String locationId = preference.getString(Constants.KEY_LOCATION_ID, null);

            RestClient restClient = new RestClient(Constants.URL_HEARTBEAT);

            restClient.addParam("businessId", businessId);
            restClient.addParam("locationId", locationId);
            restClient.addParam("registerId", registerId);
            restClient.addParam("timestamp", new Date().toString());
            
            

            for (String key : data.keySet()) {
              restClient.addParam(key, data.get(key));
            }
            try {
              restClient.execute(RequestMethod.POST);
              int responseCode = restClient.getResponseCode();
              Log.i("tapin-heartbeat-post", "RESPONSE CODE: " + responseCode);
              if (responseCode == 200) {
                String response = restClient.getResponse();
                Log.i("tapin-heartbeat-post", response);
              } else {
                Log.i("tapin-heartbeat-post", "unable to successfully post heartbeat data to server");
              }
            } catch (Exception e) {
              e.printStackTrace();
              Log.e("tapin-heartbeat-post", "error submitting heartbeat data to server");
              // TODO: implement save
              // saveCode(code);
            }

            Thread.sleep(Constants.SUBMIT_HEARTBEAT_DELAY_MS);
          }
        } catch (InterruptedException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
      }
    }
    ;

    Thread submitHeartBeatThread = new Thread(new SendHeartBeat(data));
    submitHeartBeatThread.start();
  }

  public void submitPendingCodes() {
    // we start by looking for a code who's id is greater than -1 and we
    // submit that then we replace this with the id of the recently
    // attempted submission until we receive 0 rows, in which case we set id
    // back to -1

    class ReSubmit implements Runnable {
      CaptureActivity captureActivity;

      public ReSubmit(CaptureActivity captureActivity) {
        this.captureActivity = captureActivity;
      }

      public int incrementDelay() {
        SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preference.edit();

        int delay = preference.getInt(Constants.KEY_SUBMIT_PENDING_DELAY, Constants.SUBMIT_PENDING_DELAY_MS_MIN);
        delay = delay * 2;
        if (delay > Constants.SUBMIT_PENDING_DELAY_MS_MAX) {
          delay = Constants.SUBMIT_PENDING_DELAY_MS_MAX;
        }

        editor.putInt(Constants.KEY_SUBMIT_PENDING_DELAY, delay);
        editor.commit();

        return delay;

      }

      public int decrementDelay() {
        SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preference.edit();

        int delay = preference.getInt(Constants.KEY_SUBMIT_PENDING_DELAY, Constants.SUBMIT_PENDING_DELAY_MS_MIN);
        if (delay > 0) {
          delay = delay / 2;
          if (delay < Constants.SUBMIT_PENDING_DELAY_MS_MIN) {
            delay = Constants.SUBMIT_PENDING_DELAY_MS_MIN;
          }
          if (delay > Constants.SUBMIT_PENDING_DELAY_MS_MAX) {
            delay = Constants.SUBMIT_PENDING_DELAY_MS_MAX;
          }
        } else {
          delay = Constants.SUBMIT_PENDING_DELAY_MS_MIN;
        }

        editor.putInt(Constants.KEY_SUBMIT_PENDING_DELAY, delay);
        editor.commit();

        return delay;
      }

      @Override
      public void run() {
        int id = -1;
        int newDelay = Constants.SUBMIT_PENDING_DELAY_MS_MAX; // just for
                                                              // logging
                                                              // purposes below

        while (true) {
          SQLiteDatabase db = captureActivity.openOrCreateDatabase(Constants.DB_GOODYBAG, Context.MODE_PRIVATE, null);
          SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
          int delay = preference.getInt(Constants.KEY_SUBMIT_PENDING_DELAY, Constants.SUBMIT_PENDING_DELAY_MS_MIN);
          String businessId = null;
          String locationId = null;
          String registerId = null;
          String code = null;
          String timestamp = null;

          try {
            Thread.sleep(delay);
            String findSinglePendingSQL = "SELECT * FROM " + Constants.DB_PENDING_CODES_TABLE + " ORDER BY ID DESC LIMIT 1";
            if (id > -1)
              findSinglePendingSQL = "SELECT * FROM " + Constants.DB_PENDING_CODES_TABLE + " WHERE ID<" + id + " ORDER BY ID DESC LIMIT 1";
            Cursor cursor = db.rawQuery(findSinglePendingSQL, null);
            if (cursor.moveToFirst() != false) {
              businessId = cursor.getString(1);
              locationId = cursor.getString(2);
              registerId = cursor.getString(3);
              code = cursor.getString(4);
              timestamp = cursor.getString(5);

              id = cursor.getInt(0);
              Log.i("tapin-submit-pending-codes", "index of item being submitted: " + id);

              Log.i("tapin-submit-pending-codes", "attempting to resubmit a pending tapIn with code: " + code);
            } else {
              id = -1;
            }
          } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            Log.e("tapin-submit-pending-codes", "Unable to get information from database.");
          } finally {
            db.close();
          }

          // if there was anything then submit
          if (id > -1) {
            boolean success = submitCode(businessId, locationId, registerId, code, timestamp, false);
            if (success) {
              deleteCode(id);
              newDelay = decrementDelay();
              Log.i("tapin-submit-pending-codes", "successful submitting, delay decremented to (ms): " + newDelay);
            } else {
              newDelay = incrementDelay();
              Log.i("tapin-submit-pending-codes", "unsuccessful submitting, delay incremented to (ms): " + newDelay);
            }
          } else {
            Log.i("tapin-submit-pending-codes", "nothing to submit :)");
            if (delay > Constants.SUBMIT_PENDING_DELAY_MS_MIN) {
              newDelay = decrementDelay();
              Log.i("tapin-submit-pending-codes", "delay decremented to (ms): " + newDelay);
            }
          }
        }// while loop
      }// run method
    }
    ; // runnable class

    Thread resubmit = new Thread(new ReSubmit(this));
    resubmit.start();
  }

  public void setupDB() {
    SQLiteDatabase db = this.openOrCreateDatabase(Constants.DB_GOODYBAG, Context.MODE_PRIVATE, null);
    try {
      String createCodeTable = "CREATE TABLE IF NOT EXISTS " + Constants.DB_PENDING_CODES_TABLE
          + "(id INTEGER PRIMARY KEY ASC, businessId TEXT, locationId TEXT, registerId TEXT, code TEXT, timestamp TEXT)";
      db.execSQL(createCodeTable);

    } catch (Exception e) {
      Log.e("tapin-setup-db", "There was an error connecting/creating the database and tables");
      e.printStackTrace();
    } finally {
      db.close();
    }
  }

  @Override
  protected void onResume() {
    Log.i("SYSTEM-WIDE", "RESUME");
    super.onResume();

    // onStart();
    /*
     * // this will require root Process proc; try { proc =
     * Runtime.getRuntime().exec(new
     * String[]{"su","-c","service call activity 79 s16 com.android.systemui"});
     * proc.waitFor(); } catch (IOException e) { // TODO Auto-generated catch
     * block e.printStackTrace(); } catch (InterruptedException e) { // TODO
     * Auto-generated catch block e.printStackTrace(); }
     */
    // CameraManager must be initialized here, not in onCreate(). This is
    // necessary because we don't
    // want to open the camera driver and measure the screen size if we're
    // going to show the help on
    // first launch. That led to bugs where the scanning rectangle was the
    // wrong size and partially
    // off screen.
    cameraManager = new CameraManager(getApplication());

    viewfinderView = (ViewfinderView) findViewById(R.id.viewfinder_view);
    viewfinderView.setCameraManager(cameraManager);

    resultView = findViewById(R.id.result_view);
    statusView = (TextView) findViewById(R.id.status_view);

    handler = null;
    lastResult = null;

    resetStatusView();

    SurfaceView surfaceView = (SurfaceView) findViewById(R.id.preview_view);
    // surfaceView.layout(100,100,300,300);

    /*
     * android.widget.FrameLayout.LayoutParams params = new
     * android.widget.FrameLayout.LayoutParams(800, 480); params.leftMargin =
     * (800-300)/2; params.topMargin = (-480+300)/2;
     * 
     * // params.leftMargin = 800-300; // params.topMargin = -480+300;
     * surfaceView.setLayoutParams(params);
     */
    SurfaceHolder surfaceHolder = surfaceView.getHolder();
    if (hasSurface) {
      // The activity was paused but not stopped, so the surface still
      // exists. Therefore
      // surfaceCreated() won't be called, so init the camera here.
      initCamera(surfaceHolder);
    } else {
      // Install the callback and wait for surfaceCreated() to init the
      // camera.
      surfaceHolder.addCallback(this);
      surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
    }

    beepManager.updatePrefs();

    inactivityTimer.onResume();

    Intent intent = getIntent();

    SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
    copyToClipboard = prefs.getBoolean(PreferencesActivity.KEY_COPY_TO_CLIPBOARD, true)
        && (intent == null || intent.getBooleanExtra(Intents.Scan.SAVE_HISTORY, true));

    source = IntentSource.NONE;
    decodeFormats = null;
    characterSet = null;

    if (intent != null) {

      String action = intent.getAction();
      String dataString = intent.getDataString();

      if (Intents.Scan.ACTION.equals(action)) {

        // Scan the formats the intent requested, and return the result
        // to the calling activity.
        source = IntentSource.NATIVE_APP_INTENT;
        decodeFormats = DecodeFormatManager.parseDecodeFormats(intent);

        if (intent.hasExtra(Intents.Scan.WIDTH) && intent.hasExtra(Intents.Scan.HEIGHT)) {
          int width = intent.getIntExtra(Intents.Scan.WIDTH, 0);
          int height = intent.getIntExtra(Intents.Scan.HEIGHT, 0);
          if (width > 0 && height > 0) {
            cameraManager.setManualFramingRect(width, height);
          }
        }

        String customPromptMessage = intent.getStringExtra(Intents.Scan.PROMPT_MESSAGE);
        if (customPromptMessage != null) {
          statusView.setText(customPromptMessage);
        }

      } else if (dataString != null && dataString.contains(PRODUCT_SEARCH_URL_PREFIX) && dataString.contains(PRODUCT_SEARCH_URL_SUFFIX)) {

        // Scan only products and send the result to mobile Product
        // Search.
        source = IntentSource.PRODUCT_SEARCH_LINK;
        sourceUrl = dataString;
        decodeFormats = DecodeFormatManager.PRODUCT_FORMATS;

      } else if (isZXingURL(dataString)) {

        // Scan formats requested in query string (all formats if none
        // specified).
        // If a return URL is specified, send the results there.
        // Otherwise, handle it ourselves.
        source = IntentSource.ZXING_LINK;
        sourceUrl = dataString;
        Uri inputUri = Uri.parse(sourceUrl);
        returnUrlTemplate = inputUri.getQueryParameter(RETURN_URL_PARAM);
        decodeFormats = DecodeFormatManager.parseDecodeFormats(inputUri);

      }

      characterSet = intent.getStringExtra(Intents.Scan.CHARACTER_SET);

    }
  }

  private static boolean isZXingURL(String dataString) {
    if (dataString == null) {
      return false;
    }
    for (String url : ZXING_URLS) {
      if (dataString.startsWith(url)) {
        return true;
      }
    }
    return false;
  }

  @Override
  protected void onPause() {
    Log.i("SYSTEM-WIDE", "PAUSE");
    if (handler != null) {
      handler.quitSynchronously();
      handler = null;
    }
    inactivityTimer.onPause();
    cameraManager.closeDriver();
    if (!hasSurface) {
      SurfaceView surfaceView = (SurfaceView) findViewById(R.id.preview_view);
      SurfaceHolder surfaceHolder = surfaceView.getHolder();
      surfaceHolder.removeCallback(this);
      // onW
    }

    super.onPause();
    // onResume();
    // onStart();
  }

  @Override
  protected void onDestroy() {
    inactivityTimer.shutdown();
    super.onDestroy();
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_BACK) {
      if (source == IntentSource.NATIVE_APP_INTENT) {
        setResult(RESULT_CANCELED);
        finish();
        return true;
      } else if ((source == IntentSource.NONE || source == IntentSource.ZXING_LINK) && lastResult != null) {
        restartPreviewAfterDelay(0L);
        return true;
      }
    } else if (keyCode == KeyEvent.KEYCODE_FOCUS || keyCode == KeyEvent.KEYCODE_CAMERA) {
      // Handle these events so they don't launch the Camera app
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    super.onCreateOptionsMenu(menu);
    menu.add(Menu.NONE, SHARE_ID, Menu.NONE, R.string.menu_share).setIcon(android.R.drawable.ic_menu_share);
    menu.add(Menu.NONE, HISTORY_ID, Menu.NONE, R.string.menu_history).setIcon(android.R.drawable.ic_menu_recent_history);
    menu.add(Menu.NONE, SETTINGS_ID, Menu.NONE, R.string.menu_settings).setIcon(android.R.drawable.ic_menu_preferences);
    menu.add(Menu.NONE, HELP_ID, Menu.NONE, R.string.menu_help).setIcon(android.R.drawable.ic_menu_help);
    menu.add(Menu.NONE, ABOUT_ID, Menu.NONE, R.string.menu_about).setIcon(android.R.drawable.ic_menu_info_details);
    return true;
  }

  // Don't display the share menu item if the result overlay is showing.
  @Override
  public boolean onPrepareOptionsMenu(Menu menu) {
    super.onPrepareOptionsMenu(menu);
    menu.findItem(SHARE_ID).setVisible(lastResult == null);
    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    /*
     * Intent intent = new Intent(Intent.ACTION_VIEW);
     * intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET); switch
     * (item.getItemId()) { case SHARE_ID: intent.setClassName(this,
     * ShareActivity.class.getName()); startActivity(intent); break; case
     * HISTORY_ID: intent = new Intent(Intent.ACTION_VIEW);
     * intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
     * intent.setClassName(this, HistoryActivity.class.getName());
     * startActivityForResult(intent, HISTORY_REQUEST_CODE); break; case
     * SETTINGS_ID: intent.setClassName(this,
     * PreferencesActivity.class.getName()); startActivity(intent); break; case
     * HELP_ID: intent.setClassName(this, HelpActivity.class.getName());
     * startActivity(intent); break; case ABOUT_ID: AlertDialog.Builder builder
     * = new AlertDialog.Builder(this);
     * builder.setTitle(getString(R.string.title_about) + versionName);
     * builder.setMessage(getString(R.string.msg_about) + "\n\n" +
     * getString(R.string.zxing_url));
     * builder.setIcon(R.drawable.launcher_icon);
     * builder.setPositiveButton(R.string.button_open_browser, aboutListener);
     * builder.setNegativeButton(R.string.button_cancel, null); builder.show();
     * break; default: return super.onOptionsItemSelected(item); }
     */
    return true;
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    if (resultCode == RESULT_OK) {
      if (requestCode == HISTORY_REQUEST_CODE) {
        int itemNumber = intent.getIntExtra(Intents.History.ITEM_NUMBER, -1);
        if (itemNumber >= 0) {
          HistoryItem historyItem = historyManager.buildHistoryItem(itemNumber);
          decodeOrStoreSavedBitmap(null, historyItem.getResult());
        }
      }
    }
  }

  private void decodeOrStoreSavedBitmap(Bitmap bitmap, Result result) {
    // Bitmap isn't used yet -- will be used soon
    if (handler == null) {
      savedResultToShow = result;
    } else {
      if (result != null) {
        savedResultToShow = result;
      }
      if (savedResultToShow != null) {
        Message message = Message.obtain(handler, R.id.decode_succeeded, savedResultToShow);
        handler.sendMessage(message);
      }
      savedResultToShow = null;
    }
  }

  @Override
  public void surfaceCreated(SurfaceHolder holder) {
    if (holder == null) {
      Log.e(TAG, "*** WARNING *** surfaceCreated() gave us a null surface!");
    }
    if (!hasSurface) {
      hasSurface = true;
      initCamera(holder);
    }
  }

  @Override
  public void surfaceDestroyed(SurfaceHolder holder) {
    hasSurface = false;
  }

  @Override
  public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

  }

  public boolean processCode(String code, boolean save) {
    SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
    String businessId = preference.getString(Constants.KEY_BUSINESS_ID, null);
    String registerId = preference.getString(Constants.KEY_REGISTER_ID, null);
    String locationId = preference.getString(Constants.KEY_LOCATION_ID, null);

    String timestamp = new Date().toString();

    return submitCode(businessId, locationId, registerId, code, timestamp, true);

  }

  public boolean submitCode(String businessId, String locationId, String registerId, String code, String timestamp, boolean save) {
    // Sent to server
    RestClient restClient = new RestClient(Constants.URL_TRANSACTIONS);

    restClient.addParam("barcodeId", code);
    restClient.addParam("businessId", businessId);
    restClient.addParam("locationId", locationId);
    restClient.addParam("registerId", registerId);
    restClient.addParam("timestamp", timestamp);
    Log.i("tapin-post-data", "timestamp: " + timestamp);

    // TODO: Do this in a Thread? Yes (just run this entire function in a
    // thread)
    try {
      restClient.execute(RequestMethod.POST);
      int responseCode = restClient.getResponseCode();
      Log.i("tapin-post", "RESPONSE CODE: " + responseCode);
      if (responseCode == 200) {
        String response = restClient.getResponse();
        Log.i("tapin-post", response);
        return true;
      } else {
        // TODO: implement save
        if (save) {
          Log.w("tapin-post", "unable to POST tapIn data to server. Saving to local database. Will retry again later");
          saveCode(businessId, locationId, registerId, code, timestamp);
        }
        return false;
      }
    } catch (Exception e) {
      e.printStackTrace();
      Log.e("tapin-post", "error submitting tapIn data to server");
      // TODO: implement save
      // saveCode(code);
    }
    return false;
  }

  public boolean deleteCode(int id) {
    SQLiteDatabase db = this.openOrCreateDatabase(Constants.DB_GOODYBAG, Context.MODE_PRIVATE, null);
    try {
      String deleteSQL = "DELETE FROM " + Constants.DB_PENDING_CODES_TABLE + " WHERE ID=" + id;
      db.execSQL(deleteSQL);
      Log.i("tapin-delete-code", "Deleted pending tapIn from the database with id: " + id);
      return true;
    } catch (Exception e) {
      e.printStackTrace();
      Log.e("tapin-delete-code", "There was an error removing the pending tapIn from the database");
    } finally {
      db.close();
    }
    return false;
  }

  public boolean saveCode(String businessId, String locationId, String registerId, String code, String timestamp) {
    Log.i("tapin-save-code", "Attempting to save code: " + code + " to database");
    SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);

    SQLiteDatabase db = this.openOrCreateDatabase(Constants.DB_GOODYBAG, Context.MODE_PRIVATE, null);
    try {
      String insertSQL = "INSERT INTO " + Constants.DB_PENDING_CODES_TABLE + " VALUES(NULL, '" + businessId + "', '" + locationId + "', '"
          + registerId + "', '" + code + "', '" + timestamp + "')";

      Log.d("tapin-save-code", insertSQL);
      db.execSQL(insertSQL);
      Log.i("tapin-save-code", "SAVED code pending submission: " + code + " to database");
      return true;
    } catch (Exception e) {
      e.printStackTrace();
      Log.e("tapin-save-code", "There was an error saving the code to the database");
    } finally {
      db.close();
    }
    return false;
  }

  /**
   * A valid barcode has been found, so give an indication of success and show
   * the results.
   * 
   * @param rawResult
   *          The contents of the barcode.
   * @param barcode
   *          A greyscale bitmap of the camera data which was decoded.
   */
  public void handleDecode(Result rawResult, Bitmap barcode) {
    inactivityTimer.onActivity();
    lastResult = rawResult;
    // ResultHandler resultHandler =
    // ResultHandlerFactory.makeResultHandler(this, rawResult);
    // historyManager.addHistoryItem(rawResult, resultHandler);

    Log.i("tapin", "got barcode: rawResult " + rawResult.getText());
    // beepManager.playBeepSoundAndVibrate();

    // submit data to server. if fail then store to database to be set later
    String code = rawResult.getText();

    processCode(code, true);

    showSuccessScreen();
    Runnable r = new ChangeImageAndEnableCaptureThread(this);
    getHandler().postDelayed(r, 2000);
    // restartPreviewAfterDelay(BULK_MODE_SCAN_DELAY_MS);

    /*
     * Display display = getWindowManager().getDefaultDisplay(); Point size =
     * new Point(); display.getSize(size); int width = size.x; int height =
     * size.y;
     */
    // int width= imageOverlay.getWidth();
    // int height = imageOverlay.getHeight();
    // Log.i("tapin", "width: "+width+" height: "+height);

    /*
     * if (barcode == null) { // This is from history -- no saved barcode
     * handleDecodeInternally(rawResult, resultHandler, null); } else {
     * 
     * drawResultPoints(barcode, rawResult); switch (source) { case
     * NATIVE_APP_INTENT: case PRODUCT_SEARCH_LINK:
     * handleDecodeExternally(rawResult, resultHandler, barcode); break; case
     * ZXING_LINK: if (returnUrlTemplate == null){
     * handleDecodeInternally(rawResult, resultHandler, barcode); } else {
     * handleDecodeExternally(rawResult, resultHandler, barcode); } break; case
     * NONE: SharedPreferences prefs =
     * PreferenceManager.getDefaultSharedPreferences(this); if
     * (prefs.getBoolean(PreferencesActivity.KEY_BULK_MODE, false)) {
     * Toast.makeText(this, R.string.msg_bulk_mode_scanned,
     * Toast.LENGTH_SHORT).show(); // Wait a moment or else it will scan the
     * same barcode continuously about 3 times
     * restartPreviewAfterDelay(BULK_MODE_SCAN_DELAY_MS); } else {
     * handleDecodeInternally(rawResult, resultHandler, barcode); } break; } }
     */
  }

  public void showDefaultScreen() {
    ImageView imageOverlay = (ImageView) findViewById(R.id.image_overlay);
    imageOverlay.setImageResource(R.drawable.scan_default);
  }

  public void showSuccessScreen() {
    ImageView imageOverlay = (ImageView) findViewById(R.id.image_overlay);
    imageOverlay.setImageResource(R.drawable.scan_success);
    // beepManager.playBeepSoundAndVibrate();
    playSound();
  }

  public void showFailScreen() {
    ImageView imageOverlay = (ImageView) findViewById(R.id.image_overlay);
    imageOverlay.setImageResource(R.drawable.scan_fail);
  }

  public void playSound() {
    Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
    /*
     * MediaPlayer mp = MediaPlayer.create(getApplicationContext(), soundUri);
     * 
     * mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
     * 
     * @Override public void onCompletion(MediaPlayer mp) { mp.stop();
     * mp.release(); } }); mp.start();
     */

    try {
      MediaPlayer mp = new MediaPlayer();
      mp.setDataSource(getApplicationContext(), soundUri);
      mp.setAudioStreamType(AudioManager.STREAM_MUSIC);
      mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mp) {
          mp.stop();
          mp.release();
        }
      });
      mp.prepare();
      mp.start();
    } catch (Exception e) {
      e.printStackTrace();
      Log.e("tapin-sound", "unable to play sound");
    }

    /*
     * mp.setLooping(false); mp.setAudioStreamType(AudioManager.STREAM_MUSIC);
     * mp.setVolume(1.0f, 1.0f); //mp.start(); //mp.prepare();
     * 
     * mp.setOnPreparedListener(new OnPreparedListener() {
     * 
     * @Override public void onPrepared(MediaPlayer mp) { mp.start();
     * while(mp.isPlaying()){}; } });
     */

    /*
     * MediaPlayer mMediaPlayer = new MediaPlayer();
     * mMediaPlayer.setDataSource(context, soundUri); final AudioManager
     * audioManager = (AudioManager)
     * context.getSystemService(Context.AUDIO_SERVICE); if
     * (audioManager.getStreamVolume(AudioManager.STREAM_MUSIC) != 0) {
     * mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
     * mMediaPlayer.setVolume(1.0f, 1.0f); mMediaPlayer.setLooping(true);
     * mMediaPlayer.prepare(); mMediaPlayer.seekTo(0); mMediaPlayer.start(); }
     */
  }

  /**
   * Superimpose a line for 1D or dots for 2D to highlight the key features of
   * the barcode.
   * 
   * @param barcode
   *          A bitmap of the captured image.
   * @param rawResult
   *          The decoded results which contains the points to draw.
   */
  private void drawResultPoints(Bitmap barcode, Result rawResult) {
    ResultPoint[] points = rawResult.getResultPoints();
    if (points != null && points.length > 0) {
      Canvas canvas = new Canvas(barcode);
      Paint paint = new Paint();
      paint.setColor(getResources().getColor(R.color.result_image_border));
      paint.setStrokeWidth(3.0f);
      paint.setStyle(Paint.Style.STROKE);
      Rect border = new Rect(2, 2, barcode.getWidth() - 2, barcode.getHeight() - 2);
      canvas.drawRect(border, paint);

      paint.setColor(getResources().getColor(R.color.result_points));
      if (points.length == 2) {
        paint.setStrokeWidth(4.0f);
        drawLine(canvas, paint, points[0], points[1]);
      } else if (points.length == 4
          && (rawResult.getBarcodeFormat() == BarcodeFormat.UPC_A || rawResult.getBarcodeFormat() == BarcodeFormat.EAN_13)) {
        // Hacky special case -- draw two lines, for the barcode and
        // metadata
        drawLine(canvas, paint, points[0], points[1]);
        drawLine(canvas, paint, points[2], points[3]);
      } else {
        paint.setStrokeWidth(10.0f);
        for (ResultPoint point : points) {
          canvas.drawPoint(point.getX(), point.getY(), paint);
        }
      }
    }
  }

  private static void drawLine(Canvas canvas, Paint paint, ResultPoint a, ResultPoint b) {
    canvas.drawLine(a.getX(), a.getY(), b.getX(), b.getY(), paint);
  }

  // Put up our own UI for how to handle the decoded contents.
  private void handleDecodeInternally(Result rawResult, ResultHandler resultHandler, Bitmap barcode) {
    statusView.setVisibility(View.GONE);
    viewfinderView.setVisibility(View.GONE);
    resultView.setVisibility(View.VISIBLE);

    ImageView barcodeImageView = (ImageView) findViewById(R.id.barcode_image_view);
    if (barcode == null) {
      barcodeImageView.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.launcher_icon));
    } else {
      barcodeImageView.setImageBitmap(barcode);
    }

    TextView formatTextView = (TextView) findViewById(R.id.format_text_view);
    formatTextView.setText(rawResult.getBarcodeFormat().toString());

    TextView typeTextView = (TextView) findViewById(R.id.type_text_view);
    typeTextView.setText(resultHandler.getType().toString());

    DateFormat formatter = DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT);
    String formattedTime = formatter.format(new Date(rawResult.getTimestamp()));
    TextView timeTextView = (TextView) findViewById(R.id.time_text_view);
    timeTextView.setText(formattedTime);

    TextView metaTextView = (TextView) findViewById(R.id.meta_text_view);
    View metaTextViewLabel = findViewById(R.id.meta_text_view_label);
    metaTextView.setVisibility(View.GONE);
    metaTextViewLabel.setVisibility(View.GONE);
    Map<ResultMetadataType, Object> metadata = rawResult.getResultMetadata();
    if (metadata != null) {
      StringBuilder metadataText = new StringBuilder(20);
      for (Map.Entry<ResultMetadataType, Object> entry : metadata.entrySet()) {
        if (DISPLAYABLE_METADATA_TYPES.contains(entry.getKey())) {
          metadataText.append(entry.getValue()).append('\n');
        }
      }
      if (metadataText.length() > 0) {
        metadataText.setLength(metadataText.length() - 1);
        metaTextView.setText(metadataText);
        metaTextView.setVisibility(View.VISIBLE);
        metaTextViewLabel.setVisibility(View.VISIBLE);
      }
    }

    TextView contentsTextView = (TextView) findViewById(R.id.contents_text_view);
    CharSequence displayContents = resultHandler.getDisplayContents();
    contentsTextView.setText(displayContents);
    // Crudely scale betweeen 22 and 32 -- bigger font for shorter text
    int scaledSize = Math.max(22, 32 - displayContents.length() / 4);
    contentsTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, scaledSize);

    TextView supplementTextView = (TextView) findViewById(R.id.contents_supplement_text_view);
    supplementTextView.setText("");
    supplementTextView.setOnClickListener(null);
    if (PreferenceManager.getDefaultSharedPreferences(this).getBoolean(PreferencesActivity.KEY_SUPPLEMENTAL, true)) {
      SupplementalInfoRetriever.maybeInvokeRetrieval(supplementTextView, resultHandler.getResult(), handler, historyManager, this);
    }

    int buttonCount = resultHandler.getButtonCount();
    ViewGroup buttonView = (ViewGroup) findViewById(R.id.result_button_view);
    buttonView.requestFocus();
    for (int x = 0; x < ResultHandler.MAX_BUTTON_COUNT; x++) {
      TextView button = (TextView) buttonView.getChildAt(x);
      if (x < buttonCount) {
        button.setVisibility(View.VISIBLE);
        button.setText(resultHandler.getButtonText(x));
        button.setOnClickListener(new ResultButtonListener(resultHandler, x));
      } else {
        button.setVisibility(View.GONE);
      }
    }

    if (copyToClipboard && !resultHandler.areContentsSecure()) {
      ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
      clipboard.setText(displayContents);
    }
  }

  /*
   * // Briefly show the contents of the barcode, then handle the result outside
   * Barcode Scanner. private void handleDecodeExternally(Result rawResult,
   * ResultHandler resultHandler, Bitmap barcode) {
   * viewfinderView.drawResultBitmap(barcode);
   * 
   * // Since this message will only be shown for a second, just tell the user
   * what kind of // barcode was found (e.g. contact info) rather than the full
   * contents, which they won't // have time to read.
   * statusView.setText(getString(resultHandler.getDisplayTitle()));
   * 
   * if (copyToClipboard && !resultHandler.areContentsSecure()) {
   * ClipboardManager clipboard = (ClipboardManager)
   * getSystemService(CLIPBOARD_SERVICE);
   * clipboard.setText(resultHandler.getDisplayContents()); }
   * 
   * if (source == IntentSource.NATIVE_APP_INTENT) {
   * 
   * // Hand back whatever action they requested - this can be changed to
   * Intents.Scan.ACTION when // the deprecated intent is retired. Intent intent
   * = new Intent(getIntent().getAction());
   * intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
   * intent.putExtra(Intents.Scan.RESULT, rawResult.toString());
   * intent.putExtra(Intents.Scan.RESULT_FORMAT,
   * rawResult.getBarcodeFormat().toString()); byte[] rawBytes =
   * rawResult.getRawBytes(); if (rawBytes != null && rawBytes.length > 0) {
   * intent.putExtra(Intents.Scan.RESULT_BYTES, rawBytes); }
   * Map<ResultMetadataType,?> metadata = rawResult.getResultMetadata(); if
   * (metadata != null) { Integer orientation = (Integer)
   * metadata.get(ResultMetadataType.ORIENTATION); if (orientation != null) {
   * intent.putExtra(Intents.Scan.RESULT_ORIENTATION, orientation.intValue()); }
   * String ecLevel = (String)
   * metadata.get(ResultMetadataType.ERROR_CORRECTION_LEVEL); if (ecLevel !=
   * null) { intent.putExtra(Intents.Scan.RESULT_ERROR_CORRECTION_LEVEL,
   * ecLevel); } Iterable<byte[]> byteSegments = (Iterable<byte[]>)
   * metadata.get(ResultMetadataType.BYTE_SEGMENTS); if (byteSegments != null) {
   * int i = 0; for (byte[] byteSegment : byteSegments) {
   * intent.putExtra(Intents.Scan.RESULT_BYTE_SEGMENTS_PREFIX + i, byteSegment);
   * i++; } } } sendReplyMessage(R.id.return_scan_result, intent);
   * 
   * } else if (source == IntentSource.PRODUCT_SEARCH_LINK) {
   * 
   * // Reformulate the URL which triggered us into a query, so that the request
   * goes to the same // TLD as the scan URL. int end =
   * sourceUrl.lastIndexOf("/scan"); String replyURL = sourceUrl.substring(0,
   * end) + "?q=" + resultHandler.getDisplayContents() + "&source=zxing";
   * sendReplyMessage(R.id.launch_product_query, replyURL);
   * 
   * } else if (source == IntentSource.ZXING_LINK) {
   * 
   * // Replace each occurrence of RETURN_CODE_PLACEHOLDER in the
   * returnUrlTemplate // with the scanned code. This allows both queries and
   * REST-style URLs to work. if (returnUrlTemplate != null) { String
   * codeReplacement = String.valueOf(resultHandler.getDisplayContents()); try {
   * codeReplacement = URLEncoder.encode(codeReplacement, "UTF-8"); } catch
   * (UnsupportedEncodingException e) { // can't happen; UTF-8 is always
   * supported. Continue, I guess, without encoding } String replyURL =
   * returnUrlTemplate.replace(RETURN_CODE_PLACEHOLDER, codeReplacement);
   * sendReplyMessage(R.id.launch_product_query, replyURL); }
   * 
   * } }
   */

  private void sendReplyMessage(int id, Object arg) {
    Message message = Message.obtain(handler, id, arg);
    long resultDurationMS = getIntent().getLongExtra(Intents.Scan.RESULT_DISPLAY_DURATION_MS, DEFAULT_INTENT_RESULT_DURATION_MS);
    if (resultDurationMS > 0L) {
      handler.sendMessageDelayed(message, resultDurationMS);
    } else {
      handler.sendMessage(message);
    }
  }

  /**
   * We want the help screen to be shown automatically the first time a new
   * version of the app is run. The easiest way to do this is to check
   * android:versionCode from the manifest, and compare it to a value stored as
   * a preference.
   */
  private boolean showHelpOnFirstLaunch() {
    try {
      PackageInfo info = getPackageManager().getPackageInfo(PACKAGE_NAME, 0);
      int currentVersion = info.versionCode;
      // Since we're paying to talk to the PackageManager anyway, it makes
      // sense to cache the app
      // version name here for display in the about box later.
      this.versionName = info.versionName;
      SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
      int lastVersion = prefs.getInt(PreferencesActivity.KEY_HELP_VERSION_SHOWN, 0);
      if (currentVersion > lastVersion) {
        prefs.edit().putInt(PreferencesActivity.KEY_HELP_VERSION_SHOWN, currentVersion).commit();
        Intent intent = new Intent(this, HelpActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
        // Show the default page on a clean install, and the what's new
        // page on an upgrade.
        String page = lastVersion == 0 ? HelpActivity.DEFAULT_PAGE : HelpActivity.WHATS_NEW_PAGE;
        intent.putExtra(HelpActivity.REQUESTED_PAGE_KEY, page);
        startActivity(intent);
        return true;
      }
    } catch (PackageManager.NameNotFoundException e) {
      Log.w(TAG, e);
    }
    return false;
  }

  private void initCamera(SurfaceHolder surfaceHolder) {
    try {
      cameraManager.openDriver(surfaceHolder);
      // Creating the handler starts the preview, which can also throw a
      // RuntimeException.
      if (handler == null) {
        handler = new CaptureActivityHandler(this, decodeFormats, characterSet, cameraManager);
      }
      decodeOrStoreSavedBitmap(null, null);
    } catch (IOException ioe) {
      Log.w(TAG, ioe);
      displayFrameworkBugMessageAndExit();
    } catch (RuntimeException e) {
      // Barcode Scanner has seen crashes in the wild of this variety:
      // java.?lang.?RuntimeException: Fail to connect to camera service
      Log.w(TAG, "Unexpected error initializing camera", e);
      displayFrameworkBugMessageAndExit();
    }
  }

  private void displayFrameworkBugMessageAndExit() {
    AlertDialog.Builder builder = new AlertDialog.Builder(this);
    builder.setTitle(getString(R.string.app_name));
    builder.setMessage(getString(R.string.msg_camera_framework_bug));
    builder.setPositiveButton(R.string.button_ok, new FinishListener(this));
    builder.setOnCancelListener(new FinishListener(this));
    builder.show();
  }

  public void restartPreviewAfterDelay(long delayMS) {
    if (handler != null) {
      handler.sendEmptyMessageDelayed(R.id.restart_preview, delayMS);
    }
    resetStatusView();
  }

  private void resetStatusView() {
    resultView.setVisibility(View.GONE);
    statusView.setText(R.string.msg_default_status);
    statusView.setVisibility(View.VISIBLE);
    viewfinderView.setVisibility(View.VISIBLE);
    lastResult = null;
  }

  public void drawViewfinder() {
    viewfinderView.drawViewfinder();
  }

  /**
   * Check the network state
   * 
   * @param context
   *          context of application
   * @return true if the phone is connected
   */
  public static boolean isConnected(Context context) {
    ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkInfo netInfo = cm.getActiveNetworkInfo();
    if (netInfo != null && netInfo.isConnected()) {
      return true;
    }
    return false;
  }

}
