package info.teddylazebnik.mobileversion

import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.annotation.RequiresApi
import java.net.URL

class TeachingMessages : AppCompatActivity() {

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teaching_messages)

        // read messages file, parse it and generate message list
        val messagesRawData = URL("https://teddylazebnik.info/app-messages.txt").readText()
        var massageList = TeachingMessageList(messagesRawData)

        // build GUI
        buildMessageList()

        // build courses filter
        buildCoursesFilter()
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildMessageList()
    {

    }

    /*
        Fill the dropdown box with the available courses names
    */
    private fun buildCoursesFilter()
    {

    }
}