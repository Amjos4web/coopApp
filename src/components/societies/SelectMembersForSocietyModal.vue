<template>
  <div class="modal fade" id="selectMembers" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">{{ modalTitle }}</h4>
          </div>
          <div class="modal-body padtrbl">
            <div v-if="errorDisplay"> 
              <div class="text-center error-div">
                <span>
                  {{ errorDisplay }}
                </span>
              </div>
            </div>
            <div v-if="isLoading">
              <div class="text-center">
                <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
              </div>
            </div>
            <form @submit.prevent="searchMemberEventHandler()">
              <div class="row">
                <div class="input-field col-md-6 col-md-offset-3">
                  <input type="text" v-model="searchMeta">
                  <label for="Society Name">Search member</label>
                  <span class="error"></span>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" value="Search" class="btn btn-primary">
              </div>
            </form><br>
            <form @submit.prevent="saveSocietyMember()">
              <div class = "row" v-for="member in members" :key="member.id">
                <div class="col-md-8">
                  <h5>{{ member.name }}</h5>
                </div>
                <div class="col-md-4" style="margin-top: 5px; text-align: right;">
                  <p>
                    <label class="switch"><input type="checkbox" @click="toggleSocietyMember(member.id)">
                      <span class="slider round"></span>
                    </label>
                  </p>
                </div>
              </div>
              <div class="modal-footer">
                <input type="submit" value="Save" class="btn btn-info">
                <button type="button" class="btn btn-default pull-right cancel" data-dismiss="modal" id="cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import Validator from 'validatorjs'


const selectedMember = []

export default {
  name: 'select-members-for-society-modal',
  data(){
    return{
      searchMeta: ''
    }
  },
  props: {
    members: Array,
    modalTitle: String,
    searchMember: Function,
    errorDisplay: String,
    isLoading: Boolean,
    saveSocietyMemberEventHandler: Function
  },

  methods: {
    ...mapActions("app/society_member", ["saveSocietyMember"]),
    ...mapMutations("app/society_member", ["setError"]),
    searchMemberEventHandler(){
      this.$props.searchMember(this.$data.searchMeta)
    },
    toggleSocietyMember(id){
      const index = selectedMember.indexOf(id);
      if(index > -1){
        selectedMember.splice(index, 1)
      }else{
        selectedMember.push(id)
      }
      console.log(selectedMember);
    },
    saveSocietyMember(){
      this.$props.saveSocietyMemberEventHandler(selectedMember);
    }
  },
}
</script>