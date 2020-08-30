<template>
  <section>
    <div class="mb-2">
      <h2>Domains</h2>
      <b-button
        v-b-modal.configure-domain
        pill
        size="sm"
        class="mx-1"
      >
        New
      </b-button>
    </div>
    <b-alert
      :show="tableRows.length === 0 && !$store.getters['resource/domain/fetching']"
      variant="warning"
    >
      No domains
    </b-alert>
    <b-table
      v-if="tableRows.length > 0 || $store.getters['resource/domain/fetching']"
      :items="tableRows"
      :fields="fields"
      :busy="$store.getters['resource/domain/fetching']"
    >
      <template
        slot="actions"
        slot-scope="row"
      >
        <b-button
          size="sm"
          variant="warning"
          class="mr-1"
          @click="onEdit(row.item.id)"
        >
          Edit
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
    <ConfigureDomainModal :domain="subject" />
    <DeleteDomainModal :domain="subject" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

import ConfigureDomainModal from '@client/components/modal/ConfigureDomain.vue';
import DeleteDomainModal from '@client/components/modal/DeleteDomain.vue';
import { Domain } from '@client/store/resource/domain';
import { BvModalEvent, BvTableFieldArray } from 'bootstrap-vue';

interface Data {
  subject: Domain | undefined;
}

export default Vue.extend({
  name: 'DomainAdmin',

  components: {
    ConfigureDomainModal,
    DeleteDomainModal,
  },

  data(): Data {
    return {
      subject: undefined,
    };
  },

  computed: {
    domains(): Domain[] {
      return this.$store.getters['resource/domain/items'];
    },

    tableRows(): { id: string; key: string; name: string; url: string }[] {
      return this.domains.map((domain) => ({
        id: domain.id,
        key: domain.data.key,
        name: domain.data.name,
        url: domain.data.url,
      }));
    },

    fields(): BvTableFieldArray {
      return [
        { key: 'key', label: 'Key' },
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'url', label: 'Url' },
        { key: 'actions', label: 'Actions', class: 'text-right' },
      ];
    },
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent: BvModalEvent, modalId: string) => {
      if (
        ['configure-domain', 'delete-domain'].includes(modalId)
                && bvEvent.type === 'hide'
      ) {
        this.subject = undefined;
      }
    });
  },

  methods: {
    onDelete(id: string) {
      this.subject = this.domains.find((domain) => domain.id === id);

      if (this.subject) {
        this.$bvModal.show('delete-domain');
      }
    },

    onEdit(id: string) {
      this.subject = this.domains.find((domain) => domain.id === id);

      if (this.subject) {
        this.$bvModal.show('configure-domain');
      }
    },
  },
});
</script>

<style scoped>

</style>
