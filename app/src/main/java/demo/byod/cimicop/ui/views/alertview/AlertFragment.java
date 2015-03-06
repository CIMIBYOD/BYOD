package demo.byod.cimicop.ui.views.alertview;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;

import demo.byod.cimicop.R;

/**
 * Created by Anthony on 01/02/2015.
 */
public class AlertFragment extends Fragment {

    public AlertFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.alert_fragment_main, container, false);

        Spinner spinner = (Spinner) rootView.findViewById(R.id.alert_type_spinner);
        // Create an ArrayAdapter using the string array and a default spinner layout
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getActivity(),R.array.alert_types_list, android.R.layout.simple_spinner_item);
        // Specify the layout to use when the list of choices appears
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        // Apply the adapter to the spinner
        spinner.setAdapter(adapter);

        final Button button = (Button) rootView.findViewById(R.id.send_report_button);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {



            }
        });

        return rootView;
    }
}

