<template>
  <div>
    <nav class="navbar navbar-default top-navbar" role="navigation">
			<UnionName/>
    </nav>
  </div>
</template>

<script>
import UnionName from '@/components/includes/header/UnionName'

export default {
  name: 'not-logged-in-header',
	components:{
		UnionName,
	},
}
</script>