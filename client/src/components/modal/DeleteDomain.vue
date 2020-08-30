<template>
  <b-modal
    id="delete-domain"
    title="Delete Domain"
    :ok-title="`Yes - delete ${domain && domain.data.key}`"
    cancel-title="No - cancel"
    @ok="onOk"
  >
    <p>Are you sure you want to delete domain {{ domain && domain.data.key }}?</p>
    <b-alert
      variant="danger"
      :show="numberOfIntercepts > 0"
    >
      This domain has {{ numberOfIntercepts }} intercept{{ numberOfIntercepts > 1 ? 's' : '' }}.
      They will all be deleted, as will all of their conditions and responses.
      <strong>This is a pretty big deal!!</strong>
    </b-alert>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Domain } from '@client/store/resource/domain';

export default Vue.extend({
  name: 'ModalDeleteDomain',

  props: {
    domain: {
      type: Object as PropType<Domain>,
      required: true,
    },
  },

  computed: {
    numberOfIntercepts(): number {
      if (!this.domain) { return 0; }
      return Object.keys(this.domain.data.intercepts).length;
    },
  },

  methods: {
    onOk() {
      this.$store.dispatch('resource/domain/remove', this.domain && this.domain.id);
    },
  },
});
</script>
