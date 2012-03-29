package goodybag.mobile;

//import java.io.File;
//import java.util.*;
import android.app.Activity;
//import android.content.Context;
import android.os.Bundle;
//import android.text.format.DateUtils;
//import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.*;

public class GoodybagActivity extends Activity {
	public static String Url = "http://192.168.2.112";
	
	WebView mWebView;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // remove title
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        setContentView(R.layout.main);

        mWebView = (WebView) findViewById(R.id.webview);
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        mWebView.setWebViewClient(new GoodybagWebClient());
        mWebView.loadUrl(Url);
    }
    
    private class GoodybagWebClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            return true;
        }
    }
    
	  //helper method for clearCache() , recursive
	  //returns number of deleted files
	  /*static int clearCacheFolder(final File dir, final int numDays) {
	
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
	  }*/
	
	  /*
	   * Delete the files older than numDays days from the application cache
	   * 0 means all files.
	   */
	  /*public static void clearCache(final Context context, final int numDays) {
	      int numDeletedFiles = clearCacheFolder(context.getCacheDir(), numDays);
	  }*/
}