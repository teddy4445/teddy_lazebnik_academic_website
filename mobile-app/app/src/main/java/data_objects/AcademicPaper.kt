package data_objects

class AcademicPaper(title: String, description: String, pageLink: String, authors: ArrayList<String>, year: Int, journal: String) : ListMenuItem(title, description){

    companion object {
        fun sort(papers: ArrayList<AcademicPaper>): ArrayList<AcademicPaper> {
            var answer  = papers.filterNotNull() as ArrayList<AcademicPaper>
            answer.sortWith(compareBy({-1 * it.year}))
            return answer
        }
    }

    var pageLink: String = ""
    var authors: ArrayList<String> = ArrayList<String>()
    var journal: String = ""
    var year: Int = 2000

    init {
        this.pageLink = pageLink
        this.authors = authors
        this.year = year
        this.journal = journal
    }

    private fun join(spliter: String, list: ArrayList<String>): String
    {
        var answer = ""
        for (item in list){
            answer += "$item$spliter"
        }
        answer = answer.substring(0, answer.length - spliter.length)
        return answer
    }
}