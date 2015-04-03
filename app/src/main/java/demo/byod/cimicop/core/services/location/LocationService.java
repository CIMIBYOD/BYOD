package demo.byod.cimicop.core.services.location;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.media.RingtoneManager;
import android.os.Bundle;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import demo.byod.cimicop.R;
import demo.byod.cimicop.core.managers.RestQueryManager;
import demo.byod.cimicop.core.managers.RestrictedZoneInclusionManager;
import demo.byod.cimicop.core.preferences.PreferencesManager;

/*
 *
 */
public class LocationService extends Service implements
        SharedPreferences.OnSharedPreferenceChangeListener,
        GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener,
        LocationListener {

    public static final long TIME_BTW_REFRESH = 5000; //Todo get from prefs
    private static final String LOCATION_SERVICE_TAG = "LOC-SRVC";
    private boolean sendCurrentLocationToServer = false;

    private GoogleApiClient googleApiClient;
    private LocationRequest locationRequest;
    private RestrictedZoneInclusionManager restrictedZoneMgr;

    @Override
    public void onCreate() {
        super.onCreate();

        //Get init prefs values and adding listener on pref changes
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        sendCurrentLocationToServer = sharedPref.getBoolean(PreferencesManager.LOCATION_PUSH, false);
        sharedPref.registerOnSharedPreferenceChangeListener(this);

        //Create GoogleApiClient to access LocationServices.FusedLocationApi
        googleApiClient = new GoogleApiClient.Builder(this)
                .addApi(LocationServices.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();

        restrictedZoneMgr = new RestrictedZoneInclusionManager(LocationService.this);

        Log.i(LOCATION_SERVICE_TAG, "onCreate() DONE");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        googleApiClient.connect();

        Log.i(LOCATION_SERVICE_TAG, "onStartCommand() DONE");
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {

        //Removing listener on pref changes
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        sharedPref.unregisterOnSharedPreferenceChangeListener(this);

        googleApiClient.disconnect();

        Log.i(LOCATION_SERVICE_TAG, "onDestroy() DONE");
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


    @Override
    // Caution: When you call registerOnSharedPreferenceChangeListener(), the preference manager does
    // not currently store a strong reference to the listener. You must store a strong reference to
    // the listener, or it will be susceptible to garbage collection. We recommend you keep a reference
    // to the listener in the instance data of an object that will exist as long as you need the listener.
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

        if (key.equals(PreferencesManager.LOCATION_PUSH)) {
            sendCurrentLocationToServer = sharedPreferences.getBoolean(PreferencesManager.LOCATION_PUSH, false);
            Log.i(LOCATION_SERVICE_TAG, "Location PUSH preferences changed to = " + sendCurrentLocationToServer);

            if (googleApiClient != null) {
                if (sendCurrentLocationToServer) {
                    if (!googleApiClient.isConnected() || googleApiClient.isConnecting()) {
                        googleApiClient.connect();
                        Log.i(LOCATION_SERVICE_TAG, "STARTED Listening & Sending location");
                    }
                } else {
                    googleApiClient.disconnect();
                    Log.i(LOCATION_SERVICE_TAG, "STOPPED Listening & Sending location");
                }
            }
        }
    }

    @Override
    public void onConnected(Bundle bundle) {

        locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        locationRequest.setInterval(TIME_BTW_REFRESH);

        LocationServices.FusedLocationApi.requestLocationUpdates(googleApiClient, locationRequest, this);

        Log.i(LOCATION_SERVICE_TAG, "GoogleApiClient requestLocationUpdates onConnected");
    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.i(LOCATION_SERVICE_TAG, "GoogleApiClient connection has been suspend");
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        Log.i(LOCATION_SERVICE_TAG, "GoogleApiClient connection has failed");
    }


    @Override
    public void onLocationChanged(Location location) {
        Log.i(LOCATION_SERVICE_TAG, "Location received: " + location.toString());
        if (location != null) {

            //Appel au gestionnaire REST pour diffuser la position
            RestQueryManager.sendLocation(location.getLatitude(), location.getLongitude(), location.getAccuracy());

            //Appel au controleur de position pour vérifier l'inclusion dans des zones de dangers
            restrictedZoneMgr.checkLocation(location.getLatitude(), location.getLongitude(), location.getAccuracy());

        }

    }

    public void generateZoneEntryNotification(String zoneName) {

       NotificationManager nMgr = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

        Notification notif = new Notification();
        notif.icon= R.drawable.ic_action_location_2;
        notif.tickerText="ALARM, ALARM ! Entering in restricted zone : "+zoneName;
        notif.sound=RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        nMgr.notify(1, notif);
    }

}
