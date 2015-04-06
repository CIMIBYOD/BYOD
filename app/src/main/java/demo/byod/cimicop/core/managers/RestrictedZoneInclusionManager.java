package demo.byod.cimicop.core.managers;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
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
 * Created by Julien Mullet on 03/04/2015.
 *
 * Gestionnaire vérifiant l'inclusion de la position du périphérique
 * dans les zones de la situation
 */
public class RestrictedZoneInclusionManager {

    private LocationService locationService;

    public RestrictedZoneInclusionManager(LocationService ls) {
        this.locationService = ls;
    }

    public void checkLocation(double latitude, double longitude, float accuracy) {

        try {
            HashMap<String, SituationEntity> entities = SituationManager.getInstance().getSituationEntities();
            Collection<SituationEntity> entitiesList = entities.values();

            //Itération sur les objets de situation
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
                        locationService.generateZoneEntryNotification(se.getName());
                    }

                }
            }

        } catch (Exception e) {
            Log.d("sendCurrentLocation", e.getLocalizedMessage());
        }

    }



}
