<template>
  <b-modal
    id="delete-intercept"
    title="Delete Intercept"
    :ok-title="`Yes - delete ${intercept && intercept.data.name}`"
    cancel-title="No - cancel"
    @ok="onOk"
  >
    <p>Are you sure you want to delete intercept {{ intercept && intercept.data.name }}?</p>
    <b-alert
      variant="danger"
      :show="true"
    >
      Some users may rely on this intercept in their tests.
      <strong>This could be a big deal!</strong>
    </b-alert>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Intercept } from '@server/resources/intercept';

export default Vue.extend({
  name: 'ModalDeleteIntercept',

  props: {
    intercept: {
      type: Object as PropType<Intercept>,
      required: true,
    },
  },

  methods: {
    onOk() {
      this.$store.dispatch('resource/intercept/remove', this.intercept && this.intercept.id);
    },
  },
});
</script>
