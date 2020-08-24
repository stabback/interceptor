<template>
  <div class="loader">
    <div
      v-if="!loading"
      class="loaded"
    >
      <slot />
    </div>
    <div
      v-else
      class="loading"
    >
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Loader',

  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
