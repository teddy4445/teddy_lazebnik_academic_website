package info.teddylazebnik.mobileversion.data_objects

import android.os.Build
import androidx.annotation.RequiresApi
import java.lang.Exception
import java.time.LocalDate
import kotlin.collections.ArrayList

@RequiresApi(Build.VERSION_CODES.O)
class TeachingMessageList(raw_data: String) {

    public var objects: ArrayList<TeachingMessageObj> = ArrayList<TeachingMessageObj>()

    init {
        for (line in raw_data.split("\n")) {
            try {
                objects.add(
                    TeachingMessageObj(
                        line
                    )
                )
            } catch (error: Exception) {

            }
        }
    }

    constructor(messagesObjArray: ArrayList<TeachingMessageObj>) : this("") {
        this.objects = messagesObjArray
    }

    public fun size(): Int
    {
        return this.objects.size
    }

    fun sort() {
        objects.sortWith(compareBy({it.date}))
        objects.reverse()
    }

    fun filter(course: String, after_date: LocalDate?): TeachingMessageList
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
        return TeachingMessageList(
            passObjects
        )
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