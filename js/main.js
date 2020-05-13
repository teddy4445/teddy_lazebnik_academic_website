// run the logic
onPageLoad();

let progress = document.getElementById("progressBar");
let totalHeight = document.body.scrollHeight - window.innerHeight;
progress.style.height = "0%";

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

window.onscroll = function (){
	let progressHeight = (window.pageYOffset / totalHeight) * 100;
	progress.style.height = progressHeight + "%";
};

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

function onPageLoad()
{
	let visitCount = getCookie("VisitFlag");
	if (visitCount == "")
	{
		setCookie("VisitFlag", 1, 365);
		visitCount = "1";
	}
	else
	{
		setCookie("VisitFlag", parseInt(visitCount) + 1, 365);
	}
	visitCount = parseInt(visitCount);
	// write the answer 
	let answerString = "";
	if (visitCount == 1){
		answerString = "* This is your first time here, nice to meet you";
	}
	else if (visitCount == 2){
		answerString = "* This is your second time here, are you looking for something spesific?";
	}
	else if (visitCount == 3){
		answerString = "* Need something spesific? Just write me and let's descuess that...";
	}
	else if (visitCount > 3){
		answerString = "* You are visiting a lot. Write me and maybe I would be able to help.";
	}
	try
	{
		document.getElementById("VisitCount").innerHTML = answerString;	
	}
	catch (error)
	{
		
	}
	
	if (getWidth() < 440)
	{
		document.getElementById("logo").innerHTML = "T. Lazebnik";
	}
}

function searchPage()
{
	var pageName = document.getElementById("search-data").value;
	pageName = pageName.toLowerCase().trim();
	
	var pageLink = "";
	
	if (pageName == "")
	{
		return;
	}
	else if (containsName(pageName, ["home", "bio", "main"]))
	{
		pageLink = "index.html";
	}
	else if (containsName(pageName, ["public", "paper", "research", "conference", "abstract"]))
	{
		pageLink = "publications.html";
	}
	else if (containsName(pageName, ["student", "chen", "shira", "tamar", "pedro"]))
	{
		pageLink = "students.html";
	}
	else if (containsName(pageName, ["code", "project", "open", "blog", "story"]))
	{
		pageLink = "opensource.html";
	}
	else if (containsName(pageName, ["teach", "course", "semester", "learn"]))
	{
		pageLink = "teaching.html";
	}
	else if (containsName(pageName, ["rivendell", "tolkin"]))
	{
		pageLink = "http://rivendell.cs.biu.ac.il/";
	}
	else if (containsName(pageName, ["dnc", "algo", "company"]))
	{
		pageLink = "http://dnc-algo.com/";
	}
	else if (containsName(pageName, ["gal", "kaminka", "advisor"]))
	{
		pageLink = "http://u.cs.biu.ac.il/~galk/";
	}
	else if (containsName(pageName, ["maverick", "group"]))
	{
		pageLink = "http://u.cs.biu.ac.il/~galk/maverick/";
	}
	else if (containsName(pageName, ["hana", "weitman"]))
	{
		pageLink = "https://physics.biu.ac.il/en/node/1384";
	}
	else if (containsName(pageName, ["dl", "deep"]))
	{
		pageLink = "courses/deep_leanring.html";
	}
	else if (containsName(pageName, ["numeric", "analy"]))
	{
		pageLink = "courses/tools_numerical_analysis.html";
	}
	else if (containsName(pageName, ["optim", "line"]))
	{
		pageLink = "courses/linear_mathematical_optimization.html";
	}
	else
	{
		opacityAnimation("error-search", 250, true);
		return false;
	}
	document.getElementById("search-data").value = "";
	window.open(pageLink);
	return false;
}

function closeSearchAlert(){
	opacityAnimation("error-search", 250, false);
}

function opacityAnimation(element_id, miliseconds, is_show = true) {
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
  function frame() {
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