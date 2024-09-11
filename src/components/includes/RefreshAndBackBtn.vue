<template>
  <div class="row">
    <div class="col-md-4">
      <a class="btn btn-primary custom-link btn-sm">
        <router-link :to="link">
          Go Back
        </router-link>
      </a>
    </div>
    <div class="col-md-8">
      <button type="submit" class="btn btn-secondary pull-right"
      @click="reloadIndexData()"><i class="fa fa-refresh"></i> Refresh</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'limit-data-fetch',
  props: {
    reloadIndexData: Function,
    link: String
  },
}
</script>