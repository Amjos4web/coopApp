<template>
  <div class="row">
    <div class="col-md-4">
      <div class="form-group">
        <!-- <label for="limit">Number of rows</label> -->
        <select @change="getLimit($event)" name="limit" class="form-control">
          <option value="">Number of Rows</option>
          <option :value="limit" selected></option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
        </select>
      </div>
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
    getLimit: Function,
    limit: Number,
    reloadIndexData: Function
  },

}
</script>