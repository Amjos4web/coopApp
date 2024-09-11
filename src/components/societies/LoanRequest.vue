<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
     <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div class="container">
          <Notification :notificationMessage="notificationMessage"/>
            <div class="box">
              <div class="row">
                <form action="" method="get" class="col s12" id="loanRequest">
                <div class="row">
                  <div class="form-group col s12">
                    <label>Select Society</label>
                      <select name="society" id="society" class="form-control">
                        <option value="">Select Society</option>
                      </select>
                    <span class="error-message" id="society-error"></span>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <input type="number" name="amount" id="amount" autofocus>
                    <label for="amount">Amount to borrow</label>
                    <span class="error-message" id="amount-error"></span>
                  </div>
                </div>
                
                <div class="row">
                  <div class="input-field col s12">
                    <textarea id="textarea1" class="materialize-textarea" name="loanPurpose"></textarea>
                    <label for="purpose">Purpose of Request</label>
                    <span class="error-message" id="loanPurpose-error"></span>
                  </div>
                </div>
                 <div class="text-center">
                  <input type="submit" value="Request Loan" class="btn-general">
                </div>
                </form>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Notification from '@/components/includes/PageNotification'

export default {
  name: 'LoanRequest',
  components: {
    HeaderNav,
    PageHeader,
    Notification
  },
  data(){
    return{
      pageTitle: 'Loan Request',
      previousPage: 'Dashboard',
      notificationMessage: 'This is where you request for loan. Kindly fill the form below',
    } 
  }
}
</script>