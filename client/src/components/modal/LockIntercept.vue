<template>
  <b-modal
    id="lock-intercept"
    title="Lock Intercept"
    ok-title="Yes - lock intercept"
    cancel-title="No - cancel"
    @ok="onOk"
  >
    <p>Are you sure you want to lock this intercept?</p>
    <p>
      Locking an intercept prevents any further changes to its conditions.  This will keep your E2E
      tests predictable and prevent unexpected responses
    </p>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Intercept } from '@client/store/resource/intercept';

export default Vue.extend({
  name: 'ModalLockIntercept',

  props: {
    intercept: {
      type: Object as PropType<Intercept>,
      required: false,
      default: null,
    },
  },

  methods: {
    onOk() {
      if (this.intercept === null) return;
      this.$store.dispatch('resource/intercept/update', {
        identifier: this.intercept.id,
        operations: [
          { path: '/data/locked', op: 'replace', value: true },
        ],
      });
    },
  },
});
</script>
