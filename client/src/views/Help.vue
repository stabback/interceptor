<template>
  <HeaderedLayout>
    <h1>Interceptor Help</h1>

    <h2 class="mt-4">
      What is Interceptor?
    </h2>
    <p>
      Interceptor is a tool to help develop applications that make HTTP requests.  Interceptor
      lives outside of your application, but allows you to guarantee API responses.  This helps
      reliably develop and test edge/error cases, development with unstable APIs, and unblock
      development held up by incomplete APIs.
    </p>

    <h2 class="mt-4">
      High level overview
    </h2>
    <p>Interceptor should sit between your application and the APIs your application calls.</p>
    <p>
      Instead of calling APIs directly, your application should make the requests to
      Interceptor.  Using this UI, you can tell Interceptor to intercept requests that match
      different conditions.  When Interceptor receives a request, it checks if it should be
      intercepted.  If it should be, it returns a canned response.  If not, it proxies it for
      you to where it is meant to go.
    </p>

    <UserHelp class="mt-4" />
    <DomainHelp class="mt-4" />
    <InterceptHelp class="mt-4" />
    <ConditionHelp class="mt-4" />
    <ResponseHelp class="mt-4" />
  </HeaderedLayout>
</template>

<script lang="ts">
import ConditionHelp from '@client/components/help/Conditions.vue';
import DomainHelp from '@client/components/help/Domains.vue';
import InterceptHelp from '@client/components/help/Intercepts.vue';
import ResponseHelp from '@client/components/help/Responses.vue';
import UserHelp from '@client/components/help/Users.vue';

import HeaderedLayout from '@client/layouts/Headered.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'Help',

  components: {
    ConditionHelp,
    DomainHelp,
    HeaderedLayout,
    InterceptHelp,
    ResponseHelp,
    UserHelp,
  },
});
</script>
