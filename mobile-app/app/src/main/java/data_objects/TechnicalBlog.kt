package data_objects

import android.util.EventLogTags
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class TechnicalBlog(title: String, description: String, pageLink: String) : ListMenuItem(title, description){

    companion object {
        fun sort(blogs : ArrayList<TechnicalBlog>): ArrayList<TechnicalBlog> {
            var answer  = blogs.filterNotNull() as ArrayList<TechnicalBlog>
            answer.sortWith(compareBy({it.title}))
            return answer
        }
    }

    var pageLink: String = ""

    init {
        this.pageLink = pageLink
    }
}