<template>
  <div class="modal fade" id="userPermissionModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <form action="" method="post" id="userPermission">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Set Permission for Ada Dorcas</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="container">
              <div class="row">
                <div class="col-md-8 col-md-offset-2">
                  <div class="form-group">
                    <label for="role">Choose role</label>
                    <select name="role" id="role" class="form-control">
                      <option value="">Choose an Option</option>
                    </select>
                    <span class="error-message" id="role-error"></span>
                  </div>
                </div>
              </div>
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title" :style="{fontWeight: '100', fontSize: '14px;'}">List of Module/Permission</h3>
                </div>
                <div class="panel-body">
                  <div class="row col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp;Make Payment for member
                  </div>
                  <div class="row col-md-4 pull-right">
                    <label class="switch mod">
                      <input type="checkbox" name="userModules" value="">
                      <span class="slider round"></span>
                    </label>
                  </div>
                  <div class="row col-md-8">
                    <i class="fa fa-check-circle"></i>&nbsp;Request loan for members
                  </div>
                  <div class="row col-md-4 pull-right">
                    <label class="switch mod">
                      <input type="checkbox" name="userModules" value="">
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <input type="submit" name="userPermission" class="btn btn-info" value="Save">
            <button type="button" id="continue" class="btn btn-warning ml-10" data-dismiss="modal">close</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-permission-modal'
}
</script>