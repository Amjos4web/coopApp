<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
     <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
     <div class="page-inner">
        <div class="container">
          <div class="filter-result">
            <div class="row">
              <form action="" method="get">
                <div class="col s12">
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label>Select Society</label>
                      <select name="society" id="society" class="form-control">
                        <option value="">Choose an Option</option>
                      </select>
                    </div>
                    <div class="form-group col-md-6">
                      <label>Select Role</label>
                      <select name="societyDelegate" id="societyDelegate" class="form-control">
                        <option value="">Choose an Option</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <input type="submit" value="Proceed" name="" class="btn-general">
          </div>
        </div>
        <div class="container">
         <div class="text-center">
            <h4><b>Role:</b> Chairman</h4>
          </div>
          <hr/>
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

    <PermissionModal/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import PermissionModal from '@/components/societies/PermissionModal'

export default {
  name: 'AssignDelegates',
  components: {
    HeaderNav,
    PageHeader,
    PermissionModal
  },
  data(){
    return{
      pageTitle: 'Assign Delegates',
      previousPage: 'Dashboard',
      notificationMessage: null,
    } 
  }
}
</script>
