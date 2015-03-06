package demo.byod.cimicop.ui.views.newsview;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import demo.byod.cimicop.R;
import demo.byod.cimicop.core.models.News;
import demo.byod.cimicop.ui.newsadapter.NewsAdapter;
import demo.byod.cimicop.ui.views.alertview.AlertFragment;

/**
 * Created by Anthony on 07/02/2015.
 */
public class NewsFragment extends Fragment {

    public NewsFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.news_list_main, container, false);

        RecyclerView recyclerView = (RecyclerView) rootView.findViewById(R.id.recyclerView);

        // this is data fro recycler view
        News itemsData[] = {
                new News("EVACUATION !",R.drawable.ic_action_export_red,"Go to designated point for pick up", "24/02/15 16:20"),
                new News("Restrict movements ",R.drawable.ic_action_shield_red,"Due to a kidnapping in the region ...", "24/02/15 16:20"),
                new News("Kidnapping in GAO",R.drawable.ic_action_warning_red,"No more info at the time ", "24/02/15 16:20"),
                new News("Risque of Kidnapping",R.drawable.ic_action_warning_orange,"Please be vigilant, the threat level ...", "24/02/15 16:20"),
                new News("Daily news",R.drawable.ic_action_monolog_green,"All the news for the region around GAO", "24/02/15 16:20"),
                new News("Suspicious activities",R.drawable.ic_action_location_orange,"Reports indicates high kidnapping rates ...", "24/02/15 16:20")};

        // 2. set layoutManger
        recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        // 3. create an adapter
        NewsAdapter mAdapter = new NewsAdapter(itemsData);
        // 4. set adapter
        recyclerView.setAdapter(mAdapter);
        // 5. set item animator to DefaultAnimator
        recyclerView.setItemAnimator(new DefaultItemAnimator());

        recyclerView.addItemDecoration(new DividerItemDecoration(getActivity(), DividerItemDecoration.VERTICAL_LIST));


        final Button button = (Button) rootView.findViewById(R.id.open_report_form);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                // Perform action on click
                // Create new fragment and transaction
                Fragment newFragment = new AlertFragment();
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
