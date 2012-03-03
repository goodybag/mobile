package com.google.zxing.client.android.tapin;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Typeface;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

public class BaseActivity extends Activity {
	protected ProgressDialog mProgressDialog;

	public static final DialogInterface.OnKeyListener SEARCH_KEY_HANDLER = new DialogInterface.OnKeyListener() {
		public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
			switch (keyCode) {
			case KeyEvent.KEYCODE_SEARCH:
				return true;
			}
			return false;
		}
	};

	public void changeActivity(Class<?> claz) {
		changeActivity(claz, true);
	}

	public void changeActivity(Class<?> claz, boolean close) {
		Intent intent = new Intent();
		intent.setClass(BaseActivity.this, claz);
		startActivity(intent);
		if (close) {
			finish();
		}
	}

	public Typeface getFont(String fontName) {
		return Typeface.createFromAsset(getAssets(), fontName);
	}

	public final void showAlertMessage(final String title, final String message, final int[] buttonTypes, final String[] buttonTexts, final DialogInterface.OnClickListener[] buttonListeners) {
		if (null == message) {
			return;
		}
		if ((null != buttonTypes && (null == buttonTexts || null == buttonListeners)) || (null != buttonTexts && (null == buttonTypes || null == buttonListeners))
				|| (null != buttonListeners && (null == buttonTexts || null == buttonTypes))) {
			return;
		}
		if ((null != buttonTypes && null != buttonTexts && null != buttonListeners) && ((buttonTypes.length != buttonTexts.length) || (buttonListeners.length != buttonTexts.length))) {
			return;
		}
		runOnUiThread(new Runnable() {
			public void run() {
				AlertDialog alertDialog = new AlertDialog.Builder(BaseActivity.this).create();
				if (null != title) {
					alertDialog.setTitle(title);
				}
				alertDialog.setMessage(message);
				if (null != buttonTypes) {
					for (int i = 0; i < buttonTypes.length; i++) {
						alertDialog.setButton(buttonTypes[i], buttonTexts[i], buttonListeners[i]);
					}
				} else {
					alertDialog.setButton(DialogInterface.BUTTON_NEUTRAL, "OK", (DialogInterface.OnClickListener) null);
				}
				alertDialog.setOnKeyListener(SEARCH_KEY_HANDLER);
				alertDialog.setCancelable(false);
				alertDialog.show();
			}
		});
	}

	public void showProcessingDialog(final String title, final String message) {
		runOnUiThread(new Runnable() {
			public void run() {
				mProgressDialog = new ProgressDialog(BaseActivity.this);
				mProgressDialog.setTitle(title);
				mProgressDialog.setMessage(message);
				mProgressDialog.setIndeterminate(true);
				mProgressDialog.setCancelable(true);
				mProgressDialog.show();
			}
		});
	}

	public void closeProcessingDialog() {
		runOnUiThread(new Runnable() {
			public void run() {
				mProgressDialog.dismiss();
			}
		});
	}

	public void closeSoftKeyBoard(View view, Activity context) {
		try {
			InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected class ErrorMessage implements Runnable {
		private String message;

		public ErrorMessage(String message) {
			this.message = message;
		}

		public void run() {
			mProgressDialog.dismiss();
			AlertDialog.Builder builder = new Builder(BaseActivity.this);
			builder.setTitle("Sorry");
			builder.setMessage(message);
			builder.setNeutralButton("OK", new DialogInterface.OnClickListener() {
				public void onClick(DialogInterface dialog, int which) {
					return;
				}
			});
			AlertDialog alert = builder.create();
			alert.show();
		}
	}
}
