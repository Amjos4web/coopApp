<template>
  <div>
    <HeaderNav/>
     <div id="content-page" class="content-page">
        <div class="container">
          <div class="filter-result">
            <div class="row">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr class="theading">
                      <th>Name</th>
                      <th>Change</th>
                      <th>Permissions</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="tcontent">
                      <td>Amos Taiwo Joseph</td>
                      <td>
                      <select name="role" id="role" class="form-control">
                        <option value="">Select an Option</option>
                      </select>
                      </td>
                      <td>
                        <button class="btn btn-info btn-sm permissions" data-target="#permissionsModal" data-toggle="modal"> Permission</button>
                      </td>
                      <td>
                        <button class="btn btn-danger btn-sm remove" data-target="#removeUserRoleModal" data-toggle="modal">Remove</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterBar/>
    </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'

export default {
  name: 'AssignDelegates',
  components: {
    HeaderNav,
    FooterBar,
  },
  data(){
    return{
      pageTitle: 'Assign Society Delegates',
      previousPage: 'Dashboard',
      notificationMessage: null,
    } 
  }
}
</script>
