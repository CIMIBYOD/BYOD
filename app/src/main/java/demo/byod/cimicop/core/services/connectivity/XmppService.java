package demo.byod.cimicop.core.services.connectivity;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import org.jivesoftware.smack.AbstractXMPPConnection;
import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.packet.Presence;
import org.jivesoftware.smack.tcp.XMPPTCPConnection;
import org.jivesoftware.smack.tcp.XMPPTCPConnectionConfiguration;


public class XmppService extends Service{

    public static final String HOST = "192.168.1.95";
    public static final int PORT = 5222;
    public static final String ROOM = "france@conference.cimicop";
    public static final String LOG = "asharpe";
    public static final String PWD = "asharpe";

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        new Thread(new Runnable() {
            public void run() {

                XMPPTCPConnectionConfiguration config = XMPPTCPConnectionConfiguration.builder()
                        .setUsernameAndPassword(LOG, PWD)
                        .setServiceName("cimicop")
                        .setHost(HOST)
                        .setPort(5222)
                        .setSecurityMode(ConnectionConfiguration.SecurityMode.disabled)
                        .build();

                AbstractXMPPConnection conn2 = new XMPPTCPConnection(config);


                try {
                    conn2.connect();
                    conn2.login(LOG,PWD);

                    // Create a new presence. Pass in false to indicate we're unavailable._
                    Presence presence = new Presence(Presence.Type.available);
                    presence.setStatus("Gone fishing");
// Send the packet (assume we have an XMPPConnection instance called "con").
                    conn2.sendStanza(presence);

                } catch (XMPPException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
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

}
