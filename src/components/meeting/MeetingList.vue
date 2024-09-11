<template>
  <div>
    <div v-if="meetingCalendars.length > 0">
      <div class="col-10 m-auto" v-for="meetingCalendar in meetingCalendars" :key="meetingCalendar.id">
        <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div class="iq-card-body iq-box-relative">
            <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
              <i class="las la-id-card-alt iq-arrow-left"></i>
            </div>
            <p class="text-secondary">{{meetingCalendar.society_name}}</p>
            <div class="d-flex align-items-center justify-content-between pull-right">
              <a>
                <router-link :to="'/meeting/start/' + meetingCalendar.society_id" class="btn btn-info"><i class="fa fa-time"></i> Take Meeting Records</router-link>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="col-12" v-for="meetingCalendar in meetingCalendars" :key="meetingCalendar.id">
        <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div class="iq-card-body iq-box-relative">
            <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
              <i class="las la-id-card-alt iq-arrow-left"></i>
            </div>
            <p class="text-secondary">{{meetingCalendar.society_name}}</p>
            <div class="d-flex align-items-center justify-content-between pull-right">
              <a>
                <router-link :to="'/meeting/start/' + meetingCalendar.society_id" class="btn btn-info"><i class="fa fa-time"></i> Take Meeting Records</router-link>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'meeting-list',
  props: {
    meetingCalendars: Array,
  }
}
</script>