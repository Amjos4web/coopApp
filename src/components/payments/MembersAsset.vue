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
            <div class="box">
              <span class="error" v-if="societyMemberError">{{societyMemberError.message}}</span>
              <div v-if="memberIsLoading || societyMemberIsLoading">
                <div class="text-center">
                  <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
                </div>
              </div>
             
              <div class="row">
                <div class="form-group col-12">
                  <label for="Society Name">Society Name</label>
                  <select class="form-control" @change="getSocietyMembers($event)">
                    <option value="">Choose a society</option>
                    <option v-for="society in societies" :key="society.id" :value="society.id">{{ society.name }}</option>
                  </select>
                  
                </div>
              </div>
                
            </div>
            <span class="error" v-if="memberError">{{memberError.message}}</span>
            <div class="row text-center mt-50" v-if="fetchData">
              <div class="form-group col-sm-6 col-md-6 m-auto">
                <label for="member name">Enter Member's Name</label>
                <input type="text" v-model="memberSearchMeta" @keyup="searchMember()" class="form-control">
                <!-- <input type="text" v-model="filters.name.value" @keyup="searchMember()" class="form-control"> -->
              </div>
            </div>
            
            <SocietyMembersList :societyMembers="searchMemberResult"
            :societyName="societyName"
            :total="total"
            :currentDate="currentDate"
            />
          </div>
        </div>
        <FooterBar/>
      </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import SocietyMembersList from '@/components/payments/SocietyMembersListForAsset'
import { mapActions , mapGetters } from 'vuex'
import { turnArrayToObject } from '../../utility'

let dataResult = []
let serverData = []

export default {
  name: 'member-asset',
  components: {
    HeaderNav,
    FooterBar,
    SocietyMembersList
  },
  data(){
    return{
      pageTitle: 'Members Asset',
      previousPage: 'Dashboard',
      societies: [],
      successMsg: '',
      members: [],
      societyMembers: [],
      societyName: '',
      searchMemberResult: [],
      errorDisplay: '',
      currentSocietyID:null,
      memberSearchMeta: '',
      fetchData: false,
      message: '',
      total: 0,
      currentDate: new Date().toLocaleDateString(),
    } 
  },
  methods: {
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
    ...mapActions(
      "app/society_member", [
        "fetchMemberInSociety", 
        "societyMemberIndex",  
      ]),
    ...mapActions("app/member", ['fetchManyMember']),
    ...mapActions("app/member_payment", ["fetchManyMemberTotalAssets"]),
  
    getSocietyMembers(event){
      
      this.$data.societyMembers = []

      const val = event.target.value

      if(!val || val == "") return;

      this.getOneSociety(val)
      .then(society=>{
        if(society){
          this.$data.currentSocietyID = society.id
          this.$data.societyName = society.name
        }else{
          this.$data.currentSocietyID = null;
        }
        return society;
      })
      .then(society=>this.fetchMemberInSociety({society_id:society.id}))
      .then(data=>this.fetchMembers(data))
    }, 


    fetchMembers(data){
      if(data){
        const memberIDs = [] //data.societyMembers.map(sm=>sm.member_id)
        const mappedSocietyIDWithMemberID = []

        let memberAsset = null;

        for(let i = 0; i < data.societyMembers.length; i++){
          memberAsset = data.societyMembers[i];
          memberIDs.push(memberAsset.member_id)
          mappedSocietyIDWithMemberID.push(`${memberAsset.society_id}:${memberAsset.member_id}`)
        }//end for loop

        Promise.all([
          this.fetchManyMember(memberIDs),
          this.fetchManyMemberTotalAssets(mappedSocietyIDWithMemberID),
        ])

        .then(results=>{
          const memberObj = turnArrayToObject(results[0].members)
          const totalAssetObj = turnArrayToObject(results[1].totalAssets)

          this.$data.searchMemberResult = data.societyMembers.map(ma=>{
            
            const m = memberObj[ma.member_id]
            const t = totalAssetObj[`${ma.society_id}:${ma.member_id}`]

            ma.member_name = m ? m.name : "Unknown"
            ma.member_gender = m ? m.gender : "Unknown"
            ma.member_asset = t ? t.total_asset : 0
            ma.member_phone = m.phone ? m.phone : "Not available"
            
            return ma;
          })//end map

          const inTotal = results[1].totalAssets.reduce((pre, cur) => {
            return parseFloat(pre) + parseFloat(cur.total_asset)
          }, 0)

          this.$data.total = inTotal

          serverData = this.$data.searchMemberResult
          this.$data.searchMemberResult = dataResult = serverData
          this.$data.fetchData = true

          this.$data.pagination = data.pagination
          
        })
        .catch(e=>this.$data.fetchManyError=e)
      }//end if
    },

    searchMember(){
      const searchValue = this.$data.memberSearchMeta.toLocaleLowerCase()
      this.$data.searchMemberResult = dataResult.filter(
        m=>(
          (m.member_name.toLocaleLowerCase().indexOf(searchValue) > -1) 
          && (m.id != dataResult.member_id)
        )
      )
    },
  },

  created(){
    this.getSocieties({query:{limit:500}})
    .then(data=>{
      if (data){
        this.$data.societies = data.societies
      }
    })
  },

  computed: {
    ...mapGetters("app/society_member", {societyMemberError:"error", societyMemberIsLoading:"isLoading"}),
    ...mapGetters("app/member", {memberError:"error", memberIsLoading:"isLoading"}),
  }
}
</script>
