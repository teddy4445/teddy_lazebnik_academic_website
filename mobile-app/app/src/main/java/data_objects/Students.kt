package data_objects

class Students(title: String, description: String, pageLink: String, isAlumni: Boolean, year: Int, degree: Int) : ListMenuItem(title, description){

    companion object {
        fun sort(students: ArrayList<Students>): ArrayList<Students> {
            val answer = students.filterNotNull() as ArrayList<Students>
            answer.sortWith(compareBy({it.isAlumni}, {it.degree}))
            return answer
        }
    }

    var pageLink: String = ""
    var isAlumni: Boolean = false
    var degree: Int = 1
    var year: Int = 2019

    init {
        this.pageLink = pageLink
        this.isAlumni = isAlumni
        this.degree = degree
        this.year = year
    }

    fun getDegreeText(): String {
        when (this.degree){
            1 -> return "Bc.S. project"
            2 -> return "Mc.S. project"
            3 -> return "Mc.S. thesis"
            4 -> return "Ph.D."
        }
        return ""
    }
}