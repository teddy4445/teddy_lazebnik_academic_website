package info.teddylazebnik.mobileversion

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.FileOutputStream

class SplashActivity : AppCompatActivity() {

    private val handler = Handler()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    private val runnable = Runnable {
        if (!isFinishing) {
            if (checkIfFirstTime())
            {
                startActivity(Intent(applicationContext, MyCustomAppIntro::class.java))
                finish()
            }
            else
            {
                startActivity(Intent(applicationContext, MainMenuActivity::class.java))
                finish()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        handler.postDelayed(runnable, 500);
    }

    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(runnable)
    }

    private fun checkIfFirstTime(): Boolean
    {
        val path: File = this.filesDir
        val file = File(path, "teddy_lazebnik_app_first_use_flag.txt")
        if (file.exists())
        {
            return false
        }
        else
        {
            val stream = FileOutputStream(file)
            try
            {
                stream.write("pass".toByteArray())
            }
            finally
            {
                stream.close()
            }
            return true
        }
    }
}