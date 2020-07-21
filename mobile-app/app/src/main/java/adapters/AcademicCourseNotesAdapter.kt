package adapters

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListAdapter
import android.widget.ListView
import android.widget.TextView
import data_objects.AcademicCourseNote
import info.teddylazebnik.mobileversion.MainActivity
import info.teddylazebnik.mobileversion.MainMenuActivity
import info.teddylazebnik.mobileversion.R

class AcademicCourseNotesAdapter(
    private val cont: Context,
    private val resources: Int,
    private val items: List<AcademicCourseNote>): ArrayAdapter<AcademicCourseNote>(cont, resources, items)
{

    var linkArrayAdapter: AcademicCourseResourcesAdapter? = null

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        // get the context to work with
        val layoutInflater: LayoutInflater = LayoutInflater.from(context)
        val view: View = layoutInflater.inflate(resources, null)

        // find the elements we wish to put info in
        val dateObj = view.findViewById<TextView>(R.id.teachingCoursesNoteDate)
        val titleObj = view.findViewById<TextView>(R.id.teachingCoursesNoteTitle)
        val listObj = view.findViewById<ListView>(R.id.teachingCoursesNoteLinksList)

        // put the data inside the view
        var item: AcademicCourseNote = items[position]
        dateObj.text = item.data
        titleObj.text = item.name

        linkArrayAdapter = AcademicCourseResourcesAdapter(cont, R.layout.teaching_couse_note_link_item, item.links)
        listObj.adapter = linkArrayAdapter
        setListViewHeightBasedOnItems(listObj)

        listObj.setOnItemClickListener{ inner_parent, inner_view, inner_position, inner_id ->
            val intent = Intent(cont, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, item.links[inner_position].link)
            }
            cont.startActivity(intent)
        }

        // build list later

        // return generated view
        return view
    }

    override fun getCount(): Int {
        return items.size
    }

    override fun getItem(position: Int): AcademicCourseNote {
        return items[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    fun setListViewHeightBasedOnItems(listView: ListView): Boolean {
        val listAdapter: ListAdapter? = listView.adapter
        return if (listAdapter != null) {
            val numberOfItems: Int = listAdapter.getCount()

            // Get total height of all items.
            var totalItemsHeight = 0
            for (itemPos in 0 until numberOfItems) {
                val item: View = listAdapter.getView(itemPos, null, listView)
                val px = 500 * listView.resources.displayMetrics.density
                item.measure(
                    View.MeasureSpec.makeMeasureSpec(
                        px.toInt(),
                        View.MeasureSpec.AT_MOST
                    ),
                    View.MeasureSpec.makeMeasureSpec(
                        0,
                        View.MeasureSpec.UNSPECIFIED
                    )
                )
                totalItemsHeight += item.measuredHeight
            }

            // Get total height of all item dividers.
            val totalDividersHeight = listView.dividerHeight *
                    (numberOfItems - 1)
            // Get padding
            val totalPadding = listView.paddingTop + listView.paddingBottom

            // Set list height.
            val params = listView.layoutParams
            params.height = totalItemsHeight + totalDividersHeight + totalPadding
            listView.layoutParams = params
            listView.requestLayout()
            true
        } else {
            false
        }
    }
}