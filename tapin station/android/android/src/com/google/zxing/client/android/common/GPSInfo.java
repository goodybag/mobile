package com.google.zxing.client.android.common;

import android.content.Context;
import android.location.Location;
import android.os.Bundle;

import com.google.zxing.client.android.common.CurrentLocationFinder.LocationResult;

public class GPSInfo {
	private double LATITUDE;
	private double LONGITUDE;
	private float ACCURACY;
	private double ALTITUDE;
	private float BEARING;
	private String PROVIDER;
	private float SPEED;
	private long TIME;
	private static GPSInfo instance;

	private GPSInfo() {
	}

	public static GPSInfo getInstance(Context context, Bundle savedInstanceState) {
		if (instance == null) {
			init(context, savedInstanceState);
		}
		return instance;
	}

	private static void init(Context context, Bundle savedInstanceState) {
		final CurrentLocationFinder finder = new CurrentLocationFinder();
		finder.getLocation(context, new LocationResult() {
			public void gotLocation(Location location) {
				if (location != null) {
					instance = new GPSInfo();
					instance.LATITUDE = location.getLatitude();
					instance.ACCURACY = location.getAccuracy();
					instance.ALTITUDE = location.getAltitude();
					instance.BEARING = location.getBearing();
					instance.LONGITUDE = location.getLongitude();
					instance.PROVIDER = location.getProvider();
					instance.SPEED = location.getSpeed();
					instance.TIME = location.getTime();
				}
			}
		});
	}

	public String toString() {
		StringBuffer stb = new StringBuffer();
		stb.append("LATITUDE=" + LATITUDE).append(",");
		stb.append("LONGITUDE=" + LONGITUDE).append(",");
		stb.append("ACCURACY=" + ACCURACY).append(",");
		stb.append("ALTITUDE=" + ALTITUDE).append(",");
		stb.append("BEARING=" + BEARING).append(",");
		stb.append("PROVIDER=" + PROVIDER).append(",");
		stb.append("SPEED=" + SPEED).append(",");
		stb.append("TIME=" + TIME);
		return stb.toString();
	}
}