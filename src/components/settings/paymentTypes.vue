<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="successMsg">
          <div class="text-center success-div">
            <span>
              {{ successMsg }}
            </span>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> {{ notificationMessage }}</p>
                <p class="export-btn"><button class="btn btn-warning btn-sm" @click="showModal"><i class="fa fa-plus"></i>&nbsp;Add New Payment Type</button></p>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="theading">
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
    </div>  
    <AddPaymentTypeModal :updatePayTypesOnParent="updatePayTypesOnParent" :paymentType="paymentType" ref="modal"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import PaymentTypeList from '@/components/settings/PaymentTypeList'
import AddPaymentTypeModal from '@/components/settings/AddPaymentTypeModal'
import { closeNavbar, toggleAvatarDropDown, openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'

const initPayTypes = { name:'', type:'' }

export default {
  name: 'paymentTypes',
  components: {
    HeaderNav,
    PageHeader,
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
        this.$data.successMsg = 'Payment type updated successfully'
      }else{
        this.$data.payTypes = [paymentType, ...this.$data.payTypes]
        this.$data.successMsg = 'Payment type created successfully'
      }
      //initialize role
      this.$data.paymentType = initPayTypes
      // hide modal
      this.hideModal()
    },
    getOnePayTypeEventHandler(id){
      //console.log(id);
      this.getOnePaymentType(id)
      .then(paymentType=>{
        console.log(paymentType)
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
  },
  mounted(){
    closeNavbar()
    toggleAvatarDropDown()
  }
}
</script>
