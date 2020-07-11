package info.teddylazebnik.mobileversion

import adapters.AcademicPaperAdapter
import adapters.OpenSourceProjectAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import data.DbManager
import data_objects.AcademicPaper
import data_objects.OpenSourceProject
import data_objects.Students

class AcademicPapersActivity : AppCompatActivity() {

    var items: ArrayList<AcademicPaper> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_academic_papers)
        // build courses
        items = DbManager().readDefaultJson(this.filesDir, DbManager.ACADEMIC_PAPER) as ArrayList<AcademicPaper>
        // sort according to order
        this.items = AcademicPaper.sort(this.items)
        // build UI
        buildList(items)
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<AcademicPaper>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.academicPapersList)

        // inject to view
        ListView.adapter = AcademicPaperAdapter(this, R.layout.academic_paper_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, items[position].pageLink)
            }
            startActivity(intent)
        }
    }
}