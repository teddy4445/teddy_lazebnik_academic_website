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

        items = DbManager().readDefaultJson(DbManager.COURSE) as ArrayList<Course>

        // build courses
        // TODO: move later to database or remote online file
        items.add(Course(title = "Numerical Analysis",
            year = 2020,
            semester = 1,
            uni = "BIU, HIT",
            pageLink = "/courses/numerical.html",
            description = "Numerical analysis and applied tools for real world problems"))
        items.add(Course(title = "Linear Mathematical Optimization",
            year = 2020,
            semester = 2,
            uni = "BIU",
            pageLink = "/courses/linear_mathematical_optimization.html",
            description = "This field provides mathematical tools for decision making and finding optimal cases for real-life situations"))
        items.add(Course(title = "Tools for Numerical Analysis",
            year = 2020,
            semester = 2,
            uni = "BIU",
            pageLink = "/courses/tools_numerical_analysis.html",
            description = "Numerical analysis and applied tools for real world problems for Eng."))
        items.add(Course(title = "Deep Learning for Computer Vision",
            year = 2020,
            semester = 2,
            uni = "HIT",
            pageLink = "/courses/deep_leanring.html",
            description = "The mathematical and applied field of Neural Networks and provide practical tools for using them. The course focuses mainly on image processing and, consequently, on convolutional neural networks."))
        items.add(Course(title = "Partial Differential Equations",
            year = 2019,
            semester = 1,
            uni = "BIU",
            pageLink = "",
            description = "The mathematical and applied field of Neural Networks and provide practical tools for using them. The course focuses mainly on image processing and, consequently, on convolutional neural networks."))
        items.add(Course(title = "Linear Mathematical Optimization",
            year = 2019,
            semester = 2,
            uni = "BIU",
            pageLink = "/courses/linear_mathematical_optimization.html",
            description = "This field provides mathematical tools for decision making and finding optimal cases for real-life situations"))
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