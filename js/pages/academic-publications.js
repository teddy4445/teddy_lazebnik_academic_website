// imports 
import { PageRender, retrivedData } from '/lecture_website_template/js/pageRender.js';
import { PublicationCard } from '/lecture_website_template/js/components/publicationCard.js';

// Data file paths
let PUBLICATIONS_JSON = "/lecture_website_template/data/jsons/academic-publications.json";

// consts 
let default_sorter = "year";
let default_filter = null;

/*
	Single instance class to build academic-publications.html page with dynamic content from JSONS from the server
*/
class AcademicPublications extends PageRender
{
	constructor()
	{
		super();
		AcademicPublications.loadFileFromServer(PUBLICATIONS_JSON, true);
		this.publicationList = PublicationCard.createListFromJson(retrivedData["publications"]);
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
			console.log("AcademicPublications.build did not find sorter, using default");
		}
		
		var filter;
		if (getParms.get("filter") != null)
		{
			filter = getParms.get("filter");
		}
		else
		{
			filter = default_filter;
			console.log("AcademicPublications.build did not find filter, using default");
		}
		
		// build the page itself
		this.buildHeader(this.sorter, filter);
		this.buildBody(this.sorter, filter);
	}
	
	/* build section functions */
	
	buildHeader(sorter = default_sorter, filter = default_filter)
	{
		try
		{
			// highlight the sort button which is active
			document.getElementById("sort-btn-" + sorter).classList.add("active-sort-button");
			
			// find all unique years/types/topics in the data
			var years = [];
			var topics = [];
			var types = [];
			for (var pubIndex = 0; pubIndex < this.publicationList.length; pubIndex++)
			{
				var item = this.publicationList[pubIndex];
				years.push(item.year);
				topics.push(item.topic);
				types.push(item.type);
			}
			// sort to make sure the order is always the same 
			years.sort();
			years.reverse();
			topics.sort();
			types.sort();
			
			// build the year filter //
			AcademicPublications.fulfilDropdown("year-filter", years);
			// build the type filter //
			AcademicPublications.fulfilDropdown("topic-filter", topics);
			// build the topic filter //
			AcademicPublications.fulfilDropdown("type-filter", types);
		}
		catch (error)
		{
			console.log("Error at AcademicPublications.buildHeader saying: " + error);
		}
	}
	
	buildBody(sorter = default_sorter, filter = default_filter, filterProperty = default_sorter)
	{
		// perpare ds //
		// sort the list
		var buildPublicationList = PublicationCard.sortByProperty(this.publicationList, sorter);	
		
		// if filter needed
		if (filter != null)
		{
			// filter the needed list only
			buildPublicationList = PublicationCard.filterList(buildPublicationList, filterProperty, filter);
		}
		
		// split into the right sets
		var publicSets = PublicationCard.splitByProperty(buildPublicationList, sorter);
		
		// build the UI //
		try
		{
			if (buildPublicationList.length > 0)
			{
				var ansewrHtml = "";
				var keys = [];
				
				for (var spliterKey in publicSets)
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
				document.getElementById("publications-body").innerHTML = ansewrHtml;
			}
			else // show error message
			{
				document.getElementById("publications-body").innerHTML = "<h3>Don't have publication with this filter</h3>"; // should not happen
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
		itemsList = [...new Set(itemsList)];
		var html = "";
		for (var itemIndex = 0; itemIndex < itemsList.length; itemIndex++)
		{
			html += '<option value="' + itemsList[itemIndex] + '">' + itemsList[itemIndex] + '</option>';
		}
		document.getElementById(id).innerHTML += html;
	}
	
	/* end -  help functions  */
}

// run the class build on page load
document.academicPublications = new AcademicPublications();
document.academicPublications.build();

export { AcademicPublications };