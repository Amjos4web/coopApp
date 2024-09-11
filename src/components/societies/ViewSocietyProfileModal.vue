<template>
  <div class="modal fade" id="viewSociety" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ society.name }} Details</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="container" :style="{width: '100%;'}">
            <div class="table-responsive">
              <table class="styled-table">
                <tbody>
                  <tr>
                    <th width="50%">Name</th>
                    <td>{{ society.name }}</td>
                  </tr>
                  <tr>
                    <th width="50%">Number of Members</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th width="50%">Date Established</th>
                    <td>{{ society.created_at }}</td>
                  </tr>
                  
                  <tr>
                    <th width="50%">Notes</th>
                    <td>{{ society.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'view-society-profile-modal',
  props: ["society"]
}
</script>