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
   <tbody v-else-if="roles.length === 0">
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
    <tr v-for="(role, index) in roles" :key="role.id">
      <td>{{ (index + 1) }}</td>
      <td>{{ role.name }}</td>
      <td>{{ role.type }}</td>
      <td>
        <button class="btn btn-info" @click="getOneRoleEventHandler(role.id)">Edit</button>
      </td>
    </tr>
  </tbody>
</template>

<script>

export default {
  name: 'user-role-list',
  props: {
    roles: Array,
    isLoading: Boolean,
    error: Error,
    getOneRoleEventHandler: Function
  }
}
</script>