package com.google.zxing.client.android.tapin;

public interface Constants {
	public static final String SETTING_PREF_NAME = "com.goodybag.tapin.station.settings";
	
	public static final String KEY_BUSINESS_ID = "businessId";
	public static final String KEY_REGISTER_ID = "registerId";
	public static final String KEY_LOCATION_ID = "locationId";

	public static final String URL_HEARTBEAT = "http://biz.goodybag.com/api/clients/registers/heartbeat";
  public static final String URL_TRANSACTIONS = "http://biz.goodybag.com/api/clients/transactions";
		
	public static final String KEY_SUBMIT_PENDING_DELAY = "submitPendingDelay";
	
	public static final String DB_GOODYBAG = "goodybag";
	public static final String DB_PENDING_CODES_TABLE = "pending_codes";
	
	public static final int SUBMIT_PENDING_DELAY_MS_MIN = 5000; //5 seconds
	public static final int SUBMIT_PENDING_DELAY_MS_MAX = 600000; //10 minutes
	public static final int SUBMIT_HEARTBEAT_DELAY_MS = 600000; //10 minutes
	
}
