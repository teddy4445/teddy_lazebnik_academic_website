package info.teddylazebnik.mobileversion

import android.content.Intent
import android.content.res.Resources
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity


@Suppress("DEPRECATION")
class MainMenuActivity : AppCompatActivity() {


    companion object {
        public val EXTRA_MESSAGE = "info.teddylazebnik.mobileversion.MESSAGE"
        public val domain: String = "https://teddylazebnik.info/"
    }

    val linesId = ArrayList<Int>()
    val manuImgIds = ArrayList<Int>()
    val manuTextIds = ArrayList<Int>()
    val webPagesLink = ArrayList<String>()

    val buttonsCounts: Int = 6

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_menu)

        // lines
        linesId.add(R.id.mainManuList1)
        linesId.add(R.id.mainManuList2)
        linesId.add(R.id.mainManuList3)
        // build img buttons list
        manuImgIds.add(R.id.mainTeachingBtnImg)
        manuImgIds.add(R.id.mainOpenSoruceImg)
        manuImgIds.add(R.id.mainAcademicStudentsImg)
        manuImgIds.add(R.id.mainTechnicalBlogImg)
        manuImgIds.add(R.id.mainPublicationsImg)
        // build text buttons list
        manuTextIds.add(R.id.mainTeachingBtnText)
        manuTextIds.add(R.id.mainOpenSoruceBtnText)
        manuTextIds.add(R.id.mainAcademicStudentsText)
        manuTextIds.add(R.id.mainTechnicalBlogText)
        manuTextIds.add(R.id.mainPublicationsText)
        // build links of buttons
        webPagesLink.add("teaching.html")
        webPagesLink.add("opensource.html#open_code")
        webPagesLink.add("students.html")
        webPagesLink.add("opensource.html#tech_posts")
        webPagesLink.add("publications.html")

        // build up the screen right
        fixLayoutPositions()
    }

    /*
        Fix the layout to fit right in the positions wanted
     */
    private fun fixLayoutPositions()
    {
        // fix buttons height
        val settingsHeightInPx = (90 * Resources.getSystem().getDisplayMetrics().density).toInt()
        val btnHieght = Math.ceil(((Resources.getSystem().getDisplayMetrics().heightPixels - settingsHeightInPx).toDouble() / (buttonsCounts/2))).toInt()
        for (viewIndex in 0 until linesId.size)
        {
            changeViewHeight(linesId[viewIndex], btnHieght)
        }

        // add the teaching messages button the event
        val teachingMessagesImg: ImageView = findViewById(R.id.mainTeachingMessagesImg)
        teachingMessagesImg.setOnClickListener{
            openTeachingMessagesActivity()
        }

        // add the teaching messages button the event
        val teachingMessagesText: TextView = findViewById(R.id.mainTeachingMessagesText)
        teachingMessagesText.setOnClickListener{
            openTeachingMessagesActivity()
        }

        // add the teaching messages button the event
        val settingsImg: ImageView = findViewById(R.id.mainSettingsImg)
        settingsImg.setOnClickListener{
            openSettingsActivity()
        }

        // add the teaching messages button the event
        val settingsText: TextView = findViewById(R.id.mainSettingsText)
        settingsText.setOnClickListener{
            openSettingsActivity()
        }

        // add the courses button the event
        val coursesImg: ImageView = findViewById(R.id.mainTeachingBtnImg)
        coursesImg.setOnClickListener{
            openCoursesActivity()
        }

        // add the courses button the event
        val coursesText: TextView = findViewById(R.id.mainTeachingBtnText)
        coursesText.setOnClickListener{
            openCoursesActivity()
        }

        // add the technical blog button the event
        val tachnicalBlogImg: ImageView = findViewById(R.id.mainTechnicalBlogImg)
        tachnicalBlogImg.setOnClickListener{
            openBlogsActivity()
        }

        // add the technical blog button the event
        val tachnicalBlogText: TextView = findViewById(R.id.mainTechnicalBlogText)
        tachnicalBlogText.setOnClickListener{
            openBlogsActivity()
        }

        // add the open source button the event
        val openSourceImg: ImageView = findViewById(R.id.mainOpenSoruceImg)
        openSourceImg.setOnClickListener{
            openOpenSourceProjectActivity()
        }

        // add the open source button the event
        val openSourceText: TextView = findViewById(R.id.mainOpenSoruceBtnText)
        openSourceText.setOnClickListener{
            openOpenSourceProjectActivity()
        }

        // add the students button the event
        val studentsImg: ImageView = findViewById(R.id.mainAcademicStudentsImg)
        studentsImg.setOnClickListener{
            openStudentsActivity()
        }

        // add the students button the event
        val studentsText: TextView = findViewById(R.id.mainAcademicStudentsText)
        studentsText.setOnClickListener{
            openStudentsActivity()
        }

        // add the students button the event
        val academicPublicationsImg: ImageView = findViewById(R.id.mainPublicationsImg)
        academicPublicationsImg.setOnClickListener{
            openPapersActivity()
        }

        // add the students button the event
        val academicPublicationsText: TextView = findViewById(R.id.mainPublicationsText)
        academicPublicationsText.setOnClickListener{
            openPapersActivity()
        }

        // add the profile button the event
        val profileImg: ImageView = findViewById(R.id.mainProfileImg)
        profileImg.setOnClickListener{
            openProfileActivity()
        }

        // add the students button the event
        val profileText: TextView = findViewById(R.id.mainProfileText)
        profileText.setOnClickListener{
            openProfileActivity()
        }
    }

    /*
        Open the teaching messages window
    */
    private fun openTeachingMessagesActivity()
    {
        val intent = Intent(this, TeachingMessagesActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the settings window
    */
    private fun openSettingsActivity()
    {
        val intent = Intent(this, SettingsActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the courses list window
    */
    private fun openCoursesActivity()
    {
        val intent = Intent(this, CoursesActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the courses list window
    */
    private fun openBlogsActivity()
    {
        val intent = Intent(this, TechnicalBlogActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the Open Source Project list window
    */
    private fun openOpenSourceProjectActivity()
    {
        val intent = Intent(this, OpenSourceProjectsActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the students list window
    */
    private fun openStudentsActivity()
    {
        val intent = Intent(this, StudentsActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the academic papers list window
    */
    private fun openPapersActivity()
    {
        val intent = Intent(this, AcademicPapersActivity::class.java)
        startActivity(intent)
    }

    /*
        Open the profile window
    */
    private fun openProfileActivity()
    {
        val intent = Intent(this, ProfileActivity::class.java)
        startActivity(intent)
    }

    /*
        Change the a spesific btn's height by id
     */
    private fun changeViewHeight(btn_id: Int, height: Int)
    {
        val btn: LinearLayout = findViewById(btn_id)
        val params: LinearLayout.LayoutParams = btn.getLayoutParams() as LinearLayout.LayoutParams
        params.height = height
        btn.setLayoutParams(params)
    }
}