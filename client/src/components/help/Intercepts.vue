<template>
  <div>
    <h2>Intercepts</h2>
    <p>
      An Intercept is a group of <em>conditions</em> and <em>responses</em>.  Every request
      Interceptor receives is compared to every Intercept.  If an Intercept matches the request,
      the Intercept will be used to determine the response.
    </p>
    <p>
      Usually, every request your application makes will have just one Intercept.  A Intercept that
      matches a request is considered a triggered Intercept.
    </p>
    <p>
      When an intercept is created it is <strong>unlocked</strong>.  When unlocked conditions
      can be added and removed.  Once an intercept is working as expected, it should be
      <strong>locked</strong> so that it cannot change.  This keeps tests stable.
    </p>
    <b-alert
      :show="true"
      variant="info"
    >
      <strong>Example</strong><br>
      <p>
        Your application uses <em>http://example.com/posts</em> to get a list of posts.  Your
        application calls <strong>{{ origin }}/call/<span class="text-success">e2e</span>/
          <span class="text-danger">example</span>/<span class="text-primary">posts</span>
        </strong> to allow Interceptor to intercept the call.
      </p>
      <p>
        You wish to respond with a 500 error for testing purposes.  You create an Intercept,
        add a condition to match the URL for <strong class="text-primary">posts</strong>, and
        create a response to send back a 500 error.
      </p>
      <p>Once happy with the intercept, it should be <strong>locked</strong>.</p>
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelpIntercepts',

  data() {
    return {
      origin: window.location.origin,
    };
  },
});
</script>
