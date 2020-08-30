<template>
  <MainLayout>
    <b-container>
      <b-row>
        <b-col>
          <h1>Domain</h1>
          <p>Select the domain you would like to configure</p>
          <b-button
            v-b-modal.configure-domain
            pill
            size="sm"
            class="mx-1"
          >
            New
          </b-button>
          <b-button
            v-b-modal.domain-help
            pill
            variant="info"
            size="sm"
            class="mx-1"
          >
            Help
          </b-button>
          <ConfigureDomainModal />
          <b-modal
            id="domain-help"
            title="Domain help"
            header-bg-variant="info"
            header-text-variant="light"
            hide-footer
          >
            <DomainHelp :title="false" />
          </b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-5">
          <Loader :loading="$store.getters['resource/domain/fetching']">
            <b-list-group v-if="domains">
              <b-list-group-item
                v-for="domain in domains"
                :key="domain.id"
                :to="{
                  name: 'domain', params: {
                    domain: domain.data.key, user: $route.params.user
                  }
                }"
                class="d-flex justify-content-between align-items-center"
              >
                <strong>
                  {{ domain.data.key }}
                </strong>: {{ domain.data.name }} (<em>{{ domain.data.url }}</em>)

                <b-badge
                  variant="primary"
                  pill
                  class="ml-auto"
                >
                  {{ Object.keys(domain.data.intercepts).length }} intercepts
                </b-badge>
                <b-badge
                  variant="success"
                  pill
                  class="ml-2"
                >
                  User has set {{ countUserIntercepts(domain.data.intercepts) }}
                </b-badge>
              </b-list-group-item>
            </b-list-group>
          </Loader>
        </b-col>
      </b-row>
    </b-container>
  </MainLayout>
</template>

<script lang="ts">
import DomainHelp from '@client/components/help/Domains.vue';
import Loader from '@client/components/Loader.vue';
import ConfigureDomainModal from '@client/components/modal/ConfigureDomain.vue';

import MainLayout from '@client/layouts/Main.vue';
import Vue from 'vue';
import { User } from '@client/store/resource/user';
import { Domain } from '@client/store/resource/domain';

export default Vue.extend({
  name: 'User',

  components: {
    ConfigureDomainModal,
    DomainHelp,
    Loader,
    MainLayout,
  },

  computed: {
    domains(): Domain[] {
      return [...this.$store.getters['resource/domain/items']].sort(
        (a, b) => a.data.key.localeCompare(b.data.key),
      );
    },
    user(): User {
      return this.$store.getters['resource/user/itemByData']('key', this.$route.params.user);
    },
  },

  created() {
    this.$store.dispatch('resource/domain/getMany');
  },

  methods: {
    countUserIntercepts(domainIntercepts: string[]) {
      return domainIntercepts.filter(
        (intercept) => Object.keys(this.user.data.intercepts).includes(intercept),
      ).length;
    },
  },
});
</script>
