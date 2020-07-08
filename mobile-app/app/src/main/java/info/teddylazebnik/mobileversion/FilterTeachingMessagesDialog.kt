package info.teddylazebnik.mobileversion

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.content.DialogInterface
import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import android.widget.EditText
import androidx.appcompat.app.AppCompatDialogFragment
import java.lang.Exception

class FilterTeachingMessagesDialog : AppCompatDialogFragment(){

    val TAG = "FilterDialog"

    var courseNameElement: AutoCompleteTextView? = null
    var courseDateElement: EditText? = null
    var DialogListener: FilterTeachingMessagesDialogListener? = null

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog
    {
        val builder = AlertDialog.Builder(getActivity())
        val inflater: LayoutInflater? = getActivity()?.layoutInflater
        val view: View? = inflater?.inflate(R.layout.teaching_message_filter_dialog, null)

        if (view != null) {
            courseNameElement = view.findViewById(R.id.teachingMessagesCourseFilterInput) as AutoCompleteTextView
            courseDateElement = view.findViewById(R.id.teachingMessagesDateFilterInput) as EditText
        }

        builder.setView(view)
            .setTitle(R.string.filterDialogHeader)
            .setNegativeButton(R.string.teaching_message_filter_cancel_btn) { dialog, which ->
                Log.i(TAG, "Filter")
            }
            .setPositiveButton(R.string.teaching_message_filter_btn) {dialog, which ->
                val courseName = courseNameElement?.text.toString()
                val courseDate = courseDateElement?.text.toString()
                DialogListener?.applyTexts(courseName, courseDate)
            }

        return builder.create()
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)

        try
        {
            DialogListener = context as FilterTeachingMessagesDialogListener
        }
        catch (error: Exception)
        {
            Log.e(TAG, "$error")
        }
    }

    interface FilterTeachingMessagesDialogListener {
        fun applyTexts(courseName: String, courseDate: String)
        {

        }
    }
}
