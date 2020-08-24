<template>
  <section>
    <div class="mb-2">
      <h2>Intercepts</h2>
      <b-form-group
        description="Select the domain you'd like to see intercepts for"
        label="Domain"
        label-for="domain-selection"
        class="px-4 py-1"
      >
        <b-form-select
          id="domain-selection"
          v-model="selectedDomain"
          :options="domainOptions"
        />
      </b-form-group>
      <b-button
        v-if="domain"
        v-b-modal.configure-intercept
        pill
        size="sm"
        class="mx-1"
      >
        New
      </b-button>
    </div>
    <b-alert
      :show="!domain"
      variant="info"
    >
      Select a domain to view its intercepts
    </b-alert>
    <b-alert
      :show="
        domain &&
          tableRows.length === 0 &&
          !$store.getters['resource/intercept/fetching']
      "
      variant="warning"
    >
      No intercepts for this domain yet
    </b-alert>
    <b-table
      v-if="tableRows.length > 0 || $store.getters['resource/intercept/fetching']"
      :items="tableRows"
      :fields="fields"
      :busy="$store.getters['resource/intercept/fetching']"
    >
      <template
        slot="actions"
        slot-scope="row"
      >
        <b-button
          v-if="!row.item.locked"
          size="sm"
          variant="success"
          class="mr-1"
          @click="onLock(row.item.id)"
        >
          Lock
        </b-button>
        <b-button
          v-if="row.item.locked"
          size="sm"
          variant="warning"
          class="mr-1"
          @click="onUnlock(row.item.id)"
        >
          Unlock
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="onDelete(row.item.id)"
        >
          Delete
        </b-button>
      </template>
    </b-table>
    <ConfigureIntercept
      :intercept="subject"
      :domain="domain"
    />
    <DeleteInterceptModal :intercept="subject" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

import ConfigureIntercept from '@client/components/modal/ConfigureIntercept.vue';
import DeleteInterceptModal from '@client/components/modal/DeleteIntercept.vue';
import { Domain } from '@server/resources/domain';
import { Intercept } from '@server/resources/intercept';
import { BvModalEvent, BvTableFieldArray } from 'bootstrap-vue';

interface DomainOption {
  text: string;
  value: string;
}

interface Data {
  subject: Intercept | undefined;
}

export default Vue.extend({
  name: 'InterceptAdmin',

  components: {
    ConfigureIntercept,
    DeleteInterceptModal,
  },

  data(): Data {
    return {
      subject: undefined,
    };
  },

  computed: {
    selectedDomain: {
      get(): string {
        return this.$route.query.domain as string;
      },

      set(val: string) {
        this.$router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            domain: val,
          },
        });
      },
    },

    domainOptions(): DomainOption[] {
      return [
        {
          text: 'Select a domain',
          value: '',
        },
        ...this.$store.getters['resource/domain/items'].map((domain: Domain) => ({
          text: domain.data.name,
          value: domain.id,
        })),
      ];
    },

    domain(): Domain {
      return this.$store.getters['resource/domain/item'](this.selectedDomain);
    },

    intercepts(): Intercept[] {
      return this.$store.getters['resource/intercept/items'];
    },

    tableRows(): {id: string; locked: boolean; name: string }[] {
      if (!this.domain) {
        return [];
      }

      return this.intercepts
        .filter((intercept) => this.domain.data.intercepts.includes(intercept.id))
        .map((intercept) => ({
          id: intercept.id,
          locked: !!intercept.data.locked,
          name: intercept.data.name,
        }));
    },

    fields(): BvTableFieldArray {
      return [
        {
          key: 'name', label: 'Name', sortable: true, sortDirection: 'asc',
        },
        {
          key: 'id', label: 'ID', sortable: true, sortDirection: 'asc',
        },
        { key: 'locked', label: 'Locked', formatter: (value) => (value ? '✅' : '❌') },
        { key: 'actions', label: 'Actions', class: 'text-right' },
      ];
    },
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent: BvModalEvent, modalId: string) => {
      if (modalId === 'delete-intercept' && bvEvent.type === 'hide') {
        this.subject = undefined;
      }
    });
  },

  methods: {
    onDelete(id: string) {
      this.subject = this.intercepts.find((intercept) => intercept.id === id);

      if (this.subject) {
        this.$bvModal.show('delete-intercept');
      } else {
        console.error('Attempting to delete a intercept that does not exist');
      }
    },

    toggleLock(identifier: string, lock: boolean) {
      this.$store.dispatch('resource/intercept/update', {
        identifier,
        operations: [
          { path: '/data/locked', op: 'replace', value: lock },
        ],
      });
    },

    onLock(identifier: string) {
      this.toggleLock(identifier, true);
    },

    onUnlock(identifier: string) {
      this.toggleLock(identifier, false);
    },
  },
});
</script>

<style scoped>

</style>
