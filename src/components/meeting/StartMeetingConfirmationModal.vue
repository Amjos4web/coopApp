<template>
  <div class="modal fade" id="startMeetingConfirmationModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Start Meeting Confirmation</h4>
        </div>
        <div class="modal-body padtrbl">
          <h4>Start Meeting?</h4>
          <p>The correct time to start meeting is 11:00am and the current time is 10:45am. Are you sure of starting this meeting?</p>
          <div class="text-center">
            <a>
              <router-link to="/meeting/start" class="btn btn-info"><i class="fa fa-time"></i> Start Meeting</router-link>
            </a>
            <button type="button" class="btn btn-warning ml-10" data-dismiss="modal" id="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'start-meeting-confrimation-modal'
}
</script>