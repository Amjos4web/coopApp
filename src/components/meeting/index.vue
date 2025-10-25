<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div v-if="societyIsLoading || mCisLoading">
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
          <RefreshOnly :reloadIndexData="reloadMeetingHandler"/>
          <hr>
          <div class="col-12" v-if="!meetingCalendars.length && !mCisLoading && !societyIsLoading && !smIsLoading">
            <div class="text-center error-div">
              <span>
                You have no meeting for today
              </span>
            </div>
          </div>
          <div class="col-12" v-else>
            <MeetingList :meetingCalendars="meetingCalendars"/>
          </div>
        </div>
      </div>
      <FooterBar />
    </div> 
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import MeetingList from '@/components/meeting/MeetingList'
import RefreshOnly from '@/components/includes/RefreshOnly';
import { mapActions , mapGetters, mapMutations } from 'vuex'
import {turnArrayToObject} from '../../utility'

export default {
  name: 'meetingIndex',
  components: {
    HeaderNav,
    FooterBar,
    MeetingList,
    RefreshOnly
  },
  data(){
    return {
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

    listSocietyMemberWhichHasMeetingTodayHandler(additional_data={}){
      // get all meeting the current day
      this.listSocietyMemberWhichHasMeetingToday(additional_data)
      .then(data => {
        //console.log(reload)
        if (data){
          this.fetchManySociety(data.meetingCalendars.map(mcs=>mcs.society_id))
          .then(result=>{
            const store = turnArrayToObject(result.societies)
            this.$data.meetingCalendars = data.meetingCalendars.map(mcs=>{
              mcs.society_name = store[mcs.society_id] ? store[mcs.society_id].name : "Unknown"
              return mcs;
            })
          })
          .catch(e=>{
            this.setError(e)
          })
        }
      })
    },

    reloadMeetingHandler(){
      this.listSocietyMemberWhichHasMeetingTodayHandler({reload:true})
    }
  },

  computed: {
    ...mapGetters("app/meeting_calendar", {mCerror:"error", mCisLoading:"isLoading"}),
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"}),
    ...mapGetters("app/society_member", {smError:"error", smIsLoading:"isLoading"}),
  },

  created(){
    // get all meeting the current day
    this.listSocietyMemberWhichHasMeetingTodayHandler()
  }
  
}
</script>
