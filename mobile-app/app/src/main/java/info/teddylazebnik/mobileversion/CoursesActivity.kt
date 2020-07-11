package info.teddylazebnik.mobileversion

import adapters.CourseAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import data.DbManager
import data_objects.Course

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
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<Course>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.teachingCoursesList)

        // inject to view
        ListView.adapter = CourseAdapter(this, R.layout.course_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, MainMenuActivity.domain.plus(items[position].pageLink))
            }
            startActivity(intent)
        }
    }
}