package info.teddylazebnik.mobileversion

import android.content.Intent
import android.content.res.Resources
import android.os.Bundle
import android.util.DisplayMetrics
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.security.AccessController.getContext


@Suppress("DEPRECATION")
class MainMenuActivity : AppCompatActivity() {

    val EXTRA_MESSAGE = "info.teddylazebnik.mobileversion.MESSAGE"

    val linesId = ArrayList<Int>()
    val manuImgIds = ArrayList<Int>()
    val manuTextIds = ArrayList<Int>()
    val webPagesLink = ArrayList<String>()
    val domain: String = "https://teddylazebnik.info/"

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
        val btnHieght = Math.ceil(((Resources.getSystem().getDisplayMetrics().heightPixels).toDouble() / linesId.size)).toInt()
        for (viewIndex in 0 until linesId.size)
        {
            changeViewHeight(linesId[viewIndex], btnHieght)
        }

        // add click to buttons
        for (btnIndex in 0 until manuImgIds.size)
        {
            addImgClickEvent(manuImgIds[btnIndex], domain.plus(webPagesLink[btnIndex]))
            addTextClickEvent(manuTextIds[btnIndex], domain.plus(webPagesLink[btnIndex]))
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
    }

    /*
        Open the teaching messages window
    */
    private fun openTeachingMessagesActivity()
    {
        val intent = Intent(this, TeachingMessages::class.java)
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

    private fun addImgClickEvent(btn_id: Int, webPage: String)
    {
        val btn: ImageView = findViewById(btn_id) as ImageView
        btn.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(EXTRA_MESSAGE, webPage)
            }
            startActivity(intent)
        }
    }

    private fun addTextClickEvent(btn_id: Int, webPage: String)
    {
        val btn: TextView = findViewById(btn_id) as TextView
        btn.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(EXTRA_MESSAGE, webPage)
            }
            startActivity(intent)
        }
    }

    // get px of the screen from dp 
    private fun dpToPx(dp: Int): Int {
        return (dp * Resources.getSystem().getDisplayMetrics().density).toInt()
    }

}