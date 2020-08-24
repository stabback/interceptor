<template>
  <div>
    <AppHeader />
    <Breadcrumbs />
    <b-container>
      <b-row>
        <b-col class="mt-5">
          <main role="main">
            <slot />
          </main>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppHeader from '@client/components/AppHeader.vue';
import Breadcrumbs from '@client/components/Breadcrumbs.vue';

export default {
  name: 'HeaderedLayout',

  components: {
    AppHeader, Breadcrumbs,
  },
};
</script>
