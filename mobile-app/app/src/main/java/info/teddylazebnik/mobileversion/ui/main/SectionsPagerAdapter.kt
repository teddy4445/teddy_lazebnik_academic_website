package info.teddylazebnik.mobileversion.ui.main

import android.R.attr
import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentPagerAdapter
import info.teddylazebnik.mobileversion.R


private val TAB_TITLES = arrayOf(
    R.string.teaching_courses_page_tab_1,
    R.string.teaching_courses_page_tab_2,
    R.string.teaching_courses_page_tab_3
)

/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the sections/tabs/pages.
 */
class SectionsPagerAdapter(private val context: Context, fm: FragmentManager) :
    FragmentPagerAdapter(fm) {

    override fun getItem(position: Int): Fragment {

        val bundle = Bundle()
        bundle.putString("course_name", )

        when(position)
        {
            1 -> {
                val pickedFragment = AcademicCourseActivitySourcesFragment()
                pickedFragment.arguments = bundle
                return pickedFragment
            }
            2 -> {
                val pickedFragment = AcademicCourseActivityNotesFragment()
                pickedFragment.arguments = bundle
                return pickedFragment
            }
            3 -> {
                val pickedFragment = AcademicCourseActivityAdditionalFragment()
                pickedFragment.arguments = bundle
                return pickedFragment
            }
            else ->
            {
                val pickedFragment = AcademicCourseActivityNotesFragment()
                pickedFragment.arguments = bundle
                return pickedFragment
            }
        }
    }

    override fun getPageTitle(position: Int): CharSequence? {
        return context.resources.getString(TAB_TITLES[position])
    }

    override fun getCount(): Int {
        return 3
    }
}