package data_objects

import android.util.EventLogTags
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class TechnicalBlog(title: String, description: String, pageLink: String) : ListMenuItem(title, description){

    companion object {
        fun sort(blogs : ArrayList<TechnicalBlog>): ArrayList<TechnicalBlog> {
            blogs.sortWith(compareBy({it.title}))
            return blogs
        }
    }

    var pageLink: String = ""

    init {
        this.pageLink = pageLink
    }
}