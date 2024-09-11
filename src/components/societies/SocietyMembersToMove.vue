<template>
  <div class="mt-20">
    <div class="container">
      <div class="row">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Move</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in societyMembers" :key="member.id">
                <td>{{ (index) + 1 }}</td>
                <td>{{ member.member_name }}</td>
                <td>
                  <button type="button" class="btn btn-primary" @click="openSocietyModalEventHandler(member.member_id, member.member_name, member.society_id)">Move Member</button>
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
    openSocietyModalEventHandler: Function
  }
}
</script>