<template>
   <tbody v-if="isLoading">
     <tr>
       <td colspan="4">
         <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
          <small>Fetching data...</small>
        </div>
       </td>
     </tr>
   </tbody>
   <tbody v-else-if="payTypes.length === 0">
    <tr>
       <td colspan="4">
         <div class="text-center" :style="{width: '100%'}">
          <small>No data found</small>
        </div>
       </td>
     </tr>
  </tbody>
  <tbody v-else-if="error">
    <tr>
       <td colspan="4">
         <div class="text-center" :style="{width: '100%'}">
          <small>Unable to fetch data</small>
        </div>
       </td>
     </tr>
  </tbody>
   <tbody v-else>
    <tr v-for="(paymentType, index) in payTypes" :key="paymentType.id">
      <td>{{ (index + 1) }}</td>
      <td>{{ paymentType.name }}</td>
      <td>{{ paymentType.type }}</td>
      <td>
        <button class="btn btn-info" @click="getOnePayTypeEventHandler(paymentType.id)">Edit</button>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'payment-type-list',
  props: ['payTypes', 'isLoading', 'getOnePayTypeEventHandler', 'error']
}
</script>