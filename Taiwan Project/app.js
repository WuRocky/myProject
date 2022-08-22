let header = document.querySelector("header");
let nav = document.querySelector("header nav");
let hedaerAnchor = document.querySelectorAll("header nav ul li a");

// console.log(hedaerAnchor);

window.addEventListener("scroll", () => {
	if (window.pageYOffset != 0) {
		header.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
		header.style.color = "white";
		nav.style.backgroundColor = "rgba(90, 90, 90, 0.5)";
		hedaerAnchor.forEach((a) => {
			a.style.color = "white";
		});
	} else {
		header.style.backgroundColor = "";
		nav.style.backgroundColor = "";
	}
});

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

// header.style.backgroundColor
