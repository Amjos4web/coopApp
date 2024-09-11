<template>
  <ul id="dropdown2" class="dropdown-content w250">
    <li>
      <div>
          <i class="fa fa-table fa-fw"></i> Odokoto Ifeoluwa meeting is today
          <!-- <span class="pull-right text-muted small">4 min</span> -->
      </div>
    </li>
    <li class="divider"></li>
    <li>
      <div>
          <i class="fa fa-table fa-fw"></i> Odokoto Ifeoluwa 2 meeting is today
          <!-- <span class="pull-right text-muted small">12 min</span> -->
      </div>
    </li>            
    <li class="divider"></li>
    <li>
      <a class="waves-effect waves-dark">
        <router-link to="/meeting"><i class="fa fa-table"></i>
          <strong>See All Meetings</strong>
        </router-link>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'notification-dropdown-content'
}
</script>