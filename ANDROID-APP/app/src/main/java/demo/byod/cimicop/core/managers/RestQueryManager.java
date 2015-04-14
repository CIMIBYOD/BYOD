package demo.byod.cimicop.core.managers;


import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import de.greenrobot.event.EventBus;
import demo.byod.cimicop.MainActivity;
import demo.byod.cimicop.R;
import demo.byod.cimicop.core.events.RevokedStateEvent;
import demo.byod.cimicop.core.preferences.PreferencesManager;
import demo.byod.cimicop.ui.views.osmview.OsmFragment;

public class RestQueryManager implements
        SharedPreferences.OnSharedPreferenceChangeListener {

    public static RestQueryManager instance = null;

    public static final String SERVICE_PREFIX = "http://";
    public static final String SERVICE_LOCATION = "/api/location/";
    public static final String SERVICE_SITUATION = "/api/situation/";
    public static final String SERVICE_REPORT = "/api/report/";

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

                JSONObject body = new JSONObject();
                body.put("email",login);
                body.put("password",pwd);

                //replace with string
                JSONObject position = new JSONObject();
                position.put("latitude", latitude);
                position.put("longitude", longitude);
                position.put("accuracy", accuracy);

                body.put("location",position);

                RestQuery r = new RestQuery("sendLocation", srv, body);
                new PutRequestAsync().execute(r);

            } catch (Exception e) {
                Log.e("sendCurrentLocation","",e);
            }
        }else{
            Log.d("sendCurrentLocation", "not connected");
        }
    }

    public void getCurrentSituation() {

        if(isConnected()){
            String srv = SERVICE_PREFIX+host+":"+port+SERVICE_SITUATION;
            Log.d("getCurrentSituation", srv);
            try {
                JSONObject body = new JSONObject();
                body.put("email",login);
                body.put("password",pwd);

                RestQuery r = new RestQuery("getCurrentSituation",srv, body);
                new PostRequestAsync().execute(r);

            } catch (Exception e) {
                Log.e("sendCurrentLocation","",e);
            }
        }else{
            Log.d("getCurrentSituation", "not connected");
        }
    }

    public void sendReport(String report) {

        if(isConnected()){

            String srv = SERVICE_PREFIX+host+":"+port+SERVICE_REPORT;
            JSONObject body = new JSONObject();
            try {
                body.put("email",login);
                body.put("password",pwd);
                body.put("report", report);

                RestQuery r = new RestQuery("sendReport",srv, body);

                new PostRequestAsync().execute(r);

            } catch (Exception e) {
                Log.e("sendReport","",e);
            }
        }else{
            Log.d("sendReport", "not connected");
        }
    }


    private class RestQuery{

        public String url;
        public JSONObject json;
        public String query;

        public RestQuery(String query, String url, JSONObject json){
            this.query = query;
            this.url = url;
            this.json = json;
        }
    }

    private class PostRequestAsync extends AsyncTask<RestQuery, Void, Void> {

        protected Void doInBackground(RestQuery... rqueries) {

            for(RestQuery rq: rqueries){

                try {
                    // 1. create HttpClient
                    HttpClient httpclient = new DefaultHttpClient();
                    // 2. make POST request to the given URL
                    HttpPost httpPOST = new HttpPost(rq.url);

                    // 4. convert JSONObject to JSON to String
                    String json = rq.json.toString();
                    // 5. set json to StringEntity
                    StringEntity se = new StringEntity(json);
                    // 6. set httpPost Entity
                    httpPOST.setEntity(se);
                    // 7. Set some headers to inform server about the type of the content
                    httpPOST.setHeader("Accept", "application/json");
                    httpPOST.setHeader("Content-type", "application/json");
                    // 8. Execute POST request to the given URL
                    HttpResponse httpResponse = httpclient.execute(httpPOST);
                    String JSONString = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
                    Log.d("httpResponse", JSONString);

                    if(rq.query.equals("getCurrentSituation")){
                        SituationManager.getInstance().fullUpdate(JSONString);
                    }

                    if(JSONString.replaceAll("\"","").equalsIgnoreCase("revoked")) {
                        revokeUserAccess();
                    }

                } catch (Exception e) {
                    Log.e("sendReport","",e);
                }
            }
            return null;
        }
    }

    private class PutRequestAsync extends AsyncTask<RestQuery, Void, Void> {

        protected Void doInBackground(RestQuery... rqueries) {

            for(RestQuery rq: rqueries){

                try {
                    // 1. create HttpClient
                    HttpClient httpclient = new DefaultHttpClient();
                    // 2. make POST request to the given URL
                    HttpPut httpPUT = new HttpPut(rq.url);

                    // 4. convert JSONObject to JSON to String
                    String json = rq.json.toString();
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

                    if(JSONString.replaceAll("\"","").equalsIgnoreCase("revoked")) {
                        revokeUserAccess();
                    }

                } catch (Exception e) {
                    Log.e("sendReport","",e);
                }
            }
            return null;
        }
    }

    private void revokeUserAccess(){
        Log.d("revokeUserAccess", "revoking user access");
        EventBus.getDefault().post(new RevokedStateEvent(true));
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
