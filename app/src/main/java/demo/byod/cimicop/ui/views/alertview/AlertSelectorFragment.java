package demo.byod.cimicop.ui.views.alertview;

import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import demo.byod.cimicop.R;


/**
 * Created by asharpe on 06/03/2015.
 */
public class AlertSelectorFragment extends Fragment {

    public AlertSelectorFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.alert_selector_fragment, container, false);

        return rootView;
    }
}
