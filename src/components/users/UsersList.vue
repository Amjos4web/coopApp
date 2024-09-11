<template>
  <tbody v-if="userIsLoading">
    <tr>
      <td colspan="7">
        <div class="text-center" :style="{width: '100%'}">
        <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
        <small>Fetching data...</small>
      </div>
      </td>
    </tr>
  </tbody>
  <tbody v-else>
    <tr v-for="(user, index) in users" :key="user.id">
      <td>{{ (((currentPage - 1) * limit) + ((index) + 1)) }}</td>
      <td>{{ user.userid }}</td>
      <td>{{ user.name }}</td>
      <td>{{ user.phone }}</td>
      <td>
        <a class="btn btn-primary custom-link btn-sm">
          <router-link :to="'/users/rolePermission/' + user.member_id">
            Set Permission
          </router-link>
        </a>
      </td>
      <td>
        <a class="btn btn-warning custom-link btn-sm">
          <router-link :to="'/users/AssignDelegates/' + user.member_id">
            Assign as Delegate
          </router-link>
        </a>
      </td>
      <td>
        <div class="dropdown">
          <button class="btn btn-info dropdown-toggle" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Actions
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a href="#" class="dropdown-item" @click="resetUserPasswordEventHandler(user.id)">
              Reset Password
            </a>
            <a href="#"  v-if="user.active == true" @click="deactivateUserEventHandler(user.id)" class="dropdown-item">
              Deactivate
            </a>
            <a href="#"  v-if="user.active == false" @click="deactivateUserEventHandler(user.id)" class="dropdown-item">
              Activate
            </a>
            <a href="#"  class="dropdown-item" data-target="#uploadProfileImage" data-toggle="modal" @click="switchOnCamera(user.member_id, user.name)">
              Upload Profile Image
            </a>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>


export default {
  name: 'users-list',
  props: {
    users: Array,
    userIsLoading: Boolean,
    usersError: Error,
    currentPage: Number,
    limit: Number,
    resetUserPasswordEventHandler: Function,
    deactivateUserEventHandler: Function,
    switchOnCamera: Function
  }, 
}
</script>