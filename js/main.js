const mathCategoryLinks = document.querySelectorAll('[data-category="math"]');

mathCategoryLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		window.location.href = "pages/math.html";
	});
});
