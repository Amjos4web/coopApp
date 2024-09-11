<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
        <div v-if="societyIsLoading || mCisLoading || societyIsLoading">
          <div class="text-center">
            <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
          </div>
        </div>
        <div v-if="mCerror">
          <div class="error-div text-center">
            <span>
              {{ mCerror.message }}
            </span>
          </div>
        </div>
         <div v-if="societyError">
          <div class="error-div text-center">
            <span>
              {{ societyError.message }}
            </span>
          </div>
        </div>
        <div v-if="smError">
          <div class="error-div text-center">
            <span>
              {{ smError.message }}
            </span>
          </div>
        </div>
        <div class="container" v-else>
         <Notification :notificationMessage="notificationMessage" v-if="meetingCalendars.length > 0"/>
          <div class="col s12" v-if="meetingCalendars.length == 0 && societyIsLoading && mCisLoading && societyIsLoading">
            <div class="text-center error-div">
              <span>
                You have no meeting for today
              </span>
            </div>
          </div>
          <div class="col s12" v-else>
            <MeetingList :meetingCalendars="meetingCalendars"/>
          </div>
        </div>
      </div>
    </div> 
    
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import Notification from '@/components/includes/PageNotification'
import MeetingList from '@/components/meeting/MeetingList'
import { closeNavbar, toggleAvatarDropDown, closeModal, openModal } from "../../assets/js/helpers/utility"
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from '../../utility'

export default {
  name: 'meetingIndex',
  components: {
    HeaderNav,
    PageHeader,
    Notification,
    MeetingList,
  },
  data(){
    return {
      meetingID: 1,
      pageTitle: 'Meeting',
      previousPage: 'Dashboard',
      notificationMessage: 'List of all meetings to be held today',
      meetingCalendars: [],
    }
  },

  methods: {
    ...mapActions("app/meeting_calendar", ["listSocietyMemberWhichHasMeetingToday"]),
    ...mapActions("app/society", ["fetchManySociety"]),
    ...mapMutations("app/society_member", ['setError']),
  },

  computed: {
    ...mapGetters("app/meeting_calendar", {mCerror:"error", mCisLoading:"isLoading"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/society_member", {smError:"error", smIsLoading:"isLoading"}),
  },

  created(){
    // get all meeting the current day
    this.listSocietyMemberWhichHasMeetingToday()
    .then(data => {
      console.log(data);
      if (data){
        this.fetchManySociety(data.meetingCalendars.map(mcs=>mcs.society_id))
        .then(result=>{
          // console.log(result)
          const store = turnArrayToObject(result.societies)
          // console.log(store)
          this.$data.meetingCalendars = data.meetingCalendars.map(mcs=>{
            mcs.society_name = store[mcs.society_id] ? store[mcs.society_id].name : "Unknown"
            return mcs;
          })
        })
        .catch(e=>{
          //console.log({e:this.setError})
          this.setError(e)
        })
      }
    })
  },

  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
  
}
</script>
