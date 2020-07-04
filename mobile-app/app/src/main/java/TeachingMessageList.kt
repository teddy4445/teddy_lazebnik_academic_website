package info.teddylazebnik.mobileversion

import android.os.Build
import androidx.annotation.RequiresApi
import java.lang.Exception
import java.time.LocalDate
import kotlin.collections.ArrayList

@RequiresApi(Build.VERSION_CODES.O)
class TeachingMessageList(raw_data: String) {

    public val objects = ArrayList<TeachingMessageObj>()

    init {
        for (line in raw_data.split("\n"))
        {
            try
            {
                objects.add(TeachingMessageObj(line))
            }
            catch (error: Exception)
            {

            }
        }
    }

    public fun filter(course: String, after_date: LocalDate): ArrayList<TeachingMessageObj>
    {
        val passObjects =  ArrayList<TeachingMessageObj>()
        for (message in objects)
        {
            if (message.passFilter(course, after_date))
            {
                try
                {
                    passObjects.add(message)
                }
                catch (error: Exception)
                {

                }
            }
        }
        return passObjects
    }

    public fun getAllCourses(): ArrayList<String>
    {
        val coursesNames =  ArrayList<String>()
        for (message: TeachingMessageObj in objects)
        {
            if (!coursesNames.contains(message.course))
            {
                coursesNames.add(message.course)
            }
        }
        return coursesNames
    }
}