package info.teddylazebnik.mobileversion

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import java.lang.Exception
import java.net.URL
import java.time.LocalDate


class TeachingMessages : AppCompatActivity() {

    private val handler = Handler()
    private var massageList: TeachingMessageList? = null

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teaching_messages)

        val filterBtn: Button = findViewById<Button>(R.id.teachingMessagesFilterBtn)
        filterBtn.setOnClickListener{
            filterList()
        }

        Thread(Runnable {
            // read messages file, parse it and generate message list
            val messagesRawData = URL("https://teddylazebnik.info/app-messages.txt").readText()
            massageList = TeachingMessageList(raw_data = messagesRawData)
            // update UI
            handler.post(runnable);
        }).start()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private val runnable = Runnable {
        if (!isFinishing) {
            // build GUI
            massageList?.let { buildMessageList(it) }

            // build courses filter
            val autoCompleteTextView = findViewById<AutoCompleteTextView>(R.id.teachingMessagesCourseFilterInput)
            autoCompleteTextView.setAdapter(massageList?.let { buildCoursesFilter(this, it) })
        }
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
    private fun buildCoursesFilter(context: Context, messageList: TeachingMessageList): ArrayAdapter<String?>?
    {
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

    /*
        Filter the messages according to the user's inputs
     */
    @RequiresApi(Build.VERSION_CODES.O)
    public fun filterList()
    {
        // first, get the user's data
        val courseNameInput: AutoCompleteTextView =
            findViewById(R.id.teachingMessagesCourseFilterInput)
        val messagesDateInput: EditText = findViewById(R.id.teachingMessagesDateFilterInput)
        var messagesDateInputObj: LocalDate? = null
        try
        {
            var dateElements =messagesDateInput.text.toString()
                .replace("/", ".")
                .replace("-", ".")
                .split(".")
            var year = dateElements[2].toInt()
            if (year < 2000)
            {
                year += 2000
            }
            var month = dateElements[1].toInt()
            when
            {
                month < 1 -> month = 1
                month > 12 -> month = 12
            }
            var day = dateElements[0].toInt()
            when
            {
                day < 1 -> day = 1
                day > 31 -> day = 31
            }
            messagesDateInputObj = LocalDate.of(year, month, day)
        } catch (e: Exception)
        {
            messagesDateInputObj = null
        }
        // filter list
        val leftMessages = massageList?.filter(
            course = courseNameInput.text.toString(),
            after_date = messagesDateInputObj
        )
        // if filter fine - show new list
        if (leftMessages != null) {
            if (leftMessages.size() > 0) {
                buildMessageList(leftMessages)
            }
            else
            {
                // TODO: if list empty show error message without list
            }
        }
    }
}