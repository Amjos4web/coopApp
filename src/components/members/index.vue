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
          <div class="row">
            <div class="col-md-12">
                <div class="export-btn text-right">
                  <button class="btn btn-warning btn-sm ml-10"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button>
                  <button class="btn btn-info btn-sm  ml-10" @click="showAddModal(false)"><i class="fa fa-plus"></i>&nbsp;Add Member</button>
                </div>
            </div>
          </div>
          <form @submit.prevent="searchMember()">
            <div class="row">
                <div class="col-md-8 m-auto">
                  <div class="form-group">
                    <label>Enter member name</label>
                    <input type="text"
                    class="form-control"
                    v-model="searchMeta"
                    >
                  </div>
                  <div class="text-center">
                    <input type="submit" value="Filter Result" class="btn btn-info">
                  </div>
                </div>
            </div>
          </form>
        </div>
        <div class="container">
          <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit" :reloadIndexData="reloadIndexDataEventHandler"/>
          <div class="text-center mb-20">
            <h3 class="search-result-title">{{ searchResultData }}</h3>
          </div>
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>View</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <MembersList :members="members" :error="error" :isLoading="isLoading" :getOneMemberEventHandlerForView="getOneMemberEventHandlerForView" :getOneMemberEventHandlerForEdit="getOneMemberEventHandlerForEdit" 
              :currentPage="pagination.currentPage" :limit="pagination.limit"
              />
            </table>
          </div>
        </div>
        <Pagination :pagination="pagination" :changePage="changePage"/>
      </div>
    <FooterBar/>
    <ViewMemberProfileModal ref="viewModal" :member="member"/>
    <RegisterMemberModal :updateMemberOnParent="updateMemberOnParent" :member="member" :modalTitle="modalTitle" ref="addModal"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import MembersList from '@/components/members/MembersList'
import ViewMemberProfileModal from '@/components/members/ViewMemberProfileModal'
import RegisterMemberModal from '@/components/members/RegisterMemberModal'
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import { openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters } from 'vuex'

const initMember = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  can_pay: '',
  address: '',
  active: ''
}

export default {
  name: 'members-component',
  components: {
    HeaderNav,
    FooterBar,
    MembersList,
    ViewMemberProfileModal,
    RegisterMemberModal,
    Pagination,
    LimitDataFetch
  },
  data(){
     return{
      pageTitle: 'Members',
      previousPage: 'Dashboard',
      notificationMessage: 'All registered members are being shown here',
      member: initMember,
      members: [],
      pagination: {},
      successMsg: '',
      searchMeta: '',
      searchResultData: '',
      modalTitle: 'Add New Member'
    } 
  },
    methods: {
    ...mapActions("app/member", ["getMembers", "getOneMember"]),
    
    showAddModal(isEdit = false){
      if (!isEdit) {
        // only reset if adding a new member
        this.$data.member = { ...initMember }
        this.modalTitle = "Add New Member"
      }
      let element = this.$refs.addModal.$el
      openModal(element);
    },
    showViewModal(){
      let element = this.$refs.viewModal.$el
      openModal(element);
    },
    showEditModal(){
      let element = this.$refs.editModal.$el
      openModal(element);
    },
    hideAddModal(){
      let element = this.$refs.addModal.$el
      closeModal(element)
    },

    searchMember(){
      this.getMembers({query:{limit:this.$data.pagination.limit, filter:{name:this.$data.searchMeta}}})
      .then(data => {
        if(data){
          this.$data.members = data.members
          this.$data.pagination = data.pagination
          this.$data.searchResultData = `${data.pagination.totalRecord} results found for ${this.$data.searchMeta}`
        }
      })
    },

    getLimit(event){
      let val = event.target.value;
      this.getMembers({query:{limit:val}})
      .then(data => {
        if(data){
          this.$data.members = data.members
          this.$data.pagination = data.pagination
        }
      })
    },

    updateMemberOnParent(member, isUpdate, clearForm){
      if(isUpdate){
        this.$data.members = this.$data.members.map(
          m=>((m.id.toString() === member.id.toString()) ? member : m)
        )
        this.$toasted.show('Member updated successfully', {
          type: "success", 
          icon: 'check-circle'
        })
      }else{
        this.$data.members = [member.member, ...this.$data.members]
        this.$data.successMsg = `Member added successfully. UserID: ${member.auth_detail.userid} - Password: ${member.auth_detail.password}`
        this.$toasted.show(`Member added successfully. UserID: ${member.auth_detail.userid} - Password: ${member.auth_detail.password}`, { 
          type: "success", 
          icon: 'check-circle'
        })
        if (clearForm){
          this.$data.member = {}
        }
      }
      //initialize member
      this.$data.member = initMember
      //this.hideAddModal();
    },

    getAllMembersEventHandler(additional_data={}){
      this.getMembers(additional_data)
      .then(data => {
        if(data){
          this.$data.members = data.members
          this.$data.pagination = data.pagination
        }
      })
    },
    
    getOneMemberEventHandlerForView(id){
      this.getOneMember(id)
      .then(member => {
        if (member){
          this.$data.member = member
          // raise modal here
          this.showViewModal()
        }
      })
    },

    getOneMemberEventHandlerForEdit(id){
      this.getOneMember(id).then(member => {
        if (member){
          this.$data.member = member   // set member into modal
          this.modalTitle = `Edit ${member.name}'s Profile`
          this.showAddModal(true)      // pass flag to prevent reset
        }
      })
    },

    reloadIndexDataEventHandler(){
      this.getAllMembersEventHandler({query:{limit:200}, reload:true})
    },

    changePage(page){
      this.getMembers({query:{page, limit:200}})
      .then(data => {
        if(data){
          this.$data.members = data.members
          this.$data.pagination = data.pagination
        }
      })
    }
  },
  computed: {
    ...mapGetters("app/member", ["error", "isLoading"])
  },
  created(){
    this.getAllMembersEventHandler({query:{limit:200}})
  }
}
</script>
