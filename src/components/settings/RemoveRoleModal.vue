<template>
  <div class="modal fade" id="removeRoleModal" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <form action="" method="post" id="deactivateUser">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Confirming removing of this role</h4>
          </div>
          <div class="modal-body padtrbl">
            <div class="container text-center">
              <p id="confirm-text">Are you sure of removing Union President?</p>
            </div>
          </div>
          <div class="modal-footer">
            <input type="submit" name="resetPassword" class="btn btn-info pull-left" value="Yes" id="yes">
            <button type="button" id="continue" class="btn btn-warning pull-right" data-dismiss="modal">No</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remove-role-modal'
}
</script>