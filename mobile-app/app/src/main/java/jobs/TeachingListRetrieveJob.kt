package info.teddylazebnik.mobileversion.jobs

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.job.JobParameters
import android.app.job.JobService
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.preference.PreferenceManager
import android.util.Log
import androidx.core.app.NotificationCompat
import data.DbManager
import info.teddylazebnik.mobileversion.R
import info.teddylazebnik.mobileversion.TeachingMessagesActivity
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.lang.Exception
import java.net.URL


class TeachingListRetrieveJob : JobService() {

    private val TAG = "TeachingListRetrieveJob"

    private val channelId = "i.apps.notifications"
    private val notificationId = 1

    lateinit var notificationManager : NotificationManager
    lateinit var notificationChannel : NotificationChannel
    lateinit var builder : Notification.Builder

    override fun onStartJob(params: JobParameters): Boolean {
        Log.d(TAG, "Teaching Messages Retrieve Job started")
        Thread(Runnable {
            try
            {
                val messagesRawData = URL("https://teddylazebnik.info/app-messages.txt").readText()
                val path: File = this.filesDir
                val file = File(path, TeachingMessagesActivity.listMessageFilePath)
                if (file.exists())
                {
                    val oldMessagesRawData = FileInputStream(file).bufferedReader().use { it.readText() }
                    val numberOfcurrentMessages = messagesRawData.split("\n").size
                    val numberOfNewMessages = oldMessagesRawData.split("\n").size
                    if (numberOfcurrentMessages != numberOfNewMessages && PreferenceManager.getDefaultSharedPreferences(this).getString("notifications", "false") == "true")
                    {
                        createNotificationOnNewMessages(numberOfNewMessages - numberOfcurrentMessages)
                    }
                }
                val stream = FileOutputStream(file)
                stream.write(messagesRawData.toByteArray())
                stream.close()

                // update the other screens for json files
                DbManager().updateDataAll(this.filesDir)

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

    fun createNotificationOnNewMessages(numberOfMessages: Int)
    {
        // the notification is clicked, this intent will come into action
        val intent = Intent(this, TeachingMessagesActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT)

        // the text to show in the message
        var textContent = ""
        if (numberOfMessages == 1)
        {
            textContent = "You have a new teaching message"
        }
        else
        {
            textContent = "You have $numberOfMessages new teaching messages"
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            var notificationChannel = NotificationChannel(channelId, textContent, NotificationManager.IMPORTANCE_HIGH)
            notificationChannel.enableLights(true)
            notificationChannel.lightColor = Color.BLUE
            notificationChannel.enableVibration(true)
            notificationChannel.vibrationPattern = longArrayOf(100, 200, 300, 400, 500, 400, 300, 200, 400)
            notificationManager.createNotificationChannel(notificationChannel)
        }
        var builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle("New Message")
            .setContentText(textContent)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .build()
        // send notification
        this.notificationManager.notify(notificationId, builder)
    }
}