<template>
  <div>
    <div class="row" v-for="meetingCalendar in meetingCalendars" :key="meetingCalendar.id">
      <div class="col s12 m8 offset-m2">
        <div class="card blue-grey darken-1">
          <div class="card-content black-text text-center">
            <span class="card-title">{{meetingCalendar.society_name}}</span>
            <p>Click on the button below to start meeting for <b><i>{{meetingCalendar.society_name}}</i></b></p>
          </div>
          <div class="card-action text-center">
            <a>
              <router-link :to="'/meeting/start/' + meetingCalendar.society_id" class="btn btn-info"><i class="fa fa-time"></i> Start Meeting</router-link>
            </a>
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