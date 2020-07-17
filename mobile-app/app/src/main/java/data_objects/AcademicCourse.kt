package data_objects

class AcademicCourse {
    val sources = ArrayList<AcademicCourseSource>()
    val teachingNotes = ArrayList<AcademicCourseNote>()
    val additionalData = ArrayList<AcademicCourseSource>()
    val title: String = ""
    val code: String = ""
    val description: String = ""
}


class AcademicCourseSource(val name: String, val link: String) {

}

class AcademicCourseNote(val name: String, val data: String, val links: List<AcademicCourseSource>) {

}