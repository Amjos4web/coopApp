<template>
  <tr class="tcontent">
    <td>1</td>
    <td>Ada Dorcas</td>
    <td>Odokoto Ife-Oluwa C.I.C.S</td>
    <td>&#x20A6;15,000</td>
    <td>&#x20A6;50,000</td>
    <td>
      <button class="btn btn-info btn-sm" data-target="#loanDetails" data-toggle="modal">View Details</button>
    </td>
    <td>
      <button class="btn btn-info btn-sm" data-target="#profileDetails" data-toggle="modal">View Profile</button>
    </td>
    <td>
      <label class="granted">Granted</label>
    </td>
  </tr>
</template>
<script>
export default {
  props:{society_id:Number, member_id:Number},
  data:{
    member:null,
    society:null
  },
  mounted(){
    Promise.resolve(member=>{
      this.$data.member = member;
    });
  }
}
</script>