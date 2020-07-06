package info.teddylazebnik.mobileversion.jobs

import android.app.job.JobParameters
import android.app.job.JobService
import android.util.Log
import info.teddylazebnik.mobileversion.TeachingMessages
import java.io.File
import java.io.FileOutputStream
import java.lang.Exception
import java.net.URL


class TeachingListRetrieveJob : JobService() {

    private val TAG = "TeachingListRetrieveJob"

    override fun onStartJob(params: JobParameters): Boolean {
        Log.d(TAG, "Teaching Messages Retrieve Job started")
        Thread(Runnable {
            try
            {
                val messagesRawData = URL("https://teddylazebnik.info/app-messages.txt").readText()
                val path: File = this.filesDir
                val file = File(path, TeachingMessages.listMessageFilePath)
                val stream = FileOutputStream(file)
                stream.write(messagesRawData.toByteArray())
                stream.close()
                Log.d(TAG, "Job finished")
                jobFinished(params, false)
            }
            catch (error: Exception)
            {
                Log.d(TAG, "Job Failed")
            }
        }).start()
        return true
    }

    override fun onStopJob(params: JobParameters?): Boolean {
        Log.d(TAG, "Teaching Messages Retrieve Job cancelled")
        return true
    }
}