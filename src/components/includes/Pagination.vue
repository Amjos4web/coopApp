<template>
  <div class="row">
    <div class="col-12" aria-label="pagination">
      <nav v-if="pagination.hasPrevPage || pagination.hasNextPage">
        <ul class="pagination text-center">
          <li v-if="pagination.hasPrevPage" class="page-item">
            <a href="javascript:void(0)" aria-label="Previous" @click.prevent="changePage(pagination.currentPage - 1)" :class="{'disabled' : pagination.hasPrevPage}">
              <span arial-hidden="true" class="page-link">Previous</span>
            </a>
          </li>
          <li v-for="page in pagesNumber" :class="{'active': page == pagination.currentPage}" :key="page.currentPage">
            <a href="javascript:void(0)" aria-label="Next" @click.prevent="changePage(page)" class="page-link">
              {{ page }}
            </a>
          </li>
          <li v-if="pagination.hasNextPage" class="page-item">
            <a href="javascript:void(0)" aria-label="Next" @click.prevent="changePage(pagination.currentPage + 1)" :class="{'disabled' : pagination.hasNextPage}">
              <span arial-hidden="true" class="page-link">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pagination-component',
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
}
</script>