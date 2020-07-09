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
import data_objects.TechnicalBlog
import info.teddylazebnik.mobileversion.R
import info.teddylazebnik.mobileversion.data_objects.TeachingMessageObj

class TechnicalBlogAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<TechnicalBlog>): ArrayAdapter<TechnicalBlog>(cont, resources, items)
{

    val MAX_DESCRIPTION_CHARS = 120

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val titleObj = view.findViewById<TextView>(R.id.technicalBlogPostTitle)
        val descriptionObj = view.findViewById<TextView>(R.id.technicalBlogPostDes)

        // put the data inside the view
        var item: TechnicalBlog = items[position]
        titleObj.text = item.title
        descriptionObj.text = item.shortDescription(letters = MAX_DESCRIPTION_CHARS)

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): TechnicalBlog {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }
}