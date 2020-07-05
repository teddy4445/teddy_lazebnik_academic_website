package info.teddylazebnik.mobileversion

import android.os.Build
import androidx.annotation.RequiresApi
import java.lang.Exception
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@RequiresApi(Build.VERSION_CODES.O)
class TeachingMessageObj(raw_data: String) {

    private val DATE_FORMAT = "dd.MM.yyyy"

    var course: String = ""
    var date: LocalDate = LocalDate.now()
    var message: String = ""

    init {
        val elements = raw_data.split("~")
        this.course = elements[0]
        var dateElements = elements[1].split(".")
        this.date = LocalDate.of(dateElements[2].toInt(), dateElements[1].toInt(), dateElements[0].toInt())
        this.message = elements[2]
    }

    fun dateString(): String
    {
        return this.date.format(DateTimeFormatter.ofPattern(DATE_FORMAT))
    }

    fun passFilter(course: String, after_date: LocalDate?): Boolean
    {
        when {
            course != "" && after_date != null -> {
                return (this.course.contains(course) && this.date.isAfter(after_date))
            }
            course == "" && after_date != null -> {
                return this.date.isAfter(after_date)
            }
            course != "" && after_date == null -> {
                return this.course.contains(course)
            }
            course == "" && after_date == null -> {
                return true
            }
        }
        return false
    }
}