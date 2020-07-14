package info.teddylazebnik.mobileversion

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity


class ProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile_full)

        // build up the screen right
        addClickActions()
    }

    /*
        add click actions
     */
    private fun addClickActions()
    {
        // add call event
        val callImg: ImageView = findViewById(R.id.personalPanelPhoneImg)
        callImg.setOnClickListener{
            openDialer()
        }
        val callText: TextView = findViewById(R.id.personalPanelPhoneText)
        callText.setOnClickListener{
            openDialer()
        }

        // add email event
        val emailImg: ImageView = findViewById(R.id.personalPanelEmailImg)
        emailImg.setOnClickListener{
            openEmail()
        }
        val emailText: TextView = findViewById(R.id.personalPanelEmailText)
        emailText.setOnClickListener{
            openEmail()
        }

        // add map event
        val mapImg: ImageView = findViewById(R.id.personalPanelOfficeImg)
        mapImg.setOnClickListener{
            openMap()
        }
        val mapText: TextView = findViewById(R.id.personalPanelOfficeText)
        mapText.setOnClickListener{
            openMap()
        }

        // add social event
        val socialImg: ImageView = findViewById(R.id.personalPanelSocialImg)
        socialImg.setOnClickListener{
            openSocial()
        }
        val socialText: TextView = findViewById(R.id.personalPanelSocialText)
        socialText.setOnClickListener{
            openSocial()
        }
    }

    private fun openEmail() {
        try
        {
            intent = Intent(Intent.ACTION_VIEW)
                .setType("plain/text")
                .setData(Uri.parse("lazebnik.teddy@gmail.com"))
                .setClassName("com.google.android.gm", "com.google.android.gm.ComposeActivityGmail")
                .putExtra(Intent.EXTRA_SUBJECT, "Message from app")
                .putExtra(Intent.EXTRA_TEXT, "Hi Teddy, I am writing you about: \n");
            startActivity(intent);
        }
        catch (error: Exception)
        {
            Toast.makeText(this, "Service not available right now", Toast.LENGTH_SHORT).show()
        }
    }

    private fun openDialer()
    {
        val intent = Intent(Intent.ACTION_DIAL)
        intent.data = Uri.parse("tel:0545524589")
        startActivity(intent)
        Toast.makeText(this, "Not available right now", Toast.LENGTH_SHORT).show()
    }

    private fun openMap()
    {
        /*
        val gmmIntentUri = Uri.parse("geo:32.066714, 34.841329")
        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
        mapIntent.setPackage("com.google.android.apps.maps")
        mapIntent.resolveActivity(packageManager)?.let {
            startActivity(mapIntent)
        }
         */
        Toast.makeText(this, "Not available right now", Toast.LENGTH_SHORT).show()
    }

    private fun openSocial()
    {
        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra(MainMenuActivity.EXTRA_MESSAGE, "https://www.linkedin.com/in/teddy-lazebnik/")
        }
        startActivity(intent)
    }
}