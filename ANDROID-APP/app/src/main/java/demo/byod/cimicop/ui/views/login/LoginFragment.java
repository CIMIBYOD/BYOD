package demo.byod.cimicop.ui.views.login;

import android.support.v4.app.Fragment;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.apache.http.HttpResponse;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import demo.byod.cimicop.R;
import demo.byod.cimicop.core.preferences.PreferencesManager;
import demo.byod.cimicop.ui.views.osmview.OsmFragment;


public class LoginFragment extends Fragment {

    public static final String LOGIN_SERVICE = "http://192.168.43.33:9000/auth/local";

    EditText uname, password;
    Button submit;
    // Creating JSON Parser object

    public LoginFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View rootView =  inflater.inflate(R.layout.login_main, container, false);

        uname = (EditText) rootView.findViewById(R.id.txtUser);
        password = (EditText) rootView.findViewById(R.id.txtPass);
        submit = (Button) rootView.findViewById(R.id.button1);

        //Get init prefs values and adding listener on pref changes
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this.getActivity());
        String storedLogin = sharedPref.getString(PreferencesManager.LOGIN, "");
        String storedPassword = sharedPref.getString(PreferencesManager.PASSWORD, "");
        uname.setText(storedLogin, TextView.BufferType.EDITABLE);
        password.setText(storedPassword, TextView.BufferType.EDITABLE);
        if(storedLogin.isEmpty() && storedPassword.isEmpty()){
            new Login().execute();
        }

        submit.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {
                // execute method invokes doInBackground() where we open a Http URL connection using the given Servlet URL
                //and get output response from InputStream and return it.
                new Login().execute();
            }
        });

        return rootView;
    }

    private class Login extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... args) {
            // Getting username and password from user input
            String username = uname.getText().toString();
            String pass = password.getText().toString();

            //TODO remove only for testing
            if(username.equals("test")&& pass.equals("test")){
                getFragmentManager().beginTransaction().add(R.id.container, new OsmFragment()).commit();
            }

            String server = username.substring(username.indexOf("@")+1);
            String login_service = "http://"+server+":9000/auth/local";
            Log.d("Login", login_service);
            try {
                //create HttpClient
                HttpClient httpclient = new DefaultHttpClient();
                //make POST request to the given URL
                HttpPost httpPost = new HttpPost(login_service);

                //Create body with input data
                JSONObject body = new JSONObject();
                body.put("email", username);
                body.put("password", pass);

                //convert JSONObject to JSON to String
                String json = body.toString();

                //set json to StringEntity
                StringEntity se = new StringEntity(json);
                se.setContentType(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
                httpPost.setEntity(se);

                //set httpPost Entity
                httpPost.setEntity(se);
                //Set some headers to inform server about the type of the content

                httpPost.setHeader("Accept", "application/json");
                httpPost.setHeader("Content-type", "application/json");
                //Execute POST request to the given URL
                HttpResponse httpResponse = httpclient.execute(httpPost);
                String JSONString = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");

                if( httpResponse.getStatusLine().getStatusCode() == 200){

                    JSONObject ies = new JSONObject(JSONString);
                    String token = ies.getString("token");
                    if(token.equalsIgnoreCase("revoked")){
                        getFragmentManager().beginTransaction().add(R.id.container, new RevokedFragment()).commit();
                    }
                    String login = uname.getText().toString();

                    SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(LoginFragment.this.getActivity());
                    SharedPreferences.Editor editor = sharedPref.edit();
                    editor.putString(PreferencesManager.LOGIN, login);
                    editor.putString(PreferencesManager.PASSWORD, pass);
                    editor.putString(PreferencesManager.TOKEN, token);
                    editor.putString(PreferencesManager.HOST, server);
                    editor.putString(PreferencesManager.PORT, "9000");

                    editor.commit();

                    Log.d("LOGIN", "OK :"+ login+" "+ token);
                    getFragmentManager().beginTransaction().add(R.id.container, new OsmFragment()).commit();

                }else{
                    Log.d("LOGIN", "FAIL :"+ JSONString);
                }

            } catch (Exception e) {
                Log.d("LOGIN", e.getLocalizedMessage());
            }

            return null;
        }

    }

}
