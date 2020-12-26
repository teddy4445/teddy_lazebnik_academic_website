google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawStateDistrebution);

function drawStateDistrebution()
{
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'X');
	data.addColumn('number', 'Asymptomatic Infected Adult');
	data.addColumn('number', 'Exposed Adult');
	data.addColumn('number', 'Symptomatic Infected Adult');
	data.addColumn('number', 'Susceptible Adult');
	data.addColumn('number', 'Recovered Adult');
	data.addColumn('number', 'Dead Adult');
	data.addColumn('number', 'Asymptomatic Infected Children');
	data.addColumn('number', 'Exposed Children');
	data.addColumn('number', 'Symptomatic Infected Children');
	data.addColumn('number', 'Susceptible Children');
	data.addColumn('number', 'Recovered Children');
	data.addColumn('number', 'Dead Children');

	data.addRows(sim.statesGraphData);

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
		colors: ['#DB4437', '#aa77cc', '#FF4437', '#0F9D58', '#4285F4', '#140304', '#DB4667', '#aa77cc', '#FF4667', '#0F9E76', '#4492F1', '#140304'],
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
