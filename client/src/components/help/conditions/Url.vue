<template>
  <div>
    <h3>URL Condition</h3>
    <p>URL Conditions test that the URL matches a regex pattern.</p>
    <b-alert
      :show="true"
      variant="info"
    >
      <strong>Example</strong><br>
      <p>
        Interceptor receives a request at <strong>
          {{ origin }}/call/<span class="text-success">e2e</span>/
          <span class="text-danger">example</span>/
          <span class="text-primary">posts/15/comments</span>
        </strong>
      </p>
      <p>
        You wish to intercept all calls which get comments for posts.  You create a URL
        Condition that tests the request url against the pattern
        <strong>^\/posts\/(.*)\/comments$</strong>.
      </p>
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelpConditionsUrl',

  data() {
    return {
      origin: window.location.origin,
    };
  },
});
</script>
