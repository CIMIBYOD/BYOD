package demo.byod.cimicop.ui.views.mapview;


import android.app.Fragment;
import android.app.FragmentTransaction;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.mapbox.mapboxsdk.views.MapView;

import demo.byod.cimicop.R;
import demo.byod.cimicop.core.managers.CartoManager;
import demo.byod.cimicop.ui.views.alertview.AlertSelectorFragment;


/**
 * Created by asharpe on 04/03/2015.
 */
public class MapFragment extends Fragment {

    public MapFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.map, container, false);

        MapView mapView = (MapView) rootView.findViewById(R.id.mapview);

        final Button button = (Button) rootView.findViewById(R.id.open_alert_selector);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                // Perform action on click
                // Create new fragment and transaction
                Fragment newFragment = new AlertSelectorFragment();
                FragmentTransaction transaction = getFragmentManager().beginTransaction();

                // Replace whatever is in the fragment_container view with this fragment,
                // and add the transaction to the back stack
                transaction.replace(R.id.container, newFragment);
                transaction.addToBackStack(null);

                // Commit the transaction
                transaction.commit();
            }
        });

        //CartoManager.getInstance().setMap(mapView, rootView.getContext());

        return rootView;
    }
}
