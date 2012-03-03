package com.google.zxing.client.android.tapin;

public interface Constants {
	public static String SETTING_PREF_NAME = "com.skt.tapin.tapin_settings";
	public static String KEY_BUSINESS_ID = "businessId";
	public static String KEY_REGISTER_ID = "registerId";
	public static String KEY_LOCATION_ID = "locationId";
	public static String KEY_BARCODES = "barcodes";
	public static String KEY_PASSCODE = "passcode";
	
	public static final String KEY_SUBMIT_PENDING_DELAY = "submitPendingDelay";
	
	public static final String DB_GOODYBAG = "goodybag";
	public static final String DB_PENDING_CODES_TABLE = "pending_codes";
	
	public static final int SUBMIT_PENDING_DELAY_MS_MIN = 5000; //5 seconds
	public static final int SUBMIT_PENDING_DELAY_MS_MAX = 600000; //10 minutes
	public static final int SUBMIT_HEARTBEAT_DELAY_MS = 600000; //10 minutes
	
	public static String URL_HEARTBEAT = "http://biz.goodybag.com/api/clients/registers/heartbeat";
	public static String URL_TRANSACTIONS = "http://biz.goodybag.com/api/clients/transactions";
	
}
