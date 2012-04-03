package goodybag.mobile;

import java.io.File;
import java.util.*;
import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.text.format.DateUtils;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.*;
import android.util.Log;

public class GoodybagActivity extends Activity {
	WebView mWebView;
	
	@Override
	public void onConfigurationChanged(Configuration newConfig){        
	    super.onConfigurationChanged(newConfig);
	}
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	int Version = Build.VERSION.SDK_INT;
    	String Url = "http://192.168.2.112/#!/android/" + Version;
    	Log.v("navcache", "Version: " + Version);
    	
        super.onCreate(savedInstanceState);
        // clear cache
        clearCache(this, 0);
        // remove title
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        setContentView(R.layout.main);

        GoodybagWebClient myClient = new GoodybagWebClient();
        mWebView = (WebView) findViewById(R.id.webview);
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        mWebView.setWebChromeClient(myClient);
        mWebView.loadUrl(Url);
    }
    
    private class GoodybagWebClient extends WebChromeClient {
        public void onConsoleMessage(String message, int lineNumber, String sourceID) {
		    Log.d("Goodybag", message + " -- From line "
		                         + lineNumber + " of "
		                         + sourceID);
		  }
	    public boolean onConsoleMessage(ConsoleMessage cm) {
		    Log.d("Goodybag", cm.message() + " -- From line "
		            + cm.lineNumber() + " of "
		            + cm.sourceId() );
		    return true;
		}
    }
    
	  //helper method for clearCache() , recursive
	  //returns number of deleted files
	  static int clearCacheFolder(final File dir, final int numDays) {
	
	      int deletedFiles = 0;
	      if (dir!= null && dir.isDirectory()) {
	          try {
	              for (File child:dir.listFiles()) {
	
	                  //first delete subdirectories recursively
	                  if (child.isDirectory()) {
	                      deletedFiles += clearCacheFolder(child, numDays);
	                  }
	
	                  //then delete the files and subdirectories in this dir
	                  //only empty directories can be deleted, so subdirs have been done first
	                  if (child.lastModified() < new Date().getTime() - numDays * DateUtils.DAY_IN_MILLIS) {
	                      if (child.delete()) {
	                          deletedFiles++;
	                      }
	                  }
	              }
	          }
	          catch(Exception e) {
	              //
	          }
	      }
	      return deletedFiles;
	  }
	
	  /*
	   * Delete the files older than numDays days from the application cache
	   * 0 means all files.
	   */
	  public static int clearCache(final Context context, final int numDays) {
	      return clearCacheFolder(context.getCacheDir(), numDays);
	  }
}