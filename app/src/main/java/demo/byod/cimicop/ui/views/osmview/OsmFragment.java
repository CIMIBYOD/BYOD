package demo.byod.cimicop.ui.views.osmview;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;

import demo.byod.cimicop.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OsmFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link OsmFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OsmFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match

    OsmView mOsmView=null;

    public OsmFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View rootView =  inflater.inflate(R.layout.fragment_osm, container, false);


        mOsmView = (OsmView) rootView.findViewById(R.id.osm_webview);
        WebSettings webSettings = mOsmView.getSettings();
        webSettings.setJavaScriptEnabled(true);
       //for Geoloc
        mOsmView.setWebChromeClient(new WebChromeClient() {
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });
        mOsmView.loadUrl("file:///android_asset/www/index.html");

        //for bridge toJava
        mOsmView.addJavascriptInterface(new JavaJSBridge(this), "JSBridge");

        return rootView;
    }



}
