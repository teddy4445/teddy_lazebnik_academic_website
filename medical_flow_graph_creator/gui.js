const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function changeNodeStatus()
{
	var e = document.getElementById("node_type");
	NODE_STATUS = e.options[e.selectedIndex].value;
}

function setOrganNodeSettings()
{
	var organ_name = document.getElementById("organ_name").value;
	var lip = document.getElementById("lip").value;
	var ts = document.getElementById("ts").value;
	
	if (organ_name == "" || lip == "" || ts == "")
	{
		alert("Fill all the needed data");
		return false;
	}
	
	$('#organ_add_panel').hide();
	ORGAN_PANEL_OPEN = false;
	setTimeout(function(){ IS_PANEL_OPEN = false; }, 20);
	loop();
	return true;
}


function keyPressed() 
{
	// if panel open, ignore short keys
	if (IS_PANEL_OPEN)
	{
		return;
	}
	
	if (keyCode === 79) // code of 'O'
	{
		document.getElementById("node_type").selectedIndex = 0;
		NODE_STATUS = "o";
	}
	
	if (keyCode === 66) // code of 'b'
	{
		document.getElementById("node_type").selectedIndex = 1;
		NODE_STATUS = "b";
	}
	
	if (keyCode === 83) // code of 's'
	{
		downloadasTextFile("fg_save_version.txt", JSON.stringify(fg));
		downloadasTextFile("fg_py_code.txt", fg.to_string());
	}
	
	if (keyCode === 76) // code of 'l'
	{
		$('#load_data_file').show();
		IS_PANEL_OPEN = true;
	}
}

// download a .txt file into your computer
function downloadasTextFile(filename, text) 
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);	
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();	
	document.body.removeChild(element);
}

function closeLoadModelPanel()
{
	$('#load_data_file').hide();
	IS_PANEL_OPEN = false;
}

$(document).on('change', '#fg_load_file', function(event) 
{
  var reader = new FileReader();

  reader.onload = function(event) 
  {
	  fg = FlowGraph.from_json(JSON.parse(event.target.result));
  }

	reader.readAsText(event.target.files[0]);
	$('#load_data_file').hide();
	IS_PANEL_OPEN = false;	
});