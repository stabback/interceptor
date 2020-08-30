<template>
  <b-modal
    id="configure-domain"
    :title="`${isUpdating ? 'Edit' : 'Create new'} domain`"
    hide-footer
    @shown="prepopulateForm"
  >
    <b-alert
      variant="warning"
      :show="isUpdating"
    >
      You are editing an existing domain.  Be careful - changes may break other teams tests.
    </b-alert>
    <b-form @submit.prevent="onSubmit">
      <Errors :errors="$store.getters['resource/domain/errors']" />
      <b-form-group
        id="name-group"
        label="Name"
        label-for="domain-name-input"
        description="A friendly name for this domain to help identify it"
      >
        <b-form-input
          id="domain-name-input"
          v-model="state.form.name"
          placeholder="Clients intercept server"
          required
          :disabled="fetching"
        />
      </b-form-group>
      <b-form-group
        id="key-group"
        label="Key"
        label-for="domain-key-input"
        description="
          A short key, unique, used in your url.
          Letters and dashes only.  Casing will be ignored.
        "
      >
        <b-form-input
          id="domain-key-input"
          v-model="state.form.key"
          placeholder="short-name"
          required
          pattern="^[A-Za-z-]+$"
          :disabled="fetching"
        />
      </b-form-group>
      <b-form-group
        id="url-group"
        label="Base URL passthroughs should proxy to"
        label-for="domain-url-input"
        description="If the call is to pass through, then all requests will have this url prepended"
      >
        <b-form-input
          id="domain-url-input"
          v-model="state.form.url"
          placeholder="http://example.com"
          type="url"
          required
          :disabled="fetching"
        />
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="fetching"
      >
        {{ isUpdating ? 'Update' : 'Create' }}
      </b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { compare } from 'fast-json-patch';

import Errors from '@client/components/Errors.vue';
import { Domain } from '@client/store/resource/domain';

const DEFAULT_FORM = {
  key: '',
  name: '',
  url: '',
};

export default Vue.extend({
  name: 'ModalConfigureDomain',

  components: {
    Errors,
  },

  props: {
    domain: {
      type: Object as PropType<Domain>,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      state: {
        fetching: false,
        form: {
          ...DEFAULT_FORM,
        },
      },
    };
  },

  computed: {
    fetching(): boolean {
      return this.$store.getters['resource/domain/fetching'];
    },

    isUpdating(): boolean {
      return !!this.domain;
    },
  },

  methods: {
    async onSubmit() {
      if (!this.isUpdating) {
        await this.$store.dispatch('resource/domain/create', {
          ...this.state.form,
        });
      } else {
        const operations = compare(
          this.domain,
          {
            ...this.domain,
            data: {
              ...this.domain.data,
              ...this.state.form,
            },
          },
        );

        await this.$store.dispatch('resource/domain/update', {
          identifier: this.domain.id,
          operations,
        });
      }

      if (!this.$store.getters['resource/domain/failed']) {
        this.$bvModal.hide('configure-domain');
        this.state.form = { ...DEFAULT_FORM };
      }
    },

    prepopulateForm() {
      if (this.isUpdating) {
        this.state.form.key = this.domain.data.key;
        this.state.form.name = this.domain.data.name;
        this.state.form.url = this.domain.data.url;
      } else {
        this.state.form = {
          ...DEFAULT_FORM,
        };
      }
    },
  },
});
</script>
