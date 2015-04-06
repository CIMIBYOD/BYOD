package demo.byod.cimicop.core.managers;


import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import demo.byod.cimicop.MainActivity;
import demo.byod.cimicop.core.preferences.PreferencesManager;

public class RestQueryManager implements
        SharedPreferences.OnSharedPreferenceChangeListener {

    public static RestQueryManager instance = null;

    public static final String POSITION_SERVICE = "http://192.168.1.100:8585/TOMSDataService.svc/bso/cimicop/position/fromcivilian/";
    public static final String USER = "user1";

    public static final String SERVICE_PREFIX = "http://";
    public static final String SERVICE_LOCATION = "/api/position/";

    public String host = "";
    public String port = "";
    public String login = "";
    public String pwd = "";


    public RestQueryManager(){

        //Get init prefs values and adding listener on pref changes
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(MainActivity.getContext());
        host = sharedPref.getString(PreferencesManager.HOST, "");
        port = sharedPref.getString(PreferencesManager.PORT, "");
        login = sharedPref.getString(PreferencesManager.LOGIN, "");
        pwd = sharedPref.getString(PreferencesManager.PASSWORD, "");

        sharedPref.registerOnSharedPreferenceChangeListener(this);
    }

    public static RestQueryManager getInstance(){
        if(instance == null){
            instance = new RestQueryManager();
        }
        return instance;
    }

    private boolean isConnected(){
        return !login.isEmpty() && !pwd.isEmpty();
    }

    public void sendLocation(double latitude, double longitude, float accuracy) {

        if(isConnected()){
            String srv = SERVICE_PREFIX+host+":"+port+SERVICE_LOCATION;
            Log.d("sendLocation", srv + ", " + latitude+ ", " + longitude+ ", " + accuracy);
            try {
                // 1. create HttpClient
                HttpClient httpclient = new DefaultHttpClient();
                // 2. make POST request to the given URL
                HttpPut httpPUT = new HttpPut(srv);

                JSONObject body = new JSONObject();
                body.put("email",login);
                body.put("password",pwd);

                //replace with string
                JSONObject position = new JSONObject();
                position.put("latitude", latitude);
                position.put("longitude", longitude);
                position.put("accuracy", accuracy);

                body.put("position",position);

                // 4. convert JSONObject to JSON to String
                String json = body.toString();
                // 5. set json to StringEntity
                StringEntity se = new StringEntity(json);
                // 6. set httpPost Entity
                httpPUT.setEntity(se);
                // 7. Set some headers to inform server about the type of the content
                httpPUT.setHeader("Accept", "application/json");
                httpPUT.setHeader("Content-type", "application/json");
                // 8. Execute POST request to the given URL
                HttpResponse httpResponse = httpclient.execute(httpPUT);
                String JSONString = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
                Log.d("httpResponse", JSONString);

            } catch (Exception e) {
                Log.e("sendCurrentLocation","",e);
            }
        }else{
            Log.d("sendCurrentLocation", "not connected");
        }


    }


    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        if (key.equals(PreferencesManager.PORT)) {
            port = sharedPreferences.getString(PreferencesManager.PORT, "");
        }
        else if (key.equals(PreferencesManager.HOST)) {
            host = sharedPreferences.getString(PreferencesManager.HOST, "");
        }
        else if (key.equals(PreferencesManager.LOGIN)) {
            login = sharedPreferences.getString(PreferencesManager.LOGIN, "");
        }
        else if (key.equals(PreferencesManager.PASSWORD)) {
            pwd = sharedPreferences.getString(PreferencesManager.PASSWORD, "");
        }
    }
}
