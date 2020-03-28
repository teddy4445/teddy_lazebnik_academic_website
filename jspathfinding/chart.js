google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawChartFinished);
google.charts.setOnLoadCallback(drawChartAvgDis);
google.charts.setOnLoadCallback(drawChartCenterMassRealTime);
google.charts.setOnLoadCallback(drawChartCenterMassRealTimeVar);

function drawChartFinished(rows) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Finished Percent');
      data.addColumn('number', 'Crashed Percent');

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Generation'
        },
        vAxis: {
          title: 'Results'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('resultChart'));

      chart.draw(data, options);
    }
	
function drawChartAvgDis(rows) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Avg Distance');

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Generation'
        },
        vAxis: {
          title: 'Avg Distance'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('resultChartAvgDis'));

      chart.draw(data, options);
    }
	
	
function drawChartCenterMassRealTime(rows) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Distance');

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Frame'
        },
        vAxis: {
          title: 'Center Mass Distance'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('realTimeCenterChartGravity'));

      chart.draw(data, options);
    }
	
	
function drawChartCenterMassRealTimeVar(rows) {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Var');

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Frame'
        },
        vAxis: {
          title: 'Variance Of  Rockets'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('realTimeCenterChartGravityVar'));

      chart.draw(data, options);
    }