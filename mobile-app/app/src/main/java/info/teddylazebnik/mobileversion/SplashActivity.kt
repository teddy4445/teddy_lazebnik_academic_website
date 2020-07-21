package info.teddylazebnik.mobileversion

import android.app.job.JobInfo
import android.app.job.JobScheduler
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import data.DbManager
import info.teddylazebnik.mobileversion.jobs.TeachingListRetrieveJob
import java.io.File
import java.io.FileOutputStream


class SplashActivity : AppCompatActivity() {

    private val TAG = "SplashActivity"
    private val handler = Handler()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private val runnable = Runnable {
        if (!isFinishing) {
            // set job to repeat data
            scheduleJob()
            // download all data
            DbManager().updateDataAll(this.filesDir)
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

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onResume() {
        super.onResume()
        handler.postDelayed(runnable, 10);
    }

    @RequiresApi(Build.VERSION_CODES.O)
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


    @RequiresApi(Build.VERSION_CODES.N)
    fun scheduleJob()
    {
        // consts of cycle
        val cyclicTime = 60 * 60 * 1000.toLong()
        val cyclicDelayTime = cyclicTime - 30 * 60 * 1000.toLong()

        val teachMessageJobObj = ComponentName(this, TeachingListRetrieveJob::class.java)
        val info = JobInfo.Builder(1, teachMessageJobObj)
            .setRequiresCharging(false)
            .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
            .setPersisted(true)
            .setPeriodic(cyclicTime, cyclicDelayTime)
            .build()
        val scheduler = getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
        val resultCode = scheduler.schedule(info)
        if (resultCode == JobScheduler.RESULT_SUCCESS) {
            Log.d(TAG,"Job scheduled")
        } else {
            Log.d(TAG,"Job scheduling failed")
        }
    }
}