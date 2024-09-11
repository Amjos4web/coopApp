<template>
  <label class="app-name error" v-if="error">
    Unable to get union name
  </label>
  <label class="app-name" v-else>
    {{ unionName }}
  </label>
</template>

<script>
export default {
  name: 'union-name',
  props: ["unionName", "error"]

}
</script>