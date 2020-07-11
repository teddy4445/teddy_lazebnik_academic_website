package data

import android.os.Build
import androidx.annotation.RequiresApi
import java.io.File
import java.time.LocalDateTime
import java.time.ZoneOffset

open class DbUpdateManager {

    companion object{
        val DB_UPDATE = "db_update.txt"
        val SECONDS_IN_HALF_DAY = 43200

        @RequiresApi(Build.VERSION_CODES.O)
        fun checkLastUpdate(dataAppFolder: File, deltaInSeconds: Int): Boolean {
            try {
                return LocalDateTime.now(ZoneOffset.UTC).atZone(ZoneOffset.UTC).toEpochSecond() - LocalDateTime.parse(File(dataAppFolder, DB_UPDATE).readText()).atZone(ZoneOffset.UTC).toEpochSecond() >= deltaInSeconds
            }
            catch (error: Exception)
            {
                return true
            }
        }

        @RequiresApi(Build.VERSION_CODES.O)
        fun updateDbDate(dataAppFolder: File) {
            File(dataAppFolder, DB_UPDATE).writeText(LocalDateTime.now(ZoneOffset.UTC).toString())
        }
    }

}