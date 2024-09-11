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
          <div class="box" >
            <div v-if="isLoading">
              <div class="text-center">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
              </div>
            </div>
            <div class="row" v-else>
              <div class="form-group">
                <div class="row">
                  <div class="form-group col s12">
                    <label for="Society Name">Society Name</label>
                    <select class="form-control" @change="getsocietyMinimumAmount($event)">
                      <option value="">Choose a society</option>
                      <option v-for="society in societies" :key="society.id" :value="society.id">{{ society.name }}</option>
                    </select>
                    <span class="error"></span>
                  </div>
                </div>
              </div>
              <GetSocietyMinimumAmount :societyPaymentMinAmounts="societyPaymentMinAmounts" 
              :openAddNewPaymentTypeModal="openAddNewPaymentTypeModal"
              :disableBtn="disableBtn"
              :editSocietyMinimumPaymentTypeEventHandler="editSocietyMinimumPaymentTypeEventHandler"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddNewPaymentTypeToSocietyModal ref="modal" 
    :paymentTypes="paymentTypes" 
    :currentSocietyPaymentMinAmt="currentSocietyPaymentMinAmt"
    :society_name="societyName"
    :modalTitle="modalTitle"
    :updateSocietyPaymentTypeOnParent="updateSocietyPaymentTypeOnParent"/>
  </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import GetSocietyMinimumAmount from '@/components/societies/GetSocietyMinimumAmount'
import AddNewPaymentTypeToSocietyModal from '@/components/societies/AddNewPaymentTypeToSocietyModal'
import { closeNavbar, toggleAvatarDropDown, closeModal, openModal } from "../../assets/js/helpers/utility"
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from "../../utility"

const init = {payment_type_id:'', id:null, min_amount:''}

export default {
  name: 'SetMinimumAmount',
  components: {
    HeaderNav,
    PageHeader,
    GetSocietyMinimumAmount,
    AddNewPaymentTypeToSocietyModal
  },
  data(){
    return{
      pageTitle: 'Set Minimum Amount',
      previousPage: 'Dashboard',
      notificationMessage: null,
      societyPaymentMinAmounts: [],
      paymentTypes: [],
      societies: [],
      society_id: '',
      successMsg: '',
      societyName: '',
      disableBtn: true,
      modalTitle: '',
      currentSocietyPaymentMinAmt:init,
    } 
  },
  methods: {
    ...mapActions("app/payment_type", ["getPaymentTypes"]),
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
    ...mapActions(
      "app/society_payment_minimum_amount", [
        "getSocietyPaymentsMinAmount",
        "addNewSocietyPaymentMinAmount", 
        "updateSocietyPaymentMinimumAmount",
        "getOneSocietyPaymentMinAmount"
      ]
    ),

    showModal(){
      let element = this.$refs.modal.$el
      openModal(element);
    },

    hideModal(){
      let element = this.$refs.modal.$el
      closeModal(element);
    },

    getsocietyMinimumAmount(event){
      const society_id = event.target.value
      if(!society_id || society_id == "") return

      this.getOneSociety(society_id)
      .then(society => {
        if (society){
          this.getSocietyPaymentsMinAmount({society_id})
          .then(data => {
            //console.log(data);
            if (data){
            
              this.$data.societyPaymentMinAmounts = this.addPaymentNameToSocietyPaymentMinAmounts(
                data.societyPaymentMinAmounts
              )
              this.$data.disableBtn = false
              this.$data.society_id = society_id
              this.$data.societyName = society.name
            }
          })
        }
      })
    },

    addPaymentNameToSocietyPaymentMinAmounts(societyPaymentMinAmounts){
      const paymentTypesObj = turnArrayToObject(this.$data.paymentTypes)
      //console.log(paymentTypesObj)
      return societyPaymentMinAmounts.map(spm=>{
        spm.payment_name = paymentTypesObj[spm.payment_type_id] ? paymentTypesObj[spm.payment_type_id].name : "Unknown";
        return spm 
      })
    },

    updateSocietyPaymentTypeOnParent(formData){
     
      const id = this.$data.currentSocietyPaymentMinAmt.id//this.$props.society_id

      formData.society_id = this.$data.society_id

      this.$data.currentSocietyPaymentMinAmt = init;

      if (id){
        this.updateSocietyPaymentMinimumAmount({id, formData })
        .then(minAmount => {
        
          if (minAmount){
            this.$data.societyPaymentMinAmounts = this.addPaymentNameToSocietyPaymentMinAmounts(
              this.$data.societyPaymentMinAmounts.map(
                p=>((p.id.toString() === minAmount.id.toString()) ? minAmount : p)
              )
            )
            // hide modal
            this.hideModal();
            this.$data.successMsg = 'Minimum payment amount updated successfully'
          }// end if
        }) // end then
      } else {
        this.addNewSocietyPaymentMinAmount(formData)
        .then(minAmount => {

          if (minAmount) {
            this.$data.societyPaymentMinAmounts = this.addPaymentNameToSocietyPaymentMinAmounts(
              [minAmount, ...this.$data.societyPaymentMinAmounts]
            )
            // hide modal
            this.hideModal();
            this.$data.successMsg = 'Minimum payment amount set successfully'
          } // end if   
        })// end then
      }
    },

    openAddNewPaymentTypeModal(){
      this.$data.modalTitle = `Setting minimum payment amount for ${this.$data.societyName}`
      this.showModal(); 
    },

    elementHasError(elemID){
      return ((
        this.error 
        && this.error.errors 
        && this.error.errors[elemID] 
        && this.error.errors[elemID].length > 0
      ) ? true : false)
    },

    editSocietyMinimumPaymentTypeEventHandler(id){
      this.getOneSociety(id)
      .then(society => {
        if (society){ 
          this.getOneSocietyPaymentMinAmount(id)
          .then(societyPayMinAmt=>{
            console.log(societyPayMinAmt)
            if(societyPayMinAmt){
              this.$data.currentSocietyPaymentMinAmt = societyPayMinAmt
              this.showModal()
            }
          })
        }
      });
    }
  },
  
  computed: {
    ...mapGetters("app/payment_type", ["isLoading", "error"]),
    ...mapGetters("app/society", ["error", "isLoading"])
  },
  created(){
    // get all societies
    this.getSocieties()
    .then(data => {
      if(data){
        this.$data.societies = data.societies
      }
    })

    // get all payment types
    this.getPaymentTypes()
    .then(data => {
      // check if data is not null
      console.log(data)
      if(data){
        // save to trigger rerendering
        this.$data.paymentTypes = data.paymentTypes    
      }
    })
  },
  mounted(){
    closeNavbar()
    toggleAvatarDropDown()
  }
}
</script>
