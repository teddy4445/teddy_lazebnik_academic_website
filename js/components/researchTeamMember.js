import { Element } from '/js/components/element.js';
class ResearchTeamMember extends Element
{
	constructor(name, title, role, websiteLink, googleLink, linkedinLink)
	{
		super();
		this.name = name;
		this.title = title;
		this.role = role
		this.websiteLink = websiteLink;
		this.googleLink = googleLink;
		this.linkedinLink = linkedinLink;
	}
	
	// convert the object into HTML
	toHtml()
	{
		let html = '<div class="member-card">';

		html += '<div class="member-properties"><img class="member-pesonal-img member-link-icon" src="/img/research/person-image.png" alt="personal-image"><h5 class="member-details">' + this.name + ", " + this.title + '</h5></div>';

		html += '<p class="member-role">' + this.role + '</p>';

		html += '<div class="member-link-icons">';
		
		if (this.websiteLink != "")
		{
			html += '<a href="' + this.websiteLink + '"><img class="member-link-icon" src="/img/research/website.png" alt="personal website"></a>';
		}
		if (this.linkedinLink != "")
		{
			html += '<a href="' + this.linkedinLink + '"><img class="member-link-icon" src="/img/research/google-scholar.png" alt="googel scholar link"></a>';
		}
		if (this.googleLink != "")
		{
			html += '<a href="' + this.googleLink + '"><img class="member-link-icon" src="/img/research/linkedin.png" alt="linkedin link"></a>';
		}
		html += '</div></div>';

		return html;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			answer.push(ResearchTeamMember.createFromJson(jsonObj[publicationIndex]));
		}
		return answer;

	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{	
		return new ResearchTeamMember(jsonObj["name"],
			jsonObj["title"],
			jsonObj["role"],
			jsonObj["websiteLink"], 
			jsonObj["googleLink"], 
			jsonObj["linkedinLink"]);

	}
}
export {ResearchTeamMember};