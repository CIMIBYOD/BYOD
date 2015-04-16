package demo.byod.cimicop.ui.views.osmview;

import android.support.v4.app.Fragment;
import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

import demo.byod.cimicop.core.managers.RestQueryManager;

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
     * Logging utility
     */
    @JavascriptInterface
    public void log(String msg) {
        Log.i("JavaJSBridge",  msg );

    }

    /**
     * Triggered when html map view is loaded
     */
    @JavascriptInterface
    public void mapReady() {

       try {

            ((OsmFragment) mContext).mOsmView.post(new Runnable() {
                public void run() {
                    ((OsmFragment) mContext).mapReady();
                }
            });

        } catch (Exception e) {
            Log.e("JavaJSBridge","JavaJSBridge mapReady Exception "+ e.getMessage());

        }
    }

    /**
     * send new report through Java API
     */
    @JavascriptInterface
    public void sendReport(String jsonReport) {
       final String report = jsonReport;

        try {

            ((OsmFragment) mContext).mOsmView.post(new Runnable() {
                public void run() {
                   RestQueryManager.getInstance().sendReport(report);
                }
            });

        } catch (Exception e) {
            Log.e("JavaJSBridge","JavaJSBridge  sendReport Exception "+ e.getMessage());

        }
    }

}

