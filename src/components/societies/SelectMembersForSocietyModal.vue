<template>
  <div class="modal fade" id="selectMembers" role="dialog" style="border-radius: 5px;">
    <div class="modal-dialog modal-lg">
      <!-- Modal content no 1-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ modalTitle }}</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
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
                <div class="form-group col-md-6 m-auto">
                  <label for="Society Name">Search Member</label>
                  <input type="text" v-model="searchMeta" class="form-control">
                  <span class="error"></span>
                </div>
              </div>
              <div class="text-center mt-10">
                <input type="submit" value="Search" class="btn btn-secondary">
              </div>
            </form><br>
            <form @submit.prevent="saveSocietyMember()">
              <div class = "row" v-for="member in members" :key="member.id">
                <div class="col-md-8">
                  <p>{{ member.name }}</p>
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
                <input type="submit" value="Save" class="btn btn-primary">
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


let selectedMember = []

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
    },
    saveSocietyMember(){
      this.$props.saveSocietyMemberEventHandler(selectedMember);
      selectedMember = [];
    }
  },
}
</script>