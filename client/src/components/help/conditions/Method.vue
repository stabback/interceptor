<template>
  <div>
    <h2>Method Condition</h2>
    <p>Method Conditions tests against the requests HTTP verb.</p>
    <b-alert
      :show="true"
      variant="info"
    >
      <strong>Example</strong><br>
      <p>
        Interceptor receives a POST request at
        <strong>{{ origin }}/call/<span class="text-success">e2e</span>/
          <span class="text-danger">example</span>/
          <span class="text-primary">posts/15/comments</span>
        </strong>
      </p>
      <p>
        You wish to intercept all POST calls creating comments for posts.  You create a Method
        Condition that tests that the request verb is <strong>POST</strong>.
      </p>
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelpConditionsMethod',

  data() {
    return {
      origin: window.location.origin,
    };
  },
});
</script>
