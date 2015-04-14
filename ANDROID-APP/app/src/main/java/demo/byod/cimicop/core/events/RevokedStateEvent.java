package demo.byod.cimicop.core.events;


public class RevokedStateEvent {

    private boolean isRevoked;

    public RevokedStateEvent(boolean isRevoked){
        this.isRevoked = isRevoked;
    }

    public boolean isRevoked(){
        return this.isRevoked;
    }
}
