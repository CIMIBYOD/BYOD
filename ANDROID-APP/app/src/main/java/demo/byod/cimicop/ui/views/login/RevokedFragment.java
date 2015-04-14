package demo.byod.cimicop.ui.views.login;

import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


import demo.byod.cimicop.R;


public class RevokedFragment extends Fragment {

    // Creating JSON Parser object

    public RevokedFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View rootView = inflater.inflate(R.layout.revoked_main, container, false);

        return rootView;
    }
}