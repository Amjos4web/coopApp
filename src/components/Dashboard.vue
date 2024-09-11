<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
			<div id="page-inner">
        <div v-if="memberIsLoading || societyIsLoading || smIsLoading || selfIsLoading">
          <div class="text-center mb-20" :style="{width: '100%'}">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
          </div>
        </div>
        <div v-if="smError">
          <div class="error-div text-center">
            <span>{{ smError.message }}</span>
          </div>
        </div>
        <div class="dashboard-cards"> 
					<div class="row">
						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image red">
									<i class="material-icons dp48">import_export</i>
								</div>
								<div class="card-stacked red">
									<div class="card-content">
										<h3>84,198</h3> 
									</div>
									<div class="card-action">
										<strong>SOCIETIES</strong>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image orange">
									<i class="material-icons dp48">shopping_cart</i>
								</div>
								<div class="card-stacked orange">
									<div class="card-content">
										<h3>36,540</h3> 
									</div>
									<div class="card-action">
										<strong>MEMBERS</strong>
									</div>
								</div>
							</div> 
						</div>
						
						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image blue">
									<i class="material-icons dp48">equalizer</i>
								</div>
								<div class="card-stacked blue">
									<div class="card-content">
										<h3>24,225</h3> 
									</div>
									<div class="card-action">
										<strong>PRODUCTS</strong>
									</div>
								</div>
							</div> 
						</div>
						
						<div class="col-xs-12 col-sm-6 col-md-3">
							<div class="card horizontal cardIcon waves-effect waves-dark">
								<div class="card-image green">
									<i class="material-icons dp48">supervisor_account</i>
								</div>
								<div class="card-stacked green">
									<div class="card-content">
										<h3>88,658</h3> 
									</div>
									<div class="card-action">
										<strong>VISITS</strong>
									</div>
								</div>
							</div> 
						</div>
					</div>
				</div>

        <div class="row">
					<div class="col-xs-12 col-sm-12 col-md-12"> 
						<div class="cirStats">
							<div class="row">
								<div class="col-xs-12 col-sm-6 col-md-6"> 
										<div class="card-panel text-center">
											<h4>Profit</h4>
											<div class="easypiechart" id="easypiechart-blue" data-percent="82" ><span class="percent">82%</span>
											</div> 
										</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-6"> 
									<div class="card-panel text-center">
										<h4>No. of Visits</h4>
										<div class="easypiechart" id="easypiechart-red" data-percent="46" ><span class="percent">46%</span>
										</div>
									</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-6"> 
									<div class="card-panel text-center">
										<h4>Customers</h4>
										<div class="easypiechart" id="easypiechart-teal" data-percent="84" ><span class="percent">84%</span>
										</div> 
									</div>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-6"> 
									<div class="card-panel text-center">
										<h4>Sales</h4>
										<div class="easypiechart" id="easypiechart-orange" data-percent="55" ><span class="percent">55%</span>
										</div>
									</div>
								</div>  
							</div>
						</div>							
					</div><!--/.row-->
				</div>
        <div class="row padding" v-if="member">
          <div class="panel panel-default">
            <div class="panel-heading">
              <i class="fa fa-user"></i> My Profile
            </div>
            <!-- /.panel-heading -->
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 text-center">
                  <img src="@/assets/passports/avata.png" class="avatar">
                </div>
                <div class="col-md-8">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
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
          <div class="panel panel-default">
            <div class="panel-heading">
              <i class="fa fa-money"></i> My Assets
            </div>
            <!-- /.panel-heading -->
            <div class="panel-body">
              <div class="row">
                <div class="col-md-12 text-center">
                  <select class="form-control" @change="getTotalAsset($event)">
                    <option value="">Select Society</option>
                    <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                  </select>
                  <div v-if="memberPaymentIsLoading">
                    <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                  </div>
                  <div v-else-if="memberPaymentError">
                    <div class="error-div">
                      <span>{{memberPaymentError.message}}</span>
                    </div>
                  </div>
                  <div v-else>
                    <h4 class="custom-heading">Total Asset: &#8358;{{totalAsset}}</h4>
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
</template>

<script>
import HeaderNav from '@/components/includes/headerNav'; 
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import { closeNavbar, toggleAvatarDropDown } from "../assets/js/helpers/utility";
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    HeaderNav,
    PageHeader
  },

  data:()=>({
    fetchManySocietyError:null, 
    societyName:'', 
    societies: [], 
    totalAsset:0.0,
    member:[],
    pageTitle: 'Dashboard',
    previousPage: 'Dashboard'
  }),

  methods: {
    ...mapActions("app/member_payment", ["fetchMyTotalAsset"]),
    ...mapActions("app/society_member", ["fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/auth", ["getSelf"]),
    ...mapActions("app/society", ['fetchManySociety']),
    ...mapActions("app/member", ["getOneMember"]),

    getTotalAsset(event){
      
      const society_id = event.target.value
      
      this.$data.totalAsset = 0.0

      if (society_id != ""){
        this.fetchMyTotalAsset(society_id)
        .then(data => {
          console.log(data)
          if(data){
            this.$data.totalAsset = data.totalAsset
          }
        })
      }
      
    }
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
          .then(data=>{
            if(data){
              this.$data.societyName = data.societies.reduce((prevVal, s)=>{
                prevVal.push(s.name);
                return prevVal;
              }, []).join(", ")

              this.$data.societies = data.societies.map(s=>({name:s.name, id:s.id}))
            }
          })
          .catch(e=>this.$data.fetchManySocietyError=e)
        }//end else
      }//end if
    })//end then

    this.getSelf()
    .then(result => {
      console.log(result)
      if (result){
        const member_id = result.member_id
        this.getOneMember(member_id)
        .then(data => {
          if (data){
            this.$data.member = data.member
          }
        })
      }
    })
  },

  computed: {
    ...mapGetters("app/society_member", {smIsLoading:"isLoading", smError:"error"}),
    ...mapGetters("app/auth", {selfIsLoading:"isLoading", selfError:"error"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
    ...mapGetters("app/member", {memberIsLoading:"isLoading", memberError:"error"}),
    ...mapGetters("app/member_payment", {memberPaymentIsLoading:"isLoading", memberPaymentError:"error"}),
    
  },

  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
 
}
</script>
