$.ajax('assets/json/articles.json')
	.success( function(data) {
		
	})
	.error( function(e) {
		alert('Json ERROR: ' + e.statusText);
	});
