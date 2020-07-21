package info.teddylazebnik.mobileversion

import adapters.CourseAdapter
import adapters.OpenSourceProjectAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.ListView
import data.DbManager
import data_objects.Course
import data_objects.OpenSourceProject
import data_objects.TechnicalBlog

class OpenSourceProjectsActivity : AppCompatActivity() {

    var items: ArrayList<OpenSourceProject> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_open_source_projects)
        // build courses
        items = DbManager().readDefaultJson(this.filesDir, DbManager.OPEN_SOURCE_PROJECT) as ArrayList<OpenSourceProject>
        // sort according to order
        this.items = OpenSourceProject.sort(this.items)
        // build UI
        buildList(items)

        // add button event
        val profileImg: View = findViewById(R.id.openSourceProjectFloatBtn)
        profileImg.setOnClickListener{
            showTextActivity()
        }
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<OpenSourceProject>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.openSourceProjectList)

        // inject to view
        ListView.adapter = OpenSourceProjectAdapter(this, R.layout.open_source_project_card, listItems)

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
            putExtra(MainMenuActivity.EXTRA_MESSAGE, getString(R.string.long_text_open_source))
            putExtra(TextActivity.EXTRA_ENTITY, getString(R.string.activity_open_source))
        }
        startActivity(intent)
    }
}