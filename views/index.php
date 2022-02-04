<?php
header("Content-Type:")
?>
<!DOCTYPE html>
<html>

<head>

	<title> Rest API Application </title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<meta name="description" content="This single page application ">

	<meta name="author" content="Code With Mark">
	<meta name="authorUrl" content="http://codewithmark.com">

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css">


	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js"></script>


</head>

<body>



	<!-- Navigation -->
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark static-top">
		<div class="container">
			<a class="navbar-brand" href="#">Rest API</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarResponsive">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item active">
						<a class="nav-link btn_menu" screen_name="home" href="#/home">Home
							<span class="sr-only">(current)</span>
						</a>
					</li>
					<li class="nav-item">
						<a class="nav-link btn_menu" screen_name="emails" href="#/emails">Get Emails</a>
					</li>

					<li class="nav-item">
						<a class="nav-link btn_menu" screen_name="contact" href="#/contact">Contact</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<!-- Page Content -->
	<div class="container" style="padding-top:20px;">
		<div class="row card ">

			<div class="screen_name text-center text-uppercase	" style="font-size: 70px;"></div>

			<div class="col-lg-12	 screen_data"></div>

		</div>
	</div>



	<div style="display:none;" class="screens">

		<!--[home > start]-->
		<div class="screen_home">
			<div class="text-center">
				<h1 class="mt-5">Best Way To Create REST API</h1>
				<p class="lead">Complete howto guide</p>

				<img src="<?php echo APPURL . '/views/img/people.png' ?>">

			</div>
		</div>
		<!--[home > end]-->

		<div class="screen_about">

			<img src="https://placeimg.com/640/480/nature">

			<h1>Together For Lights Seasons Light For Lesser Behold</h1>
			<h2>Morning Fish For Upon</h2>
			<p>Herb without multiply bring, give two blessed beginning. Multiply wherein gathering own two they&#39;re fruit without saying, i don&#39;t given in bearing he first over isn&#39;t their unto. Us shall.</p>

			<p>Dominion isn&#39;t two whose green saying also it also us bearing first yielding seed gathering <em>life</em> hath grass place Darkness, blessed subdue <strong>under</strong> fruitful after replenish tree it dominion beginning. Is creeping. Called bearing morning evening meat won&#39;t make i.</p>

			<h2>Midst Beast She&#39;d Together All</h2>
			<p>Bearing one one land. Moved stars under fill waters open whales. Give face were sea it. Winged life Life yielding. Give beast appear form don&#39;t place that unto cattle sixth.</p>
		</div>

		<!--[contact > start]-->
		<div class="screen_contact">
			<div class="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch">
				<form action="forms/contact.php" method="post" role="form" class="php-email-form">
					<div class="form-row">
						<div class="form-group col-md-6">
							<label for="name">Your Name</label>
							<input type="text" name="name" class="form-control" id="name" data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
							<div class="validate"></div>
						</div>
						<div class="form-group col-md-6">
							<label for="name">Your Email</label>
							<input type="email" class="form-control" name="email" id="email" data-rule="email" data-msg="Please enter a valid email" />
							<div class="validate"></div>
						</div>
					</div>
					<div class="form-group">
						<label for="name">Subject</label>
						<input type="text" class="form-control" name="subject" id="subject" data-rule="minlen:4" data-msg="Please enter at least 8 chars of subject" />
						<div class="validate"></div>
					</div>
					<div class="form-group">
						<label for="name">Message</label>
						<textarea class="form-control" name="message" rows="10" data-rule="required" data-msg="Please write something for us"></textarea>
						<div class="validate"></div>
					</div>

					<div class="text-center"><button type="submit">Send Message</button></div>
				</form>
			</div>
		</div>
		<!--[contact > End]-->

	</div>



	<script type="text/javascript">
		$(document).ready(function($) {
			var ajax_url = "<?php echo AJAX_URL ?>";
			var e0 = $(document).find('.screen_data');
			var s1 = $(document).find('.screen_home').html();
			e0.html(s1);

			$(document).on('click', '.btn_menu', function(event) {
				event.preventDefault();

				var screen_name = $(this).attr('screen_name');


				window.location.hash = '/' + screen_name;

				$(document).find('.screen_name').html(screen_name);;

				if (screen_name == "home") {
					var s1 = $(document).find('.screen_home').html();
					e0.html(s1);
				} else if (screen_name == "emails") {
					//var s1 = $(document).find('.screen_about').html();

					$.getJSON(ajax_url + '/email', {
						email: 'mark@gmail.com'
					}, function(json, textStatus) {
						var s1 = '<pre class="bg-light">' +
							JSON.stringify(json, 2, 4) +
							'</pre>';

						e0.html(s1);
						console.log(json);

					});
				} else if (screen_name == "services") {

				} else if (screen_name == "contact") {
					var s1 = $(document).find('.screen_contact').html();
					e0.html(s1);
				}

			});

		});
	</script>

</body>

</html>