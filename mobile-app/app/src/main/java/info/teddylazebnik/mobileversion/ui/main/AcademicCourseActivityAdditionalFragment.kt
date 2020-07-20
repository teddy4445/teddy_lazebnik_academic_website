package info.teddylazebnik.mobileversion.ui.main

import adapters.AcademicCourseAdditionalAdapter
import adapters.AcademicCourseResourcesAdapter
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import data.DbManager
import data_objects.AcademicCourse
import data_objects.AcademicCourseNote
import data_objects.AcademicCourseSource
import info.teddylazebnik.mobileversion.MainActivity
import info.teddylazebnik.mobileversion.MainMenuActivity
import info.teddylazebnik.mobileversion.R
import org.json.JSONObject
import java.io.File

/**
 * A placeholder fragment containing a simple view.
 */
class AcademicCourseActivityAdditionalFragment : Fragment() {

    private lateinit var pageViewModel: AcademicCourseActivityAdditionalViewModel
    var itemsListView: ListView? = null
    var listData = ArrayList<AcademicCourseSource>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        pageViewModel = ViewModelProviders.of(this).get(AcademicCourseActivityAdditionalViewModel::class.java).apply {
            setIndex(arguments?.getInt(ARG_SECTION_NUMBER) ?: 1)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.teaching_course_additional_list, container, false)
        itemsListView = root.findViewById(R.id.teachingCoursesAdditionalList) as ListView

        // load data
        var dataObj = AcademicCourse()
        // get course name
        val courseName = File(activity?.filesDir, getString(R.string.sharedPref)).readText()
        dataObj.parseFromJson(JSONObject(File(activity?.filesDir, DbManager.TEACHING_JSON_PATH).readText()).get(courseName) as JSONObject)

        listData = dataObj.additionalData

        val resourcesAdapter = activity?.let { AcademicCourseAdditionalAdapter(it, R.layout.teaching_couse_additional_item, listData) }
        itemsListView!!.adapter = resourcesAdapter

        itemsListView!!.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(activity, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, listData[position].link)
            }
            startActivity(intent)
        }

        return root
    }

    companion object {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private const val ARG_SECTION_NUMBER = "section_number"

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        @JvmStatic
        fun newInstance(sectionNumber: Int): AcademicCourseActivityAdditionalFragment {
            return AcademicCourseActivityAdditionalFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_SECTION_NUMBER, sectionNumber)
                }
            }
        }
    }
}