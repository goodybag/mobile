package com.google.zxing.client.android.tapin.activities;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONObject;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.util.Log;

import com.google.gson.Gson;
import com.google.zxing.client.android.CaptureActivity;
import com.google.zxing.client.android.R;
import com.google.zxing.client.android.common.BuildInfo;
import com.google.zxing.client.android.common.GPSInfo;
import com.google.zxing.client.android.common.rest.RequestMethod;
import com.google.zxing.client.android.common.rest.RestClient;
import com.google.zxing.client.android.tapin.BaseActivity;
import com.google.zxing.client.android.tapin.Constants;

public class ScanActivity extends BaseActivity implements OnClickListener {
	private Timer timer = new Timer();

	protected void onCreate(final Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.scan);

		timer.schedule(new TimerTask() {
			public void run() {
				Log.i("tapin-heartbeat", "attempting to submit heartbeat");
				sendHeartBeat(savedInstanceState);
			}
		}, 5000);

		//changeActivity(CaptureActivity.class, false);
	}

	private void sendHeartBeat(final Bundle savedInstanceState) {
		new Thread(new Runnable() {
			public void run() {
				Log.i("tapin-heartbeat", "Attempting to submit heartbeat2");
				RestClient client = new RestClient(Constants.URL_HEART_BEAT);
				BuildInfo build = BuildInfo.getInstance(ScanActivity.this, savedInstanceState);
				GPSInfo gpsInfo = GPSInfo.getInstance(ScanActivity.this, savedInstanceState);
				SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
				String businessId = preference.getString(Constants.KEY_BUSINESS_ID, null);
				String registerId = preference.getString(Constants.KEY_REGISTER_ID, null);
				String locationId = preference.getString(Constants.KEY_LOCATION_ID, null);
				client.addParam("businessId", businessId);
				client.addParam("locationId", locationId);
				client.addParam("registerId", registerId);
				client.addParam("device", build.toString());
				client.addParam("geo", gpsInfo.toString());
				try {
					client.execute(RequestMethod.POST);
					if (client.getResponseCode() == 200) {
						showAlertMessage("Tap In", client.getResponse(), null, null, null);
//						JSONObject jsonObject = new JSONObject(client.getResponse());
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				String barcodeJson = preference.getString(Constants.KEY_BARCODES, null);
				Gson gson = new Gson();
				ArrayList<String> savedBarcodes = gson.fromJson(barcodeJson, ArrayList.class);
				if (savedBarcodes != null) {
					for (int i = 0; i < savedBarcodes.size(); i++) {
						sendTransaction(savedBarcodes.get(i));
					}
				}
			}
		}).start();
	}

	private void sendTransaction(final String barcode) {
		new Thread(new Runnable() {
			public void run() {
				RestClient client = new RestClient(Constants.URL_HEART_BEAT);
				SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
				String businessId = preference.getString(Constants.KEY_BUSINESS_ID, null);
				String registerId = preference.getString(Constants.KEY_REGISTER_ID, null);
				String locationId = preference.getString(Constants.KEY_LOCATION_ID, null);
				DateFormat dateFormat = SimpleDateFormat.getDateInstance(SimpleDateFormat.FULL);
				client.addParam("businessId", businessId);
				client.addParam("locationId", locationId);
				client.addParam("registerId", registerId);
				client.addParam("barcode", barcode);
				client.addParam("timestamp", dateFormat.format(new Date()));
				try {
					client.execute(RequestMethod.POST);
					if (client.getResponseCode() == 200) {
						showAlertMessage("Tap In", client.getResponse(), null, null, null);
						JSONObject jsonObject = new JSONObject(client.getResponse());
						deleteBarCode(barcode);
					} else {
						saveBarCode(barcode);
					}
				} catch (Exception e) {
					e.printStackTrace();
					saveBarCode(barcode);
				}
			}

			private synchronized void deleteBarCode(String barcode) {
				SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
				String barcodeJson = preference.getString(Constants.KEY_BARCODES, null);
				Gson gson = new Gson();
				ArrayList<String> savedBarcodes = gson.fromJson(barcodeJson, ArrayList.class);
				if (savedBarcodes != null && savedBarcodes.contains(barcode)) {
					savedBarcodes.remove(barcode);
					String json = gson.toJson(savedBarcodes);
					SharedPreferences.Editor editor = preference.edit();
					editor.putString(Constants.KEY_BARCODES, json);
					editor.commit();
				}
			}

			private synchronized void saveBarCode(String barcode) {
				SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
				String barcodeJson = preference.getString(Constants.KEY_BARCODES, null);
				Gson gson = new Gson();
				ArrayList<String> savedBarcodes = gson.fromJson(barcodeJson, ArrayList.class);
				if (savedBarcodes == null) {
					savedBarcodes = new ArrayList<String>();
				}
				if (!savedBarcodes.contains(barcode)) {
					savedBarcodes.add(barcode);
					String json = gson.toJson(savedBarcodes);
					SharedPreferences.Editor editor = preference.edit();
					editor.putString(Constants.KEY_BARCODES, json);
					editor.commit();
				}
			}
		}).start();
	}

	public void onClick(View view) {
		switch (view.getId()) {
		case R.scan.settingButton:
			changeActivity(AskPasscodeActivity.class, false);
			break;
		}
	}
}