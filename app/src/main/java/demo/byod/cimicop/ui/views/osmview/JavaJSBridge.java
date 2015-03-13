package demo.byod.cimicop.ui.views.osmview;

import android.app.Fragment;
import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

/**
 * Created by sylvain on 08/03/2015.
 */
public class JavaJSBridge {

    Fragment mContext;

    /**
     * Instantiate the interface and set the context
     */
    JavaJSBridge(Fragment f) {
        mContext = f;
    }

    /**
     * Show a toast from the web page
     */
    @JavascriptInterface
    public void log(String msg) {
        Log.i("CIMI", "msg=[" + msg + "]");

    }


    @JavascriptInterface
    public void touch() {

       try {

            ((OsmFragment) mContext).mOsmView.post(new Runnable() {
                public void run() {
                    ((OsmFragment) mContext).mOsmView.loadUrl("javascript:draw()");
                }
            });

        } catch (Exception e) {
            Log.e("JavaJSBridge","JavaJSBridge Exception "+ e.getMessage());

        }
    }

}

