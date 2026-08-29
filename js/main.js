const categoryLinks = document.querySelectorAll('[data-category]');

categoryLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		const category = link.dataset.category;
		window.location.href = `pages/categories/${category}.html`;
	});
});
