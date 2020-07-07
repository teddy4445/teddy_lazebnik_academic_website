package info.teddylazebnik.mobileversion

import android.Manifest
import androidx.fragment.app.Fragment
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import com.github.appintro.AppIntro2
import com.github.appintro.AppIntroFragment
import com.github.appintro.AppIntroPageTransformerType

class MyCustomAppIntro : AppIntro2() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setTransformer(AppIntroPageTransformerType.Fade)
        isColorTransitionsEnabled = true
        // Toggle Indicator Visibility
        isIndicatorEnabled = true
        // allow to skip
        isWizardMode = true
        // show full screen
        setImmersiveMode()

        // Change Indicator Color
        setIndicatorColor(
            selectedIndicatorColor = Color.BLACK,
            unselectedIndicatorColor = getResources().getColor(R.color.white)
        )

        // ask permissions in the wanted slide
        askForPermissions(
            permissions = arrayOf(Manifest.permission.INTERNET),
            slideNumber = 4,
            required = true)
        askForPermissions(
            permissions = arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE),
            slideNumber = 4,
            required = true)
        askForPermissions(
            permissions = arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
            slideNumber = 4,
            required = true)

        // Call addSlide passing your Fragments.
        addSlide(
            AppIntroFragment.newInstance(
                title = "Welcome",
                description = "Here you will able to get updates regarding technological, academic, and pedagogic updates by Teddy Lazebnik.",
                titleColor = Color.WHITE,
                imageDrawable  = R.drawable.splash_icon,
                descriptionColor = Color.WHITE,
                backgroundColor = getResources().getColor(R.color.colorPrimaryComplete)
            )
        )

        // Call addSlide passing your Fragments.
        addSlide(
            AppIntroFragment.newInstance(
                title = "Teaching",
                description = "In either 'teaching' and 'messages' tabs you will be find relevant resources for your course and online messages.",
                titleColor = Color.WHITE,
                imageDrawable  = R.drawable.main_manu_teaching,
                descriptionColor = Color.WHITE,
                backgroundColor = getResources().getColor(R.color.colorPrimaryDarkest)
            )
        )

        // Call addSlide passing your Fragments.
        addSlide(
            AppIntroFragment.newInstance(
                title = "Open Resources",
                description = "You will be able to find technological blog and open source in the related tabs.",
                titleColor = Color.WHITE,
                imageDrawable  = R.drawable.main_manu_code,
                descriptionColor = Color.WHITE,
                backgroundColor =  getResources().getColor(R.color.colorPrimaryComplete2)
            )
        )

        // Call addSlide passing your Fragments.
        addSlide(
            AppIntroFragment.newInstance(
                title = "Academia",
                description = "You are a Bc.S or Mc.S student in the Math or CS. dept. and finding research exciting? checkout the students tab. You can find my academic papers in the related tab.",
                titleColor = Color.WHITE,
                imageDrawable  = R.drawable.main_manu_students,
                descriptionColor = Color.WHITE,
                backgroundColor =  getResources().getColor(R.color.colorPrimaryComplete3)
            )
        )
    }

    override fun onSkipPressed(currentFragment: Fragment?) {
        super.onSkipPressed(currentFragment)
        openMainMenuActivity()
    }

    override fun onDonePressed(currentFragment: Fragment?) {
        super.onDonePressed(currentFragment)
        openMainMenuActivity()
    }

    override fun onUserDeniedPermission(permissionName: String) {
        // TODO: finish it later
        // User pressed "Deny" on the permission dialog
    }
    override fun onUserDisabledPermission(permissionName: String) {
        // TODO: finish it later
        // User pressed "Deny" + "Don't ask again" on the permission dialog
    }

    /*
    Open the main menu activity
     */
    fun openMainMenuActivity()
    {
        val intent = Intent(this, MainMenuActivity::class.java)
        startActivity(intent)
    }
}