<template>
  <b-modal
    id="configure-intercept"
    hide-footer
    :title="`${isUpdating ? 'Edit' : 'Create new'} intercept`"
    @shown="prepopulateForm"
  >
    <b-form @submit.prevent="onSubmit">
      <p v-if="domain">
        Adding to domain <strong>{{ domain.data.name }}</strong>
      </p>
      <Errors :errors="$store.getters['resource/intercept/errors']" />
      <b-form-group
        id="configure-intercept-name"
        label="Name"
        label-for="configure-intercept-name-input"
        description="A friendly name for organizational purposes only."
      >
        <b-form-input
          id="configure-intercept-name-input"
          v-model="state.form.name"
          required
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
import Vue from 'vue';
import { compare } from 'fast-json-patch';

import Errors from '@client/components/Errors.vue';

const DEFAULT_FORM = {
  name: '',
};

export default Vue.extend({
  name: 'ModalConfigureIntercept',

  components: {
    Errors,
  },

  props: {
    intercept: {
      type: Object,
      required: false,
      default: null,
    },
    domain: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      state: {
        form: { ...DEFAULT_FORM },
      },
    };
  },

  computed: {
    fetching(): boolean {
      return this.$store.getters['resource/intercept/fetching'];
    },

    isUpdating(): boolean {
      return !!this.intercept;
    },
  },

  methods: {
    async onSubmit() {
      if (!this.isUpdating) {
        await this.$store.dispatch('resource/intercept/create', {
          domain: this.domain.id,
          ...this.state.form,
        });
      } else {
        const operations = compare(
          this.intercept,
          {
            ...this.intercept,
            data: {
              ...this.intercept.data,
              ...this.state.form,
            },
          },
        );

        await this.$store.dispatch('resource/intercept/update', {
          identifier: this.intercept.id,
          operations,
        });
      }

      if (!this.$store.getters['resource/intercept/failed']) {
        this.$bvModal.hide('configure-intercept');
      }
    },

    prepopulateForm() {
      if (this.isUpdating) {
        this.state.form.name = this.intercept.data.name;
      } else {
        this.state.form = {
          ...DEFAULT_FORM,
        };
      }
    },
  },
});
</script>

<style scoped lang="scss">

</style>
