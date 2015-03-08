package demo.byod.cimicop.core.managers;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;

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

import demo.byod.cimicop.core.models.SituationEntity;

public class CartoManager {

    private static CartoManager instance = null;
    GpsLocationProvider providerGps;
    private MapView mapview = null;
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

    public void setMapView(MapView mapview, Context context) {

        this.mapview = mapview;
        this.context = context;

        mapview.setAccessToken("pk.eyJ1IjoiYXNoYXJwZWZyIiwiYSI6IjVvQXFtZDAifQ.C_7U9O7OT1IZPUACJ4VTDg");
        mapview.setTileSource(new MapboxTileLayer("asharpefr.lcd7hho8"));

        providerGps = new GpsLocationProvider(context);


        UserLocationOverlay myLocationOverlay = new UserLocationOverlay(providerGps, mapview);
        myLocationOverlay.enableMyLocation();
        myLocationOverlay.enableFollowLocation();

        myLocationOverlay.setDrawAccuracyEnabled(true);
        mapview.getOverlays().add(myLocationOverlay);


        this.addOrUpdateSituationEntities(SituationManager.getInstance().getSituationEntities());


    }


    public void addOrUpdateSituationEntities(HashMap<String, SituationEntity> entities) {

        if (mapview != null && context != null) {
            for (Map.Entry<String, SituationEntity> e : entities.entrySet()) {

                if (this.mapObjectsCache.containsKey(e.getKey())) {
                    //SituationEntity already displayed on the map, updating the map object
                    this.updateFromSituationEntity(e.getKey(), e.getValue());

                } else {
                    //SituationEntity doesn't exist on the map, creating the map object
                    Object displayedObject = this.createFromSituationEntity(e.getKey(), e.getValue());
                    if (displayedObject instanceof Marker) {
                        mapview.addMarker((Marker) displayedObject);
                    } else if (displayedObject instanceof PathOverlay) {
                        mapview.addOverlay((PathOverlay) displayedObject);
                    }
                }
            }
            //Force refresh of the map
            //mapview.invalidate();
        }

    }

    public void removeSituationEntities(HashMap<String, SituationEntity> entities) {

        for (Map.Entry<String, SituationEntity> e : entities.entrySet()) {

            if (this.mapObjectsCache.containsKey(e.getKey())) {
                //SituationEntity already displayed on the map, updating the map object
                if (mapview != null && context != null) {
                    Object displayedObject = this.mapObjectsCache.get(e.getKey());
                    if (displayedObject instanceof Marker) {
                        mapview.removeMarker((Marker) displayedObject);
                    } else if (displayedObject instanceof PathOverlay) {
                        mapview.removeOverlay((PathOverlay) displayedObject);
                    }
                }
                this.mapObjectsCache.remove(e.getKey());

            } else {
                //SituationEntity doesn't exist on the map
            }
        }
        //Force refresh of the map
        if (mapview != null && context != null) {
            // mapview.invalidate();
        }

    }

    private Object createFromSituationEntity(String id, SituationEntity se) {

        Object resultOject = null;
        if (se != null && se.getShape() != null) {
            JSONObject shape = se.getShape();
            try {
                String type = shape.getString("type");
                if (type != null && type.equalsIgnoreCase("ponctual")) {

                    JSONArray coords = shape.getJSONArray("coords");
                    JSONObject latLng = coords.getJSONObject(0);
                    if (latLng != null) {
                        double lat = latLng.getDouble("lat");
                        double lng = latLng.getDouble("lng");

                        Marker m = new Marker(mapview, se.getName(), se.getType(), new LatLng(lat, lng));
                        m.setIcon(new Icon(context, Icon.Size.LARGE, "city", "3887be"));
                        resultOject = m;
                    }

                } else if (type != null && type.equalsIgnoreCase("polygon")) {
                    PathOverlay line = new PathOverlay(Color.argb(240, 240, 0, 0), 3);
                    line.getPaint().setStyle(Paint.Style.FILL);

                    line.addPoint(new LatLng(51.2, 0.1));
                    line.addPoint(new LatLng(51.7, 0.3));
                    line.addPoint(new LatLng(52.7, 1.3));
                    line.addPoint(new LatLng(51.2, 0.1));
                    resultOject = line;
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return resultOject;
    }

    private void updateFromSituationEntity(String id, SituationEntity se) {

    }
}
