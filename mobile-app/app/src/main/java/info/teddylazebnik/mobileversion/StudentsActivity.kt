package info.teddylazebnik.mobileversion

import adapters.OpenSourceProjectAdapter
import adapters.StudentsAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.ListView
import data.DbManager
import data_objects.Course
import data_objects.OpenSourceProject
import data_objects.Students
import kotlin.text.Typography.degree

class StudentsActivity : AppCompatActivity() {

    var items: ArrayList<Students> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_students)
        // build courses
        items = DbManager().readDefaultJson(this.filesDir, DbManager.STUDENTS) as ArrayList<Students>
        // sort according to order
        this.items = Students.sort(this.items)
        // build UI
        buildList(items)

        // add button event
        val profileImg: View = findViewById(R.id.studentsFloatBtn)
        profileImg.setOnClickListener{
            showTextActivity()
        }
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

    /*
        Open the text view activity
     */
    private fun showTextActivity()
    {
        val intent = Intent(this, TextActivity::class.java).apply {
            putExtra(MainMenuActivity.EXTRA_MESSAGE, getString(R.string.long_text_students))
            putExtra(TextActivity.EXTRA_ENTITY, getString(R.string.activity_students))
        }
        startActivity(intent)
    }
}