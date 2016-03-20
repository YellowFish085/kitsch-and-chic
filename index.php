<?php
	include('config.php');
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<link rel="stylesheet" href="/assets/css/bootstrap.min.css">
		<link rel="stylesheet" href="/assets/css/style.css">
		<script src="/assets/js/vendor/jquery.min.js"></script>
		<script src="/assets/js/vendor/bootstrap.min.js"></script>
		<script src="/assets/js/vendor/jquery.history.js"></script>
		<script src="/assets/js/vendor/mustache.min.js"></script>
		<script src="/assets/js/app.js"></script>
	</head>
	<body>
		<header>
			<div class="container">
				<nav class="row">
					<ul class="col-xs-12 col-sm-12 main-nav">
						<li>
							<span type="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						    Interieur
						  </span>
						  <ul class="dropdown-menu">
						    <li>
						    	<a class="dropdown-item" href="/interieur/cuisine" title="Cuisine">Cuisine</a>
						    </li>
						    <li>
						    	<a class="dropdown-item" href="/interieur/salle-de-bain" title="Salle de bain">Salle de bain</a>
						    </li>
						    <li>
						    	<a class="dropdown-item" href="/interieur/chambre" title="Chambre">Chambre</a>
						    </li>
						    <li>
						    	<a class="dropdown-item" href="/interieur/sejour" title="Sejour">Sejour</a>
						    </li>
						  </ul>
						</li>
						<li>
							<a class="dropdown-item" href="/astuces" title="Astuces">Astuces</a>
						</li>
						<li>
							<a class="dropdown-item" href="/createurs" title="Créateurs">Créateurs</a>
						</li>
						<li>
							<a class="dropdown-item" href="/insolites" title="Insolites">Insolites</a>
						</li>
						<li>
							<a class="dropdown-item" href="/passion-kitsch" title="Passion kitsch">Passion kitsch</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
		<div id="content">
		
		</div>
		<footer>
			
		</footer>
	</body>
</html>