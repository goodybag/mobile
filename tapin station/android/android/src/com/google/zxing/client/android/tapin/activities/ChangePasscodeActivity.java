package com.google.zxing.client.android.tapin.activities;

import android.content.Context;
import android.content.DialogInterface;
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

public class ChangePasscodeActivity extends BaseActivity implements OnClickListener {
	private EditText currentPasscodeEditText;
	private EditText newPasscodeEditText;
	private EditText confirmPasscodeEditText;

	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.change_passcode);

		currentPasscodeEditText = (EditText) findViewById(R.change_passcode.currentPasscode);
		newPasscodeEditText = (EditText) findViewById(R.change_passcode.newPasscode);
		confirmPasscodeEditText = (EditText) findViewById(R.change_passcode.confirmPasscode);
		confirmPasscodeEditText.setOnEditorActionListener(new OnEditorActionListener() {
			public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
				if (actionId == EditorInfo.IME_ACTION_DONE) {
					savePasscode(v);
					return true;
				}
				return false;
			}
		});
	}

	public void onClick(View view) {
		switch (view.getId()) {
		case R.change_passcode.submitButton:
			savePasscode(view);
			break;
		}
	}

	public void onBackPressed() {
		finish();
	}

	private void savePasscode(View v) {
		closeSoftKeyBoard(v, ChangePasscodeActivity.this);

		final String currentPasscode = currentPasscodeEditText.getText().toString().trim();
		final String newPasscode = newPasscodeEditText.getText().toString().trim();
		final String confirmPasscode = confirmPasscodeEditText.getText().toString().trim();
		if (0 == currentPasscode.length()) {
			showAlertMessage("Error", "Please enter current passcode!!!", null, null, null);
			return;
		}
		if (0 == newPasscode.length()) {
			showAlertMessage("Error", "Please enter new passcode!!!", null, null, null);
			return;
		}
		if (0 == confirmPasscode.length()) {
			showAlertMessage("Error", "Please enter confirm passcode!!!", null, null, null);
			return;
		}
		if (!newPasscode.equals(confirmPasscode)) {
			showAlertMessage("Error", "New passcode and confirm passcode should be same!!!", null, null, null);
			return;
		}
		SharedPreferences preference = getSharedPreferences(Constants.SETTING_PREF_NAME, Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = preference.edit();
		editor.putString(Constants.KEY_PASSCODE, newPasscode);
		editor.commit();
		showAlertMessage("Info", "Your Passcode changed successfully!!!", new int[] { DialogInterface.BUTTON_NEUTRAL }, new String[] { "OK" },
				new DialogInterface.OnClickListener[] { new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						ChangePasscodeActivity.this.finish();
					}
				} });
	}
}