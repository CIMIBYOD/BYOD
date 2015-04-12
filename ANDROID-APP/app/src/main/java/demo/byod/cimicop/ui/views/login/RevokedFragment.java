package demo.byod.cimicop.ui.views.login;

import android.app.Fragment;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import demo.byod.cimicop.R;
import demo.byod.cimicop.core.preferences.PreferencesManager;

public class RevokedFragment extends Fragment {

    // Creating JSON Parser object

    public RevokedFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View rootView = inflater.inflate(R.layout.login_main, container, false);

        return rootView;
    }
}