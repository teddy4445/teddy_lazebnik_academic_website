package info.teddylazebnik.mobileversion

import adapters.AcademicPaperAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ListView
import data.DbManager
import data_objects.AcademicPaper

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

        // add button event
        val profileImg: View = findViewById(R.id.academicPapersFloatBtn)
        profileImg.setOnClickListener{
            showTextActivity()
        }
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

    /*
        Open the text view activity
     */
    private fun showTextActivity()
    {
        val intent = Intent(this, TextActivity::class.java).apply {
            putExtra(MainMenuActivity.EXTRA_MESSAGE, getString(R.string.long_text_academic_papers))
            putExtra(TextActivity.EXTRA_ENTITY, getString(R.string.activity_academic_papers))
        }
        startActivity(intent)
    }
}