package com.google.zxing.client.android.tapin.activities;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

import com.google.zxing.client.android.R;
import com.google.zxing.client.android.tapin.BaseActivity;
import com.google.zxing.client.android.tapin.Constants;

public class AskPasscodeActivity extends BaseActivity implements OnClickListener {
	private EditText currentPasscodeEditText;

	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.ask_passcode);

		currentPasscodeEditText = (EditText) findViewById(R.ask_passcode.currentPasscode);
		currentPasscodeEditText.setOnEditorActionListener(new OnEditorActionListener() {
			public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
				if (actionId == EditorInfo.IME_ACTION_DONE) {
					checkPasscode(v);
					return true;
				}
				return false;
			}
		});
	}

	public void onClick(View view) {
		switch (view.getId()) {
		case R.ask_passcode.submitButton:
			checkPasscode(view);
			break;
		}
	}
	
	public void onBackPressed() {
		finish();
	}

	private void checkPasscode(View view) {
		closeSoftKeyBoard(view, AskPasscodeActivity.this);
		final String passcode = currentPasscodeEditText.getText().toString().trim();
		if (0 == passcode.length()) {
			showAlertMessage("Error", "Please enter current passcode!!!", null, null, null);
			return;
		}
		SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
		String savedPasscode = preference.getString(Constants.KEY_PASSCODE, "1111");
		if (passcode.equals(savedPasscode)) {
			Intent intent = new Intent(AskPasscodeActivity.this, SettingActivity.class);
			intent.putExtra("from_ask", true);
			startActivity(intent);
			AskPasscodeActivity.this.finish();
		} else {
			showAlertMessage("Error", "Wrong Passcode!!! You are not authorized to use this facility!!!", null, null, null);
		}
	}
}