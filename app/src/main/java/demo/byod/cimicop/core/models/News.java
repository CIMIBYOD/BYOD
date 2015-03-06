package demo.byod.cimicop.core.models;

public class News {

    private String title;
    private String description;
    private int imageUrl;
    private String date;


    public News(String title, int imageUrl, String description, String date){

        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.date = date;
    }

    public int getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(int imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }



}
