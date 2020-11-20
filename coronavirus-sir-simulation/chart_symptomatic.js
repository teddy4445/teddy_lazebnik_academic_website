google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawStateDistrebution);
google.charts.setOnLoadCallback(drawRzeroGraph);

function drawAll()
{
	drawStateDistrebution();
	drawRzeroGraph();
}

function drawStateDistrebution()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Asymptomatic Infected Adult');
	data.addColumn('number', 'Susceptible Adult');
	data.addColumn('number', 'Symptomatic Infected Adult');
	data.addColumn('number', 'Recovered Adult');
	data.addColumn('number', 'Dead Adult');
	data.addColumn('number', 'Asymptomatic Infected Children');
	data.addColumn('number', 'Susceptible Children');
	data.addColumn('number', 'Symptomatic Infected Children');
	data.addColumn('number', 'Recovered Children');
	data.addColumn('number', 'Dead Children');

	data.addRows(stateGraphData);

	var options = {
		height: 500,
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#DB4437', '#0F9D58', '#FF4437', '#4285F4', '#140304', '#DB4667', '#0F9E76', '#FF4667','#4492F1', '#140304'],
        hAxis: {
			title: 'Day'
        },
        vAxis: {
			title: 'Count'
        }
      };

    var chart = new google.visualization.LineChart(document.getElementById('stateGraph'));
	chart.draw(data, options);
}

function drawRzeroGraph()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'R_0');
	data.addColumn('number', 'Outbreak trashold');

	data.addRows(rzeroGraphData);

	var options = {
		height: 300,
		pointSize: 3,
		pointShape: 'circle',
		colors: ['#DE5246', '#000000'],
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Value'
        }
	};
	  
	var chart = new google.visualization.LineChart(document.getElementById('rzeroGraph'));
	chart.draw(data, options);
}
