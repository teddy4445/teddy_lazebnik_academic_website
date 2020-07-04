package info.teddylazebnik.mobileversion

import android.content.Context
import android.os.Build
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import java.net.URL


class TeachingMessages : AppCompatActivity() {

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teaching_messages)

        Thread(Runnable {
            // read messages file, parse it and generate message list
            val messagesRawData = URL("https://teddylazebnik.info/app-messages.txt").readText()
            var massageList = TeachingMessageList(messagesRawData)

            // build GUI
            buildMessageList(massageList)

            // build courses filter
            val autoCompleteTextView = findViewById<AutoCompleteTextView>(R.id.teachingMessagesCourseFilterInput)
            autoCompleteTextView.setAdapter(buildCoursesFilter(this, massageList))
        }).start()
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun buildMessageList(massageList: TeachingMessageList)
    {
        for (messageObj in massageList.objects)
        {
            teachingMessagesCard.newInstance(messageObj.course, messageObj.dateString(), messageObj.message)
        }
    }

    /*
        Fill the dropdown box with the available courses names
    */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun buildCoursesFilter(context: Context, messageList: TeachingMessageList): ArrayAdapter<String?>? {
        val courseNames = messageList.getAllCourses()
        val elements = arrayOfNulls<String>(courseNames.size)
        for (i in courseNames.indices) {
            elements[i] = courseNames[i]
        }
        return ArrayAdapter(
            context,
            android.R.layout.simple_dropdown_item_1line,
            elements
        )
    }
}