<template>
  <div>
    <HeaderNav/>
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
      <div v-if="smIsLoading || societyIsLoading">
        <div class="text-center mb-20" :style="{width: '100%'}">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img"><br>       
        </div>
      </div>
      
			<div id="content-page" class="content-page" v-else>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Select the society to make payment for
            </h5>
            <div class="row">
              <div class="col-md-8 m-auto text-center">
                <select class="form-control" @change="getMyPayments($event)">
                  <option value="">Select society to view your asset</option>
                  <option v-for="s in societies" :value="s.id" :key="s.id">{{ s.name }}</option>
                </select>
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
import FooterBar from '@/components/includes/Footer'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'MakePaymentIndexPage',
  components: {
    HeaderNav,
    FooterBar,
  },

  data:() =>({
    pageTitle: 'Make Payment',
    previousPage: 'Dashboard',
    societies: [],
  }),

  methods: {
    ...mapActions("app/society_member", ["fetchAllSocietyToWhichIBelongs"]),
    ...mapActions("app/society", ['fetchManySociety']),

    getMyPayments(event){
      const society_id = event.target.value

      if(society_id !== ""){
        this.$router.push('/makePayment/analysis/' + society_id)
      }
    }
  },

  computed:{
    ...mapGetters("app/society_member", {smIsLoading:"isLoading", smError:"error"}),
    ...mapGetters("app/society", {societyIsLoading:"isLoading", societyError:"error"}),
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
  }
}
</script>
