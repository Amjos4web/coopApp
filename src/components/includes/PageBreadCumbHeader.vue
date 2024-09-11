<template>
  <div class="header">
    <h3 class="page-header">
      {{ pageTitle }}
    </h3>
    <ol class="breadcrumb">
      <li>
        <a>
          <router-link to="/dashboard">
            {{ previousPage }}
          </router-link>
        </a>
      </li>
      <li><a href="#" class="active">{{ pageTitle }}</a></li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'page-header',
  props: ['pageTitle', 'previousPage']
}
</script>