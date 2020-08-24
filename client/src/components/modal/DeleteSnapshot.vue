<template>
  <b-modal
    id="delete-snapshot"
    title="Delete Snapshot"
    ok-title="Yes - delete snapshot"
    cancel-title="No - cancel"
    @ok="onOk"
  >
    <p>Are you sure you want to delete this snapshot?</p>
    <b-alert
      v-if="snapshot"
      show
      variant="danger"
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
    <p>It will not be able to be restored.  Snapshots are not backed up in other snapshots.</p>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Snapshot } from '@server/resources/snapshot';

export default Vue.extend({
  name: 'ModalDeleteSnapshot',

  props: {
    snapshot: {
      type: Object as PropType<Snapshot>,
      required: true,
    },
  },

  methods: {
    onOk() {
      this.$store.dispatch('resource/snapshot/remove', this.snapshot.id);
    },
  },
});
</script>
