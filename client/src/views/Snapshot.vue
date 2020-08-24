<template>
  <MainLayout>
    <b-container>
      <b-row>
        <b-col>
          <h1>Snapshots</h1>
          <p>Snapshots are backup points.  Be careful here, this affects everything</p>
          <p>Total snapshot size: {{ totalSize }}</p>
          <b-button
            v-b-modal.create-snapshot
            pill
            size="sm"
            class="mx-1"
          >
            New
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-5">
          <Loader :loading="$store.getters['resource/snapshot/fetching']">
            <b-list-group v-if="snapshots">
              <b-list-group-item
                v-for="snapshot in snapshots"
                :key="snapshot.id"
                class="flex-column align-items-start"
                :active="selectedSnapshot && snapshot.id === selectedSnapshot.id"
              >
                <div class="d-flex flex-row align-items-center mb-2">
                  <b-badge
                    :variant="
                      snapshot.data.meta.type ===
                        'user' ? 'primary' : 'secondary'
                    "
                    pill
                  >
                    {{ snapshot.data.meta.type }}
                  </b-badge>
                                    &nbsp;
                  <strong>{{ snapshot.data.meta.title || '(no title)' }}</strong>
                </div>
                <ul>
                  <li>ID: <code>{{ snapshot.id }}</code></li>
                  <li>Date: <code>{{ snapshot.formattedTimestamp }}</code></li>
                  <li>Size: <code>{{ snapshot.formattedSize }}</code></li>
                </ul>
                <p>{{ snapshot.data.meta.notes }}</p>
                <div class="d-flex flex-row">
                  <b-button
                    size="sm"
                    :href="snapshot.downloadLink"
                    download
                  >
                    Download
                  </b-button>&nbsp;
                  <b-button
                    size="sm"
                    variant="success"
                    @click="onRestore(snapshot)"
                  >
                    Restore
                  </b-button>&nbsp;
                  <b-button
                    size="sm"
                    variant="danger"
                    @click="onDelete(snapshot)"
                  >
                    Delete
                  </b-button>
                </div>
              </b-list-group-item>
            </b-list-group>
          </Loader>
        </b-col>
      </b-row>
    </b-container>
    <DeleteSnapshotModal :snapshot="selectedSnapshot" />
    <RestoreSnapshotModal :snapshot="selectedSnapshot" />
    <CreateSnapshotModal />
  </MainLayout>
</template>

<script lang="ts">
import Vue from 'vue';
import prettyBytes from 'pretty-bytes';

import Loader from '@client/components/Loader.vue';
import MainLayout from '@client/layouts/Main.vue';

import DeleteSnapshotModal from '@client/components/modal/DeleteSnapshot.vue';
import RestoreSnapshotModal from '@client/components/modal/RestoreSnapshot.vue';
import CreateSnapshotModal from '@client/components/modal/CreateSnapshot.vue';
import { Snapshot } from '@server/resources/snapshot';
import { BvModalEvent } from 'bootstrap-vue';

const formatter = new Intl.DateTimeFormat('en-CA', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

export default Vue.extend({
  name: 'Snapshot',

  components: {
    Loader,
    MainLayout,
    DeleteSnapshotModal,
    CreateSnapshotModal,
    RestoreSnapshotModal,
  },

  data(): {
    selectedSnapshot: Snapshot | null;
    } {
    return {
      selectedSnapshot: null,
    };
  },

  computed: {
    totalSize(): string {
      const total = this.snapshots.reduce((acc, snapshot) => acc + snapshot.data.meta.size, 0);
      console.log('Total', total);
      return prettyBytes(total);
    },

    snapshots(): Snapshot[] {
      const { protocol, host } = window.location;
      return this.$store.getters['resource/snapshot/items'].map((snapshot: Snapshot) => ({
        ...snapshot,
        data: {
          ...snapshot.data,
        },
        formattedTimestamp: formatter.format(
          new Date(snapshot.data.meta.timestamp),
        ).replace(/,/g, ''),
        formattedSize: prettyBytes(snapshot.data.meta.size),
        downloadLink: `${protocol}//${host}/command/snapshot/${snapshot.id}?download`,
      })).reverse();
    },
  },

  created() {
    this.$store.dispatch('resource/snapshot/getMany');

    this.$root.$on('bv::modal::hidden', (event: BvModalEvent, modalId: string) => {
      if (['delete-snapshot', 'restore-snapshot'].includes(modalId)) {
        this.selectedSnapshot = null;
      }
    });
  },

  methods: {
    onDelete(snapshot: Snapshot) {
      this.selectedSnapshot = snapshot;
      this.$bvModal.show('delete-snapshot');
    },

    onRestore(snapshot: Snapshot) {
      this.selectedSnapshot = snapshot;
      this.$bvModal.show('restore-snapshot');
    },
  },
});
</script>
