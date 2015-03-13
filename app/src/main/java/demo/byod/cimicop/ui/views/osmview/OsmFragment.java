package demo.byod.cimicop.ui.views.osmview;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import demo.byod.cimicop.R;
import demo.byod.cimicop.core.managers.CartoManager;


public class OsmFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match

    OsmView mOsmView=null;
    boolean OsmViewLoaded=false;
    String mBso=null;

    public OsmFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {


        // Inflate the layout for this fragment
        View rootView =  inflater.inflate(R.layout.fragment_osm, container, false);

       //create mapview
        mOsmView = (OsmView) rootView.findViewById(R.id.osm_webview);
        WebSettings webSettings = mOsmView.getSettings();
        webSettings.setJavaScriptEnabled(true);

       //for Geolocation access
        mOsmView.setWebChromeClient(new WebChromeClient() {
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        mOsmView.setWebViewClient(new WebViewClient() {

            public void onPageFinished(WebView view, String url) {
                OsmViewLoaded = true;
            }
        });

        CartoManager.getInstance().setMap(this, rootView.getContext());

        //for bridge toJava
        mOsmView.addJavascriptInterface(new JavaJSBridge(this), "JSBridge");

        //navigate
        mOsmView.loadUrl("file:///android_asset/www/index.html");



        return rootView;
    }



    private void _scheduleWhenViewReady() {
        //isReady
        if(!mOsmView.isReady()) {


        }
    }


    public void addBso( JSONObject bso) {
        Log.i("OsmFragment", "addBso  " + bso.toString());
        final String inBso ;
        inBso = bso.toString();

        try {

            mOsmView.post(new Runnable() {
                public void run() {
                    Log.i("OsmFragment", "addBso in UI  " + inBso);
                    mOsmView.loadUrl("javascript:addBso('" + inBso + "')");
                }
            });

        } catch (Exception e) {
            Log.e("OsmFragment", "addBso Exception " + e.getMessage());

        }
    }
    public void updateBso(JSONObject bso) {

    }
    public void removeBso(String id) {

    }
}
