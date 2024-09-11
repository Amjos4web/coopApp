<template>
  <div>
    <HeaderNav/>
      <div v-if="societyIsLoading">
        <div class="text-center">
          <img src="/img/loadinggif.png" alt="Loading" class="loading-img">
        </div>
      </div>
      <div id="content-page" class="content-page" v-else>
        <div class="container">
          <div class="row text-center">
            <div class="form-group col-sm-12 col-md-8 col-lg-8 m-auto">
              <label for="society name">Enter Societie's Name</label>
              <input type="text" v-model="searchMeta" @keyup="filterSociety()" class="form-control">
            </div>
          </div>
          <div class="col-md-10 m-auto">
            <div class="table-responsive">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="society in societies" :key="society.id">
                    <th>{{ society.name }}</th>
                    <td>
                      <a class="btn btn-primary custom-link">
                        <router-link :to="'/memberList/' + society.id">
                          Select
                        </router-link>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { mapActions , mapGetters} from 'vuex'

let dataResult = []
let serverData = []

export default {
  name: 'edit-member-payment',
  components: {
    HeaderNav,
    FooterBar,
  },
  data(){
    return{
      pageTitle: 'Edit Members Payment',
      previousPage: 'Dashboard',
      societies: [],
      searchMeta: '',
    } 
  },
  methods: {
    ...mapActions("app/society", ["getSocieties", "getOneSociety"]),

    filterSociety(){
      const searchValue = this.$data.searchMeta.toLocaleLowerCase()
      this.$data.societies = dataResult.filter(
        s=>(
          (s.name.toLocaleLowerCase().indexOf(searchValue) > -1) 
          && (s.id != dataResult.id)
        )
      )
    }
  },

  created(){
    this.getSocieties({query:{limit:500}})
    .then(data=>{
      if (data){
        this.$data.societies = data.societies
      }

      serverData = this.$data.societies

      this.$data.societies = dataResult = serverData
    })
  },

  computed: {
    ...mapGetters("app/society", {societyError:"error", societyIsLoading:"isLoading"})
  }
}
</script>
