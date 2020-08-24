<template>
  <div>
    <h2>Domains</h2>
    <p>
      Every domain your application calls will need to be added to Interceptor.  Each domain is
      given a key to identify it.  When interceptor receives a request with this key, interceptor
      then knows to proxy your request to that domain.
    </p>
    <b-alert
      :show="true"
      variant="info"
    >
      <strong>Example</strong><br>
      <p>
        Your application calls <em>http://example.com/posts</em>.  The domain
        <em>http://example.com</em> is added to interceptor with the key
        <strong class="text-danger">example</strong>.  Calls to
        <strong>
          {{ origin }}/call/
          <span class="text-success">e2e</span>/
          <span class="text-danger">example</span>/
        </strong> would proxy to <em>http://example.com</em>
      </p>
    </b-alert>
    <p>Interceptor must know the domains it will be commmunicating with ahead of time.</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelpDomains',

  data() {
    return {
      origin: window.location.origin,
    };
  },
});
</script>
