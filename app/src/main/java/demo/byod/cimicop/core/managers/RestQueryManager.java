package demo.byod.cimicop.core.managers;


public class RestQueryManager {

    public static final String POSITION_SERVICE = "http://192.168.1.100:8585/TOMSDataService.svc/bso/cimicop/position/fromcivilian/";
    public static final String USER = "user1";


    public static void sendLocation(double latitude, double longitude, float accuracy) {
        /*
        try {
            // 1. create HttpClient
            HttpClient httpclient = new DefaultHttpClient();
            // 2. make POST request to the given URL
            HttpPut httpPUT = new HttpPut(POSITION_SERVICE+USER);

            JSONObject body = new JSONObject();

            //replace with string
            JSONObject position = new JSONObject();
            JSONArray coordsArray = new JSONArray();
            JSONObject coords = new JSONObject();

            String latString = latitude+"";
            String lonString = longitude+"";

            coords.put("lat", latString.replace(".",","));
            coords.put("lon", lonString.replace(".",","));
            coordsArray.put(coords);

            position.put("coords", coordsArray);
            body.put("position", position.toString());

            // 4. convert JSONObject to JSON to String
            String json = body.toString();
            // 5. set json to StringEntity
            StringEntity se = new StringEntity(json);
            // 6. set httpPost Entity
            httpPUT.setEntity(se);
            // 7. Set some headers to inform server about the type of the content
            httpPUT.setHeader("Accept", "application/json");
            httpPUT.setHeader("Content-type", "application/json");
            // 8. Execute POST request to the given URL
            HttpResponse httpResponse = httpclient.execute(httpPUT);
            String JSONString = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
            Log.d("httpResponse", JSONString);

        } catch (Exception e) {
            Log.d("sendCurrentLocation", e.getLocalizedMessage());
        }
        */
    }


}
