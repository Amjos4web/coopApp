<template>
  <div>
    <headerNav/>
    <transition name="moveInUp" class="router-view" mode="out-in" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerNav from '@/components/includes/headerNav'

export default {
  name: 'App',
  components: {
    headerNav,
  },
}
</script>
