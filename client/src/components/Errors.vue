<template>
  <ul v-if="errors.length > 0">
    <li
      v-for="err in errors"
      :key="err.id"
    >
      <b-alert
        :show="true"
        :data-error-id="err.id"
        variant="danger"
      >
        {{ err.data.message }}
      </b-alert>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Errors',

  props: {
    errors: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style scoped>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
</style>
