package info.teddylazebnik.mobileversion

import android.content.res.Resources
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity


@Suppress("DEPRECATION")
class MainMenuActivity : AppCompatActivity() {

    val manuBunsIds = ArrayList<Int>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_menu)
        manuBunsIds.add(R.id.mainTeachingBtn)
        manuBunsIds.add(R.id.mainOpenSoruceBtn)
        manuBunsIds.add(R.id.mainAcademicStudentsBtn)
        manuBunsIds.add(R.id.mainTechnicalBlogBtn)
        manuBunsIds.add(R.id.mainPublicationsBtn)
        fixLayoutPositions()
    }

    /*
        Fix the layout to fit right in the positions wanted
     */
    private fun fixLayoutPositions()
    {
        val textMargin = 60
        // fix buttons height
        val btnHieght = Math.ceil(((Resources.getSystem().getDisplayMetrics().heightPixels - textMargin).toDouble() / manuBunsIds.size)).toInt()
        for (btnId in manuBunsIds)
        {
            changeBtnHeight(btnId, btnHieght)
        }
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
}