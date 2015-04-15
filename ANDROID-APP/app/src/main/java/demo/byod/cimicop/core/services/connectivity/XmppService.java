package demo.byod.cimicop.core.services.connectivity;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import org.jivesoftware.smack.AbstractXMPPConnection;
import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.MessageListener;
import org.jivesoftware.smack.XMPPConnection;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.chat.Chat;
import org.jivesoftware.smack.chat.ChatManager;
import org.jivesoftware.smack.chat.ChatManagerListener;
import org.jivesoftware.smack.chat.ChatMessageListener;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.packet.Presence;
import org.jivesoftware.smack.tcp.XMPPTCPConnection;
import org.jivesoftware.smack.tcp.XMPPTCPConnectionConfiguration;
import org.jivesoftware.smackx.muc.DiscussionHistory;
import org.jivesoftware.smackx.muc.MultiUserChat;
import org.jivesoftware.smackx.muc.MultiUserChatManager;
import org.jivesoftware.smackx.offline.OfflineMessageManager;
import org.json.JSONException;
import org.json.JSONObject;

import de.greenrobot.event.EventBus;
import demo.byod.cimicop.MainActivity;
import demo.byod.cimicop.R;
import demo.byod.cimicop.core.events.RevokedStateEvent;
import demo.byod.cimicop.core.managers.SituationManager;
import demo.byod.cimicop.ui.views.login.RevokedFragment;


public class XmppService extends Service implements MessageListener, ChatMessageListener{

    public static final String HOST = "server.cimicop.org";
    public static final int PORT = 5222;
    public static final String ROOM = "afgha@conference.server.cimicop.org";
    public static final String LOG = "asharpe";
    public static final String PWD = "asharpe";


    private XMPPTCPConnection connection = null;

    @Override
    public void onCreate() {
        super.onCreate();
        EventBus.getDefault().register(this);

        new Thread(new Runnable() {
            public void run() {
                connect();
            }
        }).start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        disconnect();
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


    private void connect(){
        XMPPTCPConnectionConfiguration config = XMPPTCPConnectionConfiguration.builder()
                .setUsernameAndPassword(LOG, PWD)
                .setServiceName(HOST)
                .setHost(HOST)
                .setPort(5222)
                .setSecurityMode(ConnectionConfiguration.SecurityMode.disabled)
                .build();

        this.connection = new XMPPTCPConnection(config);
        try {
            this.connection.connect();
            this.connection.login(LOG,PWD);
            Log.i("XMPP SERVICE","Connected "+ LOG);

            // Create a new presence. Pass in false to indicate we're unavailable._
            Presence presence = new Presence(Presence.Type.available);
            presence.setStatus("Gone fishing");

            // Send the packet (assume we have an XMPPConnection instance called "con").
            this.connection.sendStanza(presence);

            DiscussionHistory dh = new DiscussionHistory();
            dh.setMaxStanzas(0);

            ChatManager chatManager = ChatManager.getInstanceFor(this.connection);

            chatManager.addChatListener(
                    new ChatManagerListener() {
                        @Override
                        public void chatCreated(Chat chat, boolean createdLocally) {
                            if (!createdLocally)
                                chat.addMessageListener(XmppService.this);
                        }
                    });

            // Get the MultiUserChatManager
            MultiUserChatManager manager = MultiUserChatManager.getInstanceFor(this.connection);

            // Create a MultiUserChat using an XMPPConnection for a room
            MultiUserChat muc2 = manager.getMultiUserChat(ROOM);
            muc2.addMessageListener(this);

            // User2 joins the new room
            // The room service will decide the amount of history to send
            muc2.join(LOG,"",dh,10000);

        } catch (XMPPException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void disconnect(){
        try {
            this.connection.disconnect();
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void processMessage(Message message) {
        if(message != null && message.getBody()!= null) {
            Log.i("XMPP SERVICE", message.getBody());
            customProcessMessage(message);
        }

    }

    @Override
    public void processMessage(Chat chat, Message message) {
        if(message != null && message.getBody()!= null) {
            Log.i("XMPP SERVICE", message.getBody());
            customProcessMessage(message);
        }
    }

    private void customProcessMessage(Message message){

        if(message != null) {
            Log.i("XMPP SERVICE", message.getBody());
            String data = message.getBody();
            try {
                JSONObject msg = new JSONObject(data);
                if (msg != null) {
                    String type = msg.getString("type");
                    switch (type) {
                        case "message":
                            String msgData = msg.getString("message");
                            String subjectData = msg.getString("subject");
                            displayMessageNotification(subjectData, msgData);
                            break;
                        case "situation":
                            String situationDelta = msg.getString("situation");
                            SituationManager.getInstance().deltaUpdate(situationDelta);
                            break;
                        case "revoked":
                            Log.d("revokeUserAccess", "revoking user access");
                            String state = msg.getString("value");
                            boolean s = Boolean.getBoolean(state);
                            if(s){
                                EventBus.getDefault().post(new RevokedStateEvent(true));
                            }
                            break;
                        default:
                            break;
                    }
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private void displayMessageNotification(String subject, String msg){
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.drawable.commanderarmy)
                .setContentTitle(subject)
                .setContentText(msg);

        NotificationManager mNotificationManager = (NotificationManager) MainActivity.getContext().getSystemService(Context.NOTIFICATION_SERVICE);
        // mId allows you to update the notification later on.
        mNotificationManager.notify(1, mBuilder.build());
    }

    //Notification of user being revoked
    public void onEventMainThread(RevokedStateEvent event) {
        if (event.isRevoked()) {
            EventBus.getDefault().unregister(this);
            stopSelf();
        }
    }



}
