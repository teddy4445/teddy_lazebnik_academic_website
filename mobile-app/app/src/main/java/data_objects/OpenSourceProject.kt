package data_objects

class OpenSourceProject(title: String, description: String, pageLink: String, tags: ArrayList<String>) : ListMenuItem(title, description){

    companion object {
        fun sort(openSourceProjectsList : ArrayList<OpenSourceProject>): ArrayList<OpenSourceProject> {
            val answer = openSourceProjectsList.filterNotNull() as ArrayList<OpenSourceProject>
            answer.sortWith(compareBy({it.title}))
            return answer
        }
    }

    var pageLink: String = ""
    var tags: ArrayList<String> = ArrayList<String>()

    init {
        this.pageLink = pageLink
        this.tags = tags.clone() as ArrayList<String>
    }
}