package com.goodybag.tapin.station;

import com.google.zxing.client.android.CaptureActivity;
import android.util.Log;

public class ChangeImageAndEnableCaptureThread implements Runnable {

	public CaptureActivity captureActivity;
	@Override
	public void run() {
		Log.i("tapin-changeImage", "attempting to change image");
//		captureActivity.showSuccessScreen();
//		try {
//			Thread.sleep(2000L);
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		captureActivity.showDefaultScreen();
		captureActivity.restartPreviewAfterDelay(0);
		// TODO Auto-generated method stub
		
	}
	
	public ChangeImageAndEnableCaptureThread(CaptureActivity captureActivity){
		this.captureActivity = captureActivity;
		
	}

}
