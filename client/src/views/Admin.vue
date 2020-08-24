<template>
  <HeaderedLayout>
    <b-alert
      variant="danger"
      :show="true"
    >
      <p><strong class="h1">Doing things on this page can break other peoples stuff</strong></p>
      <p>
        Changing anything here may impact other users and break E2E tests for other teams.  Please
        make sure you know the impact of what you are doing.
      </p>
      <p>If in doubt, ask.</p>
    </b-alert>

    <b-container>
      <b-row>
        <b-col>
          <h1>Admin controls</h1>

          <UserAdmin />
          <DomainAdmin />
          <InterceptAdmin />
        </b-col>
      </b-row>
    </b-container>
  </HeaderedLayout>
</template>

<script lang="ts">

import DomainAdmin from '@client/components/page/admin/DomainAdmin.vue';
import InterceptAdmin from '@client/components/page/admin/InterceptAdmin.vue';
import UserAdmin from '@client/components/page/admin/UserAdmin.vue';
import HeaderedLayout from '@client/layouts/Headered.vue';
import Vue from 'vue';

export default Vue.extend({

  name: 'Admin',

  components: {
    DomainAdmin,
    HeaderedLayout,
    InterceptAdmin,
    UserAdmin,
  },

  async created() {
    await Promise.all([
      this.$store.dispatch('resource/user/getMany'),
      this.$store.dispatch('resource/domain/getMany'),
      this.$store.dispatch('resource/intercept/getMany'),
      this.$store.dispatch('resource/condition/getMany'),
      this.$store.dispatch('resource/response/getMany'),

    ]);
  },

});
</script>
