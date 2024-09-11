<template>
    <ul id="dropdown1" class="dropdown-content">
      <li>
        <a>
          <router-link to="/profile">
            <i class="fa fa-user fa-fw"></i> My Profile
          </router-link>
        </a>
      </li>

      <li>
        <a>
          <router-link to="/changePassword">
            <i class="fa fa-key fa-fw"></i> Change Password
          </router-link>
        </a>
      </li>
    
      <li>
        <a>
          <router-link to="/Logout">
            <i class="fa fa-sign-out fa-fw"></i> Logout
          </router-link>
        </a>
      </li>
    </ul>
</template>

<script>
export default {
  name: 'avatar-dropdown-notification'
}
</script>