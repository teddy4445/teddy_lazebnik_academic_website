package data_objects

class OpenSourceProject(title: String, description: String, pageLink: String, tags: ArrayList<String>) : ListMenuItem(title, description){

    companion object {
        fun sort(openSourceProjectsList : ArrayList<OpenSourceProject>): ArrayList<OpenSourceProject> {
            openSourceProjectsList.sortWith(compareBy({it.title}))
            return openSourceProjectsList
        }
    }

    var pageLink: String = ""
    var tags: ArrayList<String> = ArrayList<String>()

    init {
        this.pageLink = pageLink
        this.tags = tags.clone() as ArrayList<String>
    }
}