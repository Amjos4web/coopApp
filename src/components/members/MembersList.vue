<template>
  <tbody v-if="isLoading">
    <tr>
      <td colspan="7">
        <div class="text-center" :style="{width: '100%'}">
        <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
        <small>Fetching data...</small>
      </div>
      </td>
    </tr>
  </tbody>
  <tbody v-else-if="members.length === 0">
  <tr>
    <td colspan="7">
      <div class="text-center" :style="{width: '100%'}">
      <small>No data found</small>
    </div>
    </td>
  </tr>
</tbody>
<tbody v-else-if="error">
  <tr>
    <td colspan="7">
      <div class="text-center" :style="{width: '100%'}">
      <small>Unable to fetch data</small>
    </div>
    </td>
  </tr>
</tbody>
  <tbody v-else>
    <tr v-for="(member, index) in members" class="tcontent" :key="member.id">
      <td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
      <td>{{ member.name }}</td>
      <td>{{ member.phone }}</td>
      <td>
        <button class="btn btn-warning btn-sm" @click="getOneMemberEventHandlerForView(member.id)">View Profile</button>
      </td>
      <td>
        <button class="btn btn-info btn-sm" @click="getOneMemberEventHandlerForEdit(member.id)">Edit</button>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'members-list',
  props:[
    "members", "error", "isLoading", 
    "getOneMemberEventHandlerForView", 
    "getOneMemberEventHandlerForEdit", 
    "limit", "currentPage"
  ]
}
</script>