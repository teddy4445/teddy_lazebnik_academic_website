package data_objects

import android.nfc.Tag
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject

class AcademicCourse {
    val sources = ArrayList<AcademicCourseSource>()
    val teachingNotes = ArrayList<AcademicCourseNote>()
    val additionalData = ArrayList<AcademicCourseSource>()
    var title: String = ""
    var code: String = ""
    var description: String = ""

    fun parseFromJson(jsonObject: JSONObject)
    {
        this.title = jsonObject["title"].toString()
        this.code = jsonObject["code"].toString()
        this.description = jsonObject["description"].toString()
        for (itemIndex in 0 until (jsonObject["sources"] as JSONArray).length())
        {
            try {
                sources.add(
                    AcademicCourseSource(
                        ((jsonObject["sources"] as JSONArray)[itemIndex] as JSONObject)["name"].toString(),
                        ((jsonObject["sources"] as JSONArray)[itemIndex] as JSONObject)["link"].toString()
                    )
                )
            }
            catch (e: Exception)
            {
                Log.e("AcademicCourse.Parse", "Error as: $e")
            }
        }
        for (itemIndex in 0 until (jsonObject["additionalData"] as JSONArray).length())
        {
            try {
                additionalData.add(AcademicCourseSource(((jsonObject["additionalData"] as JSONArray)[itemIndex] as JSONObject)["name"].toString(),
                    ((jsonObject["additionalData"] as JSONArray)[itemIndex] as JSONObject)["link"].toString()))
            }
            catch (e: Exception)
            {
                Log.e("AcademicCourse.Parse", "Error as: $e")
            }
        }
        for (itemIndex in 0 until (jsonObject["teachingNotes"] as JSONArray).length())
        {
            try {
                var links = ArrayList<AcademicCourseSource>()
                for (linkIndex in 0 until (((jsonObject["teachingNotes"] as JSONArray)[itemIndex] as JSONObject)["links"] as JSONArray).length())
                {
                    links.add(AcademicCourseSource(((((jsonObject["teachingNotes"] as JSONArray)[itemIndex] as JSONObject)["links"] as JSONArray)[linkIndex] as JSONObject)["name"].toString(),
                        ((((jsonObject["teachingNotes"] as JSONArray)[itemIndex] as JSONObject)["links"] as JSONArray)[linkIndex] as JSONObject)["link"].toString()))
                }
                teachingNotes.add(AcademicCourseNote(((jsonObject["teachingNotes"] as JSONArray)[itemIndex] as JSONObject)["name"].toString(),
                    ((jsonObject["teachingNotes"] as JSONArray)[itemIndex] as JSONObject)["date"].toString(),
                    links))
            }
            catch (e: Exception)
            {
                Log.e("AcademicCourse.Parse", "Error as: $e")
            }
        }
    }
}


class AcademicCourseSource(val name: String, val link: String) {

}

class AcademicCourseNote(val name: String, val data: String, val links: List<AcademicCourseSource>) {

}