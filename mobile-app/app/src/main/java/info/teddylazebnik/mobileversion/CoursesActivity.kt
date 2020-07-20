package info.teddylazebnik.mobileversion

import adapters.CourseAdapter
import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.ListView
import data.DbManager
import data_objects.Course
import info.teddylazebnik.mobileversion.MainMenuActivity.Companion.EXTRA_MESSAGE
import java.io.File

class CoursesActivity : AppCompatActivity() {

    var items: ArrayList<Course> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teaching_courses)
        // build courses
        items = DbManager().readDefaultJson(this.filesDir, DbManager.COURSE) as ArrayList<Course>
        // sort according to order
        this.items = Course.sort(this.items)
        // build UI
        buildList(items)

        // add button event
        val profileImg: View = findViewById(R.id.teachingCoursesFloatBtn)
        profileImg.setOnClickListener {
            showTextActivity()
        }
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<Course>) {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.teachingCoursesList)

        // inject to view
        ListView.adapter = CourseAdapter(this, R.layout.course_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            // set to shared pref the name of the course so the fragments will be able to use it later
            File(this.filesDir, getString(R.string.sharedPref)).writeText(items[position].title)

            val intent = Intent(this, AcademicCourseActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, items[position].title)
            }
            startActivity(intent)
        }
    }

    /*
        Open the text view activity
     */
    private fun showTextActivity()
    {

        val intent = Intent(this, TextActivity::class.java).apply {
            putExtra(MainMenuActivity.EXTRA_MESSAGE, getString(R.string.long_text_teaching_philosophy))
            putExtra(TextActivity.EXTRA_ENTITY, getString(R.string.activity_teaching_courses))
        }
        startActivity(intent)
    }
}