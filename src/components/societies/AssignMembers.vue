<template>
  <div>
    <div id="page-wrapper">
      <div class="header">
        <h3 class="page-header">
          Assign Members
        </h3>
        <ol class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#" class="active">Assign Members</a></li>
        </ol>
      </div>
      <div class="page-inner">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p class="page-notification-message"><i class="fa fa-info-circle"></i> This is where members are being assigned to society </p>
                <!-- <p class="export-btn"><button class="btn btn-info btn-sm"><i class="fa fa-download"></i>&nbsp;Import CSV</button></p> -->
              </div>
            </div>
          </div>
          
            <div class="box">
              <div class="row">
                <div class="form-group">
                  <form action="" method="get" class="col s12" id="createSociety">
                  <div class="row">
                    <div class="form-group col s12">
                      <label for="Society Name">Soiety Name</label>
                      <select name="societyName" id="societyName" class="form-control">
                        <option value="">Choose a Society</option>
                      </select>
                      <span class="error-message" id="societyName-error"></span>
                    </div>
                  </div>
                </form>
                <div class="row">
                  <div class="col s12 text-center">
                    <button class="btn btn-general" data-target="#selectMembers" data-toggle="modal"><i class="fa fa-user"></i>&nbsp;Select Members</button>
                    <div id="listOfMembers">
                      <h5>Select Members</h5>
                      Amos Joseph, Amos Juliannah, Adegoke Sola
                    </div>
                    <input type="hidden" name="listOfMembers" value="">
                  </div>
                </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <input type="submit" value="Save" class="btn-general">
            </div>
          
        </div>
        </div>
      </div>

    <div class="modal fade" id="selectMembers" role="dialog" style="border-radius: 5px;">
      <div class="modal-dialog modal-lg">
        <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Select Members</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="row">
              <div class="form-group col-md-6 col-md-offset-3">
                <label for="Society Name">Search member</label>
                <input type="text" name="memberName" id="memberName">
                <span class="error-message" id="societyName-error"></span>
              </div>
            </div>
            <div class = "row">
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID">
                  <label for="memberID"></label>
                </p>
              </div>
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID2">
                  <label for="memberID2"></label>
                </p>
              </div>
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID3">
                  <label for="memberID3"></label>
                </p>
              </div>
              <div class="col s8">
                <h5>Amos Joseph</h5>
              </div>
              <div class="col s4" style="margin-top: 5px; text-align: right;">
                <p>
                  <input type="checkbox" name="memberID" id="memberID4">
                  <label for="memberID4"></label>
                </p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div> 
</template>

<script>
export default {
  name: 'AssignMembers',

}
</script>
