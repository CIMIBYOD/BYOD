package demo.byod.cimicop.core.managers;

import java.util.ArrayList;
import java.util.List;

import demo.byod.cimicop.core.models.SituationEntity;
import demo.byod.cimicop.core.models.Zone;

public class SituationManager {

    private static SituationManager instance = null;

    public SituationManager(){

    }

    public static SituationManager getInstance(){
        if(instance == null){
            instance = new SituationManager();
        }
        return instance;
    }


    public List<SituationEntity> getSituationEntities(){

        ArrayList<SituationEntity> entities = new ArrayList<SituationEntity>();

        Zone z = new Zone();

        entities.add(z);

        return entities;
    }

}
