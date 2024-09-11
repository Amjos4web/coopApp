<template>
  <tbody>
    <tr class="tcontent">
      <td>6/20/2020</td>
      <td>&#x20A6;50,000</td>
      <td>&#x20A6;30,000</td>
      <td>&#x20A6;20,000</td>
      <td>1,500 Monthly</td>
      <td>
        <button type="button" class="btn btn-info" data-target="#loanHistoryModal" data-toggle="modal">View History</button>
      </td>
      <td>
        <button type="button" class="btn btn-primary" data-target="#updateInterestRateModal" data-toggle="modal">Update</button>
      </td>
      <td><label class="in-progress">In Progress</label></td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'loan-history'
}
</script>