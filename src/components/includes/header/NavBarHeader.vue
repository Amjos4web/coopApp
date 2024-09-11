<template>
  <div class="navbar-header">		
    <ToggleNavigationMenu/>
    <div id="sideNav" href=""><i class="material-icons dp48 side-bar-icon">toc</i>
    </div>
  </div>
</template>
<script>
  import ToggleNavigationMenu from '@/components/includes/header/ToggleNavigation'
  
  export default {
    name:"navbar-headers",
    components: {
      ToggleNavigationMenu
    }    
  }
</script>