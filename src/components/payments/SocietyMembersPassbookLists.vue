<template>
  <div class="mt-20">
    <div class="container">
      <div class="row">
        <h4><small>All <strong>{{ societyName }}</strong> Members</small></h4>
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>View Passbook</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in societyMembers" :key="member.id">
                <td>{{ (index) + 1 }}</td>
                <td>{{ member ? member.member_name : "Unknown" }}</td>
                <td>
                  <a class="btn btn-warning custom-link">
                    <router-link :to="'/payments/memberPassbook/' + member.member_id + '/' + currentSocietyID">
                      View Passbook
                    </router-link>
                  </a>
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
const ID = String | Number

export default {
  name: 'society-members-list',
  props: {
    societyMembers: Array,
    removeMemberFromSocietyEventHandler: Function,
    societyName: String,
    currentSocietyID: ID
  }
}
</script>