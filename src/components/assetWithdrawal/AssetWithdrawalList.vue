<template>
	<tbody v-if="assetWithdrawalIsLoading">
		<tr>
			<td colspan="9">
				<div class="text-center" :style="{width: '100%'}">
					<img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
					<small>Fetching data...</small>
				</div>
			</td>
		</tr>
	</tbody>
	<tbody v-else-if="assetWithdrawalError">
		<tr>
			<td colspan="9">
				<div class="text-center" :style="{width: '100%'}">
					<small>Unable to fetch data</small>
				</div>
			</td>
		</tr>
	</tbody>
	<tbody v-else>
		<tr v-for="(assWith, index) in assetWithdrawals" :key="assWith.id">
			<td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
			<td>{{ assWith.member_name }}</td>
			<td>{{ assWith.member_society }}</td>
			<td>{{ assWith.payment_type_name}}</td>
			<td>&#x20A6;{{ Number(assWith.amount).toLocaleString() }}</td>
			<td>
				<button class="btn btn-warning" @click="getOneAssetWithdrawalEventHandler(assWith.id)">Edit</button>
			</td>
			<td>
				<button class="btn btn-danger" @click="removeAssetWithdrawalEventHandler(assWith.id)">Delete</button>
			</td>
			</tr>
	</tbody>
</template>
   
<script>
	export default {
		name: 'asset_withdrawal-list',
		props: {
			assetWithdrawals: Array,
			assetWithdrawalIsLoading: Boolean,
			assetWithdrawalError: Error,
			limit: Number,
			currentPage: Number,
			getOneAssetWithdrawalEventHandler: Function,
			removeAssetWithdrawalEventHandler: Function
		}
  }
</script>