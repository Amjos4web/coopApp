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
                <div class="col-md-6">
                  <div class="input-group col s8 m8 offset-m2">
                    <label>Select society</label>
                    <select class="form-control">
                      <option value="">Select Society</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group col s8 m8 offset-m2">
                    <label>Meeting Date</label>
                    <select class="form-control">
                      <option value="">Select Society</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <input type="submit" value="Filter Result" class="btn-general">
          </div>
        </div>
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Society Name</th>
                  <th>View Payment Records</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tcontent">
                  <td>1</td>
                  <td>Oba-loluwa C.I.C.S</td>
                  <td>
                    <button class="btn btn-info btn-sm modal-trigger" data-target="#paymentRecords" data-toggle="modal">View Payment Records</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentRecord/>
    </div> 
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PaymentRecord from '@/components/meeting/PaymentRecord'
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import { toggleAvatarDropDown, closeNavbar } from '../../assets/js/helpers/utility';
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'societyDue',
  components: {
    HeaderNav,
    PageHeader,
    PaymentRecord,
  },
  data(){
    return {
      pageTitle: 'Society Monthly Payment Record',
      previousPage: 'Dashboard',
      notificationMessage: null,
    }
  },
  
}
</script>
