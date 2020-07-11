package data

import android.os.Handler
import android.os.SystemClock
import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import data_objects.*
import java.io.File
import java.io.FileOutputStream
import java.net.URL

open class DbManager {

    private val TAG = "DbManager"
    private val WAIT_CALL_TIME_MS = 50
    private var callData = ""
    private val handler = Handler()

    private var finishCall = true

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

        val DOMAIN_JSON: String = "https://teddylazebnik.info/app_jsons/"
    }

    public fun updateDataAll(dataAppFolder: File) {
        try
        {
            updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(COURSE_JSON_PATH), COURSE_JSON_PATH)
            updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(ACADEMIC_PAPER_JSON_PATH), ACADEMIC_PAPER_JSON_PATH)
            updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(OPEN_SOURCE_PROJECT_JSON_PATH), OPEN_SOURCE_PROJECT_JSON_PATH)
            updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(STUDENTS_JSON_PATH), STUDENTS_JSON_PATH)
            updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(TECHNICAL_BLOG_JSON_PATH), TECHNICAL_BLOG_JSON_PATH)
        }
        catch (error: Exception)
        {
            Log.e(TAG, "Cannot update files because: $error")
        }
    }

    public fun updateData(dataAppFolder: File, className: String) {
        when (className) {
            COURSE -> {
                updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(COURSE_JSON_PATH), COURSE_JSON_PATH)
            }
            ACADEMIC_PAPER -> {
                updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(ACADEMIC_PAPER_JSON_PATH), ACADEMIC_PAPER_JSON_PATH)
            }
            OPEN_SOURCE_PROJECT -> {
                updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(OPEN_SOURCE_PROJECT_JSON_PATH), OPEN_SOURCE_PROJECT_JSON_PATH)
            }
            STUDENTS -> {
                updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(STUDENTS_JSON_PATH), STUDENTS_JSON_PATH)
            }
            TECHNICAL_BLOG -> {
                updateDataRaw(dataAppFolder, DOMAIN_JSON.plus(TECHNICAL_BLOG_JSON_PATH), TECHNICAL_BLOG_JSON_PATH)
            }
        }
    }

    public fun updateDataRaw(dataAppFolder: File, link: String, saveFilePath: String) {
        callData = ""

        Thread(Runnable {
            // read messages file, parse it and generate message list
            callData = URL(link).readText()
        }).start()

        // lock until we have answer
        var count = 1
        while (callData == "")
        {
            Log.i(TAG, "Wait for ${count * WAIT_CALL_TIME_MS} ms for $link")
            count++
            SystemClock.sleep(WAIT_CALL_TIME_MS.toLong());
        }

        // save results
        val file = File(dataAppFolder, saveFilePath)
        val stream = FileOutputStream(file)
        stream.write(callData.toByteArray())
        Log.i(TAG, "Save ${8 * callData.length} bytes for $link")
        stream.close()
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

    public fun readDefaultJson(dataAppFolder: File, className: String): List<*>?
    {
        when (className) {
            COURSE -> {
                return readJsonFromFile(dataAppFolder, COURSE_JSON_PATH, className)
            }
            ACADEMIC_PAPER -> {
                return readJsonFromFile(dataAppFolder, ACADEMIC_PAPER_JSON_PATH, className)
            }
            OPEN_SOURCE_PROJECT -> {
                return readJsonFromFile(dataAppFolder, OPEN_SOURCE_PROJECT_JSON_PATH, className)
            }
            STUDENTS -> {
                return readJsonFromFile(dataAppFolder, STUDENTS_JSON_PATH, className)
            }
            TECHNICAL_BLOG -> {
                return readJsonFromFile(dataAppFolder, TECHNICAL_BLOG_JSON_PATH, className)
            }
        }
        return null
    }

    public fun writeJsonFile(filePath: String, contentJson: String)
    {
        File(filePath).writeText(contentJson)
    }

    public fun readJsonFromFile(dataAppFolder: File, fileName: String, className: String): List<*>?
    {
        return readJson(File(dataAppFolder, fileName).readText(), className)
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
