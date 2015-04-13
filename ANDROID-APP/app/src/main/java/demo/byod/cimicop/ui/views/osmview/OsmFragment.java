package demo.byod.cimicop.ui.views.osmview;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import demo.byod.cimicop.MainActivity;
import demo.byod.cimicop.R;
import demo.byod.cimicop.core.managers.CartoManager;
import demo.byod.cimicop.core.preferences.PreferencesManager;
import demo.byod.cimicop.ui.views.login.RevokedFragment;


public class OsmFragment extends Fragment implements
        SharedPreferences.OnSharedPreferenceChangeListener {
    // TODO: Rename parameter arguments, choose names that match

    OsmView mOsmView = null;
    Context mContext;


    public static final int INPUT_FILE_REQUEST_CODE = 1;
    private ValueCallback<Uri[]> mFilePathCallback;
    private String mCameraPhotoPath;


    public OsmFragment() {
        // Required empty public constructor
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(MainActivity.getContext());
        sharedPref.registerOnSharedPreferenceChangeListener(this);
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {


        // Inflate the layout for this fragment
        View rootView = inflater.inflate(R.layout.fragment_osm, container, false);

        //create mapview
        mOsmView = (OsmView) rootView.findViewById(R.id.osm_webview);
        mContext = rootView.getContext();
        WebSettings webSettings = mOsmView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setAllowFileAccess(true);


        //for Geolocation access (automatic grant access)
        mOsmView.setWebChromeClient(new WebChromeClient() {
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }


            public boolean onShowFileChooser(
                    WebView webView, ValueCallback<Uri[]> filePathCallback,
                    WebChromeClient.FileChooserParams fileChooserParams) {

                Log.i("OsmFragment", "onShowFileChooser");

                if (mFilePathCallback != null) {
                    mFilePathCallback.onReceiveValue(null);
                }
                mFilePathCallback = filePathCallback;

                Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                if (takePictureIntent.resolveActivity(getActivity().getPackageManager()) != null) {
                    // Create the File where the photo should go
                    Log.i("OsmFragment", "Create the File where the photo should go");

                    File photoFile = null;
                    try {
                        photoFile = createImageFile();
                        takePictureIntent.putExtra("PhotoPath", mCameraPhotoPath);
                    } catch (IOException ex) {
                        // Error occurred while creating the File
                        Log.e("OsmFragment", "Unable to create Image File", ex);
                    }

                    // Continue only if the File was successfully created
                    if (photoFile != null) {
                        mCameraPhotoPath = "file:" + photoFile.getAbsolutePath();
                        takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT,
                                Uri.fromFile(photoFile));
                    } else {
                        takePictureIntent = null;
                    }
                }

                Log.i("OsmFragment", "mCameraPhotoPath=" + mCameraPhotoPath);


                Intent contentSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
                contentSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);
                contentSelectionIntent.setType("image/*");

                Intent[] intentArray;
                if (takePictureIntent != null) {
                    intentArray = new Intent[]{takePictureIntent};
                } else {
                    intentArray = new Intent[0];
                }

                Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
                chooserIntent.putExtra(Intent.EXTRA_INTENT, contentSelectionIntent);
                chooserIntent.putExtra(Intent.EXTRA_TITLE, "Image Chooser");
                chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray);
                Log.i("OsmFragment", "startActivityForResult");
                startActivityForResult(chooserIntent, INPUT_FILE_REQUEST_CODE);

                return true;
            }


            private File createImageFile() throws IOException {
                // Create an image file name
                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
                String imageFileName = "JPEG_" + timeStamp + "_";
                File storageDir = Environment.getExternalStoragePublicDirectory(
                        Environment.DIRECTORY_PICTURES);
                File imageFile = File.createTempFile(
                        imageFileName,  /* prefix */
                        ".jpg",         /* suffix */
                        storageDir      /* directory */
                );
                return imageFile;
            }

        });


        //for bridge toJava
        mOsmView.addJavascriptInterface(new JavaJSBridge(this), "JSBridge");

        //navigate
        mOsmView.loadUrl("file:///android_asset/www/index.html");

        return rootView;
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        Log.i("OsmFragment", "onActivityResult requestCode=" + requestCode);

        if (requestCode != INPUT_FILE_REQUEST_CODE || mFilePathCallback == null) {
            super.onActivityResult(requestCode, resultCode, data);
            return;
        }

        Uri[] results = null;

        // Check that the response is a good one
        if (resultCode == Activity.RESULT_OK) {
            Log.i("OsmFragment", "onActivityResult resultCode= Activity.RESULT_OK)");
            if (data == null) {
                // If there is not data, then we may have taken a photo
                if (mCameraPhotoPath != null) {
                    results = new Uri[]{Uri.parse(mCameraPhotoPath)};
                }
            } else {
                String dataString = data.getDataString();
                if (dataString != null) {
                    results = new Uri[]{Uri.parse(dataString)};
                }
            }
        }
        Log.i("OsmFragment", "onActivityResult onReceiveValue)");

        mFilePathCallback.onReceiveValue(results);
        mFilePathCallback = null;
        return;
    }


    // JS map loaded
    public void mapReady() {
        //can launch now Cato manager
        CartoManager.getInstance().setMap(this, mContext);
    }


    public void addBso(JSONObject bso) {
        Log.i("OsmFragment", "addBso  " + bso.toString());
        final String inBso;
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
        final String inBso;
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
        final String inId = id;
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

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        if (key.equals(PreferencesManager.REVOKED)) {
            boolean revoked = sharedPreferences.getBoolean(PreferencesManager.REVOKED, false);
            if(revoked){
                RevokedFragment revokedFragment = new RevokedFragment();
                FragmentTransaction transaction = getFragmentManager().beginTransaction();

                // Replace whatever is in the fragment_container view with this fragment,
                // and add the transaction to the back stack
                transaction.replace(R.id.container, revokedFragment);
                transaction.addToBackStack(null);

                // Commit the transaction
                transaction.commit();
                Log.e("onSharedPreferen", "revoked fragment");

            }
        }
    }
}
