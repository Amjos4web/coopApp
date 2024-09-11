<template>
  <tbody v-if="isLoading">
     <tr>
       <td colspan="5">
         <div class="text-center" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
          <small>Fetching data...</small>
        </div>
       </td>
     </tr>
   </tbody>
   <tbody v-else-if="societies.length === 0">
    <tr>
       <td colspan="5">
         <div class="text-center" :style="{width: '100%'}">
          <small>No data found</small>
        </div>
       </td>
     </tr>
  </tbody>
  <tbody v-else-if="error">
    <tr>
       <td colspan="5">
         <div class="text-center" :style="{width: '100%'}">
          <small>Unable to fetch data</small>
        </div>
       </td>
     </tr>
  </tbody>
  <tbody v-else>
    <tr v-for="(society, index) in societies" :key="society.id">
      <td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
      <td>{{ society.name }}</td>
      <td>{{society.totalMember ? society.totalMember : 0}}</td>
      <td>
        <button class="btn btn-info" @click="getOneSocietyEventHandlerForView(society.id)">View</button>
      </td>
      <td>
        <button class="btn btn-warning" @click="getOneSocietyEventHandlerForEdit(society.id)">Edit</button>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'societies-list',
  props: ["societies", "error", "isLoading", 
  "getOneSocietyEventHandlerForView", 
  "getOneSocietyEventHandlerForEdit",
  "limit", "currentPage"
  ]
}
</script>