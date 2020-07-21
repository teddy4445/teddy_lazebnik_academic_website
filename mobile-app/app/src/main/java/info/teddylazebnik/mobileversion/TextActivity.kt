package info.teddylazebnik.mobileversion

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import info.teddylazebnik.mobileversion.MainMenuActivity.Companion.EXTRA_MESSAGE

class TextActivity : AppCompatActivity() {

    companion object {
        val EXTRA_ENTITY = "info.teddylazebnik.mobileversion.BACK_ENTITY"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_text)

        // Get the Intent that started this activity and extract the string
        updateMessage(intent.getStringExtra(EXTRA_MESSAGE))

        // add button event
        val backBtn: View = this.findViewById(R.id.text_activity_back_btn)
        backBtn.setOnClickListener{
            backButton()
        }
    }

    private fun backButton()
    {
        when (intent.getStringExtra(EXTRA_ENTITY)){
            getString(R.string.activity_academic_papers) -> {
                val intent = Intent(this, AcademicPapersActivity::class.java)
                startActivity(intent)
            }
            getString(R.string.activity_open_source) -> {
                val intent = Intent(this, OpenSourceProjectsActivity::class.java)
                startActivity(intent)
            }
            getString(R.string.activity_students) -> {
                val intent = Intent(this, StudentsActivity::class.java)
                startActivity(intent)
            }
            getString(R.string.activity_teaching_courses) -> {
                val intent = Intent(this, CoursesActivity::class.java)
                startActivity(intent)
            }
        }
        this.finish()
    }

    fun updateMessage(message: String)
    {
        val mainText: TextView = findViewById(R.id.text_activity_main_text)
        mainText.text = message
    }
}