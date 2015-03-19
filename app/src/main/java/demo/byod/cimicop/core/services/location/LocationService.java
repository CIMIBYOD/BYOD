package demo.byod.cimicop.core.services.location;

import android.app.Service;

import android.content.Intent;

import android.os.IBinder;
import android.util.Log;

import com.cocoahero.android.geojson.util.JSONUtils;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;


public class LocationService extends Service{

    public static final long TIME_BTW_REFRESH = 1000 * 60;

    public static final String POSITION_SERVICE = "http://serverc2:8585/TOMSDataService.svc/bso/cimicop/position/fromcivilian/";
    public static final String USER = "user1";

    public double lat = 34.589;
    public double lon = 69.763;

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        new Thread(new Runnable() {
            public void run() {
                while(true){

                    sendCurrentLocation();
                    try {
                        Thread.sleep(TIME_BTW_REFRESH);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        return super.onUnbind(intent);
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
    }


    private void sendCurrentLocation(){

        try {
            // 1. create HttpClient
            HttpClient httpclient = new DefaultHttpClient();
            // 2. make POST request to the given URL
            HttpPut httpPUT = new HttpPut(POSITION_SERVICE+USER);

            JSONObject body = new JSONObject();

            //replace with string
            JSONObject position = new JSONObject();
            JSONArray coordsArray = new JSONArray();
            JSONObject coords = new JSONObject();
            this.lat += 0.0001;
            this.lon += 0.0001;
            String latString = lat+"";
            String lonString = lon+"";

            coords.put("lat", latString.replace(".",","));
            coords.put("lon", lonString.replace(".",","));
            coordsArray.put(coords);

            position.put("coords", coordsArray);
            body.put("position", position.toString());

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
            String JSONString = EntityUtils.toString(httpResponse.getEntity(),"UTF-8");
            Log.d("httpResponse", JSONString);

        } catch (Exception e) {
            Log.d("sendCurrentLocation", e.getLocalizedMessage());
        }
    }

}
