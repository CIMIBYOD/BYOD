package demo.byod.cimicop.core.services.situation;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;


import java.util.Timer;
import java.util.TimerTask;

import de.greenrobot.event.EventBus;
import demo.byod.cimicop.R;
import demo.byod.cimicop.core.events.RevokedStateEvent;
import demo.byod.cimicop.core.managers.RestQueryManager;
import demo.byod.cimicop.ui.views.login.RevokedFragment;


public class SituationService extends Service {

    private static final long NOTIFY_INTERVAL = 1000 * 60;

    private Timer mTimer = null;

    @Override
    public void onCreate(){
        super.onCreate();

        // cancel if already existed
        if(mTimer != null) {
            mTimer.cancel();
        } else {
            // recreate new
            mTimer = new Timer();
        }
        // schedule task
        mTimer.scheduleAtFixedRate(new GetCurrentSituationTimerTask(), 0, NOTIFY_INTERVAL);

        EventBus.getDefault().register(this);;
    }

    @Override
    public void onDestroy() {
        if(mTimer != null) {
            mTimer.cancel();
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        return super.onUnbind(intent);
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
    }


    class GetCurrentSituationTimerTask extends TimerTask {

        @Override
        public void run() {
            RestQueryManager.getInstance().getCurrentSituation();
        }
    }

    //Notification of user being revoked
    public void onEventMainThread(RevokedStateEvent event) {
        if (event.isRevoked()) {
            EventBus.getDefault().unregister(this);
            stopSelf();
        }
    }

}