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
    }

    public static SituationManager getInstance(){
        if(instance == null){
            instance = new SituationManager();
        }
        return instance;
    }

    //
    public HashMap<String, SituationEntity> getSituationEntities() {
        return this.entities;
    }

    public void addOrUpdateSituationEntity(SituationEntity se) {
        this.entities.put(se.getId(), se);
        CartoManager.getInstance().addOrUpdateSituationEntities(this.getSituationEntities());
    }

    public void fullUpdate(String json){

        entities.clear();
        try {
            JSONObject r = new JSONObject(json);
            JSONArray array = r.getJSONArray("entities");
            for(int i=0; i<array.length(); i++){
                String e = array.getString(i);
                if(e != null){
                    addSituationEntityFromString(e);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void deltaUpdate(String json){

    }

    private void addSituationEntityFromString(String jsonData) {
        try {
            JSONObject ies = new JSONObject(jsonData);
            String id = ies.getString("id");
            String type = ies.getString("type");
            String subtype = ies.getString("subtype");
            String name = ies.getString("name");
            long datetime = ies.getLong("datetime");
            JSONObject shape = ies.getJSONObject("shape");

            SituationEntity se = new SituationEntity(id, type,subtype, name,datetime, shape);
            Log.w("SituationManager", se.toString());
            this.addOrUpdateSituationEntity(se);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


}
