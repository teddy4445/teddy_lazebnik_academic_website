let EMPTY_STAR_CODE = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 226 226" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,226v-226h226v226z" fill="none"></path><g fill="#ffffff"><path d="M113,4.52c-1.86473,0.00162 -3.53712,1.14809 -4.21102,2.8868l-27.87039,71.85211l-76.62813,3.91086c-1.86719,0.09451 -3.48354,1.32871 -4.06653,3.10506c-0.58299,1.77636 -0.01231,3.72832 1.43575,4.91087l59.6693,48.78422l-19.59844,74.02383c-0.4789,1.80371 0.19982,3.71631 1.70858,4.81466c1.50876,1.09835 3.53739,1.15664 5.10673,0.14675l64.45414,-41.36859l64.45414,41.36859c1.56934,1.00989 3.59797,0.9516 5.10673,-0.14675c1.50876,-1.09835 2.18749,-3.01095 1.70858,-4.81466l-19.59844,-74.02383l59.66929,-48.78422c1.44806,-1.18256 2.01874,-3.13452 1.43575,-4.91087c-0.58299,-1.77636 -2.19934,-3.01055 -4.06653,-3.10506l-76.62812,-3.91086l-27.87039,-71.85211c-0.6739,-1.7387 -2.34628,-2.88518 -4.21102,-2.8868zM113,21.5318l24.70992,63.72141c0.64587,1.66252 2.20892,2.78985 3.99031,2.87797l67.84414,3.46945l-52.84516,43.21367c-1.3712,1.12114 -1.96132,2.93979 -1.50961,4.65242l17.36492,65.6018l-57.10914,-36.66321c-1.48951,-0.95805 -3.40128,-0.95805 -4.89078,0l-57.10914,36.66321l17.36492,-65.6018c0.45171,-1.71263 -0.13841,-3.53128 -1.50961,-4.65242l-52.84516,-43.21367l67.84414,-3.46945c1.78139,-0.08812 3.34444,-1.21545 3.99031,-2.87797z"></path></g></g></svg>';
let FULL_STAR_CODE = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 226 226" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,226v-226h226v226z" fill="none"></path><g fill="#ffffff"><path d="M46.104,219.672c-0.904,0 -1.808,-0.452 -2.712,-0.904c-1.356,-0.904 -2.26,-3.164 -1.808,-4.972l19.888,-74.128l-59.664,-48.364c-1.808,-0.904 -2.26,-3.164 -1.808,-4.972c0.452,-1.808 2.26,-3.164 4.068,-3.164l76.84,-4.068l27.572,-71.868c0.904,-1.356 2.712,-2.712 4.52,-2.712c1.808,0 3.616,1.356 4.068,2.712l27.572,71.868l76.84,4.068c1.808,0 3.616,1.356 4.068,3.164c0.452,1.808 0,3.616 -1.356,4.972l-59.664,48.364l19.888,74.128c0.452,1.808 0,3.616 -1.808,4.972c-1.356,0.904 -3.616,1.356 -4.972,0l-64.636,-41.584l-64.636,41.584c-0.904,0.904 -1.356,0.904 -2.26,0.904z"></path></g></g></svg>';

// run the logic
addStarPages();

function addStarPages(need_alert)
{
	let starPages = getCookie("starPages");
	var perant = document.getElementsByClassName("navbar-nav mr-auto")[0];
	var pageStared = false;
	var url_parts = location.href.split("/");
	var thisPageName = "";
	if (url_parts.slice(-1)[0] == "")
	{
		thisPageName = "index"
	}
	else
	{
		thisPageName = url_parts.slice(-1)[0].replace(".html", "");
	}
	
	
	
	if (starPages != "")
	{
		var page_links = starPages.split(",");
		var page_links = starPages.split(",");
		var innerHtmlLiElement = '<li id="star-list" class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" id="starMenu" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Stared</a><div class="dropdown-menu" aria-labelledby="starMenu">';
		for (var i = 0; i < page_links.length; i++)
		{
			var linkAndName = page_links[i].split("|");
			innerHtmlLiElement += '<a class="dropdown-item" href="' + linkAndName[0].trim() + '">' + linkAndName[1].trim() + '</a>';
			
			if (linkAndName.includes(thisPageName))
			{
				pageStared = true;
			}
		}
		innerHtmlLiElement += '</div></li>';
		
		perant.innerHTML += innerHtmlLiElement;
	}
	
	var starCode = "";
	var alertCode = "";
	if (pageStared)
	{
		starCode = '<button class="star-btn" id="star_btn" onclick="return starThisPage(false);"> ' + FULL_STAR_CODE + ' </button>';
		alertCode = '<div class="alert alert-dark cookie-alert" role="alert" id="star_alert"> <strong>Stared:</strong> you have added page "' + thisPageName + '" to your favorite pages on this computer and can be find in the menu .</div>';
	}
	else
	{
		starCode = '<button class="star-btn" id="star_btn" onclick="return starThisPage(true);"> ' + EMPTY_STAR_CODE + ' </button>';
		alertCode = '<div class="alert alert-dark cookie-alert" role="alert" id="star_alert"> <strong>Unstared:</strong> you have removed page "' + thisPageName + '" from your favorite pages on this computer. </div>';
	}
	
	// if mobile or desktop version
	if (getWidth() < 1000)
	{
		document.getElementById("logo").innerHTML += starCode; // mobile 
	}
	else
	{
		perant.innerHTML += starCode; // desktop
	}
	
	if (need_alert)
	{	
		// add alert code as well 
		document.body.innerHTML += alertCode;
		// make it remove after 2 seconds
		setTimeout(() => {
			closeAlert("star_alert");
			setTimeout(() => {
				var star_btn = document.getElementById("star_alert");
				star_btn.parentNode.removeChild(star_btn);}, 500);
		}, 2000);
		
	}
}

function starThisPage(addThisPage)
{
	var cookie_data = getCookie("starPages");
	var url_parts = location.href.replace("https", "http").split("/");
	var thisPageName = "";
	if (url_parts.slice(-1)[0] == "")
	{
		thisPageName = "index"
	}
	else
	{
		thisPageName = url_parts.slice(-1)[0].replace(".html", "");
	}
	var new_page = window.location.href + "|" + thisPageName;
	new_page = new_page.replace("index.html", "");
	if (addThisPage)
	{
		if (cookie_data == "")
		{
			cookie_data = new_page;
		}
		else
		{
			cookie_data += "," + new_page;
		}
	}
	else
	{
		var pages = cookie_data.split(",");
		cookie_data = "";
		for (var i = 0; i < pages.length; i++)
		{
			if (pages[i] != new_page)
			{
				cookie_data += pages[i] + ",";	
			}
		}
		cookie_data = cookie_data.substring(0, cookie_data.length - 1);
	}
	setCookie("starPages", cookie_data, 365);
	
	// delete to make sure we don't have the same thing twice
	var star_btn = document.getElementById("star_btn");
    star_btn.parentNode.removeChild(star_btn);
	try
	{		
		var star_list = document.getElementById("star-list");
		star_list.parentNode.removeChild(star_list);	
	}
	catch (error) {	}
	
	// build right data again
	addStarPages(true);
	return false;
}

function setCookie(cname, cvalue, exdays)
{
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}