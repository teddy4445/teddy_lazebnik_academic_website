google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawStateDistrebution);
google.charts.setOnLoadCallback(drawRzeroGraph);
google.charts.setOnLoadCallback(drawInfectionGraph);

function drawAll()
{
	drawStateDistrebution();
	drawRzeroGraph();
	drawInfectionGraph();
}


function drawInfectionGraph() 
{
	let total_infections = home_infections + work_infections + school_infections;
	var data = google.visualization.arrayToDataTable([
		['Element', 'Density'],
		['Home', home_infections/total_infections],
		['Work', work_infections/total_infections],
		['School', school_infections/total_infections]
	]);
	
	var options = {
		title: 'Distribution Of Infection Over Locations',
        hAxis: {
			title: 'Location'
        },
        vAxis: {
			'minValue': 0, 
			'maxValue': 1	,
			title: 'Infection Percent'
        }
	};
	
	var chart = new google.visualization.ColumnChart(document.getElementById('infectionGraph'));
	chart.draw(data, options);
}

function drawStateDistrebution()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Asymptomatic Infected Adult');
	data.addColumn('number', 'Symptomatic Infected Adult');
	data.addColumn('number', 'Susceptible Adult');
	data.addColumn('number', 'Recovered Adult');
	data.addColumn('number', 'Dead Adult');
	data.addColumn('number', 'Asymptomatic Infected Children');
	data.addColumn('number', 'Symptomatic Infected Children');
	data.addColumn('number', 'Susceptible Children');
	data.addColumn('number', 'Recovered Children');
	data.addColumn('number', 'Dead Children');

	data.addRows(stateGraphData);

	var options = {
		height: 500,
		pointSize: 6,
		pointShape: 'circle',
        hAxis: {
			title: 'Day'
        },
        vAxis: {
			title: 'Count'
        },
		colors: ['#DB4437', '#FF4437', '#0F9D58', '#4285F4', '#140304', '#DB4667', '#FF4667', '#0F9E76', '#4492F1', '#140304'],
		series: {
			0: { lineDashStyle: [4, 4] },
			1: { lineDashStyle: [4, 4] },
			2: { lineDashStyle: [4, 4] },
			3: { lineDashStyle: [4, 4] },
			4: { lineDashStyle: [4, 4] },
			5: { lineDashStyle: [1, 1] },
			6: { lineDashStyle: [1, 1] },
			7: { lineDashStyle: [1, 1] },
			8: { lineDashStyle: [1, 1] },
			9: { lineDashStyle: [1, 1] }
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
	data.addColumn('number', 'Outbreak threshold');

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
        },
		series: {
			1: { lineDashStyle: [4, 4] }
		}
	};
	  
	var chart = new google.visualization.LineChart(document.getElementById('rzeroGraph'));
	chart.draw(data, options);
}
