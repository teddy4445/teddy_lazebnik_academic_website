package info.teddylazebnik.mobileversion

import adapters.OpenSourceProjectAdapter
import adapters.StudentsAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import data_objects.OpenSourceProject
import data_objects.Students
import kotlin.text.Typography.degree

class StudentsActivity : AppCompatActivity() {

    var items: ArrayList<Students> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_students)

        // build courses
        // TODO: move later to database or remote online file
        items.add(Students(title = "Chen Tal-Schachar",
            description = "Working on Rivendell v.3 with explicit collaborative learning. (Gal A. Kaminka as main advisor) ",
            year = 2020,
            degree = 2,
            isAlumni = false,
            pageLink = "https://www.linkedin.com/in/chen-tal-shachar/"))
        items.add(Students(title = "Shira Min Hahar",
            description = "Worked on Property-Value tagging tool as website",
            year = 2019,
            degree = 1,
            isAlumni = true,
            pageLink = "https://www.linkedin.com/in/shiraminhahar/"))
        items.add(Students(title = "Tamar Feuchtwanger",
            description = "Worked on Property-Value tagging tool as website",
            year = 2019,
            degree = 1,
            isAlumni = true,
            pageLink = "https://www.linkedin.com/in/tamar-feuchtwanger/"))
        items.add(Students(title = "Pedro Nissan",
            description = "Worked on Rivendell v.2 with online learning search engine personalization. (Gal A. Kaminka as main advisor) ",
            year = 2019,
            degree = 2,
            isAlumni = true,
            pageLink = "https://www.linkedin.com/in/pedram-pedro-nissani-we-re-hiring-0840b022/"))
        // sort according to order
        this.items = Students.sort(this.items)
        // build UI
        buildList(items)
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<Students>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.studentsList)

        // inject to view
        ListView.adapter = StudentsAdapter(this, R.layout.students_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, items[position].pageLink)
            }
            startActivity(intent)
        }
    }
}