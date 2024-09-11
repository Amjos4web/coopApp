<template>
  <div class="mt-20">
    <!-- <div class="alert alert-info text-center" :style="{margin: '0 auto'}">
      <h5 :style="{fontSize: '18px'}">Member Lists for {{ societyName }}</h5>
    </div> -->
       
    <div class="container">
      <div class="row">
        <h4><small>All <strong>{{ societyName }}</strong> Members</small></h4>
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Edit Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in societyMembers" :key="member.id">
                <td>{{ (index) + 1 }}</td>
                <td>{{ member ? member.member_name : "Unknown" }}</td>
                <td>
                  <a class="btn btn-primary custom-link">
                    <router-link :to="'/payment/edit/' + member.member_id + '/' + currentSocietyID">
                      Edit
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