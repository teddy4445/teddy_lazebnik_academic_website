package adapters

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.LinearLayout
import android.widget.TextView
import data_objects.OpenSourceProject
import data_objects.Students
import data_objects.TechnicalBlog
import info.teddylazebnik.mobileversion.R

class StudentsAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<Students>): ArrayAdapter<Students>(cont, resources, items)
{
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val listHolderObj = view.findViewById<LinearLayout>(R.id.studentsLayout)
        val titleObj = view.findViewById<TextView>(R.id.studentsTitle)
        val descriptionObj = view.findViewById<TextView>(R.id.studentsDes)
        val typeObj = view.findViewById<TextView>(R.id.studentsType)

        // put the data inside the view
        var item: Students = items[position]
        titleObj.text = item.title
        descriptionObj.text = item.description
        typeObj.text = "[${item.getDegreeText()} - ${item.year.toString()}]"
        if (item.isAlumni)
        {
            listHolderObj.setBackgroundColor(Color.rgb(230, 230, 230))
        }

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): Students {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }
}