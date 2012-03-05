package com.goodybag.tapin.station.activities;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;
import android.util.Log;

import com.goodybag.tapin.station.Constants;
import com.google.zxing.client.android.CaptureActivity;
import com.google.zxing.client.android.R;

public class SettingActivity extends Activity implements OnClickListener {
	private EditText businessIdEditText;
	private EditText registerIdEditText;
	private EditText locationIdEditText;

	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
		String businessId = preference.getString(Constants.KEY_BUSINESS_ID, null);
		String registerId = preference.getString(Constants.KEY_REGISTER_ID, null);
		String locationId = preference.getString(Constants.KEY_LOCATION_ID, null);

		boolean fromAsk = getIntent().getBooleanExtra("settingsCompleted", false);
		if (!fromAsk) {
			if (businessId == null || registerId == null || locationId == null) {
				setContentView(R.layout.settings);
			} else {
		    Intent intent = new Intent();
		    intent.setClass(this, CaptureActivity.class);
		    startActivity(intent);
		    finish();
				return;
			}
		} else {
		}
		
		businessIdEditText = (EditText) findViewById(R.settings.businessIdEditBox);
		businessIdEditText.setText(businessId);
		locationIdEditText = (EditText) findViewById(R.settings.locationIdEditBox);
		locationIdEditText.setText(locationId);
		registerIdEditText = (EditText) findViewById(R.settings.registerIdEditBox);
		registerIdEditText.setText(registerId);
		registerIdEditText.setOnEditorActionListener(new OnEditorActionListener() {
			public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
				if (actionId == EditorInfo.IME_ACTION_DONE) {
					saveRequest(v);
					return true;
				}
				return false;
			}
		});
	}

	public void onClick(View view) {
		saveRequest(view);
	}

	private void saveRequest(View v) {
	  //http://stackoverflow.com/questions/1109022/how-to-close-hide-the-android-soft-keyboard
	  InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
	  imm.hideSoftInputFromWindow(v.getWindowToken(), 0);

		final String storeId = businessIdEditText.getText().toString().trim();
		final String registerId = registerIdEditText.getText().toString().trim();
		final String locationId = locationIdEditText.getText().toString().trim();
		if (0 == storeId.length()) {
			blankFieldError("Please enter a Business Id");
			return;
		}
		if (0 == locationId.length()) {
			blankFieldError("Please enter Location Id");
			return;
		}
		if (0 == registerId.length()) {
			blankFieldError("Please enter Registered Id");
			return;
		}
		SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = preference.edit();
		editor.putString(Constants.KEY_BUSINESS_ID, storeId);
		editor.putString(Constants.KEY_REGISTER_ID, registerId);
		editor.putString(Constants.KEY_LOCATION_ID, locationId);
		editor.commit();
		Intent intent = new Intent();
    intent.setClass(this, CaptureActivity.class);
    startActivity(intent);
    finish();
	}
	
	  //http://www.wikihow.com/Show-Alert-Dialog-in-Android
	  public final void blankFieldError(String message) {
	    AlertDialog alertDialog = new AlertDialog.Builder(this).create();
	    alertDialog.setTitle("Blank Field");
	    alertDialog.setMessage(message);
	    alertDialog.setButton("OK", new DialogInterface.OnClickListener() {
	       public void onClick(DialogInterface dialog, int which) {
	          // here you can add functions
	       }
	    });
	    alertDialog.show();
	  }
}