let EMPTY_STAR_CODE = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 226 226" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,226v-226h226v226z" fill="none"></path><g fill="#ffffff"><path d="M113,4.52c-1.86473,0.00162 -3.53712,1.14809 -4.21102,2.8868l-27.87039,71.85211l-76.62813,3.91086c-1.86719,0.09451 -3.48354,1.32871 -4.06653,3.10506c-0.58299,1.77636 -0.01231,3.72832 1.43575,4.91087l59.6693,48.78422l-19.59844,74.02383c-0.4789,1.80371 0.19982,3.71631 1.70858,4.81466c1.50876,1.09835 3.53739,1.15664 5.10673,0.14675l64.45414,-41.36859l64.45414,41.36859c1.56934,1.00989 3.59797,0.9516 5.10673,-0.14675c1.50876,-1.09835 2.18749,-3.01095 1.70858,-4.81466l-19.59844,-74.02383l59.66929,-48.78422c1.44806,-1.18256 2.01874,-3.13452 1.43575,-4.91087c-0.58299,-1.77636 -2.19934,-3.01055 -4.06653,-3.10506l-76.62812,-3.91086l-27.87039,-71.85211c-0.6739,-1.7387 -2.34628,-2.88518 -4.21102,-2.8868zM113,21.5318l24.70992,63.72141c0.64587,1.66252 2.20892,2.78985 3.99031,2.87797l67.84414,3.46945l-52.84516,43.21367c-1.3712,1.12114 -1.96132,2.93979 -1.50961,4.65242l17.36492,65.6018l-57.10914,-36.66321c-1.48951,-0.95805 -3.40128,-0.95805 -4.89078,0l-57.10914,36.66321l17.36492,-65.6018c0.45171,-1.71263 -0.13841,-3.53128 -1.50961,-4.65242l-52.84516,-43.21367l67.84414,-3.46945c1.78139,-0.08812 3.34444,-1.21545 3.99031,-2.87797z"></path></g></g></svg>';
let FULL_STAR_CODE = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 226 226" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,226v-226h226v226z" fill="none"></path><g fill="#ffffff"><path d="M46.104,219.672c-0.904,0 -1.808,-0.452 -2.712,-0.904c-1.356,-0.904 -2.26,-3.164 -1.808,-4.972l19.888,-74.128l-59.664,-48.364c-1.808,-0.904 -2.26,-3.164 -1.808,-4.972c0.452,-1.808 2.26,-3.164 4.068,-3.164l76.84,-4.068l27.572,-71.868c0.904,-1.356 2.712,-2.712 4.52,-2.712c1.808,0 3.616,1.356 4.068,2.712l27.572,71.868l76.84,4.068c1.808,0 3.616,1.356 4.068,3.164c0.452,1.808 0,3.616 -1.356,4.972l-59.664,48.364l19.888,74.128c0.452,1.808 0,3.616 -1.808,4.972c-1.356,0.904 -3.616,1.356 -4.972,0l-64.636,-41.584l-64.636,41.584c-0.904,0.904 -1.356,0.904 -2.26,0.904z"></path></g></g></svg>';

// run the logic
onPageLoad();

const buttons = document.querySelectorAll('button');
let rippleCounter = 0;
buttons.forEach(btn => {
	if (btn.classList.contains("cool-btn"))
	{
		btn.addEventListener('click', function(e){
			let x = e.clientX - e.offsetHeight; //- e.target.offsetLeft * 2;
			let y = e.clientY - e.offsetWidth; //- e.target.offsetTop;
			
			let ripples = document.createElement('span');
			ripples.style.left = x + "px";
			ripples.style.top = y + "px";
			ripples.classList.add("ripple");
			this.appendChild(ripples);
			
			setTimeout(() => {
				ripples.remove();
				var btn_link = document.getElementById(this.id + "_href").innerHTML;
				if (btn_link != "#" && btn_link != "")
				{
					window.open(btn_link, "_blank");
				}
			}, 1000);
		})
	}
});

function onPageLoad()
{
	if (getWidth() < 440)
	{
		document.getElementById("logo").innerHTML = "T. Lazebnik";
	}
	
	let see_cookies = getCookie("seeCookieMessage");
	if (see_cookies == "")
	{
		setCookie("seeCookieMessage", true, 7);
		opacityAnimation("cookie-box", 250, true);
	}
	// try to add notification panel
	loadNotificationBar();
}

/* notification panel on mian pages */
function loadNotificationBar()
{	
	// check if needed 
	if (document.getElementById("notification-panel") == null)
	{
		return;
	}
	
	// get the data from the file 
	var client;
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest)
	{
		client = new XMLHttpRequest();
	}
	else // code for IE6, IE5
	{
		client = new ActiveXObject("Microsoft.XMLHTTP");
	}
	client.onreadystatechange  = notificationHandler;
	client.open("GET", "../notifications.txt", false);
	client.send();
}

function notificationHandler() 
{
	if (this.readyState == 4)
	{
		if(this.status == 200 && this.responseText != null )
		{
			buildNotificationUI(this.responseText.split("\n"), true);
		} 
		else 
		{
			buildNotificationUI(this.status, false);
		}
	}
}

function buildNotificationUI(notifications, is_ok)
{
	var notfi_panel = document.getElementById("notification-panel");
	var notfi_html = '<div class="notification-panel">';
	// set notifications or error message
	if (is_ok)
	{
		// build the panel
		for (var i = 0; i < notifications.length; i++)
		{
			notfi_html += '<div class="notification"><p>' + notifications[i].trim().replace("script", "") + '</p></div>'; // the replace is to avoid JS injection in the original file
		}
	}
	else
	{
		notfi_html += "<p> Error with status " + notifications + " while trying to retrive notifications - please inform the owner of the site regarding this error... </p>";
	}
	// set the content into the panel
	notfi_html += '</div>';
	notfi_panel.innerHTML = notfi_html;
}
/* end - notification panel on mian pages */


$(function () {
  $('[data-toggle="popover"]').popover()
})

function containsName(name, nameList)
{
	for (var i = 0; i < nameList.length; i++)
	{
		if (name.includes(nameList[i]))
		{
			return true;
		}
	}
	return false;
}

function closeSearchAlert(){
	closeAlert("error-search");
}

function closeAlert(alertID)
{
	opacityAnimation(alertID, 250, false);
}

function opacityAnimation(element_id, miliseconds, is_show = true) {
	try
	{	
	  var elem = document.getElementById(element_id);
	  var FPMS = 10;
	  var frameCount = Math.floor(miliseconds / FPMS);
	  var frameIndex = 0;
	  if (is_show)
	  {
		document.getElementById(element_id).style.opacity = 0;
	  }
	  else
	  {
		document.getElementById(element_id).style.opacity = 1;
	  }
	  document.getElementById(element_id).style.display = "";
	  var id = setInterval(frame, FPMS);	
	}
	catch (error)
	{
		console.log("Error at 'opacityAnimation' saying: " + error);
	}
	  function frame() {
		  try
		  {
			if (frameIndex == frameCount) {
			  clearInterval(id);
			  if (!is_show)
			  {
				document.getElementById(element_id).style.display = "none";  
			  }
			} else {
			  if (is_show)
			  {
				elem.style.opacity = frameIndex / frameCount;
			  }
			  else
			  {
				  elem.style.opacity = 1 - (frameIndex / frameCount);   
			  }
			}
			frameIndex++;  
		  }
		  catch (error)
		  {
			  console.log("Error at 'opacityAnimation -> frame' saying: " + error);
		  }
	  }
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

function getWidth()
{
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth
	  );
}