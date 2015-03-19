package demo.byod.cimicop.core.services.situation;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import demo.byod.cimicop.core.managers.SituationManager;

/**
 * Created by ASD on 20/03/2015.
 */
public class SituationService extends Service {

    public static final long TIME_BTW_REFRESH = 1000 * 60;

    public static final String SITUATION_SERVICE = "http://serverc2:8585/TOMSDataService.svc/bso/cimicop/situation/tocivilian";


    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        new Thread(new Runnable() {
            public void run() {
                while (true) {
                    Log.d("getCurrentSituation", "GET");
                    getCurrentSituation();
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


    private void getCurrentSituation() {

        try {
            // 1. create HttpClient
            HttpClient httpclient = new DefaultHttpClient();
            // 2. make POST request to the given URL
            HttpGet httpGET = new HttpGet(SITUATION_SERVICE);

            ResponseHandler<String> handler = new BasicResponseHandler();
            try{
                String result = httpclient.execute(httpGET, handler);
                Log.d("getCurrentSituation", " r =" +result);
                JSONObject r = new JSONObject(result);
                JSONArray array = r.getJSONArray("entities");
                for(int i=0; i<array.length(); i++){
                    String e = array.getString(i);
                    if(e != null){
                        SituationManager.getInstance().addSituationEntityFromString(e);
                    }
                }
            }catch(Exception e){
                Log.d("getCurrentSituation", e.getLocalizedMessage());
            }




        } catch (Exception e) {
            Log.d("getCurrentSituation", e.getLocalizedMessage());
        }
    }
}