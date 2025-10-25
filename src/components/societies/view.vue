<template>
  <div>
    <HeaderNav/>
      <div id="content-page" class="content-page">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="alert alert-info flex-container">
                <p><i class="fa fa-info-circle"></i> {{ notificationMessage }}</p>
                <!-- <p class="export-btn"><button class="btn btn-warning btn-sm"><i class="fa fa-upload"></i>&nbsp;Export as CSV</button></p> -->
              </div>
            </div>
          </div>
          <form @submit.prevent="searchSociety()">
            <div class="filter-result">
              <div class="row">
                <div class="col-md-6 m-auto">
                  <div class="form-group">
                    <label>Enter society name</label>
                    <input type="text" 
                    class="form-control"
                    v-model="society_name"
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-10">
              <input type="submit" value="Filter Result" class="btn btn-info">
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
                  <th>Society Name</th>
                  <th>No of Members</th>
                  <th>View</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <SocietiesList :societies="societies" :error="error" :isLoading="isLoading" :getOneSocietyEventHandlerForView="getOneSocietyEventHandlerForView" :getOneSocietyEventHandlerForEdit="getOneSocietyEventHandlerForEdit"
              :currentPage="pagination.currentPage" :limit="pagination.limit"/>
            </table>
          </div>
        </div>
        <Pagination :pagination="pagination" :changePage="changePage"/>
      </div>
    <FooterBar/>
    <ViewSocietyProfileModal ref="viewModal" :society="society"/>
    <EditSocietyModal ref="editModal" :society="society" :updateSocietyOnParent="updateSocietyOnParent"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/includes/headerNav';
import FooterBar from '@/components/includes/Footer'
import SocietiesList from '@/components/societies/SocietiesList'
import ViewSocietyProfileModal from '@/components/societies/ViewSocietyProfileModal'
import EditSocietyModal from '@/components/societies/EditSocietyModal'
import Pagination from '@/components/includes/Pagination'
import LimitDataFetch from '@/components/includes/LimitDataFetch'
import { openModal, closeModal } from "../../assets/js/helpers/utility";
import { mapActions , mapGetters } from 'vuex'

export default {
  name: 'view-societies',
  components: {
    HeaderNav,
    FooterBar,
    SocietiesList,
    ViewSocietyProfileModal,
    EditSocietyModal,
    Pagination,
    LimitDataFetch
  },
  data(){
    return{
      pageTitle: 'Societies',
      previousPage: 'Dashboard',
      notificationMessage: 'All list of societies are being showed here',
      societies: [],
      pagination: {},
      society: '',
      successMsg: '',
      searchResultData: '',
      society_name: ''
    } 
  },
  methods: {
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),
    ...mapActions("app/society_member", ["countMemberInSociety"]),
    showViewModal(){
      let element = this.$refs.viewModal.$el
      openModal(element);
    },

    hideViewModal(){
      let element = this.$refs.viewModal.$el
      closeModal(element)
    },

    showEditModal(){
      let element = this.$refs.editModal.$el
      openModal(element);
    },

    hideEditModal(){
      let element = this.$refs.editModal.$el
      closeModal(element)
    },

    getSocietiesInitialData(){
      this.getSocieties({query:{limit:100}})
      .then(data => {
        if(data){
          this.$data.societies = data.societies
          const societyIDs = data.societies.map(s=>s.id)
          this.countMemberInSociety({paramIDs:societyIDs})
          .then(data1=>{
            if(data1){
              this.$data.societies = data.societies.map(s=>{
                s.totalMember = data1.countMemberInSociety[s.id]
                return s;
              })
              this.$data.pagination = data.pagination;
            }
          })
        }
      })
    },

    updateSocietyOnParent(society){
      this.$data.societies = this.$data.societies.map(
        s=>((s.id.toString() === society.id.toString()) ? society : s)
      )
      this.$data.successMsg = this.$toasted.show(`Society updated successfully`, { 
        type: "success", 
        icon: 'check-circle'
      })
      
      // hide modal
      this.hideEditModal();
    },
    
    getOneSocietyEventHandlerForView(id){
      this.getOneSociety(id)
      .then(society => {
        if (society){
          this.$data.society = society
          // raise modal here
          this.showViewModal()
        }
      })
    },

    getOneSocietyEventHandlerForEdit(id){
      this.getOneSociety(id)
      .then(society => {
        if (society){
          this.$data.society = society
          // raise modal here
          this.showEditModal()
        }
      })
    },

    changePage(page){
      this.getSocieties({query:{page, limit:10}})
      .then(data => {
        if(data){
          this.$data.societies = data.societies
          const societyIDs = data.societies.map(s=>s.id)
          this.countMemberInSociety({paramIDs:societyIDs})
          .then(data1=>{
            if(data1){
              this.$data.societies = data.societies.map(s=>{
                s.totalMember = data1.countMemberInSociety[s.id]
                return s;
              })
              this.$data.pagination = data.pagination;
            }
          })
        }
      })
    },

    getLimit(event){
      let val = event.target.value;
      this.getSocieties({query:{limit:val}})
      .then(data => {
        if(data){
          this.$data.societies = data.societies
          const societyIDs = data.societies.map(s=>s.id)
          this.countMemberInSociety({paramIDs:societyIDs})
          .then(data1=>{
            if(data1){
              this.$data.societies = data.societies.map(s=>{
                s.totalMember = data1.countMemberInSociety[s.id]
                return s;
              })
              this.$data.pagination = data.pagination;
              this.$data.searchResultData = '';
            }
          })
        }
      })
    },

    searchSociety(){
      this.getSocieties({query:{limit:this.$data.pagination.limit, filter:{name:this.$data.society_name}}})
      .then(data=> {
        if (data){
          this.$data.societies = data.societies
          const societyIDs = data.societies.map(s=>s.id)
          this.countMemberInSociety({paramIDs:societyIDs})
          .then(data1=>{
            if(data1){
              this.$data.societies = data.societies.map(s=>{
                s.totalMember = data1.countMemberInSociety[s.id]
                return s;
              })
              this.$data.pagination = data.pagination;
              this.$data.searchResultData = `${data.pagination.totalRecord} results found for ${this.$data.society_name}`
            }
          })
        }
      })
    },


    reloadIndexDataEventHandler(){
      this.getSocietiesInitialData()
    }
  },
  computed: {
    ...mapGetters("app/society", ["error", "isLoading"]),
    ...mapGetters("app/society_member", ["error", "isLoading"])
  },
  created(){
    this.getSocietiesInitialData()
  }
}
</script>
