package demo.byod.cimicop.ui.views.preferences;

import android.os.Bundle;
import android.preference.PreferenceFragment;

import demo.byod.cimicop.R;

public class PreferencesFragment extends PreferenceFragment {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Load the preferences from an XML resource
        addPreferencesFromResource(R.layout.preferences);
    }

}
