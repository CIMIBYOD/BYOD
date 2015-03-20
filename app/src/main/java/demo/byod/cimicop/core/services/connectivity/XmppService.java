package demo.byod.cimicop.core.services.connectivity;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.PacketListener;
import org.jivesoftware.smack.XMPPConnection;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.filter.MessageTypeFilter;
import org.jivesoftware.smack.filter.PacketFilter;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.packet.Packet;
import org.jivesoftware.smack.util.dns.HostAddress;
import org.jivesoftware.smackx.muc.MultiUserChat;

import demo.byod.cimicop.core.managers.SituationManager;


public class XmppService extends Service implements PacketListener {

    public static final String HOST = "192.168.1.100";
    public static final int PORT = 5222;
    public static final String ROOM = "tocivilian@conference.serverc2";
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

                ConnectionConfiguration config = new ConnectionConfiguration(HOST, PORT);
                config.setUsedHostAddress(new HostAddress(HOST));
                config.setSecurityMode(ConnectionConfiguration.SecurityMode.disabled);
                XMPPConnection connection = new XMPPConnection(config);
                try {
                    connection.connect();
                    connection.login(LOG, PWD);// Log into the server
                    PacketFilter filter = new MessageTypeFilter(Message.Type.chat);
                    connection.addPacketListener(XmppService.this, filter);

                    MultiUserChat muc2 = new MultiUserChat(connection, ROOM);
                    muc2.join(LOG);

                    muc2.addMessageListener(XmppService.this);


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

    @Override
    public void processPacket(Packet packet) {
        if(packet instanceof  Message) {
            Message message = (Message) packet;
            if (message != null) {
                String body = message.getBody();
                String from = message.getFrom();
                Log.w("XMPP", from + " = " + body);
                SituationManager.getInstance().addSituationEntityFromString(body);
            }
        }
    }
}
