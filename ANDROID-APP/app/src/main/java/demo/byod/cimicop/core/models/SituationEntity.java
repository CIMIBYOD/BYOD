package demo.byod.cimicop.core.models;

import org.json.JSONObject;

public class SituationEntity {

    public String id;
    public String type;
    public String subtype;
    public String name;
    public long datetime;
    public JSONObject shape;

    public SituationEntity(String id, String type,String subtype, String name, long datetime, JSONObject shape) {
        this.setId(id);
        this.setName(name);
        this.setType(type);
        this.setShape(shape);
        this.setSubType(subtype);
        this.setDatetime(datetime);

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

    public String getSubType() {
        return subtype;
    }

    public void setSubType(String subtype) {
        this.subtype = subtype;
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

    public long getDatetime() {
        return datetime;
    }

    public void setDatetime(long datetime) {
        this.datetime = datetime;
    }

    public String toString() {
        return this.id + " " + this.type + " " + this.name + " " + this.shape.toString();
    }

}
