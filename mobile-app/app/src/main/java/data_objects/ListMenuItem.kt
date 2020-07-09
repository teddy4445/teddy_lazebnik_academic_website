package data_objects

open class ListMenuItem(title: String, description: String) {

    var title: String = ""
    var description: String = ""

    companion object {
        fun sort(items : ArrayList<ListMenuItem>): ArrayList<ListMenuItem> {
            return items
        }
    }

    init {
        this.title = title
        this.description = description
    }

    fun shortDescription(letters: Int): String {
        if (letters < this.description.length) {
            return this.description.subSequence(0, letters).toString().plus("...")
        }
        return this.description
    }
}