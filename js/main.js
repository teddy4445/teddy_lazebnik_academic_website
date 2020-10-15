// add header and footer to each page

// init all the objects needed //
let client;
let thisPage = location.href.split("/").slice(-1)[0];
if (thisPage == "")
{
	thisPage = "index";
}
// end - init all the objects needed //

// run this method on page load 
onPageLoad();

// the function to run on page load to build dynamic components that does not change often or not render in SEO lookups
function onPageLoad()
{
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest)
	{
		client = new XMLHttpRequest();
	}
	else // code for IE6, IE5
	{
		client = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// perform all the preparation actions needed  //
	loadHeader();
	loadFooter();
	activeMenuLink();
	manageCollapsible();
}

// load the HTML of the header from the right file and put in the right location
function loadHeader()
{	
	client.onreadystatechange  = HeaderHandler;
	client.open("GET", "/components/header.html", false);
	client.send();
}

function HeaderHandler() 
{
	if (this.readyState == 4 && this.status == 200 && this.responseText != null)
	{
		document.getElementById("header").innerHTML = this.responseText;
	}
}

// load the HTML of the header from the right file and put in the right location
function loadFooter()
{		
	client.onreadystatechange  = FooterHandler;
	client.open("GET", "/components/footer.html", false);
	client.send();
}

function FooterHandler() 
{
	if (this.readyState == 4 && this.status == 200 && this.responseText != null)
	{
		document.getElementById("footer").innerHTML = this.responseText;
	}
}

// mark the right menu link as active
function activeMenuLink()
{
	$('.menu a').each(function() 
	{
		if ($(this).attr('id') == thisPage)
		{
			$(this).addClass('active'); 
		}
	});
}

// manage collapsible
// taken from w3school: https://www.w3schools.com/howto/howto_js_collapsible.asp
function manageCollapsible() {
	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			for (let j = 0; j < coll.length; j++) {
				// close all other active menus
				if(this == coll[j]) { // skip the current menu
					continue;
				} else {
					// check if the menu is active
					if(coll[j].classList.contains("active")) {
						// toggle the active class and close the menu
						coll[j].classList.toggle("active");
						var content = $(coll[j]).find("div")[0];
						content.style.maxHeight = null;
						content.style.opacity = null;
					}
				}
			}

			// expand the current menu
			this.classList.toggle("active");
			var content = $(this).find("div")[0];
			if (content.style.maxHeight){
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + "px";
			}

			// change opacity of the menu
			if (content.style.opacity) {
				content.style.opacity = null;
			} else {
				content.style.opacity = 1;
			}
			
		});
	}
}

// close header mobile menu on click outside the menu
document.getElementById("mobile-menu-bg").onclick = function() { 
	document.getElementById('mobile-menu').style.marginLeft = '-320px';
	document.getElementById('mobile-menu-bg').style.marginLeft = '100%';
};

document.getElementById('mobile-menu').onclick = function(e) { 
	e.stopPropagation();
};


/* help functions */

// TODO: duplicated of pageRender method - delete later
function loadJSON(callback) 
{   
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () 
	{
		if (xobj.readyState == 4 && xobj.status == "200") 
		{
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);  
}

// cookie related functions // 

function setCookie(cname, cvalue, exdays)
{
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 8640000)); // 24 * 60 * 60 * 1000 = 8640000
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) 
	{
		var c = ca[i];
		while (c.charAt(0) == ' ') 
		{
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) 
		{
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

// end - cookie related functions // 

/* end - help functions */