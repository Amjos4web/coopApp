<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div class="container">
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Payment Name</th>
                  <th>Type</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <PaymentTypeList :payTypes="payTypes" :isLoading="isLoading" :error="error" :getOnePayTypeEventHandler="getOnePayTypeEventHandler"/>
            </table>
          </div>
        </div> 
      </div>
      <FooterBar/>
    <AddPaymentTypeModal :updatePayTypesOnParent="updatePayTypesOnParent" :paymentType="paymentType" ref="modal"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import PaymentTypeList from '@/components/settings/PaymentTypeList'
import AddPaymentTypeModal from '@/components/settings/AddPaymentTypeModal'
import { openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters } from 'vuex'

const initPayTypes = { name:'', type:'' }

export default {
  name: 'paymentTypes',
  components: {
    HeaderNav,
    FooterBar,
    PaymentTypeList,
    AddPaymentTypeModal,
  },
  data(){
     return{
      pageTitle: 'Payment Types',
      previousPage: 'Dashboard',
      notificationMessage: 'Add new payment type',
      successMsg: '',
      payTypes: [],
      paymentType: initPayTypes 
    } 
  },
  methods: {
    ...mapActions("app/payment_type", ["getPaymentTypes", "getOnePaymentType"]),
    showModal(){
      let element = this.$refs.modal.$el
      openModal(element);
    },
    hideModal(){
      let element = this.$refs.modal.$el
      closeModal(element)
    },
    updatePayTypesOnParent(paymentType, isUpdate){
      if(isUpdate){
        this.$data.payTypes = this.$data.payTypes.map(
          p=>((p.id.toString() === paymentType.id.toString()) ? paymentType : p)
        )
        this.$toasted.show(`Payment type updated successfully`, { 
          type: "success", 
          icon: 'check-circle'
        })
      }else{
        this.$data.payTypes = [paymentType, ...this.$data.payTypes]
        this.$toasted.show(`Payment type created successfully`, { 
          type: "success", 
          icon: 'check-circle'
        })
      }
      //initialize role
      this.$data.paymentType = initPayTypes
      // hide modal
      this.hideModal()
    },
    getOnePayTypeEventHandler(id){
      this.getOnePaymentType(id)
      .then(paymentType=>{
        if(paymentType){
          this.$data.paymentType = paymentType;
          //raise modal here
          this.showModal();
        }//end if
      })//end then
    }
  },
  computed: {
    ...mapGetters("app/payment_type", ["isLoading", "error"]),
  },
  created(){
    this.getPaymentTypes()
    .then(data => {
      // check if data is not null
      if(data){
        // save to trigger rerendering
        this.$data.payTypes = data.paymentTypes
      }
    })
  }
}
</script>
