// imports
import { PageRender, retrivedData } from '/js/pageRender.js';

// Data file paths
let BLOG_JSON = "/data/jsons/blog.json";

// consts
const default_sorter = "year";
const default_filter = null;

/*
	Single instance class to build academic-publications.html page with dynamic content from JSONS from the server
*/
class BlogPost extends PageRender
{
	constructor()
	{
		super();
		this.postName;
	}

	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		var getParms = PageRender.readGetPrams();
		var sorter;
		if (getParms.get("post") != null)
		{
			this.postName = getParms.get("post");
		}
		
		// build the page itself
		this.buildBody();
	}

	/* build section functions */

	buildBody()
	{
		// build the UI //
		try
		{
			let client;
			// code for IE7+, Firefox, Chrome, Opera, Safari
			if (window.XMLHttpRequest)
			{
				client = new XMLHttpRequest();
			}
			else // code for IE6, IE5
			{
				client = new ActiveXObject("Microsoft.XMLHTTP");
			}
			client.onreadystatechange = contentHandler;
			client.open("GET", "/blog/blog-post-" + this.postName + ".html", false);
			client.send();
		}
		catch (error)
		{
			console.log("Error at BlogPost.buildBody saying: " + error);
		}
	}
}

function contentHandler() 
{
	if (this.readyState == 4 && this.status == 200 && this.responseText != null)
	{
		document.getElementById("content").innerHTML =  this.responseText;
	}
}

// run the class build on page load
document.blogpost = new BlogPost();
document.blogpost.build();

export { BlogPost };
