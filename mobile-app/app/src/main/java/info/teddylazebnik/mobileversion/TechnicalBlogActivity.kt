package info.teddylazebnik.mobileversion

import adapters.TechnicalBlogAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ListView
import data.DbManager
import data_objects.Course
import data_objects.TechnicalBlog

class TechnicalBlogActivity : AppCompatActivity() {

    var items: ArrayList<TechnicalBlog> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teachnical_blog)
        // build courses
        items = DbManager().readDefaultJson(this.filesDir, DbManager.TECHNICAL_BLOG) as ArrayList<TechnicalBlog>
        // sort according to order
        this.items = TechnicalBlog.sort(this.items)
        // build UI
        buildList(items)

        // add button event
        val profileImg: View = findViewById(R.id.TechnicalBlogFloatBtn)
        profileImg.setOnClickListener{
            showTextActivity()
        }
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<TechnicalBlog>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.TechnicalBlogList)

        // inject to view
        ListView.adapter = TechnicalBlogAdapter(this, R.layout.technical_blog_card, listItems)

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
            putExtra(MainMenuActivity.EXTRA_MESSAGE, getString(R.string.long_text_blog))
            putExtra(TextActivity.EXTRA_ENTITY, getString(R.string.activity_technical_blog))
        }
        startActivity(intent)
    }
}