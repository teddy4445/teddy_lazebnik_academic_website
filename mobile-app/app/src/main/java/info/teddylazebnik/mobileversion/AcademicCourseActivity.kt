package info.teddylazebnik.mobileversion

import android.os.Bundle
import android.widget.Toast
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import data.DbManager
import data_objects.AcademicCourse
import data_objects.Course

class AcademicCourseActivity : AppCompatActivity() {

    var items: ArrayList<AcademicCourse> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_academic_course)
        val navView: BottomNavigationView = findViewById(R.id.teaching_course_menu)

        val navController = findNavController(R.id.teaching_course_menu)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_home, R.id.navigation_dashboard, R.id.navigation_notifications
            )
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)

        // build courses
        items = DbManager().readDefaultJson(this.filesDir, DbManager.TEACHING) as ArrayList<AcademicCourse>

        // toast
        Toast.makeText(this, items[0].toString(), Toast.LENGTH_LONG).show()
    }
}