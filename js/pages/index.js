// imports 
import { PageRender, retrivedData } from '/lecture_website_template/js/pageRender.js';
import { PublicationCard } from '/lecture_website_template/js/components/publicationCard.js';
import { ProjectPanel } from '/lecture_website_template/js/components/projectPanel.js';

// Data file paths
let UPDATES_TEXT = "/lecture_website_template/data/notifications.txt"
let LECTURE_INFO_JSON = "/lecture_website_template/data/jsons/lecturer.json";
let INDEX_JSON = "/lecture_website_template/data/jsons/index.json";

let INFO_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0055 8.66707C12.672 8.66707 13.2143 8.12545 13.2143 7.45974C13.2143 6.79162 12.672 6.24805 12.0055 6.24805C11.3389 6.24805 10.7966 6.79162 10.7966 7.45974C10.7966 8.12545 11.3388 8.66707 12.0055 8.66707Z" fill="#5A67D8"/><path d="M14.1509 16.643H12.8655V11.8246C12.8655 11.3496 12.4805 10.9645 12.0054 10.9645H9.86009C9.38509 10.9645 9 11.3496 9 11.8246C9 12.2996 9.38509 12.6847 9.86009 12.6847H11.1454V17.503C11.1454 17.978 11.5305 18.3631 12.0055 18.3631H14.151C14.6261 18.3631 15.0111 17.978 15.0111 17.503C15.011 17.028 14.626 16.643 14.1509 16.643Z" fill="#5A67D8"/><path d="M12.0001 0C5.38312 0 0 5.38312 0 11.9998C0 18.6165 5.38312 23.9998 12.0001 23.9998C18.6169 23.9998 24 18.6167 24 11.9998C24 5.383 18.6168 0 12.0001 0ZM12.0001 22.2796C6.33162 22.2796 1.72018 17.6681 1.72018 11.9998C1.72018 6.33151 6.33162 1.72006 12.0001 1.72006C17.6685 1.72006 22.2798 6.33151 22.2798 11.9998C22.2798 17.6681 17.6684 22.2796 12.0001 22.2796Z" fill="#5A67D8"/></svg>';

/*
	Single instance class to build Index page with dynamic content from JSONS from the server
*/
class Index  extends PageRender
{
	constructor()
	{
		
	}
	
	// just gather all the build of all the sections in the page - one per call to the server side
	static build()
	{
		Index.buildeNotifications();
		Index.buildePersonalPanel();
		Index.buildePageContent();
	}
	
	/* build section functions */
	
	static buildeNotifications()
	{
		var container_id = "update-container";
		try
		{
			Index.loadFileFromServer(UPDATES_TEXT);
			var txtObj = retrivedData;
			var notificationLines = txtObj.split("\n");
			
			var notificationHtml = "";
			if (notificationLines.length > 0)
			{
				for (var notificationIndex = 0; notificationIndex < notificationLines.length; notificationIndex++)
				{
					notificationHtml += '<div class="carousel-cell"><div class="update-panel"><div class="update-text">' + notificationLines[notificationIndex] + '</div></div></div>';
				}
				document.getElementById("updates-panel").innerHTML = notificationHtml;
				
				if (notificationLines.length == 1)
				{
					setTimeout(function() 
					{
						  var flickity_button = document.getElementsByClassName("flickity-button");
						  for (var i = 0; i < flickity_button.length; i++) 
						  {
							  flickity_button[i].style.display = "none";
						  }
						  var flickity_dots = document.getElementsByClassName("flickity-page-dots");
						  for (var i = 0; i < flickity_dots.length; i++) 
						  {
							  flickity_dots[i].style.display = "none";
						  }
					}, 10);
				}
			}
			else
			{
				document.getElementById(container_id).style.display = "none";
			}
		}
		catch (error)
		{
			console.log("Error at Index.buildeNotifications saying: " + error);
			document.getElementById("update-container").style.display = "none";
		}
	}
	
	static buildePersonalPanel()
	{
		var container_id = "personal_container";
		try
		{
			Index.loadFileFromServer(LECTURE_INFO_JSON, true);
			var jsonObj = retrivedData;
			document.getElementById("lecture_position").innerHTML = jsonObj["position"];
			var addressesHtml = "";
			for (var locIndex = 0; locIndex < jsonObj["addresses"].length; locIndex++)
			{
				if (locIndex == 0)
				{
					addressesHtml += "<p><span>" + INFO_ICON + "</span> " + jsonObj["addresses"][locIndex] + "</p>";
				}
				else
				{
					addressesHtml += "<p> " + jsonObj["addresses"][locIndex] + "</p>";					
				}
			}
			document.getElementById("lecture_address").innerHTML += addressesHtml;
			document.getElementById("lecture_phone").innerHTML += jsonObj["phone"];
			document.getElementById("lecture_email").innerHTML += jsonObj["email"];
			
			
			document.getElementById("social-linkedin").href = jsonObj["linkedin_link"];
			document.getElementById("social-google-scholar").href = jsonObj["google_scholar_link"];
			
			// TODO: as list not single string
			// document.getElementById("research_intrests").innerHTML = jsonObj["field"];
		}
		catch (error)
		{
			console.log("Error at Index.buildePersonalPanel saying: " + error);
			document.getElementById(container_id).style.display = "none";
		}
	}
	
