<template>
    <tbody v-if="memberIsLoading || revenueIsLoading">
     <tr>
       <td colspan="6">
         <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
          <small>Fetching data...</small>
        </div>
       </td>
     </tr>
   </tbody>
    <tbody v-else>
      <tr v-for="(asset, index) in memberAssets" :key="asset.id">
        <td>{{ (index) + 1 }}</td>
        <td>{{ asset.member_name }}</td>
        <td>{{ asset.member_society }}</td>
        <td>{{ asset.payment_type_name }}</td>
        <td>&#x20A6;{{ Number(asset.total).toLocaleString() }}</td>
      </tr>
      
    </tbody>
  
</template>

<script>

export default {
  name: 'payment-record-list',
  props: {
    memberAssets: Array,
    memberIsLoading: Boolean,
    revenueIsLoading: Boolean,
  }
}
</script>