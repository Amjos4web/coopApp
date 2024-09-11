<template>
  <label class="app-name" v-if="settingError">
    Loading...
  </label>
  <label class="app-name" v-else>
    {{ unionName }}
  </label>
</template>

<script>
export default {
  name: 'union-name',
  props: ["unionName", "settingError"]

}
</script>