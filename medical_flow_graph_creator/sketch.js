// ------------------- GLOBAL VARS ------------------------ // 

// canvas Z-Index
var ERROR_VALUE = -1;
var zIndex = 300;
var gridSize = 40;
let fg = null;
var histogramData = [];

// edges
var BLUE_TYPE = 1;
var RED_TYPE = 2;

// nodes
var ORGAN = 1;
var BLOOD_VASSAL = 2;
var MAX_R = 30;


// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup() {
	// set up the simulator in the page
	widthElement = document.getElementById('game-holder').getBoundingClientRect().width;
	var cnv = createCanvas(widthElement, widthElement);
	cnv.parent('game');
	fg = new FlowGraph();
	noCursor();
}

// loop run on the simulation
function draw() 
{
	drawGrid();
	putMouse();
	fg.show();
}


function mouseClicked() 
{
	// find if hiting some node
	var nextToNode = fg.nextToNode(mouseX, mouseY);
	
	if (!keyIsDown(16))
	{
		// check if next to node, if not this is a new node
		if (nextToNode == ERROR_VALUE)
		{
			// add new node
			// TODO: get status from GUI
			fg.add_node(mouseX, mouseY, ORGAN);
		}
		else // picked a node 
		{
			// if this node picked, unpick it
			if (fg.is_node_marked(nextToNode))
			{
				fg.unmark_node(nextToNode);
			}
			else // not a picked node
			{
				// if second node or first
				// TODO: get w and status from GUI
				if (fg.picked_status())
				{
					var pickedIndex = fg.get_picked_node();
					fg.add_edge(pickedIndex, nextToNode, 1, RED_TYPE);
					fg.unmark_node(pickedIndex);
				}
				else
				{
					fg.mark_node(nextToNode);
				}
			}
		}
	}
	else
	{
		// check if next to node, if does - remove it
		if (nextToNode != ERROR_VALUE)
		{
			fg.delete_node(nextToNode);
		}
		else // check if need to delete edge
		{
			fg.try_delete_edge(mouseX, mouseY);
		}
	}
	
	// update stats
	document.getElementById("nodes_count").innerHTML = "" + fg.nodes_count();
	document.getElementById("edges_count").innerHTML = "" + fg.edges_count();
	
	// update graph
	drawHistogram();
}


// print the grid, just to make things nice to show
function drawGrid()
{
	background(0); // make the canvas black
	var boxSize = widthElement / gridSize;
	// make box's lines white
	fill(255);
	stroke(255);
	strokeWeight(1);
	// print - lines 
	for (var index = 0; index < gridSize; index++)
	{
		line(0, boxSize * index, height, boxSize * index);
	}
	// print | lines 
	for (var index = 0; index < gridSize; index++)
	{
		line(boxSize * index, 0, boxSize * index, width);
	}
}

function putMouse()
{
	stroke(255, 204, 0);
	strokeWeight(3);
	line(mouseX - 5, mouseY, mouseX + 5, mouseY);
	line(mouseX, mouseY - 5, mouseX, mouseY + 5);
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