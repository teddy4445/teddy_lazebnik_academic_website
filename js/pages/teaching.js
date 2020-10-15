// imports 
import { PageRender, retrivedData } from '/js/pageRender.js';
import {CourseCard} from '/js/components/courseCard.js';

// Data file paths
let TAECHING_JSON = "/data/jsons/teaching.json";

// consts 
let default_filter = "All Universities";

/*
	Single instance class to build teaching.html page with dynamic content from JSONS from the server
*/
class Teaching extends PageRender
{
	constructor() 
	{
		super();
        Teaching.loadFileFromServer(TAECHING_JSON, true);
        this.cardList = CourseCard.createListFromJson(retrivedData["coureses"]);
        this.filter = default_filter;
		this.property_university = 'university';
		this.listFilterName = CourseCard.listFilterButtons(this.cardList, this.property_university);
	}
	
    /* biuld function start */
	
	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		// build the page itself
        this.buildHeader(this.filter);
		this.buildBody(this.filter);
    }

	//build the header section of the page
    buildHeader(filterValue = default_filter)
	{
        try
		{
            this.createButtons();
			// highlight the sort button which is active
            document.getElementById("filter-btn-" + filterValue).classList.add("active-sort-button");
        }
        catch (error)
		{
			console.log("Error at Teaching.buildHeader saying: " + error);
		}
    }

	//build the body section of the page, start after the button filter.
    buildBody(filterValue = default_filter)
	{
        // sort the list
		var buildTeachingList = CourseCard.sortByProperty(this.cardList, "year", "semester");

		// if filter needed
		if (filterValue != default_filter)
		{
			// filter the needed list only
			buildTeachingList = CourseCard.filterList(buildTeachingList, this.property_university, filterValue);
		}
		
		// split into the right sets
		var coursesSets = CourseCard.splitByProperty(buildTeachingList, 'year');
		console.log(coursesSets);
		// build the UI //
		try
		{
            if (buildTeachingList.length > 0) 
			{
				var ansewrHtml = "";
				var keys = [];
				for (var spliterKey in coursesSets)
				{
					keys.push(spliterKey);
				}
				keys = keys.sort().reverse();
				
				for (var spliterKeyIndex = 0; spliterKeyIndex < keys.length; spliterKeyIndex++)
				{
					// add spliter 
					ansewrHtml += "<h3>" + keys[spliterKeyIndex] + "</h3>";
					// add elements inside the list
					for (var elementIndex = 0; elementIndex < coursesSets[keys[spliterKeyIndex]].length; elementIndex++)
					{
						ansewrHtml += coursesSets[keys[spliterKeyIndex]][elementIndex].toHtml();
					}
				}
				document.getElementById("teaching-body").innerHTML = ansewrHtml;
            }
			else // show error message
			{
				document.getElementById("teaching-body").innerHTML = "<h3>Don't have courses from universty " + filter + "</h3>";  // should not happen
			}
		}
		catch (error)
		{
			console.log("Error at Teaching.buildBody saying: " + error);
		}

    }
    /* build function end */
    
    //the function create buttons to the filter header section
    createButtons()
	{
        var buttonsDiv = document.getElementById("buttons-filter");
		var buttonsHTML = this.createElementButton(default_filter);
        for (var b = 0; b < this.listFilterName.length; b++)
        {
            buttonsHTML += this.createElementButton(this.listFilterName[b]);
	   	}
		buttonsDiv.innerHTML += buttonsHTML;
	}   
	
	//the function change the filter by the value.
	ChangeFilter(filter_value)
	{
		document.getElementById("filter-btn-" + this.filter).classList.remove("active-sort-button");
		this.filter = filter_value;
		document.getElementById("filter-btn-" + filter_value).classList.add("active-sort-button");
		//build the new body after the filter change.
		this.buildBody(filter_value);
	}
		
	//create a element button 
	createElementButton(nameButton)
	{
		return '<button type="button" class="mobile-buttons-tide" id="filter-btn-' + nameButton + '" onclick="document.teaching.ChangeFilter(\'' + nameButton + '\');">' + nameButton + '</button>';
	}
}

// run the class build on page load
document.teaching = new Teaching();
document.teaching.build();

export { Teaching }