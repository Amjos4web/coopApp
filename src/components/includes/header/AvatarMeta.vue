<template>
  <div>
    <a href="#" class="search-toggle iq-waves-effect d-flex align-items-center">
      <img :src="member.passport" class="rounded mr-3 avatar-2" :alt="member.name">
      <div class="caption">
        <h6 class="mb-0 line-height">{{ loginUserName }}</h6>
        <p class="mb-0">{{ roleType }}</p>
      </div>
    </a>

    <AvatarDropDownContent/>
  </div>
</template>

<script>
import AvatarDropDownContent from '@/components/includes/header/AvatarDropDownContent'
export default {
  name: 'avatar-meta',
  components: {
    AvatarDropDownContent
  },
  props: ['loginUserName', 'isLoading', 'member', 'roleType']
}
</script>