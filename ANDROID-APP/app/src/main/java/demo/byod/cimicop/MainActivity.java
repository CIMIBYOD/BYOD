package demo.byod.cimicop;

import android.content.Context;
import android.content.Intent;

import android.os.Bundle;

import android.support.v4.app.FragmentManager;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.WindowManager;


import java.util.List;

import de.greenrobot.event.EventBus;
import demo.byod.cimicop.core.events.RevokedStateEvent;

import demo.byod.cimicop.core.services.connectivity.XmppService;
import demo.byod.cimicop.core.services.location.LocationService;
import demo.byod.cimicop.core.services.situation.SituationService;
import demo.byod.cimicop.ui.views.login.LoginFragment;
import demo.byod.cimicop.ui.views.login.RevokedFragment;



public class MainActivity extends ActionBarActivity {

    private static Context instance = null;
    public static Context getContext() {
        return instance;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        instance = this.getApplicationContext();

        setContentView(R.layout.activity_main);
        //ActionBar actionBar = getActionBar();
        //actionBar.setDisplayShowTitleEnabled(false);

        if (savedInstanceState == null) {
            //getFragmentManager().beginTransaction().add(R.id.container, new OsmFragment()).commit();
            //getFragmentManager().beginTransaction().add(R.id.container, new LoginFragment()).commit();
            getSupportFragmentManager().beginTransaction().add(R.id.container, new LoginFragment()).commit();

        }

        Intent intentXmppService = new Intent(this, XmppService.class);
        startService(intentXmppService);

        Intent intenLocationServicet = new Intent(this, LocationService.class);
        startService(intenLocationServicet);

        Intent intentSituationService = new Intent(this, SituationService.class);
        startService(intentSituationService);

        EventBus.getDefault().register(this);

        getWindow().setSoftInputMode(
                WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
        );


    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        getMenuInflater().inflate(R.menu.main_actionbar,menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

//        //noinspection SimplifiableIfStatement
//        if (id == R.id.action_settings) {
//            Fragment settingsFragment = new PreferencesFragment();
//            FragmentTransaction transaction = getFragmentManager().beginTransaction();
//
//            // Replace whatever is in the fragment_container view with this fragment,
//            // and add the transaction to the back stack
//            transaction.replace(R.id.container, settingsFragment);
//            transaction.addToBackStack(null);
//
//            // Commit the transaction
//            transaction.commit();
//
//            return true;
//        }

        return super.onOptionsItemSelected(item);
    }


    //Notification of user being revoked
    public void onEventMainThread(RevokedStateEvent event) {
        if (event.isRevoked()) {
            EventBus.getDefault().unregister(this);
            getSupportFragmentManager().beginTransaction().add(R.id.container, new RevokedFragment()).commitAllowingStateLoss();
        }
    }


}