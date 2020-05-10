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
				window.open(document.getElementById(this.id + "_href").innerHTML, "_blank");
			}, 1000);
		})
	}
})

window.onscroll = function (){
	let progressHeight = (window.pageYOffset / totalHeight) * 100;
	progress.style.height = progressHeight + "%";
};

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