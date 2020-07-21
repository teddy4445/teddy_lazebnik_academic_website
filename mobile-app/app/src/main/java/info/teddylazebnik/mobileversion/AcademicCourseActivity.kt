package info.teddylazebnik.mobileversion

import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.viewpager.widget.ViewPager
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.tabs.TabLayout
import data.DbManager
import data_objects.AcademicCourse
import info.teddylazebnik.mobileversion.ui.main.SectionsPagerAdapter
import org.json.JSONObject
import java.io.File


class AcademicCourseActivity : AppCompatActivity() {

    var dataObj: AcademicCourse = AcademicCourse()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_academic_course)
        val sectionsPagerAdapter = SectionsPagerAdapter(this, supportFragmentManager)
        val viewPager: ViewPager = findViewById(R.id.view_pager)
        viewPager.adapter = sectionsPagerAdapter
        val tabs: TabLayout = findViewById(R.id.tabs)
        tabs.setupWithViewPager(viewPager)

        // load data from DB file, get only this course's data and parse to object
        dataObj.parseFromJson(JSONObject(File(this.filesDir, DbManager.TEACHING_JSON_PATH).readText()).get(intent.getStringExtra(MainMenuActivity.EXTRA_MESSAGE)) as JSONObject)

        // set title
        val title: TextView = findViewById(R.id.teaching_title)
        title.text = dataObj.title as CharSequence?

        val fab: FloatingActionButton = findViewById(R.id.fab)
        fab.setOnClickListener { view ->
            showInfoDialog()
        }
    }

    /*
        Open the filter dialog
     */
    private fun showInfoDialog()
    {
        val inflater: LayoutInflater = this@AcademicCourseActivity.layoutInflater
        val v: View = inflater.inflate(R.layout.teaching_course_info_dialog, null)

        v.findViewById<TextView>(R.id.teachingInfoDialogTitle).text = "${dataObj.title} [${dataObj.code}]"
        v.findViewById<TextView>(R.id.teachingInfoDialogDescription).text = "${dataObj.description}"

        val builder: android.app.AlertDialog.Builder =
            android.app.AlertDialog.Builder(this@AcademicCourseActivity)
        builder.setView(v)
        builder.setPositiveButton("Got it", DialogInterface.OnClickListener { dialog, which -> dialog.cancel() })
        builder.show()

        // val filterDialog: TeachingCourseInfoDialog = TeachingCourseInfoDialog()
        // filterDialog.show(supportFragmentManager, "Course's Info")
    }
}