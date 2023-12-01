import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';

class TeamCard extends Element
{
	constructor(name, title, description, s_date, e_date, image_link, info_link, category_name, order)
	{
		super();
		this.name = name;
		this.title = title;
		this.description = description;
		this.s_date = s_date;
		this.e_date = e_date;
		this.image_link = image_link;
		this.info_link = info_link;
		this.category_name = category_name;
		this.order = order;
	}
	
	// convert the object into HTML
	toHtml()
	{
		var answer = '<div class="academic-papers-panel"><h3 class="blog-title">' 
		+ this.name + '</h3><h4 class="blog-title">' 
		+ this.title + '</h4><p>'
		+ this.description + '</p><div class="personal-row space-between align-items-center mobile-row-breaker"><div class="w-100"><span class="blog-data"> During:'
		+ this.s_date + "-" + this.e_date +  '</span></div><div class="w-100 flex-end align-items-center mobile-row-spacer"><a href="'
		+ this.info_link + '" class="download-btn">Learn more</a></div></div></div>';
		return answer;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			answer.push(TeamCard.createFromJson(jsonObj[publicationIndex]));
		}
		return answer;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new TeamCard(jsonObj["title"],
		jsonObj["description"], 
		jsonObj["s_date"], 
		jsonObj["e_date"], 
		jsonObj["image_link"], 
		jsonObj["category_name"],
		jsonObj["order"]);
	}
	
	// sort according to some property list of this object
	static sortByProperty(ObjList, property)
	{
		return ObjList.sort(function(a, b)
		{
			var x = a[property + ""]; 
			var y = b[property + ""];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}
	
}
export {BlogCard};