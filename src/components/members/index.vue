<template>
  <div>
    <HeaderNav/>
    <div id="page-wrapper">
      <PageHeader :pageTitle="pageTitle" :previousPage="previousPage" />
      <div class="page-inner">
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
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> {{ notificationMessage }}</p>
                <p class="export-btn">
                  <button class="btn btn-warning btn-sm ml-10"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button>
                  <button class="btn btn-info btn-sm  ml-10" @click="showAddModal"><i class="fa fa-plus"></i>&nbsp;Add Member</button>
                </p>
              </div>
            </div>
          </div>
          <form @submit.prevent="searchMember()">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-8 col-md-offset-2">
                  <div class="form-group">
                    <label>Enter member name</label>
                    <input type="text"
                    class="form-control"
                    v-model="searchMeta"
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <input type="submit" value="Filter Result" class="btn-general">
            </div>
          </form>
          </div>
          <div class="container">
            <LimitDataFetch :getLimit="getLimit" :limit="pagination.limit"/>
            <div class="text-center mb-20">
              <h3 class="search-result-title">{{ searchResultData }}</h3>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr class="theading">
                    <th>S/N</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>View</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <MembersList :members="members" :error="error" :isLoading="isLoading" :getOneMemberEventHandlerForView="getOneMemberEventHandlerForView" :getOneMemberEventHandlerForEdit="getOneMemberEventHandlerForEdit" 
                :currentPage="pagination.currentPage" :limit="pagination.limit"/>
              </table>
            </div>
          </div>
          <Pagination :pagination="pagination" :changePage="changePage"/>
      </div>
    </div>
    <ViewMemberProfileModal ref="viewModal" :member="member"/>
    <RegisterMemberModal :updateMemberOnParent="updateMemberOnParent" :member="member" :modalTitle="modalTitle" ref="addModal"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import PageHeader from '@/components/includes/PageBreadCumbHeader'
import MembersList from '@/components/members/MembersList'
import ViewMemberProfileModal from '@/components/members/ViewMemberProfileModal'
import RegisterMemberModal from '@/components/members/RegisterMemberModal'
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import { closeNavbar, toggleAvatarDropDown, openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters, mapMutations } from 'vuex'

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
  name: 'Members',
  components: {
    HeaderNav,
    PageHeader,
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
    showAddModal(){
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
        this.$data.successMsg = 'Member updated successfully'
      }else{
        this.$data.members = [member, ...this.$data.members]
        this.$data.successMsg = 'Member added successfully'
        if (clearForm){
          this.$data.member = {}
        }
      }
      //initialize member
      this.$data.member = initMember
      this.hideAddModal();
    },
    
    getOneMemberEventHandlerForView(id){
      this.getOneMember(id)
      .then(member => {
        console.log(member)
        if (member){
          this.$data.member = member
          // raise modal here
          this.showViewModal()
        }
      })
    },
    getOneMemberEventHandlerForEdit(id){
      this.getOneMember(id)
      .then(member => {
        if (member){
          this.$data.member = member
          this.modalTitle = `Edit ${member.name}'s Profile`
          // raise modal here
          console.log(this.$data.member)
          this.showAddModal()
        }
      })
    },
    changePage(page){
      this.getMembers({query:{page, limit:10}})
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
    this.getMembers({query:{limit:10}})
    .then(data => {
      console.log(data)
      if(data){
        this.$data.members = data.members
        this.$data.pagination = data.pagination
      }
    })
  },
  mounted(){
    toggleAvatarDropDown(),
    closeNavbar()
  }
}
</script>
