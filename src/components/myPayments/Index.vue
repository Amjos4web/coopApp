<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="sMIsLoading || societyIsLoading">
          <div class="text-center" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        
        <div class="container" v-else>
          <div v-if="smError">
          <div class="error-div text-center">
            <span>
              {{smError.message}}
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
        <div v-if="noSocietyError">
          <div class="error-div text-center">
            <span>
              {{noSocietyError}}
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
          
          <div v-if="memberPaymentIsLoading" class="mt-20">
            <div class="text-center" :style="{width: '100%'}">
              <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
            </div>
          </div>
          
          <div class="filter-result" v-if="store">
            <form @submit.prevent="fetchPassbookEventHandler()">
              <div class="row">
                <div class="col-md-8 m-auto">
                  <div class="form-group">
                    <select class="form-control" v-model="query.society_id">
                      <option value="">Select Your Society</option>
                      <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                  <div class="text-center mt-20">
                    <input type="submit" value="Show my Passbook" class="btn btn-primary">
                  </div>
                </div>
              </div>
            </form>
            <hr>
            <form @submit.prevent="filterData()">
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
              <div class="text-center">
                <input type="submit" value="Filter" class="btn btn-primary">
              </div>
            </form>
          </div>
          
          <div class="row mt-50">
            <div class="col-12">
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
            </div>
          </div>
        </div>
      </div>
    <FooterBar/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer';
import { mapActions, mapGetters } from 'vuex'
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

export default {
  name: 'myPayments',
  components: {
    HeaderNav,
    FooterBar
  },
  data(){
    return{
      societies: [],
      query:{
        society_id:''
      },
      noSocietyError: null,
      noPassbook: null,
      store:{},
      from: '',
      to:'',
      message: '',
      hasError: false,
      errorMessage: ''
    }
  },

  methods: {
    ...mapActions("app/society_member", ["fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapActions("app/member_payment", ["getMemberPassbookForMember"]),

    fetchPassbookEventHandler(){
      const society_id = this.$data.query.society_id
      const from  = this.$data.from
      const to  = this.$data.to

      if (society_id.length === 0){
        this.$data.noSocietyError = 'Society is required'
      } else {
        this.getMemberPassbookForMember({society_id:society_id, from:from, to:to})
        .then(data=>{
          if (data){
            this.$data.store = data;
          } 
        })
        this.$data.message = 'All Time Payment Records'
        this.$data.noSocietyError = null
        this.$data.from = ''
        this.$data.to = ''
      }
    },

    filterData(){
      if (this.$data.from == ""){
        this.$data.hasError = true
      } else {
        this.$data.hasError = false
      }

      if (this.$data.hasError == false){
        this.getMemberPassbookForMember({society_id:this.$data.query.society_id, from:this.$data.from, to:this.$data.to})
        .then(data=>{
          if (data){
            this.$data.store = data;
            this.$data.message = `Payments/Transactions from ${this.$data.from} to ${this.$data.to ? this.$data.to : 'date'}`
          } 
        })
        this.$data.noSocietyError = null
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
    this.fetchAllSocietyToWhichIBelongs()
    .then(data=>{
      if (data){
        // gather all society IDs to fetch society name
        const societyIDs = data.societyMembers.map(sm=>sm.society_id)
        this.fetchManySociety(societyIDs)
        .then(response=>{
          if (response){
            this.$data.societies = response.societies
          }
        })
      } 
    })
  },

  computed: {
    ...mapGetters("app/society_member", {sMIsLoading:"isLoading", smError:"error"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"})
  },

}
</script>
<style scoped>
.message {
  font-size: 18px;
  font-weight: bold;
}
</style>