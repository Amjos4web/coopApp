<template>
  <div class="mt-20">
    <div class="container">
      <div class="row">
        <div class="col-12 pull-right">
          <button class="btn btn-info pull-right btn-sm" data-target="#selectMembers" data-toggle="modal">
            <i class="fa fa-plus"></i>
            &nbsp;Add New Member
            </button>
        </div>
      </div>
      <div class="row">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Phone No</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in societyMembers" :key="member.id">
                <td>{{ (index) + 1 }}</td>
                <td>{{ member.member_name }}</td>
                <td>{{ member.member_phone }}</td>
                <td>
                  <button type="button" class="btn btn-danger" @click="removeMemberFromSocietyEventHandler(member.id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'society-members-list',
  props: {
    societyMembers: Array,
    removeMemberFromSocietyEventHandler: Function,
    moveToNewSocietyEventHandler: Function
  }
}
</script>