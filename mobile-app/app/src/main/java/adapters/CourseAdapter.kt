package adapters

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.annotation.RequiresApi
import data_objects.Course
import info.teddylazebnik.mobileversion.R
import info.teddylazebnik.mobileversion.data_objects.TeachingMessageObj

class CourseAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<Course>): ArrayAdapter<Course>(cont, resources, items)
{

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val nameObj = view.findViewById<TextView>(R.id.courseCardName)
        val dateObj = view.findViewById<TextView>(R.id.courseCardDate)
        val descriptionObj = view.findViewById<TextView>(R.id.courseCardDes)
        val uniObj = view.findViewById<TextView>(R.id.courseCardUni)

        // put the data inside the view
        var item: Course = items[position]
        nameObj.text = item.title
        dateObj.text = "${item.year} (Sem. ${item.semester})"
        descriptionObj.text = item.description
        uniObj.text = item.uni

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): Course {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }
}