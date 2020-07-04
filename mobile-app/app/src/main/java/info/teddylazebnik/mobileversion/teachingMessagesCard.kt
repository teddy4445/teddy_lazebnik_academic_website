package info.teddylazebnik.mobileversion

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

private const val COURSE_NAME = "name"
private const val COURSE_DATE = "date"
private const val COURSE_MESSAGE = "message"

class teachingMessagesCard : Fragment() {

    private var name: String? = null
    private var date: String? = null
    private var message: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            name = it.getString(COURSE_NAME)
            date = it.getString(COURSE_DATE)
            message = it.getString(COURSE_MESSAGE)
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View?
    {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.teaching_messages_card, container, false)
    }

    companion object {
        @JvmStatic
        fun newInstance(name: String, date: String, message: String) =
            teachingMessagesCard().apply {
                arguments = Bundle().apply {
                    putString(COURSE_NAME, name)
                    putString(COURSE_DATE, date)
                    putString(COURSE_MESSAGE, message)
                }
            }
    }
}