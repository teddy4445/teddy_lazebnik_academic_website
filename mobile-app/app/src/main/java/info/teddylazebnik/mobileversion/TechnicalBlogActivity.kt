package info.teddylazebnik.mobileversion

import adapters.TechnicalBlogAdapter
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ListView
import data_objects.Course
import data_objects.TechnicalBlog

class TechnicalBlogActivity : AppCompatActivity() {

    var items: ArrayList<TechnicalBlog> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_teachnical_blog)

        // build courses
        // TODO: move later to database or remote online file
        items.add(TechnicalBlog(title = "Daily Issues and Solutions of a Nano-bioinformatic Research",
            pageLink = "https://www.linkedin.com/pulse/daily-issues-solutions-nano-bioinformatic-research-teddy-lazebnik/",
            description = "One may ask how does computer science integrate with biological research. The answer lays in the field of nano-bioinformatics. "))
        items.add(TechnicalBlog(title = "The History of NLP with the Hebrew Language",
            pageLink = "https://www.linkedin.com/pulse/history-nlp-hebrew-language-teddy-lazebnik/",
            description = "The story of the Natural language processing (NLP) begins in the 1950s, although previous work can be found. In 1950, Alan Turing published a famous article entitled \"Computing Machinery and Intelligence\" which proposes what is now called the Turing test as an intelligence criterion."))
        items.add(TechnicalBlog(title = "3 techniques for a better quality of tagged data for ML tasks",
            pageLink = "https://www.linkedin.com/pulse/3-technics-better-quality-tagged-data-ml-tasks-teddy-lazebnik/",
            description = "At the age of data-driven algorithms, business, personal life, and much more we are seeing each day how machines \"learn\" to perform more complex which were out of reach with traditional algorithms. We see businesses optimize their sales, customer loyalty, and employee happiness by investing in analyzing the data we are able to collect in a cheap and fast way nowadays."))
        items.add(TechnicalBlog(title = "3 steps to the medicine of the future",
            pageLink = "https://www.linkedin.com/pulse/3-steps-medicine-future-teddy-lazebnik/",
            description = "From the beginning of mankind, we try to defeat death and make our lifestyle better by being healthy. This is a very understandable wish for anybody who was sick even once (For the readers who weren't ill even once in their life, please send me an email with your contact details - I would like to check this phenomena). "))
        items.add(TechnicalBlog(title = "Medical Nanorobotics - Science or Science Fiction?",
            pageLink = "https://www.linkedin.com/pulse/medical-nanorobotics-science-fiction-teddy-lazebnik/",
            description = "Robots always caught our imagination. Books who had been written century before the first robot already described the complex relationship between humans and robots. Actually, people thought of metal devices with \"life\" already at the area of classic greek..."))
        items.add(TechnicalBlog(title = "Why should you use dotnet core for your next AI project production?",
            pageLink = "https://www.linkedin.com/pulse/why-should-you-use-dotnet-core-your-next-ai-project-teddy-lazebnik/",
            description = "Artificial intelligence (AI) is one of the hottest topics in the last few years. The fourth industrial revolution some might say, the big promise for the next years others predict. Yet, some see this as an unreachable fantasy over the following decade. Some groups even claim that we as humans should not go through this slippery road. "))
        items.add(TechnicalBlog(title = "4 Things To Consider When You User-Testing Your Service.",
            pageLink = "https://www.linkedin.com/pulse/4-things-consider-when-you-user-testing-your-service-teddy-lazebnik/",
            description = "Websites, mobile applications, professional software, operation systems, and basically each and every software that has been developed for the world to use as a component of the interaction with the user. This can be as basic as a command line or very complex like a screen with hundreds of buttons and options."))
        // sort according to order
        this.items = TechnicalBlog.sort(this.items)
        // build UI
        buildList(items)
    }

    /*
        Build messages list in the GUI - linear view with message view in a list
    */
    private fun buildList(listItems: ArrayList<TechnicalBlog>)
    {
        // find the view we wish to insert list into
        var ListView = findViewById<ListView>(R.id.TechnicalBlogList)

        // inject to view
        ListView.adapter = TechnicalBlogAdapter(this, R.layout.technical_blog_card, listItems)

        // add click event to each item
        ListView.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra(MainMenuActivity.EXTRA_MESSAGE, items[position].pageLink)
            }
            startActivity(intent)
        }
    }
}