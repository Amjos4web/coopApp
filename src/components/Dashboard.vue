<template>
  <div>
    <HeaderNav/>
			<div id="content-page" class="content-page">
        <div v-if="smError">
          <div class="error-div text-center">
            <span>{{ smError.message }}</span>
          </div>
        </div>
        <div v-if="societyError">
          <div class="error-div text-center">
            <span>{{ societyError.message }}</span>
          </div>
        </div>
        <div v-if="memberError">
          <div class="error-div text-center">
            <span>{{ memberError.message }}</span>
          </div>
        </div>
       
        <div v-if="roleError">
          <div class="error-div text-center">
            <span>{{ roleError.message }}</span>
          </div>
        </div>

         <div v-if="dashboardError">
          <div class="error-div text-center">
            <span>{{ dashboardError.message }}</span>
          </div>
        </div>

        <div v-if="memberPaymentError">
          <div class="error-div text-center">
            <span>{{ memberPaymentError.message }}</span>
          </div>
        </div>
        <div v-if="memberIsLoading || societyIsLoading || smIsLoading || selfIsLoading || roleIsLoading || dashboardIsLoading || memberPaymentIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div class="container-fluid" v-else>
          <div class="row" v-if="roleType == 'Manager' || roleType == 'ICT Director' || roleType == 'Super Admin'|| roleType == 'President' || roleType == 'Secretary'">
            <div class="col-sm-6 col-md-6 col-lg-3">
              <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                <div class="iq-card-body iq-box-relative">
                    <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-primary">
                      <i class="ri-focus-2-line"></i>
                    </div>
                    <p class="text-secondary">Total Societies</p>
                    <div class="d-flex align-items-center justify-content-between">
                      <h4><b>{{ totalSocieties }}</b></h4>
                    </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-3">
              <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                <div class="iq-card-body iq-box-relative">
                    <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
                      <i class="las la-user-tie iq-arrow-left"></i>
                    </div>
                    <p class="text-secondary">Total Members</p>
                    <div class="d-flex align-items-center justify-content-between">
                      <h4><b>{{ totalMembers }}</b></h4>
                    </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-3">
              <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                <div class="iq-card-body iq-box-relative">
                    <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-success">
                      <i class="ri-database-2-line"></i>
                    </div>
                    <p class="text-secondary">Total Members' Assets</p>
                    <div class="d-flex align-items-center justify-content-between">
                      <h4><b>&#x20A6;{{ Number(allMemberTotalAsset).toLocaleString() }}</b></h4>
                    </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-3">
              <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                <div class="iq-card-body iq-box-relative">
                    <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-warning">
                      <i class="ri-pie-chart-2-line"></i>
                    </div>
                    <p class="text-secondary">Total Members' Loan</p>
                    <div class="d-flex align-items-center justify-content-between">
                      <h4><b>&#x20A6;{{ Number(loanIssuedOut).toLocaleString() }}</b></h4>
                    </div>
                </div>
              </div>
            </div>
        </div>
        </div>
        
        <div class="row">
          <div class="col-md-6 col-sm-12 col-lg-6">
            <div class="card">
            <!-- /.panel-heading -->
              <div class="card-body">
                <h5 class="card-title">My Current Loan Balance</h5>
                <div class="row">
                  <div class="col-12">
                    <select class="form-control" @change="getLoanBalanceEventHandler($event)">
                      <option value="">Select society to view your current loan balance</option>
                      <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                    </select><br>
                    
                    <div class="col-12">
                      <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                        <div class="iq-card-body iq-box-relative">
                          <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
                            <i class="fa fa-money iq-arrow-left"></i>
                          </div>
                          <p class="text-secondary">Current Loan Balance</p>
                          <div class="d-flex align-items-center justify-content-between">
                            <h4><b>&#x20A6;{{ Number(currentLoanBalance).toLocaleString() }}</b></h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                </div>
              <!-- /.panel-body -->
              </div>
            </div>
          </div>

          <div class="col-md-6 col-sm-12 col-lg-6">
            <div class="card">
              <!-- /.panel-heading -->
                <div class="card-body">
                  <h5 class="card-title">My Assets</h5>
                  <div class="row">
                    <div class="col-12">
                      <select class="form-control" @change="getTotalAsset($event)">
                        <option value="">Select society to view your asset</option>
                        <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                      </select><br>
                     
                      <div class="col-12">
                        <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                          <div class="iq-card-body iq-box-relative">
                            <div class="iq-box-absolute icon iq-icon-box rounded-circle iq-bg-danger">
                              <i class="fa fa-money iq-arrow-left"></i>
                            </div>
                            <p class="text-secondary">Total Assets</p>
                            <div class="d-flex align-items-center justify-content-between">
                              <h4><b>&#x20A6;{{ Number(totalAsset).toLocaleString() }}</b></h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                
                </div>
                <!-- /.panel-body -->
            </div>
          </div>
        </div>
        
        <div v-if="roleType == 'Manager' || roleType == 'ICT Director' || roleType == 'Super Admin'|| roleType == 'President' || roleType == 'Secretary'">
          <div class="row">
            <div class="col-md-6 col-sm-12 col-lg-6">
              <div class="card" v-if="loanRequests">
              <!-- /.panel-heading -->
                <div class="card-body">
                  <h5 class="card-title">Latest Loan Request Status</h5>
                  <div class="table-responsive">
                    <table id="datatable" class="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Assets</th>
                          <th>Amount</th>
                          <th>View Details</th>
                          <!-- <th>Guarantors</th> -->
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody v-if="getLoanIsLoading">
                        <tr>
                          <td colspan="9">
                            <div class="text-center" :style="{width: '100%'}">
                              <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>
                              <small>Fetching data...</small>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else-if="getLoanError">
                        <tr>
                          <td colspan="9">
                            <div class="text-center" :style="{width: '100%'}">
                              <small>Unable to fetch data</small>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr v-for="loan in loanRequests" :key="loan.id">
                          <td>{{ loan.member_name }}</td>
                          <td>&#x20A6;{{ Number(loan.member_asset).toLocaleString() }}</td>
                          <td>&#x20A6;{{ Number(loan.amount_requested).toLocaleString() }}</td>
                          <td>
                            <a class="btn mb-3 btn-success rounded-pill" :style="{color: 'white'}">
                              <router-link :to="'/loan/member/details/' + loan.id">
                                Details
                              </router-link>
                            </a>
                          </td>
                          <!-- <td>
                            <a class="bg-success custom-link">
                              <router-link :to="'/loan/member/guarantors/' + loan.id">
                                Guarantors
                              </router-link>
                            </a>
                          </td> -->
                          <td>{{ loan.status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- /.panel-body -->
              </div>
            </div>
            <div class="col-md-6 col-sm-12 col-lg-6">
              <div class="card" v-if="member">
              <!-- /.panel-heading -->
                <div class="card-body">
                  <h5 class="card-title">My Profile</h5>
                  <div class="row">
                    <div class="col-md-4 text-center mb-20">
                      <img :src="member.passport" class="avatar" :alt="member.name">
                    </div>
                    <div class="col-md-8">
                      <div class="table-responsive">
                        <table id="datatable" class="table table-striped table-bordered">
                          <tbody>
                            <tr>
                              <th width="50%">Name</th>
                              <td>{{ member.name }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Email Address</th>
                              <td>{{ member.email ? member.email : 'No email address' }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Gender</th>
                              <td>{{ member.gender }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Phone Number</th>
                              <td>{{ member.phone }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Residential Address</th>
                              <td>{{ member.address }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Can Make Payment</th>
                              <td>{{ member.can_pay ? 'Yes' : 'No' }}</td>
                            </tr>
                            <tr>
                              <th>My Society(s)</th>
                              <td>{{societyName}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div> 
                </div>
                <!-- /.panel-body -->
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="row">
            <div class="col-12">
              <div class="card" v-if="member">
              <!-- /.panel-heading -->
                <div class="card-body">
                  <h5 class="card-title">My Profile</h5>
                  <div class="row">
                    <div class="col-md-4 text-center mb-20">
                      <img :src="member.passport" class="avatar" :alt="member.name">
                    </div>
                    <div class="col-md-8">
                      <div class="table-responsive">
                        <table id="datatable" class="table table-striped table-bordered">
                          <tbody>
                            <tr>
                              <th width="50%">Name</th>
                              <td>{{ member.name }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Email Address</th>
                              <td>{{ member.email ? member.email : 'No email address' }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Gender</th>
                              <td>{{ member.gender }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Phone Number</th>
                              <td>{{ member.phone }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Residential Address</th>
                              <td>{{ member.address }}</td>
                            </tr>
                            <tr>
                              <th width="50%">Can Make Payment</th>
                              <td>{{ member.can_pay ? 'Yes' : 'No' }}</td>
                            </tr>
                            <tr>
                              <th>My Society(s)</th>
                              <td>{{societyName}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div> 
                </div>
                <!-- /.panel-body -->
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
import { turnArrayToObject } from '../utility';

export default {
  name: 'dashboard-page',
  components: {
    HeaderNav,
    FooterBar
  },

  data:()=>({
    fetchManySocietyError:null, 
    societyName:'', 
    societies: [], 
    totalAsset:0.0,
    allMemberTotalAsset: 0.0,
    loanIssuedOut: 0.0,
    currentLoanBalance: 0.0,
    member:[],
    member_id:null,
    loanRequests: [],
    fetchManyError:null,
    totalMembers: 0,
    totalSocieties: 0,
    roleType:null,
    pageTitle: 'Dashboard',
    previousPage: 'Dashboard'
  }),

  methods: {
    ...mapActions("app/member_payment", ["fetchMyTotalAsset"]),
    ...mapActions("app/society_member", ["fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/auth", ["getSelf"]),
    ...mapActions("app/society", ['fetchManySociety']),
    ...mapActions("app/member", ["getOneMember"]),
    ...mapActions("app/dashboard", ["getDashboardIndexData", "getLoanPaymentBalance", "getAllMemberTotalAsset", "getAllLoanIssuedOut"]),
    ...mapActions("app/role_permission", ["getPermissionsRole"]),
    ...mapActions("app/role", ["getOneRole"]),
    ...mapActions("app/loan", ["loanIndex"]),
    ...mapActions("app/society", ["getSocieties"]),
    ...mapActions("app/member", ["fetchManyMember"]),
    ...mapActions("app/member_payment", ["fetchManyMemberTotalAssets"]),

    getTotalAsset(event){
      const society_id = event.target.value
      this.$data.totalAsset = 0.0

      if (society_id != ""){
        this.fetchMyTotalAsset(society_id)
        .then(data => {
          if(data){
            this.$data.totalAsset = data.totalAsset
          }
        })
      }
      
    },

    getLoanBalanceEventHandler(event){
      const society_id = parseFloat(event.target.value)
      const member_id  = this.self.member_id

      if (society_id !== "" && member_id !== ""){
        this.getLoanPaymentBalance({society_id, member_id})
        .then(currentLoanBalance => {
            if (currentLoanBalance){
              this.$data.currentLoanBalance = currentLoanBalance
            }
          })
        }
      },

      getLoansEventHandler(reload=false){
      this.loanIndex({query:this.$data.query, reload})
      .then(data => {
        if (data){
          // get all memberIDs
          const memberIDs = []//data.loanRequests.map(loan=>loan.member_id)

          const societyIDs = []//data.loanRequests.map(loan=>loan.society_id)
          const mappedSocietyIDWithMemberID = []

          let loan = null
          if (data.loanRequests.length < 1){
            this.$data.loanRequests = [];
            return;
          }

          for(let i = 0; i < data.loanRequests.length; i++){
            loan = data.loanRequests[i];
            memberIDs.push(loan.member_id)
            societyIDs.push(loan.society_id)
            mappedSocietyIDWithMemberID.push(`${loan.society_id}:${loan.member_id}`)
          }//end for loop

          Promise.all([
            this.fetchManyMember(memberIDs),
            this.fetchManySociety(societyIDs),
            this.fetchManyMemberTotalAssets(mappedSocietyIDWithMemberID),
          ])
          .then(results=>{
            const memberObj = turnArrayToObject(results[0].members)
            const societyObj = turnArrayToObject(results[1].societies)
            const totalAssetObj = turnArrayToObject(results[2].totalAssets)

            this.$data.loanRequests = data.loanRequests.map(loan=>{
              
              const m = memberObj[loan.member_id]
              const s = societyObj[loan.society_id]
              const t = totalAssetObj[`${loan.society_id}:${loan.member_id}`]

              loan.member_name = m ? m.name : "Unknown"
              loan.member_society = s ? s.name : "Unknown"
              loan.member_asset = t ? t.total_asset : "Unknown"
              
              return loan;
            })//end map
            this.$data.pagination = data.pagination
          })
          .catch(e=>this.$data.fetchManyError=e)
        }
      })
    },
  },
  
  created(){
    //fetch member society
    this.fetchAllSocietyToWhichIBelongs()
    .then(data=>{
      if(data){
        if(data.societyMembers.length < 1){
          this.$data.societyName = "No Society Yet"
        }else{
          this.fetchManySociety(data.societyMembers.map(sm=>sm.society_id))
          .then(data2=>{
            if(data2){
              this.$data.societyName = data2.societies.reduce((prevVal, s)=>{
                prevVal.push(s.name);
                return prevVal;
              }, []).join(", ")

              this.$data.societies = data2.societies.map(s=>({name:s.name, id:s.id}))
            }
          })
          .catch(e=>this.$data.fetchManySocietyError=e)
        }//end else
      }//end if
    })//end then

   
    this.getOneMember(this.self.member_id)
    .then(member => {
      if (member){
        this.$data.member = member
        this.$data.member_id = member.id
      }
    })
   
    this.getDashboardIndexData()
    .then((response)=>{
      if (response) {
        this.$data.totalMembers = response.members.total_member
        this.$data.totalSocieties = response.societies.total_society
      }
    })

    if(this.rolePermission){
      this.getOneRole(this.rolePermission.member_id)
      .then(role=>{
        if (role){
          this.$data.roleType = role.name
        }
      })
    }

    this.getAllMemberTotalAsset()
    .then(totalAssets => {
      if(totalAssets){
        this.$data.allMemberTotalAsset = totalAssets
      }
    })

    this.getAllLoanIssuedOut()
    .then(loanIssuedOut => {
      if(loanIssuedOut){
        this.$data.loanIssuedOut = loanIssuedOut
      }
    })

    this.getLoansEventHandler({query:{limit:200}})
  },

  computed: {
    ...mapGetters("app/society_member", {smIsLoading:"isLoading", smError:"error"}),
    ...mapGetters("app/auth", {selfIsLoading:"isLoading", selfError:"error", rolePermission:"rolePermission", self:"self"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    ...mapGetters("app/dashboard", {dashboardIsLoading:"isLoading", dashboardError:"error"}),
    ...mapGetters("app/role", {roleError:"error", roleIsLoading:"isLoading"}), 
    ...mapGetters("app/loan", {getLoanIsLoading:'isLoading', getLoanError: 'error'}),  
  },
 
}
</script>
