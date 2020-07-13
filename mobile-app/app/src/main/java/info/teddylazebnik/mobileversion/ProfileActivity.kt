package info.teddylazebnik.mobileversion

import android.os.Bundle
import android.support.wearable.activity.WearableActivity

class ProfileActivity : WearableActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile2)

        // Enables Always-on
        setAmbientEnabled()
    }
}