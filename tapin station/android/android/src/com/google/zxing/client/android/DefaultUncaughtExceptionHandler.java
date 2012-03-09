package com.google.zxing.client.android;

import java.lang.Thread.UncaughtExceptionHandler;


import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;

public class DefaultUncaughtExceptionHandler implements UncaughtExceptionHandler {
  private PendingIntent restartIntent;
  private CaptureActivity captureActivity;
  
  public DefaultUncaughtExceptionHandler(PendingIntent pi, CaptureActivity restartContext) {
      this.restartIntent = pi;
      this.captureActivity = restartContext;
  }
      
  public void uncaughtException(Thread arg0, Throwable arg1) {
      // Restart the app using the PendingIntent
//      AlarmManager mgr = (AlarmManager) captureActivity.getSystemService(Context.ALARM_SERVICE);
//      mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 2000, restartIntent);
    try{
      captureActivity.restartApp(); 
    } catch(Exception e){
      AlarmManager mgr = (AlarmManager) captureActivity.getSystemService(Context.ALARM_SERVICE);
      mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 2000, restartIntent);
    }
    System.exit(2);
  }
}
