<template>
	<!-- Footer -->
	<footer class="iq-footer">
		<div class="container-fluid">
			<div class="row">
					<div class="col-lg-6">
						<ul class="list-inline mb-0">
							<li class="list-inline-item"><a href="https://ogbomosooluwalosecicu.com.ng/">Official Website</a></li>
							<li class="list-inline-item"><a href="https://ogbomosooluwalosecicu.com.ng/privacy-policy/">Privacy Policy</a></li>
						</ul>
					</div>
					<div class="col-lg-6 text-right">
						Copyright {{ getCurrentYear() }}. <a href="#">MyCoop App (Ogbomoso Oluwalose CICU Ltd)</a> All Rights Reserved.
					</div>
			</div>
		</div>
	</footer>
<!-- Footer END -->
</template>

<script>
export default {
  name: "FooterBar",
	data() {
		return{
			currentYear: null
		}
	},

	methods: {
		getCurrentYear() {
			const currentDate = new Date()
			return this.$data.currentYear = currentDate.getFullYear()
    }
  }
}
</script>