package adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import data_objects.OpenSourceProject
import data_objects.TechnicalBlog
import info.teddylazebnik.mobileversion.R

class OpenSourceProjectAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<OpenSourceProject>): ArrayAdapter<OpenSourceProject>(cont, resources, items)
{
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val titleObj = view.findViewById<TextView>(R.id.openSourceProjectTitle)
        val descriptionObj = view.findViewById<TextView>(R.id.openSourceProjectDes)
        val tagsObj = view.findViewById<TextView>(R.id.openSourceProjectTags)

        // put the data inside the view
        var item: OpenSourceProject = items[position]
        titleObj.text = item.title
        descriptionObj.text = item.description
        tagsObj.text = join(", ", item.tags)

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): OpenSourceProject {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
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