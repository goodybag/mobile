package com.google.zxing.client.android.tapin.activities;

import android.content.Context;

import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;
import android.util.Log;

import com.google.zxing.client.android.CaptureActivity;
import com.google.zxing.client.android.R;
import com.google.zxing.client.android.tapin.BaseActivity;
import com.google.zxing.client.android.tapin.Constants;

public class SettingActivity extends BaseActivity implements OnClickListener {
	private EditText businessIdEditText;
	private EditText registerIdEditText;
	private EditText locationIdEditText;

	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
		String businessId = preference.getString(Constants.KEY_BUSINESS_ID, null);
		String registerId = preference.getString(Constants.KEY_REGISTER_ID, null);
		String locationId = preference.getString(Constants.KEY_LOCATION_ID, null);

		boolean fromAsk = getIntent().getBooleanExtra("from_ask", false);
		if (!fromAsk) {
			if (businessId == null || registerId == null || locationId == null) {
				setContentView(R.layout.settings);
				findViewById(R.settings.changePasscodeLayout).setVisibility(View.GONE);
			} else {
				changeActivity(CaptureActivity.class, true);
				return;
			}
		} else {
			findViewById(R.settings.changePasscodeLayout).setVisibility(View.VISIBLE);
		}
		
		businessIdEditText = (EditText) findViewById(R.settings.storeIdEditBox);
		businessIdEditText.setText(businessId);
		locationIdEditText = (EditText) findViewById(R.settings.locationIdEditBox);
		locationIdEditText.setText(locationId);
		registerIdEditText = (EditText) findViewById(R.settings.registeredIdEditBox);
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
		switch (view.getId()) {
		case R.settings.changePasscode:
			changeActivity(ChangePasscodeActivity.class, false);
			break;
		case R.settings.submitButton:
			saveRequest(view);
			break;
		}
	}

	private void saveRequest(View v) {
		closeSoftKeyBoard(v, SettingActivity.this);

		final String storeId = businessIdEditText.getText().toString().trim();
		final String registerId = registerIdEditText.getText().toString().trim();
		final String locationId = locationIdEditText.getText().toString().trim();
		if (0 == storeId.length()) {
			showAlertMessage("Error", "Please enter a Business Id", null, null, null);
			return;
		}
		if (0 == locationId.length()) {
			showAlertMessage("Error", "Please enter Location Id", null, null, null);
			return;
		}
		if (0 == registerId.length()) {
			showAlertMessage("Error", "Please enter Registered Id", null, null, null);
			return;
		}
		SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = preference.edit();
		editor.putString(Constants.KEY_BUSINESS_ID, storeId);
		editor.putString(Constants.KEY_REGISTER_ID, registerId);
		editor.putString(Constants.KEY_LOCATION_ID, locationId);
		editor.commit();
		changeActivity(CaptureActivity.class);
	}
}