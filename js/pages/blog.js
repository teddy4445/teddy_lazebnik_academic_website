// imports
import { PageRender, retrivedData } from '/js/pageRender.js';
import { BlogCard } from '/js/components/blogCard.js';
import { addCollapseFunction } from '/js/descriptionSlicer.js';
import {Icons} from '/js/components/icons.js';

// Data file paths
let BLOG_JSON = "/data/jsons/blog.json";

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

	buildBody()
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
					ansewrHtml += buildPublicationList[elementIndex].toHtml();
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

	changeFilterYear()
	{
		// get value
		var selector = document.getElementById("year-filter");
		var selectorIndex = selector.selectedIndex;
		var filter = selector.options[selectorIndex].value;

		// clear from the other for any case
		this.clearFilterViewSelect();

		if (filter.toLowerCase() != "year")
		{
			// mark this filter as choosen
			selector.classList.add("active-sort-button");
			document.getElementById("year-filter").selectedIndex = "" + selectorIndex;
		} else {
			filter = default_filter;
		}

		this.buildBody(this.sorter, filter, "year");
	}

	changeFilterType()
	{
		// get value
		var selector = document.getElementById("type-filter");
		var selectorIndex = selector.selectedIndex;
		var filter = selector.options[selectorIndex].value;

		// clear from the other for any case
		this.clearFilterViewSelect();

		if (filter.toLowerCase() != "type")
		{
			// mark this filter as choosen
			selector.classList.add("active-sort-button");
			document.getElementById("type-filter").selectedIndex = "" + selectorIndex;
		} else {
			filter = default_filter;
		}

		this.buildBody(this.sorter, filter, "type");
	}

	changeFilterTopic()
	{
		// get value
		var selector = document.getElementById("topic-filter");
		var selectorIndex = selector.selectedIndex;
		var filter = selector.options[selectorIndex].value;

		// clear from the other for any case
		this.clearFilterViewSelect();

		if (filter.toLowerCase() != "topic")
		{
			// mark this filter as choosen
			selector.classList.add("active-sort-button");
			document.getElementById("topic-filter").selectedIndex = "" + selectorIndex;
		} else {
			filter = default_filter;
		}

		this.buildBody(this.sorter, filter, "topic");
	}

	clearFilterViewSelect()
	{
		document.getElementById("type-filter").classList.remove("active-sort-button");
		document.getElementById("type-filter").selectedIndex = "0";
		document.getElementById("year-filter").classList.remove("active-sort-button");
		document.getElementById("year-filter").selectedIndex = "0";
		document.getElementById("topic-filter").classList.remove("active-sort-button");
		document.getElementById("topic-filter").selectedIndex = "0";
	}

	/* end - GUI functions */

	/* help functions */

	static fulfilDropdown(id, itemsList)
	{
		if (Array.from(new Set(itemsList)).length > 1)
		{
			itemsList = [...new Set(itemsList)];
			var html = "";
			for (var itemIndex = 0; itemIndex < itemsList.length; itemIndex++)
			{
				html += '<option value="' + itemsList[itemIndex] + '">' + itemsList[itemIndex] + '</option>';
			}
			document.getElementById(id).innerHTML += html;
		}
		else
		{
			document.getElementById(id).style.display = "none";
		}
	}

	/* end -  help functions  */
}

// run the class build on page load
document.blog = new Blog();
document.blog.build();

export { Blog };
