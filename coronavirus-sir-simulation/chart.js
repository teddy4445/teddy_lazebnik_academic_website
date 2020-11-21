google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawStateDistrebution);


function drawStateDistrebution()
{

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Infected Adult');
      data.addColumn('number', 'Susceptible Adult');
      data.addColumn('number', 'Recovered Adult');
      data.addColumn('number', 'Dead Adult');
      data.addColumn('number', 'Infected Children');
      data.addColumn('number', 'Susceptible Children');
      data.addColumn('number', 'Recovered Children');
      data.addColumn('number', 'Dead Children');

      data.addRows(stateGraphData);

      var options = {
		height: 300,
		pointSize: 6,
		pointShape: 'circle',
		colors: ['#DB4437', '#0F9D58', '#4285F4', '#140304', '#eb1d0c', '#1aba7d', '#73a0eb', '#0f0102'],
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Count'
        },
		series: {
			0: { lineDashStyle: [4, 4] },
			1: { lineDashStyle: [4, 4] },
			2: { lineDashStyle: [4, 4] },
			3: { lineDashStyle: [4, 4] },
			4: { lineDashStyle: [1, 1] },
			5: { lineDashStyle: [1, 1] },
			6: { lineDashStyle: [1, 1] },
			7: { lineDashStyle: [1, 1] }
		}
      };

      var chart = new google.visualization.LineChart(document.getElementById('stateGraph'));

      chart.draw(data, options);
}
