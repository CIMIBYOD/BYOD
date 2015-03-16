package demo.byod.cimicop.core.managers;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

import demo.byod.cimicop.core.models.SituationEntity;

public class SituationManager {

    private static SituationManager instance = null;

    private HashMap<String, SituationEntity> entities = new HashMap<String, SituationEntity>();

    public SituationManager(){

        JSONObject ex1 = new JSONObject();

        try {
            ex1.put("type", "ponctual");
            JSONArray coords = new JSONArray();
            JSONObject latLng = new JSONObject();
            latLng.put("lat", 48.85);
            latLng.put("lon", 2.4);
            coords.put(latLng);
            ex1.put("coords", coords);

            SituationEntity se = new SituationEntity("id1", "name1", "explosion", ex1);
            this.entities.put(se.getId(), se);

        } catch (JSONException e) {
            e.printStackTrace();
        }


    }

    public static SituationManager getInstance(){
        if(instance == null){
            instance = new SituationManager();
        }
        return instance;
    }


    public HashMap<String, SituationEntity> getSituationEntities() {

        return this.entities;
    }

    public void addOrUpdateSituationEntity(SituationEntity se) {

        this.entities.put(se.getId(), se);

        CartoManager.getInstance().addOrUpdateSituationEntities(this.getSituationEntities());

    }

    public void addSituationEntityFromString(String jsonData) {
        try {
            JSONObject ies = new JSONObject(jsonData);
            String id = ies.getString("id");
            String type = ies.getString("type");
            String name = ies.getString("name");
            JSONObject shape = ies.getJSONObject("shape");

            SituationEntity se = new SituationEntity(id, name, type, shape);
            Log.w("SituationManager", se.toString());
            this.addOrUpdateSituationEntity(se);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


}
