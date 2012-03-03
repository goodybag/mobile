package com.google.zxing.client.android.common;

import java.util.Date;
import java.util.List;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;

public class BuildInfo {
	public String FELICA;
	public String BOARD;
	public String BRAND;
	public String CPU_ABI;
	public String DEVICE;
	public String DISPLAY;
	public String FINGERPRINT;
	public String HOST;
	public String ID;
	public String MANUFACTURER;
	public String MODEL;
	public String PRODUCT;
	public String TAGS;
	public String TIME;
	public String TYPE;
	public String USER;
	public String VERSION_CODENAME;
	public String VERSION_INCREMENTAL;
	public String VERSION_RELEASE;
	public String VERSION_SDK;
	public String VERSION_SDK_INT;
	public String USER_AGENT;
	public String SENSORS;
	private static BuildInfo instance;

	private BuildInfo() {
	}

	public static BuildInfo getInstance(Context context, Bundle savedInstanceState) {
		if (instance == null) {
			init(context, savedInstanceState);
		}
		return instance;
	}

	private static void init(Context context, Bundle savedInstanceState) {
		if (savedInstanceState != null && savedInstanceState.containsKey(BuildInfo.class.toString())) {
			instance = (BuildInfo) savedInstanceState.getSerializable(BuildInfo.class.toString());
		} else {
			instance = new BuildInfo();
			instance.BOARD = Build.BOARD;
			instance.BRAND = Build.BRAND;
			instance.CPU_ABI = Build.CPU_ABI;
			instance.DEVICE = Build.DEVICE;
			instance.DISPLAY = Build.DISPLAY;
			instance.FINGERPRINT = Build.FINGERPRINT;
			instance.HOST = Build.HOST;
			instance.ID = Build.ID;
			instance.MANUFACTURER = Build.MANUFACTURER;
			instance.MODEL = Build.MODEL;
			instance.PRODUCT = Build.PRODUCT;
			instance.TAGS = Build.TAGS;
			instance.TIME = new Date(Build.TIME).toGMTString();
			instance.TYPE = Build.TYPE;
			instance.USER = Build.USER;
			instance.VERSION_CODENAME = Build.VERSION.CODENAME;
			instance.VERSION_INCREMENTAL = Build.VERSION.INCREMENTAL;
			instance.VERSION_RELEASE = Build.VERSION.RELEASE;
			instance.VERSION_SDK = Build.VERSION.SDK;
			instance.VERSION_SDK_INT = Integer.toString(Build.VERSION.SDK_INT);
			instance.USER_AGENT = new WebView(context).getSettings().getUserAgentString();

			SensorManager sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
			List<Sensor> sensorList = sensorManager.getSensorList(Sensor.TYPE_ALL);
			StringBuffer stb = new StringBuffer();
			for (Sensor each : sensorList) {
				if (stb.length() > 0) {
					stb.append(',');
				}
				stb.append(each.getName());
			}
			instance.SENSORS = stb.toString();
		}
	}

	public String toString() {
		StringBuffer stb = new StringBuffer();
		stb.append("FELICA=" + FELICA).append(",");
		stb.append("BOARD=" + BOARD).append(",");
		stb.append("BRAND=" + BRAND).append(",");
		stb.append("CPU_ABI=" + CPU_ABI).append(",");
		stb.append("DEVICE=" + DEVICE).append(",");
		stb.append("DISPLAY=" + DISPLAY).append(",");
		stb.append("FINGERPRINT=" + FINGERPRINT).append(",");
		stb.append("HOST=" + HOST).append(",");
		stb.append("ID=" + ID).append(",");
		stb.append("MANUFACTURER=" + MANUFACTURER).append(",");
		stb.append("MODEL=" + MODEL).append(",");
		stb.append("PRODUCT=" + PRODUCT).append(",");
		stb.append("TAGS=" + TAGS).append(",");
		stb.append("TIME=" + TIME).append(",");
		stb.append("TYPE=" + TYPE).append(",");
		stb.append("USER=" + USER).append(",");
		stb.append("VERSION.CODENAME=" + VERSION_CODENAME).append(",");
		stb.append("VERSION.INCREMENTAL=" + VERSION_INCREMENTAL).append(",");
		stb.append("VERSION.RELEASE=" + VERSION_RELEASE).append(",");
		stb.append("VERSION.SDK=" + VERSION_SDK).append(",");
		stb.append("VERSION.SDK_INT=" + VERSION_SDK_INT).append(",");
		stb.append("USER_AGENT=" + USER_AGENT).append(",");
		stb.append("SENSORS=" + SENSORS);
		return stb.toString();
	}
}
