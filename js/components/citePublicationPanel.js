import { Element } from '/lecture_website_template/js/components/element.js';
import { ActionButton } from '/lecture_website_template/js/components/actionButton.js';

class CitePublicationPanel extends Element
{
	constructor(publication)
	{
		this.publication = publication;
	}
	
	// convert the object into HTML
	toHtml()
	{
		throw new NotImplemented("toHtml");
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		throw new NotImplemented("createListFromJson");
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		throw new NotImplemented("createFromJson");
	}
}
export {PubloationCard};