	static buildePageContent()
	{
		try
		{
			Index.loadFileFromServer(INDEX_JSON, true);
			var jsonObj = retrivedData;
			
			// Biography
			document.getElementById("biography").innerHTML = jsonObj["biography"];
			
			// Featured Publications
			var researchInterestsHtml = "";
			for (var intrestIndex = 0; intrestIndex < jsonObj["researchInterests"].length; intrestIndex++)
			{
				researchInterestsHtml += '<div class="intrest-item"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.6667 12.2733C22.313 12.2733 21.9739 12.4138 21.7239 12.6639C21.4738 12.9139 21.3333 13.253 21.3333 13.6067V21.0333C21.3333 21.2455 21.249 21.449 21.099 21.599C20.949 21.749 20.7455 21.8333 20.5333 21.8333H3.46667C3.25449 21.8333 3.05101 21.749 2.90098 21.599C2.75095 21.449 2.66667 21.2455 2.66667 21.0333V3.96667C2.66667 3.75449 2.75095 3.55101 2.90098 3.40098C3.05101 3.25095 3.25449 3.16667 3.46667 3.16667H16.2267C16.5803 3.16667 16.9194 3.02619 17.1695 2.77614C17.4195 2.52609 17.56 2.18696 17.56 1.83333C17.56 1.47971 17.4195 1.14057 17.1695 0.890524C16.9194 0.640476 16.5803 0.5 16.2267 0.5H3.46667C2.54833 0.503512 1.66861 0.869877 1.01924 1.51924C0.369877 2.16861 0.00351184 3.04833 0 3.96667V21.0333C0.00351184 21.9517 0.369877 22.8314 1.01924 23.4808C1.66861 24.1301 2.54833 24.4965 3.46667 24.5H20.5333C21.4517 24.4965 22.3314 24.1301 22.9808 23.4808C23.6301 22.8314 23.9965 21.9517 24 21.0333V13.6067C24 13.253 23.8595 12.9139 23.6095 12.6639C23.3594 12.4138 23.0203 12.2733 22.6667 12.2733Z" fill="#5A67D8"/><path d="M10.2933 11.1667C10.0431 10.9416 9.7171 10.8196 9.38063 10.8249C9.04417 10.8302 8.72217 10.9626 8.47921 11.1954C8.23626 11.4282 8.09033 11.7443 8.07069 12.0802C8.05106 12.4162 8.15917 12.7471 8.37334 13.0067L11.3333 16.1133C11.4573 16.2433 11.6062 16.347 11.7711 16.418C11.9361 16.489 12.1137 16.526 12.2933 16.5267C12.472 16.5277 12.649 16.4928 12.8139 16.4241C12.9789 16.3554 13.1283 16.2543 13.2533 16.1267L22.2933 6.79333C22.4159 6.66726 22.5124 6.51828 22.5774 6.35491C22.6424 6.19153 22.6746 6.01695 22.6721 5.84114C22.6697 5.66533 22.6326 5.49172 22.563 5.33024C22.4934 5.16876 22.3927 5.02256 22.2667 4.89999C22.1406 4.77743 21.9916 4.68089 21.8282 4.6159C21.6649 4.55091 21.4903 4.51873 21.3145 4.52121C21.1387 4.52368 20.9651 4.56076 20.8036 4.63033C20.6421 4.6999 20.4959 4.80059 20.3733 4.92666L12.3067 13.2733L10.2933 11.1667Z" fill="#5A67D8"/></svg>' + jsonObj["researchInterests"][intrestIndex] + '</div>';
			}
			document.getElementById("research_intrests").innerHTML = researchInterestsHtml;
			
			// Featured Publications
			var featuredPublicationsHtml = "";
			for (var pubIndex = 0; pubIndex < jsonObj["featuredPublications"].length; pubIndex++)
			{
				featuredPublicationsHtml += PublicationCard.createFromJson(jsonObj["featuredPublications"][pubIndex]).toHtml();
			}
			document.getElementById("featured_publications").innerHTML = featuredPublicationsHtml;
			
			// Current Projects
			var currentProjectsHtml = "";
			for (var projIndex = 0; projIndex < jsonObj["currentProjects"].length; projIndex++)
			{
				currentProjectsHtml += ProjectPanel.createFromJson(jsonObj["currentProjects"][projIndex]).toHtml();
			}
			document.getElementById("current_projects").innerHTML = currentProjectsHtml;
			
			// egde case - no data, remove sections
			if (jsonObj["researchInterests"].length == 0)
			{
				document.getElementById("research_intrests").style.display = "none";
				document.getElementById("research_intrests_header").style.display = "none";
			}
			if (jsonObj["featuredPublications"].length == 0)
			{
				document.getElementById("featured_publications_header").style.display = "none";
			}
			if (jsonObj["current_projects_header"].length == 0)
			{
				document.getElementById("featured_publications_header").style.display = "none";
			}
		}
		catch (error)
		{
			console.log("Error at Index.buildePageContent saying: " + error);
		}
	}
	
	/* end -  build sections functions */
}

// run the class build on page load
Index.build();

export { Index };