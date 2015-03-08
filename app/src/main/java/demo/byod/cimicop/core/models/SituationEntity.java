package demo.byod.cimicop.core.models;

import org.json.JSONObject;

public class SituationEntity {

    public String id;
    public String type;
    public String name;
    public JSONObject shape;

    public SituationEntity(String id, String type, String name, JSONObject shape) {
        this.setId(id);
        this.setName(name);
        this.setType(type);
        this.setShape(shape);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JSONObject getShape() {
        return shape;
    }

    public void setShape(JSONObject shape) {
        this.shape = shape;
    }

    public String toString() {
        return this.id + " " + this.type + " " + this.name + " " + this.shape.toString();
    }

}
