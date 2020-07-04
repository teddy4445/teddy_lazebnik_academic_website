package info.teddylazebnik.mobileversion

import android.content.Intent
import android.content.res.Resources
import android.os.Bundle
import android.util.DisplayMetrics
import android.widget.Button
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import java.security.AccessController.getContext


@Suppress("DEPRECATION")
class MainMenuActivity : AppCompatActivity() {

    val EXTRA_MESSAGE = "info.teddylazebnik.mobileversion.MESSAGE"

    val manuBunsIds = ArrayList<Int>()
    val webPagesLink = ArrayList<String>()
    val domain: String = "https://teddylazebnik.info/"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_menu)

        // build buttons list
        manuBunsIds.add(R.id.mainTeachingBtn)
        manuBunsIds.add(R.id.mainOpenSoruceBtn)
        manuBunsIds.add(R.id.mainAcademicStudentsBtn)
        manuBunsIds.add(R.id.mainTechnicalBlogBtn)
        manuBunsIds.add(R.id.mainPublicationsBtn)
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
        val itemDpMargin = 30
        var itemPxMargin: Int = dpToPx(itemDpMargin)
        // fix buttons height
        val btnHieght = Math.ceil(((Resources.getSystem().getDisplayMetrics().heightPixels - (itemPxMargin * manuBunsIds.size)).toDouble() / manuBunsIds.size)).toInt()
        for (btnIndex in 0 until manuBunsIds.size)
        {
            changeBtnHeight(manuBunsIds[btnIndex], btnHieght)
            addClickEvent(manuBunsIds[btnIndex], domain.plus(webPagesLink[btnIndex]))
        }

        // add the teaching messages button the event
        val teachingMessagesBtn: Button = findViewById(R.id.mainTeachingMessagesBtn)
        teachingMessagesBtn.setOnClickListener{
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
    private fun changeBtnHeight(btn_id: Int, height: Int)
    {
        val btn: Button = findViewById(btn_id)
        val params: LinearLayout.LayoutParams = btn.getLayoutParams() as LinearLayout.LayoutParams
        params.height = height
        btn.setLayoutParams(params)
    }

    /*
        Change the a spesific btn's height by id
     */
    private fun addClickEvent(btn_id: Int, webPage: String)
    {
        val btn: Button = findViewById(btn_id) as Button
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