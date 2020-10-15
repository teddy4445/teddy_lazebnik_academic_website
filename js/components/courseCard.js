import { Element } from '/lecture_website_template/js/components/element.js';
import { ActionButton } from '/lecture_website_template/js/components/actionButton.js';

class CourseCard extends Element
{
	constructor(name, code, year, semester, university, description)
	{
		super();
		this.name = name;
		this.code = code;
		this.year = year;
        this.semester = semester;
        this.university = university;
		this.description = description;
    }
	
	// convert the object into HTML
	toHtml()
	{
		var answer = '<p> Semster ' 
		+ this.semester + '</p><div class="academic-papers-panel"><h3>' 
		+ this.name +' <small>(' 
		+ this.code + ')</small> </h3><p style=\"color:black;\">'
		+ this.description + '<br>'
		+ this.university +'</p> <div class="personal-row space-between"><div class="w-100 flex-end"><a href="/course-page.html?course='
		+ this.name.trim().replaceAll('\ ', '') + '" class="download-btn">Course Page</a></div></div></div>';
		return answer;
	}

    // build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var listCourse = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			listCourse.push(CourseCard.createFromJson(jsonObj[publicationIndex]));
		}
		return listCourse;
	}
	
    // build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new CourseCard(jsonObj["name"],
		jsonObj["code"], 
		jsonObj["year"], 
        jsonObj["semester"], 
        jsonObj["university"],
        jsonObj["description"],);
    }

    // sort according to some property list of this object
	static sortByProperty(ObjList, propertyA, propertyB)
	{
		return ObjList.sort(function(a, b)
		{
			var x = a[propertyA + ""]; 
			var y = b[propertyA + ""];
		
			if (x === y) {
				// propertyB is only important when propertyA are the same
				return b[propertyB + ""] - a[propertyB + ""];
			 }
			 return ((x < y) ? 1 : -1);
		});
	}
	
    // filter the list according to some property and value
	static filterList(objList, property, filterValue)
	{
		var answer = [];
		for (var objIndex = 0; objIndex < objList.length; objIndex++)
		{
			if (objList[objIndex][property + ""] == filterValue)
			{
				answer.push(objList[objIndex]);
			}
		}
		return answer;
	}
	
	// split list into list of lists according to some property
	static splitByProperty(ObjList, property)
	{
		var answer = {};
		var spliter = ObjList[0][property + ""];
		var subGroup = [ObjList[0]];
		for (var publicationIndex = 1; publicationIndex < ObjList.length; publicationIndex++)
		{
			if (ObjList[publicationIndex][property + ""] != spliter)
			{
				answer[spliter] = [...subGroup];
				spliter = ObjList[publicationIndex][property + ""];
				subGroup = [ObjList[publicationIndex]];
			}
			else
			{
				subGroup.push(ObjList[0]);
			}
		}
		answer[spliter] = [...subGroup];
		return answer;
	}
	
	//create list of the name of the buttons 
	static listFilterButtons(objList,property)
	{
        var answer = [];
        for (var objIndex = 0; objIndex < objList.length; objIndex++)
        {
            if (!answer.includes(objList[objIndex][property+""]))
            {
                answer.push(objList[objIndex][property+""]);
            }
		}
        return answer;
    }
}
export {CourseCard};
	