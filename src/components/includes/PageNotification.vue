<template>
  <div class="row">
    <div class="col-md-12">
      <div class="alert alert-info flex-container">
        <p class="page-notification-message">{{ notificationMessage }} </p>
        <!-- <p class="export-btn"><button class="btn btn-info btn-sm"><i class="fa fa-download"></i>&nbsp;Import CSV</button></p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notification-component',
  props: ['notificationMessage']
}
</script>