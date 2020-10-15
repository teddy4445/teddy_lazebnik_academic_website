// imports 
import { PageRender, retrivedData } from '/lecture_website_template/js/pageRender.js';
import { BlogCard } from '/lecture_website_template/js/components/blogCard.js';

// Data file paths
let PUBLICATIONS_JSON = "/lecture_website_template/data/jsons/academic-publications.json";

// consts 
let default_sorter = "year";
let default_filter = null;

/*
	Single instance class to build blog.html page with dynamic content from JSONS from the server
*/
class Blog extends PageRender
{
	constructor()
	{
		super();
		BlogCard.loadFileFromServer(PUBLICATIONS_JSON, true);
		this.publicationList = BlogCard.createListFromJson(retrivedData["posts"]);
		this.sorter = default_sorter;
	}
	
	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		// get the data from the GET HTTP from the URL and build the page
		var getParms = PageRender.readGetPrams();
		var sorter;
		if (getParms.get("sort") != null)
		{
			this.sorter = getParms.get("sort");
		}
		else
		{
			this.sorter = default_sorter;
			console.log("BlogCard.build did not find sorter, using default");
		}
		
		// build the page itself
		this.buildBody(this.sorter);
	}
	
	/* build section functions */
	
	buildBody(sorter = default_sorter)
	{
		// perpare ds //
		// sort the list
		var buildPostsList = PublicationCard.sortByProperty(this.publicationList, sorter);	
		
		// split into the right sets
		var postsSets = PublicationCard.splitByProperty(buildPostsList, sorter);
		
		// build the UI //
		try
		{
			if (buildPostsList.length > 0)
			{
				var ansewrHtml = "";
				var keys = [];
				
				for (var spliterKey in postsSets)
				{
					keys.push(spliterKey);
				}
				keys = keys.sort();
				
				// edge - case, years we wish to get in the decreasing order
				if (sorter == "year")
				{
					keys = keys.reverse();
				}
				
				for (var spliterKeyIndex = 0; spliterKeyIndex < keys.length; spliterKeyIndex++)
				{
					// add spliter 
					ansewrHtml += "<h3>" + keys[spliterKeyIndex] + "</h3>";
					// add elements inside the list
					for (var elementIndex = 0; elementIndex < publicSets[keys[spliterKeyIndex]].length; elementIndex++)
					{
						ansewrHtml += publicSets[keys[spliterKeyIndex]][elementIndex].toHtml();
					}
				}
				document.getElementById("blog-body").innerHTML = ansewrHtml;
			}
			else // show error message
			{
				document.getElementById("blog-body").innerHTML = "<h3>Don't have blog posts</h3>"; // should not happen
			}
		}
		catch (error)
		{
			console.log("Error at AcademicPublications.buildBody saying: " + error);
		}
	}
	
	/* end -  build sections functions */
	
	/* filtering and reorder of publication list functions */
	
	/* end - filtering and reorder of publication list functions */
	
	/* GUI functions */
	
	changeSort(sort_value)
	{
		document.getElementById("sort-btn-topic").classList.remove("active-sort-button");
		document.getElementById("sort-btn-year").classList.remove("active-sort-button");
		document.getElementById("sort-btn-type").classList.remove("active-sort-button");
		document.getElementById("sort-btn-" + sort_value).classList.add("active-sort-button");
		
		this.buildBody(sort_value, default_filter);
	}
	
	/* end - GUI functions */
	
	/* help functions */
	
	/* end -  help functions  */
}

// run the class build on page load
document.blogPosts = new AcademicPublications();
document.blogPosts.build();

export { AcademicPublications };