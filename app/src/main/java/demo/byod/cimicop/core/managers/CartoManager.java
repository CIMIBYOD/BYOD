package demo.byod.cimicop.core.managers;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.Log;

import com.mapbox.mapboxsdk.geometry.LatLng;
import com.mapbox.mapboxsdk.overlay.GpsLocationProvider;
import com.mapbox.mapboxsdk.overlay.Icon;
import com.mapbox.mapboxsdk.overlay.Marker;
import com.mapbox.mapboxsdk.overlay.PathOverlay;
import com.mapbox.mapboxsdk.overlay.UserLocationOverlay;
import com.mapbox.mapboxsdk.tileprovider.tilesource.MapboxTileLayer;
import com.mapbox.mapboxsdk.views.MapView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import demo.byod.cimicop.core.models.SituationEntity;
import demo.byod.cimicop.ui.views.osmview.OsmFragment;
import demo.byod.cimicop.ui.views.osmview.OsmView;

public class CartoManager {

    private static CartoManager instance = null;
    GpsLocationProvider providerGps;
    private OsmFragment map = null;
    private Context context = null;
    private HashMap<String, Object> mapObjectsCache = new HashMap<String, Object>();

    public CartoManager() {

    }

    public static CartoManager getInstance() {
        if (instance == null) {
            instance = new CartoManager();
        }
        return instance;
    }

    public void setMap(OsmFragment map, Context context) {

        this.map = map;
        this.context = context;

        this.addOrUpdateSituationEntities(SituationManager.getInstance().getSituationEntities());


    }


    public void addOrUpdateSituationEntities(HashMap<String, SituationEntity> entities) {

        if (map != null && context != null) {
            for (Map.Entry<String, SituationEntity> e : entities.entrySet()) {

                if (this.mapObjectsCache.containsKey(e.getKey())) {
                    //SituationEntity already displayed on the map, updating the map object
                    this.updateFromSituationEntity(e.getKey(), e.getValue());

                } else {
                    //SituationEntity doesn't exist on the map, creating the map object
                    final JSONObject displayedObject = this.createFromSituationEntity(e.getValue());
                    map.addBso(displayedObject);

                }
            }

        }

    }

    public void removeSituationEntities(HashMap<String, SituationEntity> entities) {

        for (Map.Entry<String, SituationEntity> e : entities.entrySet()) {

            if (this.mapObjectsCache.containsKey(e.getKey())) {
                //SituationEntity already displayed on the map, updating the map object
                if (map != null && context != null) {
                    map.removeBso(e.getKey());
                }
                this.mapObjectsCache.remove(e.getKey());

            } else {
               Log.w("Trying to remove from map unknown BSO of id "+e.getKey());
            }
        }



    }

    private JSONObject createFromSituationEntity(SituationEntity se) {

        JSONObject bsoInJson = new JSONObject();
        try {
            bsoInJson.put("id", se.getId());
            bsoInJson.put("type", se.getType());
            bsoInJson.put("name", se.getName());
            bsoInJson.put("shape", se.getShape());

        } catch (JSONException e) {
            e.printStackTrace();
        }
        //add to cache
        this.mapObjectsCache.put(se.getId(),bsoInJson);
        return bsoInJson;
    }

    private void updateFromSituationEntity(String id, SituationEntity se) {
        JSONObject bsoInJson = new JSONObject();
        try {
            bsoInJson.put("id", se.getId());
            bsoInJson.put("type", se.getType());
            bsoInJson.put("name", se.getName());
            bsoInJson.put("shape", se.getShape());

        } catch (JSONException e) {
            e.printStackTrace();
        }
        map.updateBso(bsoInJson);
    }
}
