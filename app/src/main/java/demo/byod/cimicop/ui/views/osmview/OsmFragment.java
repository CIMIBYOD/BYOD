package demo.byod.cimicop.ui.views.osmview;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.app.Fragment;
import android.os.Environment;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import demo.byod.cimicop.MainActivity;
import demo.byod.cimicop.R;
import demo.byod.cimicop.core.managers.CartoManager;


import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.view.KeyEvent;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import android.webkit.WebViewClient;
import android.provider.Settings;
import android.widget.Toast;


public class OsmFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match

    OsmView mOsmView=null;
    Context mContext;

    public Uri imageUri;
    private static final int FILECHOOSER_RESULTCODE   = 2888;
    private ValueCallback<Uri> mUploadMessage;
    private Uri mCapturedImageURI = null;




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
        mContext =  rootView.getContext();
        WebSettings webSettings = mOsmView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setAllowFileAccess(true);



       //for Geolocation access (automatic grant access)
        mOsmView.setWebChromeClient(new WebChromeClient() {
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            //The undocumented magic method override
            //Eclipse will swear at you if you try to put @Override here
            // For Android 3.0+
            public void openFileChooser(ValueCallback<Uri> uploadMsg) {
                Log.i("OsmFragment", "openFileChooser with message  [Eclipse will swear at you if you try to] " + uploadMsg);

                mUploadMessage = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                startActivityForResult(Intent.createChooser(i,"File Chooser"), FILECHOOSER_RESULTCODE);

            }

            // For Android 3.0+
            public void openFileChooser( ValueCallback uploadMsg, String acceptType ) {
                Log.i("OsmFragment", "openFileChooser with message  [For Android 3.0+] " + uploadMsg);

                mUploadMessage = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                startActivityForResult(
                        Intent.createChooser(i, "File Browser"),
                        FILECHOOSER_RESULTCODE);
            }

            //For Android 4.1
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture){
                Log.i("OsmFragment", "openFileChooser with message  [For Android 4.1] " + uploadMsg);

                mUploadMessage = uploadMsg;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                startActivityForResult( Intent.createChooser( i, "File Chooser" ), FILECHOOSER_RESULTCODE );

            }

            // openFileChooser for Android 3.0+
         /*   public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType){
                Log.i("OsmFragment", "openFileChooser with message   " + uploadMsg);

                // Update message
                mUploadMessage = uploadMsg;

                try{

                    // Create AndroidExampleFolder at sdcard

                    File imageStorageDir = new File(
                            Environment.getExternalStoragePublicDirectory(
                                    Environment.DIRECTORY_PICTURES)
                            , "cimicop");

                    if (!imageStorageDir.exists()) {
                        // Create AndroidExampleFolder at sdcard
                        imageStorageDir.mkdirs();
                    }

                    // Create camera captured image file path and name
                    File file = new File(
                            imageStorageDir + File.separator + "IMG_"
                                    + String.valueOf(System.currentTimeMillis())
                                    + ".jpg");

                    mCapturedImageURI = Uri.fromFile(file);
                    Log.i("OsmFragment", "image URI is   " + mCapturedImageURI);


                    // Camera capture image intent
                    final Intent captureIntent = new Intent(
                            android.provider.MediaStore.ACTION_IMAGE_CAPTURE);

                    captureIntent.putExtra(MediaStore.EXTRA_OUTPUT, mCapturedImageURI);

                    Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("image/*");

                    // Create file chooser intent
                    Intent chooserIntent = Intent.createChooser(i, "Image Chooser");

                    // Set camera intent to file chooser
                    chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS
                            , new Parcelable[] { captureIntent });

                    // On select image call onActivityResult method of activity
                    startActivityForResult(chooserIntent, FILECHOOSER_RESULTCODE);

                }
                catch(Exception e){
                    Log.e("OsmFragment", "Exception:" + e);
                }

            }

            // openFileChooser for Android < 3.0
            public void openFileChooser(ValueCallback<Uri> uploadMsg){
                Log.i("OsmFragment", "openFileChooser with message  (Android < 3.0) " + uploadMsg);

                openFileChooser(uploadMsg, "");
            }

            //openFileChooser for other Android versions
            public void openFileChooser(ValueCallback<Uri> uploadMsg,
                                        String acceptType,
                                        String capture) {
                Log.i("OsmFragment", "openFileChooser with message  ( other Android versions) " + uploadMsg);

                openFileChooser(uploadMsg, acceptType);
            }



            // The webPage has 2 filechoosers and will send a
            // console message informing what action to perform,
            // taking a photo or updating the file
*/


        });




        //for bridge toJava
        mOsmView.addJavascriptInterface(new JavaJSBridge(this), "JSBridge");

        //navigate
        mOsmView.loadUrl("file:///android_asset/www/index.html");

        return rootView;
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode,
                                    Intent intent) {
        Log.i("OsmFragment", "onActivityResult with requestCode   " + requestCode);

        if(requestCode==FILECHOOSER_RESULTCODE)
        {

            if (null == this.mUploadMessage) {
                return;

            }

            Uri result=null;

            try{
                if (resultCode != -1 /*RESULT_OK*/) {

                    result = null;

                } else {

                    // retrieve from the private variable if the intent is null
                    result = intent == null ? mCapturedImageURI : intent.getData();
                }
            }
            catch(Exception e)
            {
                Log.e("OsmFragment", "activity:" + e);

            }

            mUploadMessage.onReceiveValue(result);
            mUploadMessage = null;

        }

    }

    // JS map loaded
    public void mapReady() {
        //can launch now Cato manager
        CartoManager.getInstance().setMap(this, mContext);
    }




    public void addBso( JSONObject bso) {
        Log.i("OsmFragment", "addBso  " + bso.toString());
        final String inBso ;
        inBso = bso.toString();

        try {

            mOsmView.post(new Runnable() {
                public void run() {
                    mOsmView.loadUrl("javascript:addBso('" + inBso + "')");
                }
            });

        } catch (Exception e) {
            Log.e("OsmFragment", "addBso Exception " + e.getMessage());

        }
    }
    public void updateBso(JSONObject bso) {
        Log.i("OsmFragment", "updateBso  " + bso.toString());
        final String inBso ;
        inBso = bso.toString();

        try {

            mOsmView.post(new Runnable() {
                public void run() {
                    mOsmView.loadUrl("javascript:updateBso('" + inBso + "')");
                }
            });

        } catch (Exception e) {
            Log.e("OsmFragment", "updateBso Exception " + e.getMessage());

        }
    }
    public void removeBso(String id) {
        Log.i("OsmFragment", "removeBso  " + id);
        final String inId = id ;
        try {

            mOsmView.post(new Runnable() {
                public void run() {
                    mOsmView.loadUrl("javascript:removeBso('" + inId + "')");
                }
            });

        } catch (Exception e) {
            Log.e("OsmFragment", "removeBso Exception " + e.getMessage());

        }
    }
}
