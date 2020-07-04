package info.teddylazebnik.mobileversion

import android.os.Build
import androidx.annotation.RequiresApi
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@RequiresApi(Build.VERSION_CODES.O)
class TeachingMessageObj(raw_data: String) {

    private val DATE_FORMAT = "dd.MM.yyyy"

    public var course: String = ""
    public var date: LocalDate = LocalDate.now()
    public var message: String = ""

    init {
        val elements = raw_data.split("~")
        this.course = elements[0]
        this.date = LocalDate.parse(elements[1], DateTimeFormatter.ofPattern("dd.MM.yyyy"))
        this.message = elements[2]
    }

    public fun dateString(): String
    {
        return this.date.format(DateTimeFormatter.ofPattern(DATE_FORMAT));
    }

    public fun passFilter(course: String, after_date: LocalDate): Boolean
    {
        return (this.course.contains(course) && this.date.isAfter(after_date))
    }
}