<template>
  <div class="text-center" v-if="pagination.hasPrevPage || pagination.hasNextPage">
    <ul class="pagination">
      <li v-if="pagination.hasPrevPage">
        <a href="javascript:void(0)" aria-label="Previous" @click.prevent="changePage(pagination.currentPage - 1)" :class="{'disabled' : pagination.hasPrevPage}">
          <span arial-hidden="true">Previous</span>
        </a>
      </li>
      <li v-for="page in pagesNumber" :class="{'active': page == pagination.currentPage}" :key="page.currentPage">
        <a href="javascript:void(0)" aria-label="Next" @click.prevent="changePage(page)">
          {{ page }}
        </a>
      </li>
      <li v-if="pagination.hasNextPage">
        <a href="javascript:void(0)" aria-label="Next" @click.prevent="changePage(pagination.currentPage + 1)" :class="{'disabled' : pagination.hasNextPage}">
          <span arial-hidden="true">Next</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    pagination: {
      type: Object,
      required: true
    },
    changePage: {
      type: Function,
    }
  },

  computed: {
    pagesNumber(){
      let pagesArray = [];
      for (let i = 1; i <= this.pagination.lastPage; i++){
        pagesArray.push(i);
      }
      return pagesArray;
    }
  }, 
  updated(){
    console.log(this.pagination)
  }
}
</script>