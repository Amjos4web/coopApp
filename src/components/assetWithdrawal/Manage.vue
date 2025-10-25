<template>
    <div>
      <HeaderNav/>
        <div id="content-page" class="content-page">
          <div class="container">
              <div class="filter-result">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Select society</label>
                      <select class="form-control" v-model="query.filter.society_id">
                        <option value="">Select Society</option>
                        <option v-for="s in societies" :key="s.id" :value="s.id">{{ s.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Enter Member's Name</label>
                      <input type="text" v-model="query.filter.name" class="form-control">
                    </div>
                  </div>
                   <div class="col-md-4">
                    <div class="form-group">
                      <label>Payment Type</label>
                      <select v-model="query.filter.payment_type_id" class="form-control">
                        <option value="">Choose an Option</option>
                        <option v-for="pt in paymentTypes" :key="pt.id" :value="pt.id">{{ pt.name }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>From</label>
                      <input type="date" v-model="query.filter.from" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>To</label>
                      <input type="date" v-model="query.filter.to" class="form-control">
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center mt-10">
                <button type="button" class="btn btn-info" @click="getAssWithEventHandler()">Filter Result</button>
              </div>
          </div>
          
          <div class="container">
            <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit" :reloadIndexData="reloadIndexData"/>
           
            <div class="table-responsive">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Society</th>
                    <th>Payment Type</th>
                    <th>Amount Withdrawn</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <AssetWithdrawalList 
									:assetWithdrawals="assetWithdrawals"
									:limit="pagination.limit"
									:currentPage="pagination.currentPage" 
									:assetWithdrawalIsLoading="assetWithdrawalIsLoading"
									:assetWithdrawalError="assetWithdrawalError"
                  :getOneAssetWithdrawalEventHandler="getOneAssetWithdrawalEventHandler"
                  :removeAssetWithdrawalEventHandler="removeAssetWithdrawalEventHandler"
								/>
              </table>
            </div>
          </div> 
          <Pagination :pagination="pagination" :changePage="changePage"/>
        </div>
        <FooterBar />

				<UpdateAssetWithdrawalModal ref="updateAssWithModal" :memberName="memberName" 
        :assetWithdrawal="assetWithdrawal"
        :paymentTypes="paymentTypes"
				:updateParentComponentForAssetWithdrawalChange="updateParentComponentForAssetWithdrawalChange"
				:assetWithdrawalIsLoading="assetWithdrawalIsLoading"
				:assetWithdrawalError="assetWithdrawalError"/>
      </div>
      
  </template>
  
  <script>
  import HeaderNav from '@/components/includes/headerNav';
  import FooterBar from '@/components/includes/Footer'
  import Pagination from '@/components/includes/Pagination'
  import LimitDataFetch from '@/components/includes/LimitDataFetch'
  import { mapActions, mapGetters } from 'vuex';
  import { closeModal, openModal } from "../../assets/js/helpers/utility";
  import { turnArrayToObject } from '../../utility';
  import AssetWithdrawalList from '@/components/assetWithdrawal/AssetWithdrawalList.vue';
  import UpdateAssetWithdrawalModal from '@/components/assetWithdrawal/UpdateAssetWithdrawalModal.vue';

  const initAssetWithdrawal = { member_id:"", society_id:"", payment_type_id:"", amount:"" }
  
  export default {
    name: 'ManageAssetWithDrawal',
    components: {
      HeaderNav,
      FooterBar,
      AssetWithdrawalList,
      UpdateAssetWithdrawalModal,
      Pagination,
      LimitDataFetch,
    },
    data() {
      return{
        query: {
          filter:{
            society_id: '',
            name: '',
            payment_type_id: '',
            to: '',
            from:'',
          },
          limit:200,
          page:1
        },
        pageTitle: 'Manage Asset Withdrawal',
        previousPage: 'Dashboard',
        notificationMessage: '',
        assetWithdrawals: [],
        societies: [],
				paymentTypes: [],
        pagination: {},
        memberName: '',
        assetWithdrawal: initAssetWithdrawal
      } 
    },
  
    methods: {
      ...mapActions("app/society", ["getSocieties", "fetchManySociety"]),
			...mapActions("app/payment_type", ["getPaymentTypes", "fetchManyPaymentTypes"]),
			...mapActions("app/asset_withdrawal", ["fetchAllAssetWithdrawalData", "getOneAssetWithdrawal", "removeAssetWithdrawal"]),
      ...mapActions("app/member", ["fetchManyMember"]),

			openUpdateAssWithModal(){
				let element = this.$refs.updateAssWithModal.$el
				openModal(element)
			},

      closeAssetWithdrawalModal(){
        let element = this.$refs.updateAssWithModal.$el
        closeModal(element)
      },

      getOneAssetWithdrawalEventHandler(id){
        this.getOneAssetWithdrawal(id)
        .then(assetWithdrawal => {
          if (assetWithdrawal){
            this.$data.assetWithdrawal = assetWithdrawal
            // open modal
            this.openUpdateAssWithModal()
          }
        })
      },

      removeAssetWithdrawalEventHandler(id){
        this.removeAssetWithdrawal(id)
        .then(response => {
          if (response.success){
            this.$data.assetWithdrawals = this.$data.assetWithdrawals.filter(assWith => assWith.id !== id)
            this.$toasted.show(response.msg, { 
              type: "success", 
              icon: 'check-circle'
            })
          } else {
            this.$toasted.show(response.msg, { 
              type: "error", 
              icon: 'check-circle'
            })
          }
        })
      },
     
      getAssWithEventHandler(reload=false){
        this.fetchAllAssetWithdrawalData({reload, query:this.$data.query})
        .then(data => {
          if (data){
            // get all memberIDs
            const memberIDs = []//data.assetWithdrawals.map(assWith=>assWith.member_id)
            const societyIDs = []//data.assetWithdrawals.map(assWith=>assWith.society_id)
						const paymentTypeIDs = [] //data.assetWithdrawals.map(assWith=>assWith.payment_type_id)
  
            let assWith = null
            if (data.assetWithdrawals.length < 1){
              this.$data.assetWithdrawals = [];
              return;
            }
  
            for(let i = 0; i < data.assetWithdrawals.length; i++){
              assWith = data.assetWithdrawals[i];
              memberIDs.push(assWith.member_id)
              societyIDs.push(assWith.society_id)
							paymentTypeIDs.push(assWith.payment_type_id)
            }//end for loop
  
            Promise.all([
              this.fetchManyMember(memberIDs),
              this.fetchManySociety(societyIDs),
              this.fetchManyPaymentTypes(paymentTypeIDs)
            ])
            .then(results=>{
              const memberObj = turnArrayToObject(results[0].members)
              const societyObj = turnArrayToObject(results[1].societies)
              const paymentTypeObj = turnArrayToObject(results[2].paymentTypes)

              this.$data.assetWithdrawals = data.assetWithdrawals.map(assWith=>{
                
                const m = memberObj[assWith.member_id]
                const s = societyObj[assWith.society_id]
                const pt = paymentTypeObj[assWith.payment_type_id]
  
                assWith.member_name = m ? m.name : "Unknown"
                assWith.member_society = s ? s.name : "Unknown"
                assWith.payment_type_name = pt ? pt.name : "Unknown"

                return assWith;
              })//end map
              this.$data.pagination = data.pagination
            })
            .catch(e=>this.$data.fetchManyError=e)
          }
        })
      },
  
      changePage(page, limit){
        this.getAssWithEventHandler({query:{page, limit:1000}})
      },
      
      getLimit(event){
        this.$data.query.limit = event.target.value;
        this.getAssWithEventHandler()
      },//end method getLimit,
  
      updateParentComponentForAssetWithdrawalChange(msg, assetWithdrawal, updated){
        if (updated){
          this.$data.assetWithdrawals = this.$data.assetWithdrawals.map(
            assWith=>{
              if(assWith.id.toString() === assetWithdrawal.id.toString()){
                assWith.amount = assetWithdrawal.amount
              }
              return assWith
            }
          )
          this.$toasted.show(msg, { 
            type: "success", 
            icon: 'check-circle'
          })
          this.closeAssetWithdrawalModal()
        }
      },
  
      reloadIndexData(){
        this.getAssWithEventHandler(true, this.$data.query)
      }
    },
  
    created() {
			this.getSocieties({query:{limit:500}})
			.then(data => {
        if (data){
					this.$data.societies = data.societies
        }
			})

			this.getPaymentTypes()
			.then(data => {
			// check if data is not null
				if(data){
					// save to trigger rerendering
					this.$data.paymentTypes = data.paymentTypes
				}
			})
    
			this.getAssWithEventHandler({query:{limit:1000}})
    },
  
    computed: {
      ...mapGetters("app/asset_withdrawal", {assetWithdrawalError:"error", assetWithdrawalIsLoading:"isLoading"}),
      ...mapGetters("app/society", {getSocietiesIsLoading:'isLoading', getSocietiesError:'error'})
    }
  }
  </script>
  