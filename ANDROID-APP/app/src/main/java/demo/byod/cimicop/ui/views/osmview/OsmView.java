package demo.byod.cimicop.ui.views.osmview;

import android.content.Context;
import android.util.AttributeSet;
import android.webkit.WebView;

/**
 * Main map view of Cimicop.
 * <br>This is only a container, the actual view is OsmFragment
 */
public class OsmView extends WebView {

    public OsmView(Context context) {
        super(context);
    }

    public OsmView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public OsmView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

}
