<template>
  <div>
		<div id="page-wrapper">
			<div class="header">
				<h3 class="page-header">
					Dashboard
				</h3>
				<ol class="breadcrumb">
					<li><a href="#">Home</a></li>
					<li><a href="#" class="active">Dashboard</a></li>
				</ol>
			</div>
			<div id="page-inner">
				<div class="dashboard-cards"> 
					<div class="row">
						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image red">
									<i class="material-icons dp48">import_export</i>
								</div>
								<div class="card-stacked red">
									<div class="card-content">
										<h3>84,198</h3> 
									</div>
									<div class="card-action">
										<strong>REVENUE</strong>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image orange">
									<i class="material-icons dp48">shopping_cart</i>
								</div>
								<div class="card-stacked orange">
									<div class="card-content">
										<h3>36,540</h3> 
									</div>
									<div class="card-action">
										<strong>SALES</strong>
									</div>
								</div>
							</div> 
						</div>
						
						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image blue">
									<i class="material-icons dp48">equalizer</i>
								</div>
								<div class="card-stacked blue">
									<div class="card-content">
										<h3>24,225</h3> 
									</div>
									<div class="card-action">
										<strong>PRODUCTS</strong>
									</div>
								</div>
							</div> 
						</div>
						
						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image green">
									<i class="material-icons dp48">supervisor_account</i>
								</div>
								<div class="card-stacked green">
									<div class="card-content">
										<h3>88,658</h3> 
									</div>
									<div class="card-action">
										<strong>VISITS</strong>
									</div>
								</div>
							</div> 
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-xs-12 col-sm-12 col-md-12"> 
						<div class="cirStats">
							<div class="row">
								<div class="col-xs-12 col-sm-6 col-md-6"> 
										<div class="card-panel text-center">
											<h4>Profit</h4>
											<div class="easypiechart" id="easypiechart-blue" data-percent="82" ><span class="percent">82%</span>
											</div> 
										</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-6"> 
									<div class="card-panel text-center">
										<h4>No. of Visits</h4>
										<div class="easypiechart" id="easypiechart-red" data-percent="46" ><span class="percent">46%</span>
										</div>
									</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-6"> 
									<div class="card-panel text-center">
										<h4>Customers</h4>
										<div class="easypiechart" id="easypiechart-teal" data-percent="84" ><span class="percent">84%</span>
										</div> 
									</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-6"> 
									<div class="card-panel text-center">
										<h4>Sales</h4>
										<div class="easypiechart" id="easypiechart-orange" data-percent="55" ><span class="percent">55%</span>
										</div>
									</div>
								</div>  
							</div>
						</div>							
						</div><!--/.row-->
					</div>	
			</div>
			<!-- <footer>
				<p>
					All right reserved. Template by: <a href="https://webthemez.com/admin-template/">WebThemez.com</a>
				</p>
			</footer> --> 
		</div>
  </div>
</template>

<script>
export default {
  name: 'home',
}
</script>
