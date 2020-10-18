<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Meeting
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">Meeting</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p class="page-notification-message" style="font-size: 17px"><i class="fa fa-info-circle"></i> List of all meetings to be held today <b>15th of June 2020</b> </p>
                <!-- <p class="export-btn"><button class="btn btn-info btn-sm"><i class="fa fa-download"></i>&nbsp;Import CSV</button></p> -->
              </div>
            </div>
          </div>
          <div class="col s12">
            <div class="row">
              <div class="col s12 m8 offset-m2">
                <div class="card blue-grey darken-1">
                  <div class="card-content black-text text-center">
                    <span class="card-title">Odokoto Ife-Oluwa C.I.C.S</span>
                    <p>I am a very simple card. I am good at containing small bits of information.
                    I am convenient because I require little markup to use effectively.</p>
                  </div>
                  <div class="card-action text-center">
                    <button type="submit" class="btn btn-info modal-trigger" data-target="#startMeetingConfirmationModal" data-toggle="modal">
                      Start Meeting
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 

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
</div>
</template>

<script>

export default {
  name: 'meetingIndex',

  data(){
    return {
      meetingID: 1
    }
  },
  
}
</script>
