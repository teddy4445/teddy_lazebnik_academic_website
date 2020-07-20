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
        when(position)
        {
            0 -> {
                val pickedFragment = AcademicCourseActivitySourcesFragment()
                return pickedFragment
            }
            1 -> {
                val pickedFragment = AcademicCourseActivityNotesFragment()
                return pickedFragment
            }
            2 -> {
                val pickedFragment = AcademicCourseActivityAdditionalFragment()
                return pickedFragment
            }
            else ->
            {
                val pickedFragment = AcademicCourseActivityNotesFragment()
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