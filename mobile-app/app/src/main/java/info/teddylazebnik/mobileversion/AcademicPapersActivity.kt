package info.teddylazebnik.mobileversion

import adapters.AcademicPaperAdapter
import adapters.OpenSourceProjectAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import data_objects.AcademicPaper
import data_objects.OpenSourceProject

class AcademicPapersActivity : AppCompatActivity() {

    var items: ArrayList<AcademicPaper> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_academic_papers)

        // build courses
        // TODO: move later to database or remote online file
        items.add(AcademicPaper(title = "A stable algorithm for numerical matrix exponent",
            description = "",
            pageLink = "https://teddylazebnik.info/files/matrix_exponent.pdf",
            authors = arrayListOf("Teddy Lazebnik", "Shlomo Yanetz"),
            journal = "Functional Differential Equations",
            year = 2016))
        items.add(AcademicPaper(title = "Treatment of Bladder Cancer Using BCG Immunotherapy: PDE Modeling",
            description = "",
            pageLink = "https://teddylazebnik.info/files/Treatment_of_Bladder_Cancer_Using_BCG_Immunotherapy.pdf",
            authors = arrayListOf("Teddy Lazebnik", "Shlomo Yanetz", "Svetlana Bunimovich-Mendrazitsky", "Niva Aaroni"),
            journal = "Functional Differential Equations",
            year = 2019))
        items.add(AcademicPaper(title = "A highly stable implementation for numerical matrix exponent in Matlab and C",
            description = "",
            pageLink = "https://teddylazebnik.info/files/matrix_exponent_stable.pptx",
            authors = arrayListOf("Teddy Lazebnik", "Shlomo Yanetz"),
            journal = "Functional Differential Equations",
            year = 2016))
        items.add(AcademicPaper(title = "PDE Modeling of Bladder Cancer Treatment Using BCG ImmunotherapyC",
            description = "",
            pageLink = "https://teddylazebnik.info/files/Treatment_of_Bladder_Cancer___conference.pptx",
            authors = arrayListOf("Teddy Lazebnik", "Shlomo Yanetz", "Svetlana Bunimovich-Mendrazitsky"),
            journal = "Functional Differential Equations",
            year = 2019))
        items.add(AcademicPaper(title = "Energy Efficiency in 2d Quadratic Hamiltonian",
            description = "",
            pageLink = "https://teddylazebnik.info/files/Treatment_of_Bladder_Cancer___conference.pptx",
            authors = arrayListOf("Teddy Lazebnik", "Barry Ginat"),
            journal = "Technion Press",
            year = 2019))
        items.add(AcademicPaper(title = "Rivendell: Project-Based Academic Search Engine",
            description = "",
            pageLink = "https://teddylazebnik.info/files/files/nano_confirance.pptx",
            authors = arrayListOf("Teddy Lazebnik", "Barry Ginat"),
            journal = "Technion Press",
            year = 2019))
        items.add(AcademicPaper(title = "Return on Data",
            description = "",
            pageLink = "https://teddylazebnik.info/files/files/nano_confirance.pptx",
            authors = arrayListOf("Teddy Lazebnik", "Barry Ginat"),
            journal = "Technion Press",
            year = 2019))
        // sort according to order
        this.items = AcademicPaper.sort(this.items)
        // build UI
        buildList(items)
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<AcademicPaper>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.academicPapersList)

        // inject to view
        ListView.adapter = AcademicPaperAdapter(this, R.layout.academic_paper_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, items[position].pageLink)
            }
            startActivity(intent)
        }
    }
}