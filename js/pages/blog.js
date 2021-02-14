// imports
import { PageRender, retrivedData } from '/lecture_website_template/js/pageRender.js';
import { BlogCard } from '/lecture_website_template/js/components/blogCard.js';
import { addCollapseFunction } from '/lecture_website_template/js/descriptionSlicer.js';
import {Icons} from '/lecture_website_template/js/components/icons.js';

// Data file paths
let BLOG_JSON = "/lecture_website_template/data/jsons/blog.json";

// consts
const default_sorter = "year";
const default_filter = null;

/*
	Single instance class to build academic-publications.html page with dynamic content from JSONS from the server
*/
class Blog extends PageRender
{
	constructor()
	{
		super();
		Blog.loadFileFromServer(BLOG_JSON, true);
		this.publicationList = BlogCard.createListFromJson(retrivedData["posts"]);
	}

	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		// build the page itself
		this.buildBody();

		addCollapseFunction();
	}

	/* build section functions */

	buildBody(search_term = "")
	{
		// perpare ds //
		// sort the list
		var buildPublicationList = BlogCard.sortByProperty(this.publicationList, default_sorter);

		// build the UI //
		try
		{
			if (buildPublicationList.length > 0)
			{
				var ansewrHtml = "";
				for (var elementIndex = 0; elementIndex < buildPublicationList.length; elementIndex++)
				{
					if (buildPublicationList[elementIndex].title.includes(search_term) || search_term == "")
					{
						ansewrHtml += buildPublicationList[elementIndex].toHtml();	
					}
				}
				document.getElementById("publications-body").innerHTML = ansewrHtml;
			}
			else // show error message
			{
				document.getElementById("publications-body").innerHTML = "<h3>Don't have blog posts with this filter</h3>"; // should not happen
			}
		}
		catch (error)
		{
			console.log("Error at Blog.buildBody saying: " + error);
		}
	}

	/* end -  build sections functions */

	/* GUI functions */
	
	search()
	{
		this.buildBody(document.getElementById("").value.trim().toLowerCase());
	}
	
	/* end - GUI functions */

}

// run the class build on page load
document.blog = new Blog();
document.blog.build();

export { Blog };
