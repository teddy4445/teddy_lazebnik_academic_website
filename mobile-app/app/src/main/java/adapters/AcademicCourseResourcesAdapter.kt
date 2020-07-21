package adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import data_objects.AcademicCourseSource
import info.teddylazebnik.mobileversion.R

class AcademicCourseResourcesAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<AcademicCourseSource>): ArrayAdapter<AcademicCourseSource>(cont, resources, items)
{

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val textObj = view.findViewById<TextView>(R.id.teachingCoursesSourceItemText)

        // put the data inside the view
        var item: AcademicCourseSource = items[position]
        textObj.text = item.name

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): AcademicCourseSource {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }
}