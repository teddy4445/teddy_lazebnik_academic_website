
docts = [];
var doc1 = {
    "id": 1,
    "title": "Oracle released its latest database Oracle 12g",
    "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
};
docs.push(doc1);

var doc2 = {
    "id": 2,
    "title": "Oracle released its latest database Oracle 12g",
    "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
};
docs.push(doc2);


var index = elasticlunr(function () {
    this.addField('title');
    this.addField('body');
    this.setRef('id');
});

for (var i = 0; i < docs.length; i++)
{
	index.addDoc(docs[i]);	
}

function searchPageNew()
{
	var pageName = getQuery();
	if (pageName == "")
	{
		return false;
	}
}

function update_search_results()
{
	// TODO: finish here
}

function searchPage()
{
	
	var pageName = getQuery();
	if (pageName == "")
	{
		return false;
	}
	
	var pageLink = "";
	if (containsName(pageName, ["home", "bio", "main", "teddy", "lazebnik"]))
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
	else if (containsName(pageName, ["gal", "kaminka", "advisor", "prof"]))
	{
		pageLink = "http://u.cs.biu.ac.il/~galk/";
	}
	else if (containsName(pageName, ["maverick", "group", "robotics"]))
	{
		pageLink = "http://u.cs.biu.ac.il/~galk/maverick/";
	}
	else if (containsName(pageName, ["hana", "weitman", "dr"]))
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
	else if (containsName(pageName, ["nano", "medical", "medical"]))
	{
		pageLink = "https://www.linkedin.com/pulse/daily-issues-solutions-nano-bioinformatic-research-teddy-lazebnik/";
	}
	else if (containsName(pageName, ["ode", "pde", "bcg"]))
	{
		pageLink = "summeries/bcg_pde_10_eq_paper.html";
	}
	else if (containsName(pageName, ["linkedin", "social"]))
	{
		pageLink = "https://www.linkedin.com/in/teddy-lazebnik/";
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

function getQuery()
{
	var pageName = document.getElementById("search-data").value;
	var pageName2 = document.getElementById("search-data-2").value;
	pageName = pageName.toLowerCase().trim();
	pageName2 = pageName2.toLowerCase().trim();
	
	if (pageName == "" && pageName2 == "")
	{
		return "";
	}
	else if (pageName == "" && pageName2 != "" )
	{
		pageName = pageName2;
	}

	return pageName;
}