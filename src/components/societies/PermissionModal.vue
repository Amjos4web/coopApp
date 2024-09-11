<template>
  <div class="modal fade" id="permissionsModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Manage Permissions for Amos Taiwo Joseph as the Union President</h4>
        </div>
        <div class="modal-body padtrbl">
          <!-- <div class="row">
            <div class="input-field col s12">
              <input type="text" name="userName" id="memberName">
              <label for="Society Name">Search </label>
              <span class="error-message" id="societyName-error"></span>
            </div>
          </div> -->
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
        </div>
        <div class="modal-footer">
          <button type="submit" id="continue" class="btn btn-info" data-dismiss="modal">continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'permission-modal'
}
</script>