<template>
  <header>
    <h1>{{ domain.data.name }}</h1>
    <p><strong>{{ customizedUrl }}</strong> => <strong>{{ domain.data.url }}</strong></p>
  </header>
</template>

<style scoped lang="scss">

</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DomainHeader',

  props: {
    domain: {
      type: Object,
      required: true,
    },

    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      origin: window.location.origin,
      customizedUrl: '',
    };
  },

  created() {
    this.customizedUrl = `${this.origin}/call/${this.user.data.key}/${this.domain.data.key}`;
  },

});
</script>
