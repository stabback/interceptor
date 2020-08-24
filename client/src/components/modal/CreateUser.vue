<template>
  <b-modal
    id="create-user"
    title="Create new user"
    hide-footer
  >
    <b-form
      class="my-4"
      @submit.prevent="createNewUser"
    >
      <p>
        Users are simply namespaces.  All that is needed is a short, url friendly key.  When
        accessing Interceptor over API, your calls will use this key to identify you.
      </p>
      <p>
        As an example, creating the user <strong>foo</strong> would allow you to interact with the
        api at {{ origin }}/call/<strong>foo</strong>
      </p>
      <Errors :errors="$store.getters['resource/user/errors']" />
      <b-form-group
        id="key-group"
        label="New user key"
        label-for="key"
        description="
          A short key, unique, used in your url.  Letters and dashes only.  Casing will be ignored.
        "
      >
        <b-form-input
          id="key"
          v-model="state.form.key"
          placeholder="short-name"
          required
          pattern="^[A-Za-z-]+$"
          :disabled="state.fetching"
        />
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="state.fetching"
      >
        {{ state.fetching ? 'Loading' : 'Submit' }}
      </b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import Errors from '@client/components/Errors.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'ModalCreateUser',

  components: {
    Errors,
  },

  data() {
    return {
      origin: window.location.origin,
      state: {
        fetching: false,
        form: {
          key: '',
        },
      },
    };
  },

  methods: {
    async createNewUser() {
      await this.$store.dispatch(
        'resource/user/create', {
          key: this.state.form.key,
        },
      );

      if (!this.$store.getters['resource/user/failed']) {
        this.$bvModal.hide('create-user');
      }
    },
  },
});
</script>

<style>

</style>
