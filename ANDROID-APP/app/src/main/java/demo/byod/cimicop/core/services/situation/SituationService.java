package demo.byod.cimicop.core.services.situation;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

import demo.byod.cimicop.core.managers.RestQueryManager;
import demo.byod.cimicop.core.managers.SituationManager;


public class SituationService extends Service {

    public static final long TIME_BTW_REFRESH = 1000 * 60;

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
                    RestQueryManager.getInstance().getCurrentSituation();
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



}