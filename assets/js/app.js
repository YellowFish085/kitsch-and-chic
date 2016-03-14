$.ajax('assets/json/articles.json')
	.success( function(data) {
		
	})
	.error( function(e) {
		alert('Json ERROR: ' + e.statusText);
	});

$(document).ready( function() {
	$('a').on('click', function(e) {
		e.preventDefault();
		History.pushState(null, e.target.title, e.target.href);
	})
})