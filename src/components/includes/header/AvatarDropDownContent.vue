<template>
    <div class="iq-sub-dropdown iq-user-dropdown">
      <div class="iq-card shadow-none m-0">
        <div class="iq-card-body p-0 ">
          <!-- <div class="bg-primary p-3">
          <h5 class="mb-0 text-white line-height">Hello</h5>
          <span class="text-white font-size-12">Available</span>
          </div> -->
          <a class="iq-sub-card iq-bg-primary-hover">
            <router-link to="/profile">
              <div class="media align-items-center">
                <div class="rounded iq-card-icon iq-bg-primary">
                  <i class="ri-file-user-line"></i>
                </div>
                <div class="media-body ml-3">
                  <h6 class="mb-0 ">My Profile</h6>
                  <router-link to="/profile">
                    <p class="mb-0 font-size-12">View personal profile details</p>
                  </router-link>
                </div>
              </div>
            </router-link>
          </a>
          <a class="iq-sub-card iq-bg-primary-hover">
            <router-link to="/profile">
              <div class="media align-items-center">
                <div class="rounded iq-card-icon iq-bg-primary">
                  <i class="ri-profile-line"></i>
                </div>
                <div class="media-body ml-3">
                  <h6 class="mb-0 ">Change Password</h6>
                  <router-link to="/changePassword">
                    <p class="mb-0 font-size-12">Modify my password</p>
                  </router-link>
                </div>
              </div>
            </router-link>
          </a>
          <div class="d-inline-block w-100 text-center p-3">
          <a class="bg-warning iq-sign-btn" role="button">
            <router-link to="/Logout">
              Sign out<i class="ri-login-box-line ml-2"></i>
            </router-link>
          </a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'avatar-dropdown-notification'
}
</script>