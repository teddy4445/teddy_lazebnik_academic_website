package info.teddylazebnik.mobileversion

import android.os.Bundle
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.tabs.TabLayout
import androidx.viewpager.widget.ViewPager
import androidx.appcompat.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.widget.TextView
import com.google.gson.JsonObject
import data.DbManager
import data_objects.Students
import info.teddylazebnik.mobileversion.ui.main.SectionsPagerAdapter
import org.json.JSONObject
import java.io.File

class AcademicCourseActivity : AppCompatActivity() {

    var dataJson: JSONObject = JSONObject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_academic_course)
        val sectionsPagerAdapter = SectionsPagerAdapter(this, supportFragmentManager)
        val viewPager: ViewPager = findViewById(R.id.view_pager)
        viewPager.adapter = sectionsPagerAdapter
        val tabs: TabLayout = findViewById(R.id.tabs)
        tabs.setupWithViewPager(viewPager)

        // load data from DB file
        dataJson = JSONObject(File(this.filesDir, DbManager.TEACHING_JSON_PATH).readText())
        // get only this course data
        dataJson = dataJson.get(intent.getStringExtra(MainMenuActivity.EXTRA_MESSAGE)) as JSONObject

        // set title
        val title: TextView = findViewById(R.id.teaching_title)
        title.text = dataJson.get("title") as CharSequence?

        val fab: FloatingActionButton = findViewById(R.id.fab)
        fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null).show()
        }
    }
}