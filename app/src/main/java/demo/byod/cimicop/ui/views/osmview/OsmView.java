package demo.byod.cimicop.ui.views.osmview;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.text.TextPaint;
import android.util.AttributeSet;
import android.view.View;
import android.webkit.WebView;

import demo.byod.cimicop.R;

/**
 * TODO: document your custom view class.
 */
public class OsmView extends WebView {
private boolean _ready=false;

    public OsmView(Context context) {
        super(context);
    }

    public OsmView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public OsmView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }


    public void setReady() {
        _ready = true;
    }
    public boolean isReady(){
        return _ready;
    }
}
