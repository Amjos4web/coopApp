<template>
  <tbody>
    <tr class="tcontent">
      <td>1</td>
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
      <td>
          <button type="button" class="btn btn-warning" data-target="#editLoan" data-toggle="modal">Edit</button>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'loan-request-list'
}
</script>