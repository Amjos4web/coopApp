<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
     <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div class="container">
          <form action="" method="get" id="filter">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Select society</label>
                    <select name="society" id="society" class="form-control">
                      <option value="">Select Society</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Select a member</label>
                    <select name="memberSelect" id="memberSelect" class="form-control">
                      <option value="">Select a Member</option>
                    </select>
                    
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Enter member name</label>
                    <input type="text" name="memberName" id="memberName" class="form-control">
                  </div>
                </div>
              </div>
            </div>
           <div class="text-center">
            <input type="submit" value="Filter Result" class="btn-general">
          </div>
          </form>
        </div>
        
        <div class="container">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Society</th>
                  <th>Phone No</th>
                  <th>View Payment Records</th>
                </tr>
              </thead>
              <MembersPaymentRecordList/>
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
import MembersPaymentRecordList from '@/components/payments/MembersPaymentRecordList'

export default {
  name: 'membersDue',
  components: {
    HeaderNav,
    PageHeader,
    PaymentRecord,
    MembersPaymentRecordList
  },
  data(){
    return {
      pageTitle: 'Members Monthly Payment Record',
      previousPage: 'Dashboard',
      notificationMessage: null,
    }
  },
}
</script>
