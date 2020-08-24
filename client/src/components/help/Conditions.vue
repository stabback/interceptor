<template>
  <div>
    <h2>Conditions</h2>
    <p>
      A Condition is a test against a request.  An Intercept has multiple conditions.  Every
      condition must be matched to trigger the Intercept.
    </p>
    <p>
      When an intercept is created it is <strong>unlocked</strong>.  When unlocked conditions can
      be added and removed.  Once an intercept is working as expected, it should be
      <strong>locked</strong> so that it cannot change.  This keeps tests stable.
    </p>
    <div class="pl-4 pt-4">
      <UrlConditionHelp />
      <MethodConditionHelp class="mt-4" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import MethodConditionHelp from '@client/components/help/conditions/Method.vue';
import UrlConditionHelp from '@client/components/help/conditions/Url.vue';

export default Vue.extend({
  components: {
    MethodConditionHelp,
    UrlConditionHelp,
  },
});
</script>
