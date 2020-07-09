package adapters

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.LinearLayout
import android.widget.TextView
import data_objects.AcademicPaper
import data_objects.OpenSourceProject
import data_objects.Students
import data_objects.TechnicalBlog
import info.teddylazebnik.mobileversion.R

class AcademicPaperAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<AcademicPaper>): ArrayAdapter<AcademicPaper>(cont, resources, items)
{
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val titleObj = view.findViewById<TextView>(R.id.academicPaperTitle)
        val authorsObj = view.findViewById<TextView>(R.id.academicPaperAuthors)
        val journalObj = view.findViewById<TextView>(R.id.academicPaperJournal)
        val yearObj = view.findViewById<TextView>(R.id.academicPaperYear)

        // put the data inside the view
        var item: AcademicPaper = items[position]
        titleObj.text = item.title
        authorsObj.text = join(", ", item.authors)
        journalObj.text = item.journal
        yearObj.text = item.year.toString()

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): AcademicPaper {
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