let header = document.querySelector("header");
let headerAnchor = document.querySelectorAll("header nav ul li a");
window.addEventListener("scroll", () => {
	if (window.pageYOffset != 0) {
		header.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
		header.style.color = "white";
		headerAnchor.forEach((a) => {
			a.style.color = "white";
		});
	} else {
		header.style = "";
		headerAnchor.forEach((a) => {
			a.style.color = "#09777d";
		});
	}
});

// document.querySelector("#contact-form").addEventListener("submit", (e) => {
// 	e.preventDefault();
// 	e.target.elements.name.value = "";
// 	e.target.elements.email.value = "";
// 	e.target.elements.message.value = "";
// });
