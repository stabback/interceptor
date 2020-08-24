<template>
  <b-modal
    id="create-snapshot"
    hide-footer
    title="Create Snapshot"
  >
    <b-form
      class="my-4"
      @submit.prevent="createSnapshot"
    >
      <p>Note - snapshots of large applications may take up significant space.  Use with care.</p>
      <Errors :errors="$store.getters['resource/snapshot/errors']" />
      <b-form-group
        id="title-group"
        label="Snapshot title"
        label-for="title"
        description="A non-unique, optional title for the snapshot"
      >
        <b-form-input
          id="title"
          v-model="state.form.title"
          placeholder="My custom snapshot"
          :disabled="state.fetching"
        />
      </b-form-group>
      <b-form-group
        id="notes-group"
        label="Notes"
        label-for="notes"
        description="Notes to help identify why this snapshot is being taken.  500 character max."
      >
        <b-form-textarea
          id="notes"
          v-model="state.form.notes"
          placeholder="This was created because..."
          :disabled="state.fetching"
          maxlength="500"
        />
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="state.fetching"
      >
        {{ state.fetching ? 'Creating...' : 'Create' }}
      </b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import Errors from '@client/components/Errors.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'ModalCreateSnapshot',

  components: {
    Errors,
  },

  data() {
    return {
      state: {
        fetching: false,
        form: {
          title: '',
          notes: '',
        },
      },
    };
  },

  methods: {
    async createSnapshot() {
      this.state.fetching = true;
      const { title, notes } = this.state.form;
      await this.$store.dispatch('resource/snapshot/create', { title, notes });
      this.state.fetching = false;
      this.$bvModal.hide('create-snapshot');
    },
  },
});
</script>

<style scoped lang="scss">

</style>
