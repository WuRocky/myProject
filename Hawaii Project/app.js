let header = document.querySelector("header");
let headerAnchor = document.querySelectorAll("header nav ul li a");
let headerLogo = document.querySelector("header div.logo img");
// console.log(headerLogo);
window.addEventListener("scroll", () => {
	if (window.pageYOffset != 0) {
		header.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
		header.style.color = "white";
		headerLogo.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
		headerLogo.style.color = "white";
		headerAnchor.forEach((a) => {
			a.style.color = "white";
		});
	} else {
		header.style = "";
		headerLogo.style = "";
		headerAnchor.forEach((a) => {
			a.style.color = "#09777d";
		});
	}
});
