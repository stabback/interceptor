<template>
  <header class="">
    <b-navbar
      toggleable="lg"
      variant="secondary"
      type="dark"
    >
      <b-navbar-brand :to="{name: 'set-user'}">
        Interceptor
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-nav>
          <b-nav-item :to="{name: 'help'}">
            Help
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{name: 'admin'}">
            Admin
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppHeader',
});
</script>
