package info.teddylazebnik.mobileversion

import adapters.CourseAdapter
import adapters.OpenSourceProjectAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import data_objects.Course
import data_objects.OpenSourceProject

class OpenSourceProjectsActivity : AppCompatActivity() {

    var items: ArrayList<OpenSourceProject> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_open_source_projects)

        // build courses
        // TODO: move later to database or remote online file
        items.add(OpenSourceProject(title = "Lightweight JS pathfinding genetic programming",
            pageLink = "https://bitbucket.org/teddy_lazebnik/js-path-finding-genetic-programming/src/master/",
            description = "The idea is to present light weight (Java Script written) genetic programming. There are graphs (using Google's API) for monitoring the optimization process and game-link controlers to control the parameters of the evaluations.",
            tags = arrayListOf("JS", "Genetic Programing")))
        items.add(OpenSourceProject(title = "Hebrew associative word distance calculator",
            pageLink = "https://teddylazebnik.info/js-path-finding-genetic-programming.html",
            description = "A SaaS solution with Front-end, Back-end and algorithms in a single project. Allowing to train W2V and then Random-Forest model on a data of associative words and than querying the model with new words. The training and evaluation can be done with an easy to use GUI. In addition, some BI tools and basic user management is integrated into the project.",
            tags = arrayListOf("Python", "NLP", "W2V", "RF")))
        items.add(OpenSourceProject(title = "A python class generator",
            pageLink = "https://bitbucket.org/teddy_lazebnik/python-class-generator/src/master/",
            description = "Allowing to build a class file using code for on-run class generation and meta-class analysis.",
            tags = arrayListOf("Python", "meta-classes")))
        items.add(OpenSourceProject(title = "Infinite run game in Unity (C#)",
            pageLink = "https://github.com/ArielA147/Space-temple-run",
            description = "An Indine game made in Unity (C#) of 3d infinity runer taking place in space. A smart memory management by creating and destraction of objects according to the potentional pathes of the user is included.",
            tags = arrayListOf("C#", "Unity", "Game")))
        items.add(OpenSourceProject(title = "Tower collapse game in Unity (C#)",
            pageLink = "https://bitbucket.org/teddy_lazebnik/babylonian-revenge-mobile-game/src/master/",
            description = "A simple 3d game allowing to build a tower from blocks with enemies trying to hit and destroy your tower.",
            tags = arrayListOf("C#", "Unity", "Game")))
        items.add(OpenSourceProject(title = "Pubmed and arXiv paper downloader",
            pageLink = "https://bitbucket.org/galk-opensource/pubmed-arxiv-paper-downloader/src/master/",
            description = "The project written in Java allowing a user to download full papers from both PubMed and arXiv.",
            tags = arrayListOf("Java", "Academic Search Engine")))
        items.add(OpenSourceProject(title = "K-means great again",
            pageLink = "https://bitbucket.org/teddy_lazebnik/knn_over_time/src/master/",
            description = "This project provides three different extensions for the K-means and Knn algorithm provided in the \"sklearn\" module. First, X-means which finds the best 'k' hyper-parameter in K-means automatically for given possible set of K's. Second, n-regression convert the classic Knn classification problem to a regression predictor. Third, Knn over time allowing to find casters using the Knn algorithm with a strong time component. This technique inherently using changing of clusters over time and not just another dimension in the feature-space.",
            tags = arrayListOf("Python", "ML")))
        items.add(OpenSourceProject(title = "Academic PDF to TXT",
            pageLink = "https://bitbucket.org/galk-opensource/paper-pdf-text-extractor/src/master/",
            description = "The project written in Java allowing a user to convert academic papers in a PDF format to a TXT extracting the text of the paper using several techniques. Currently, it support the following geometrical \\ format elements popular in academic papers: 1. 2 coloum texts - by spliting the page into 2 pages, one per coloum. 2. Graphs, tables and images - finding the boundery of each one of them in a page and removing it by overriding with white rectangle. 3. Equeations - the OCR providing short and non-words from equeations which is mostly cleared in the post-processing stage.",
            tags = arrayListOf("Java", "OCR")))
        items.add(OpenSourceProject(title = "Home Darts ScoreBoard",
            pageLink = "https://bitbucket.org/teddy_lazebnik/darts_score_board/src",
            description = "A darts scoreboard for home use",
            tags = arrayListOf("Python", "JS", "Game")))
        items.add(OpenSourceProject(title = "Simple (yet effective) General Semantic Analysis",
            pageLink = "https://teddylazebnik.info/sementic_analysis_sample.html",
            description = "General Semantic Analysis demo fully develped in Vanila JS. Checkout the whatsapp chat analysis - a lot of fun.",
            tags = arrayListOf("JS", "NLP")))
        items.add(OpenSourceProject(title = "Game of Life CoronaSpread analysis",
            pageLink = "https://teddylazebnik.info/game_of_life/index.html",
            description = "An implementation of the \"game of life\" simulating corona spread in the population.",
            tags = arrayListOf("JS", "P5.JS")))
        items.add(OpenSourceProject(title = "Assosiative Words Grouper",
            pageLink = "https://teddylazebnik.info/assosiative_words_grouper.html",
            description = "A  GUI allowing to load lists of source and target words (from associative experiments) and build similarity groups.",
            tags = arrayListOf("JS")))
        // sort according to order
        this.items = OpenSourceProject.sort(this.items)
        // build UI
        buildList(items)
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<OpenSourceProject>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.openSourceProjectList)

        // inject to view
        ListView.adapter = OpenSourceProjectAdapter(this, R.layout.open_source_project_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, items[position].pageLink)
            }
            startActivity(intent)
        }
    }
}