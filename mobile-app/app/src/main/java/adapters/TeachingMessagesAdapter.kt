package info.teddylazebnik.mobileversion.adapters

import android.os.Build
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.annotation.RequiresApi
import info.teddylazebnik.mobileversion.R
import info.teddylazebnik.mobileversion.TeachingMessageObj

class TeachingMessagesAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<TeachingMessageObj>): ArrayAdapter<TeachingMessageObj>(cont, resources, items)
{

    @RequiresApi(Build.VERSION_CODES.O)
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val courseName = view.findViewById<TextView>(R.id.courseName)
        val messageDate = view.findViewById<TextView>(R.id.courseMessageDate)
        val message = view.findViewById<TextView>(R.id.courseMessage)

        // put the data inside the view
        var item: TeachingMessageObj = items[position]
        courseName.text = item.course
        messageDate.text = item.dateString()
        message.text = item.message

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): TeachingMessageObj {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }
}