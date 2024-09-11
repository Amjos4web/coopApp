<template>
  <div class="row">
    <div class="col-md-3">
      <div class="form-group">
        <label for="limit">Number of rows</label>
        <select @change="getLimit($event)" name="limit" class="form-control">
          <option :value="limit" selected></option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'limit-data-fetch',
  props: {
    getLimit: Function,
    limit: Number
  }
}
</script>