package data

import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import data_objects.*
import info.teddylazebnik.mobileversion.TeachingMessagesActivity
import info.teddylazebnik.mobileversion.data_objects.TeachingMessageList
import java.io.File
import java.io.FileOutputStream
import java.net.URL

open class DbManager {

    private val handler = Handler()

    companion object {
        val COURSE: String = "Course"
        val ACADEMIC_PAPER: String = "AcademicPaper"
        val OPEN_SOURCE_PROJECT: String = "OpenSourceProject"
        val STUDENTS: String = "Students"
        val TECHNICAL_BLOG: String = "TechnicalBlog"

        val COURSE_JSON_PATH = "Course.json"
        val ACADEMIC_PAPER_JSON_PATH = "AcademicPaper.json"
        val OPEN_SOURCE_PROJECT_JSON_PATH = "OpenSourceProject.json"
        val STUDENTS_JSON_PATH = "Students.json"
        val TECHNICAL_BLOG_JSON_PATH = "TechnicalBlog.json"

        val DOMAIN_JSON: String = "http://teddylazebnik.info/json/"
    }

    public fun updateDataAll() {
        updateDataRaw(DOMAIN_JSON.plus(COURSE_JSON_PATH), COURSE_JSON_PATH)
        updateDataRaw(DOMAIN_JSON.plus(ACADEMIC_PAPER_JSON_PATH), ACADEMIC_PAPER_JSON_PATH)
        updateDataRaw(DOMAIN_JSON.plus(OPEN_SOURCE_PROJECT_JSON_PATH), OPEN_SOURCE_PROJECT_JSON_PATH)
        updateDataRaw(DOMAIN_JSON.plus(STUDENTS_JSON_PATH), STUDENTS_JSON_PATH)
        updateDataRaw(DOMAIN_JSON.plus(TECHNICAL_BLOG_JSON_PATH), TECHNICAL_BLOG_JSON_PATH)
    }

    public fun updateData(className: String) {
        when (className) {
            COURSE -> {
                updateDataRaw(DOMAIN_JSON.plus(COURSE_JSON_PATH), COURSE_JSON_PATH)
            }
            ACADEMIC_PAPER -> {
                updateDataRaw(DOMAIN_JSON.plus(ACADEMIC_PAPER_JSON_PATH), ACADEMIC_PAPER_JSON_PATH)
            }
            OPEN_SOURCE_PROJECT -> {
                updateDataRaw(DOMAIN_JSON.plus(OPEN_SOURCE_PROJECT_JSON_PATH), OPEN_SOURCE_PROJECT_JSON_PATH)
            }
            STUDENTS -> {
                updateDataRaw(DOMAIN_JSON.plus(STUDENTS_JSON_PATH), STUDENTS_JSON_PATH)
            }
            TECHNICAL_BLOG -> {
                updateDataRaw(DOMAIN_JSON.plus(TECHNICAL_BLOG_JSON_PATH), TECHNICAL_BLOG_JSON_PATH)
            }
        }
    }

    public fun updateDataRaw(link: String, saveFilePath: String)
    {
        Thread(Runnable {
            // read messages file, parse it and generate message list
            val data = URL(link).readText()
            // save results
            val file = File(AppCompatActivity().filesDir, saveFilePath)
            val stream = FileOutputStream(file)
            stream.write(data.toByteArray())
            stream.close()
        }).start()
    }

    public fun writeDefaultJson(className: String, contentJson: String)
    {
        when (className) {
            COURSE -> {
                writeJsonFile(COURSE_JSON_PATH, contentJson)
            }
            ACADEMIC_PAPER -> {
                writeJsonFile(ACADEMIC_PAPER_JSON_PATH, contentJson)
            }
            OPEN_SOURCE_PROJECT -> {
                writeJsonFile(OPEN_SOURCE_PROJECT_JSON_PATH, contentJson)
            }
            STUDENTS -> {
                writeJsonFile(STUDENTS_JSON_PATH, contentJson)
            }
            TECHNICAL_BLOG -> {
                writeJsonFile(TECHNICAL_BLOG_JSON_PATH, contentJson)
            }
        }
    }

    public fun readDefaultJson(className: String): List<*>?
    {
        when (className) {
            COURSE -> {
                return readJsonFromFile(COURSE_JSON_PATH, className)
            }
            ACADEMIC_PAPER -> {
                return readJsonFromFile(ACADEMIC_PAPER_JSON_PATH, className)
            }
            OPEN_SOURCE_PROJECT -> {
                return readJsonFromFile(OPEN_SOURCE_PROJECT_JSON_PATH, className)
            }
            STUDENTS -> {
                return readJsonFromFile(STUDENTS_JSON_PATH, className)
            }
            TECHNICAL_BLOG -> {
                return readJsonFromFile(TECHNICAL_BLOG_JSON_PATH, className)
            }
        }
        return null
    }

    public fun writeJsonFile(filePath: String, contentJson: String)
    {
        File(filePath).writeText(contentJson)
    }

    public fun readJsonFromFile(filePath: String, className: String): List<*>?
    {
        return readJson(File(filePath).readText(Charsets.UTF_8), className)
    }

    public fun readJson(jsonString: String, className: String): List<*>?
    {
        when (className) {
            COURSE -> {
                val listObjects =  object : TypeToken<List<Course>>() {}.type
                return Gson().fromJson(jsonString, listObjects)
            }
            ACADEMIC_PAPER -> {
                val listObjects =  object : TypeToken<List<AcademicPaper>>() {}.type
                return Gson().fromJson(jsonString, listObjects)
            }
            OPEN_SOURCE_PROJECT -> {
                val listObjects =  object : TypeToken<List<OpenSourceProject>>() {}.type
                return Gson().fromJson(jsonString, listObjects)
            }
            STUDENTS -> {
                val listObjects =  object : TypeToken<List<Students>>() {}.type
                return Gson().fromJson(jsonString, listObjects)
            }
            TECHNICAL_BLOG -> {
                val listObjects =  object : TypeToken<List<TechnicalBlog>>() {}.type
                return Gson().fromJson(jsonString, listObjects)
            }
        }
        return null
    }
}
