<template>
   <ul class="nav navbar-top-links navbar-right">
      <li><a class="dropdown-button waves-effect waves-dark" data-activates="dropdown2"><i class="fa fa-bell fa-fw"></i> <i class="material-icons right">arrow_drop_down</i></a></li>
     
      <li>
        <a class="dropdown-button waves-effect waves-dark" data-activates="dropdown1" id="avatarDropDownContent"><i class="fa fa-user fa-fw"></i> <b>{{ loginUserName }}</b> <i class="material-icons right">arrow_drop_down</i>
        </a>
        <AvatarDropDownContent/>
      </li>
    </ul>
</template>

<script>
import AvatarDropDownContent from '@/components/includes/header/AvatarDropDownContent'
export default {
  name: 'avatar-meta',
  components: {
    AvatarDropDownContent
  },
  props: ['loginUserName', 'isLoading']
}
</script>