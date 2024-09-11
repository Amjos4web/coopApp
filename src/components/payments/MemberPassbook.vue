<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="memberIsLoading ||  memberPaymentIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        
        <div class="container" v-else>
          <div v-if="memberError">
          <div class="error-div text-center">
            <span>
              {{memberError.message}}
            </span>
          </div>
        </div>
        <div v-if="societyError">
          <div class="error-div text-center">
            <span>
              {{societyError.message}}
            </span>
          </div>
        </div>
        <div v-if="memberPaymentError">
          <div class="error-div text-center">
            <span>
              {{memberPaymentError.message}}
            </span>
          </div>
        </div>
        <div v-if="hasError">
          <div class="error-div text-center">
            <span>
              {{errorMessage}}
            </span>
          </div>
        </div>
        <div>
          <h4 style="color:grey">{{ pageTitle }}</h4>
        </div><hr>
         <RefreshAndBackBtn :reloadIndexData="reloadIndexData" :link="link"/>
         <form @submit.prevent="filterData()">
          <div class="filter-result mt-20">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>From</label>
                  <input type="date" v-model="from" class="form-control">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>To</label>
                  <input type="date" v-model="to" class="form-control">
                </div>
              </div>
            </div>
            <div class="text-center mt-20">
              <input type="submit" value="Filter" class="btn btn-info">
            </div>
          </div>
        </form>
       
          <div class="row mt-50">
            <div class="col-md-12">
              <div class="pull-right" v-if="store">
                <button @click="exportToPDF" class="btn btn-warning">Export to PDF</button>
              </div>
              <div class="table-responsive" id="record-data">
                <div class="message text-center">
                  {{ message }}
                </div>
                <table class="styled-table" id="payment-details" v-if="store">
                  <thead>
                    <tr>
                      <th class="bg-lightblue">Date</th>
                      <th v-for="payment_type_name in store.paymentNames" :key="payment_type_name">
                        {{payment_type_name}} &#x20A6;
                      </th>
                    </tr>
                  </thead>
                  <tbody id="tbody">
                    <tr v-for="(d, meeting_calendar) in store.memberPassbook" :key="meeting_calendar">
                      <td class="bg-lightblue"><b>{{meeting_calendar}}</b></td>
                      <td v-for="(payment_type_name) in store.paymentNames" :key="meeting_calendar + '|' + payment_type_name">
                        <!-- Conditionally render based on payment_type_name -->
                        <span v-if="payment_type_name !== 'Loan Interest' && payment_type_name !== 'Loan Repaid' && payment_type_name !== 'Minute' && payment_type_name !== 'Bank Interest'">
                          <b>{{`Cr: ${Number(d[payment_type_name].credit).toLocaleString()} - Bal: ${Number(d[payment_type_name].balance).toLocaleString()}`}}</b>
                        </span>
                        <span v-else>
                          <b>{{`Cr: ${Number(d[payment_type_name].credit).toLocaleString()}`}}</b>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
               
              </div>
              <!-- <div v-else>
                <div class="warning-div text-center">
                  <span>
                    {{noPassbook}}
                  </span>
                </div>
              </div> -->
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
import RefreshAndBackBtn from '@/components/includes/RefreshAndBackBtn'
import { mapActions, mapGetters } from 'vuex'
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

export default {
  name: 'myPayments',
  components: {
    HeaderNav,
    FooterBar,
    RefreshAndBackBtn
  },
  data(){
    return{
      pageTitle: null,
      previousPage: 'Dashboard',
      noPassbook: null,
      store:null,
      link: '/payments/membersDue',
      from: '',
      to: '',
      message: '',
      hasError: false,
      errorMessage: '',
      member_name: ''
    }
  },

  methods: {
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapActions("app/member_payment", ["getMemberPassbookForAdmin"]),
    ...mapActions("app/member", ["getOneMember"]),

    reloadIndexData(){
      this.getMemberPassbookForAdmin({society_id:this.$route.params.society_id, member_id:this.$route.params.member_id})
      .then(data=>{
        if (data){
          this.$data.store = data;
        } 
      })
    },

    filterData(){
      if (this.$data.from == ""){
        this.$data.hasError = true
      } else {
        this.$data.hasError = false
      }

      if (this.$data.hasError == false){
        this.getMemberPassbookForAdmin({society_id:this.$route.params.society_id, member_id:this.$route.params.member_id, from:this.$data.from, to:this.$data.to})
        .then(response=>{
          if (response){
            this.$data.store = response;
            this.$data.message = `Payments/Transactions from ${this.$data.from} to ${this.$data.to ? this.$data.to : 'date'} for ${this.$data.member_name}`
          } 
        })
      } else {
        this.$data.errorMessage = 'Please select necessary date parameters'
      }
    },

    async exportToPDF() {
      const element = document.getElementById('record-data');
      const canvas = await html2canvas(element, {
        scale: 1, // Lower scale reduces image resolution (default is 1, increase or decrease this)
      });
      const imgData = canvas.toDataURL('image/png', 0.8);

      const pdf = new jsPDF({
        orientation: 'portrait', // 'portrait' or 'landscape'
        unit: 'pt',
        format: 'a4',
        compressPdf: true
      });

      // Define the left, right, top, and bottom margins
      const leftMargin = 10; // Left margin in points (pt)
      const rightMargin = 10; // Right margin in points (pt)
      const topMargin = 10; // Top margin
      const bottomMargin = 10; // Bottom margin

      const pageWidth = pdf.internal.pageSize.getWidth(); // Get PDF page width
      const pageHeight = pdf.internal.pageSize.getHeight(); // Get PDF page height

      // Calculate available width and height for the image
      const availableWidth = pageWidth - leftMargin - rightMargin; // Subtract left and right margins from page width
      const availableHeight = pageHeight - topMargin - bottomMargin; // Subtract top and bottom margins from page height

      // Get the dimensions of the image
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = availableWidth; // Set image width to available width
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width; // Maintain aspect ratio

      // Ensure the image height fits within the available height
      const finalHeight = imgHeight > availableHeight ? availableHeight : imgHeight;

      // Add the image to the PDF with left, right, and top margins
      pdf.addImage(imgData, 'JPEG', leftMargin, topMargin, imgWidth, finalHeight);
      pdf.save('my_statement_of_account.pdf');
    }
  },

  

  created(){
    this.getOneMember(this.$route.params.member_id)
    .then(data2=> {
      if (data2) {
        this.$data.member_name = data2.name
        this.$data.pageTitle = `Payment Record for ${this.$data.member_name}`
      }
    })

    this.getMemberPassbookForAdmin({society_id:this.$route.params.society_id, member_id:this.$route.params.member_id, from:this.$data.from, to:this.$data.to})
    .then(data=>{
      if (data){
        this.$data.store = data;
        this.$data.message = `All Time Payment Records for ${this.$data.member_name}`
      } 
    })
  },

  computed: {
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    ...mapGetters("app/member", {memberError:"error", memberIsLoading:"isLoading"})
  }
}
</script>