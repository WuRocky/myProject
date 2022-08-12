google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var data = google.visualization.arrayToDataTable([
		["Year", "GDP"],
		["1960", 34394],
		["1965", 114762],
		["1970", 231397],
		["1975", 601778],
		["1980", 1522459],
		["1985", 2535056],
		["1990", 4474288],
		["1995", 7391062],
		["2000", 10328549],
		["2005", 12036675],
		["2010", 14060345],
	]);

	var options = {
		title: "過去台灣60年GDP變化圖表",
		curveType: "function",
		legend: { position: "bottom" },
	};

	var chart = new google.visualization.LineChart(
		document.getElementById("curve_chart")
	);

	chart.draw(data, options);
}
