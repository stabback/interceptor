<template>
  <div>
    <h2 v-if="title">
      Users
    </h2>
    <p>
      Interceptor is built with the concept of Users.  Users allow you to have multiple people work
      on your application without intercepting each others requests.
    </p>
    <p>
      A common practice is to create one user per engineer working on your application, as well as
      one user each for QA users, E2E tests, and development / staging deploys.
    </p>
    <p>
      Note that users are <em>not</em> authenticated.  Anyone can choose to update any User.  Peer
      pressure should be used to discourage this.
    </p>
    <b-alert
      :show="true"
      variant="info"
    >
      <strong>Example</strong><br>
      <p>
        Your E2E tests use Interceptor.  You create user <strong class="text-success">e2e</strong>
        to ensure when your E2E tests run no other user is impacted.  Calls to
        <strong>{{ origin }}/call/<span class="text-success">e2e</span>/</strong> would use the E2E
        user.
      </p>
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelpUsers',

  props: {
    title: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      origin: window.location.origin,
    };
  },
});
</script>
