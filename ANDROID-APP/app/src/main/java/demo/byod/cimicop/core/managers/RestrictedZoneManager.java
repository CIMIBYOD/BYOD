package demo.byod.cimicop.core.managers;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.provider.Settings;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Collection;
import java.util.HashMap;

import demo.byod.cimicop.MainActivity;
import demo.byod.cimicop.R;
import demo.byod.cimicop.core.models.SituationEntity;
import demo.byod.cimicop.core.services.location.LocationService;

/**
 * Gestionnaire vérifiant l'inclusion de la position du périphérique
 * dans les zones de la situation
 */
public class RestrictedZoneManager {

    private static RestrictedZoneManager instance;

    private String lastNotifiedZone = "";

    public RestrictedZoneManager(){

    }

    public static RestrictedZoneManager getInstance(){
        if(instance == null){
            instance = new RestrictedZoneManager();
        }
        return instance;
    }

    public void checkLocation(double latitude, double longitude, float accuracy) {

        try {
            HashMap<String, SituationEntity> entities = SituationManager.getInstance().getSituationEntities();
            Collection<SituationEntity> entitiesList = entities.values();

            //Itération sur les objets de situation

            boolean atLeastIsInOneZone = false;
            for(SituationEntity se : entitiesList) {
                //On ne traite que les surfaciques
                if(se.getType().equals("area")) {
                    JSONObject jsonObj = se.getShape();
                    JSONArray posArray = jsonObj.getJSONArray("coords");

                    int nvert = posArray.length();
                    double[] vertx = new double[nvert];
                    double[] verty = new double[nvert];

                    for(int i = 0; i < nvert; i++) {
                        JSONObject pos = posArray.getJSONObject(i);
                        double lat = pos.getDouble("lat");
                        vertx[i] = lat;
                        double lon = pos.getDouble("lon");
                        verty[i] = lon;
                    }

                    int i, j;
                    boolean c = false;
                    for (i = 0, j = nvert-1; i < nvert; j = i++) {
                        if ( ((verty[i]>longitude) != (verty[j]>longitude)) &&
                                (latitude < (vertx[j]-vertx[i]) * (longitude-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
                            c = !c;
                    }

                    //Send android notif if included in a restricted zone
                    if(c) {
                        //TODO : Afficher la notification
                        //locationService.generateZoneEntryNotification(se.getName());
                        atLeastIsInOneZone = true;
                        this.generateZoneEntryNotification(se.getName());
                    }
                }
            }
            if(!atLeastIsInOneZone){
                this.lastNotifiedZone = "";
            }

        } catch (Exception e) {
            Log.d("sendCurrentLocation", e.getLocalizedMessage());
        }

    }

    public void generateZoneEntryNotification(String zoneName) {

        if(!this.lastNotifiedZone.equalsIgnoreCase(zoneName)){
            this.lastNotifiedZone = zoneName;
            NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(MainActivity.getContext())
                    .setSmallIcon(R.drawable.ic_action_location_2)
                    .setContentTitle("RESTRICTED ZONE")
                    .setContentText("Entering in restricted zone : " + zoneName);
            mBuilder.setVibrate(new long[]{50,500,200,500,200,1000,200,1500});
            Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            mBuilder.setSound(notification);

            NotificationManager mNotificationManager = (NotificationManager) MainActivity.getContext().getSystemService(Context.NOTIFICATION_SERVICE);
            // mId allows you to update the notification later on.
            mNotificationManager.notify(1, mBuilder.build());
        }
    }

    /*    public void showNotification(String text){
+
+        // define sound URI, the sound to be played when there's a notification
+        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
+
+        // intent triggered, you can add other intent for other actions
+        //Intent intent = new Intent(MainActivity.this, NotificationReceiver.class);
+        //PendingIntent pIntent = PendingIntent.getActivity(MainActivity.this, 0, intent, 0);
+
+        // this is it, we'll build the notification!
+        // in the addAction method, if you don't want any icon, just set the first param to 0
+        Notification mNotification = new Notification.Builder(this)
+
+                .setContentTitle("Alarm")
+                .setContentText("You have entered in a restricted zone !")
+                .setSmallIcon(R.drawable.ic_action_location_2)
+                .setContentIntent(*//**pIntent**//*null)
+                .setSound(soundUri)
+
+                //.addAction(R.drawable.ic_action_location_2, "View", pIntent)
+                //.addAction(0, "Remind", pIntent)
+
+                .build();
+
+        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
+
+        notificationManager.notify(0, mNotification);
+    }
+
+    public void cancelNotification(int notificationId){
+
+        if (Context.NOTIFICATION_SERVICE!=null) {
+            NotificationManager nMgr = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
+            nMgr.cancel(notificationId);
+        }
+    }*/



}
