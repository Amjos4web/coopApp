<template>
  <tbody v-if="isLoading">
    <tr>
      <td colspan="6">
        <div class="text-center" :style="{width: '100%'}">
        <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
        <small>Fetching data...</small>
      </div>
      </td>
    </tr>
  </tbody>

  <tbody v-else-if="error">
    <tr>
       <td colspan="6">
         <div class="text-center" :style="{width: '100%'}">
          <small>Unable to fetch data</small>
        </div>
       </td>
     </tr>
  </tbody>
  <tbody v-else>
    <tr class="tcontent" v-for="(user, index) in users" :key="user.id">
      <td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
      <td>{{ user.name }}</td>
      <td>{{  user.phone }}</td>
      <td>
        <button class="btn btn-warning btn-sm" data-target="#userPermissionModal" data-toggle="modal">
          Set Permission
        </button>
      </td>
      <td>
        <button class="btn btn-primary btn-sm" @click="resetUserPasswordEventHandler(user.id)">
          Reset Password
        </button>
      </td>
      <td v-if="user.active == 1">
        <button class="btn btn-danger btn-sm" @click="deactivateUserEventHandler(user.id)">Deactivate Account</button>
      </td>
      <td v-else>
        <button class="btn btn-success btn-sm" @click="deactivateUserEventHandler(user.id)">Activate Account</button>
      </td>
    </tr>
  </tbody>
</template>

<script>

export default {
  name: 'users-list',
  props: {
    users: Array,
    isLoading: Boolean,
    error: Error,
    currentPage: Number,
    limit: Number,
    resetUserPasswordEventHandler: Function,
    deactivateUserEventHandler: Function
  },
}
</script>