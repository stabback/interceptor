<template>
  <b-modal
    id="restore-snapshot"
    title="Restore Snapshot"
    :ok-title="state.fetching ? 'Restoring...' : 'Yes - restore snapshot'"
    cancel-title="No - cancel"
    :busy="state.fetching"
    @ok="onOk"
  >
    <p>This will delete all current data (besides snapshots) and replace it with this snapshot.</p>
    <p>A snapshot will be taken automatically before this happens.</p>
    <b-alert
      v-if="snapshot"
      show
      variant="warning"
    >
      <dl>
        <dt>ID</dt>
        <dl>{{ snapshot.id }}</dl>
        <dt>Title</dt>
        <dl>{{ snapshot.data.meta.title }}</dl>
        <dt>Timestamp</dt>
        <dl>{{ snapshot.formattedTimestamp }}</dl>
        <dt>Notes</dt>
        <dl>{{ snapshot.data.meta.notes }}</dl>
      </dl>
    </b-alert>
    <p>
      While you can undo this by restoring the new snapshot, other people on the team may be relying
      on it.  Make sure you know what you are doing.
    </p>
    <p>Note - page will reload when done</p>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

export default Vue.extend({
  name: 'ModalRestoreSnapshot',

  props: {
    snapshot: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },

  data() {
    return {
      state: {
        fetching: false,
      },
    };
  },

  methods: {
    async onOk(bvModalEvt: BvModalEvent) {
      bvModalEvt.preventDefault();
      this.state.fetching = true;
      await this.$store.dispatch('resource/snapshot/restore', this.snapshot.id);
      this.state.fetching = false;

      window.location.reload();
    },
  },
});
</script>
