package data_objects

import android.util.EventLogTags
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class Course(title: String, year: Int, semester: Int, uni: String, description: String, pageLink: String) : ListMenuItem(title, description){

    companion object {
        fun sort(courses : ArrayList<Course>): ArrayList<Course> {
            var answer  = courses.filterNotNull() as ArrayList<Course>
            answer.sortWith(compareBy({-1*it.year}, {2 - it.semester}, {it.title}))
            return answer
        }
    }

    var year: Int = 2000
    var semester: Int = 1
    var uni: String = ""
    var pageLink: String = ""

    init {
        this.year = year
        this.semester = semester
        this.pageLink = pageLink
        this.uni = uni
    }
}