<template>
  <b-breadcrumb :items="items" />
</template>

<script lang="ts">
import Vue from 'vue';
import { Domain } from '@client/store/resource/domain';
import { User } from '@client/store/resource/user';

interface Crumb {
    active?: boolean;
    text: string;
    to?: {
      name: string;
      params?: {
        [key: string]: string;
      };
    };
}

export default Vue.extend({
  name: 'Breadcrumbs',

  computed: {
    items(): Crumb[] {
      const crumbs = [
        this.homeCrumb,
        this.helpCrumb,
        this.userCrumb,
        this.domainCrumb,
      ];
      // TODO - use flatmap for better type safety
      return crumbs.filter((crumb): crumb is Crumb => Boolean(crumb));
    },

    user(): User {
      return this.$store.getters['resource/user/itemByData']('key', this.$route.params.user);
    },

    domain(): Domain {
      return this.$store.getters['resource/domain/itemByData']('key', this.$route.params.domain);
    },

    homeCrumb(): Crumb {
      return {
        active: this.$route.name === 'set-user',
        text: 'Home',
        to: { name: 'set-user' },
      };
    },

    helpCrumb(): Crumb | null {
      if (this.$route.name === 'help') {
        return {
          active: this.$route.name === 'help',
          text: 'Help',
          to: { name: 'help' },
        };
      }
      return null;
    },

    userCrumb(): Crumb | null {
      if (this.user) {
        return {
          active: this.$route.name === 'user',
          text: `User ${this.user.data.key}`,
          to: {
            name: 'user',
            params: {
              user: this.user.data.key,
            },
          },
        };
      }
      return null;
    },

    domainCrumb(): Crumb | null {
      if (this.domain) {
        return {
          active: this.$route.name === 'domain',
          text: this.domain.data.url,
          to: { name: 'domain' },
        };
      }
      return null;
    },
  },
});
</script>

<style>

</style>
