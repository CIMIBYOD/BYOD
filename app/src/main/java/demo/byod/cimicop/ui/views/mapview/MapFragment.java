package demo.byod.cimicop.ui.views.mapview;


import android.app.Fragment;
import android.app.FragmentTransaction;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.mapbox.mapboxsdk.geometry.LatLng;
import com.mapbox.mapboxsdk.overlay.GpsLocationProvider;
import com.mapbox.mapboxsdk.overlay.Icon;
import com.mapbox.mapboxsdk.overlay.Marker;
import com.mapbox.mapboxsdk.overlay.PathOverlay;
import com.mapbox.mapboxsdk.overlay.UserLocationOverlay;
import com.mapbox.mapboxsdk.tileprovider.tilesource.MapboxTileLayer;
import com.mapbox.mapboxsdk.views.MapView;

import demo.byod.cimicop.R;
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
        mapView.setAccessToken("pk.eyJ1IjoiYXNoYXJwZWZyIiwiYSI6IjVvQXFtZDAifQ.C_7U9O7OT1IZPUACJ4VTDg");
        mapView.setTileSource(new MapboxTileLayer("asharpefr.lcd7hho8"));

        GpsLocationProvider providerGps = new GpsLocationProvider(rootView.getContext());
        UserLocationOverlay myLocationOverlay = new UserLocationOverlay(providerGps, mapView);
        myLocationOverlay.enableMyLocation();
        myLocationOverlay.enableFollowLocation();

        myLocationOverlay.setDrawAccuracyEnabled(true);
        mapView.getOverlays().add(myLocationOverlay);

        Marker m = new Marker(mapView, "Stockholm", "Sweden", new LatLng(59.32995, 18.06461));
        m.setIcon(new Icon(rootView.getContext(), Icon.Size.LARGE, "city", "3887be"));
        mapView.addMarker(m);


        PathOverlay line = new PathOverlay(Color.argb(240,240,0,0), 3);
        line.getPaint().setStyle(Paint.Style.FILL);

        line.addPoint(new LatLng(51.2, 0.1));
        line.addPoint(new LatLng(51.7, 0.3));
        line.addPoint(new LatLng(52.7, 1.3));
        line.addPoint(new LatLng(51.2, 0.1));

        mapView.getOverlays().add(line);

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
        return rootView;
    }
}
