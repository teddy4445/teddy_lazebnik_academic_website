package info.teddylazebnik.mobileversion.ui.main

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.AutoCompleteTextView
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatDialogFragment
import info.teddylazebnik.mobileversion.R
import java.lang.Exception

class TeachingCourseInfoDialog : AppCompatDialogFragment(){

    val TAG = "CourseInfoDialog"

    var courseInfoTitle: TextView? = null
    var courseInfoDescription: TextView? = null

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog
    {
        val builder = AlertDialog.Builder(getActivity())
        val inflater: LayoutInflater? = getActivity()?.layoutInflater
        val view: View? = inflater?.inflate(R.layout.teaching_course_info_dialog, null)

        if (view != null) {
            courseInfoTitle = view.findViewById(R.id.teachingInfoDialogTitle) as TextView
            courseInfoDescription = view.findViewById(R.id.teachingInfoDialogDescription) as TextView

            // set the needed data

        }

        builder.setView(view)
            .setTitle(R.string.filterDialogHeader)
            .setNegativeButton(R.string.teaching_message_filter_cancel_btn) { dialog, which ->
                Log.i(TAG, "Got it")
            }

        return builder.create()
    }
}
