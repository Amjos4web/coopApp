
<template>
  <transition name="fade" class="router-view" mode="out-in" appear>
    <router-view></router-view>
  </transition>
</template>

<script>
import event, {EVENT_TYPE} from "./utility/event"
import {debug, REFRESH_TOKEN_EVENT_TYPE} from "./utility"


export default {
  name: 'App',
  data:()=>({
    path:window.location.pathname
  }),
 
  mounted(){
    console.log("mounted");
    event.on(REFRESH_TOKEN_EVENT_TYPE.REFRESH_TOKEN_ERROR, (error)=>{
      debug("REFRESH_TOKEN_ERROR", error);
    });
  },
  destroyed(){
    debug("app component", "I was destroyed");
    event.emit(REFRESH_TOKEN_EVENT_TYPE.CANCEL_REFRESHING_TOKEN);    
  },
  
  watch: {
    path:(oldPath, newPath)=>{
      console.log(oldPath, newPath)
    }
  },
  computed:{
    getCurrentPath(){
      console.log(this.$route);
      return "";
    }
  }
}

</script>
