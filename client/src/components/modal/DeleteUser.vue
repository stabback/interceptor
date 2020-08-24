<template>
  <b-modal
    id="delete-user"
    title="Delete User"
    :ok-title="`Yes - delete ${user && user.data.key}`"
    cancel-title="No - cancel"
    @ok="onOk"
  >
    <p>Are you sure you want to delete user {{ user && user.data.key }}?</p>
    <b-alert
      variant="danger"
      :show="numberOfIntercepts > 0"
    >
      This user has {{ numberOfIntercepts }} intercept{{ numberOfIntercepts > 1 ? 's' : '' }} set
    </b-alert>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { User } from '@server/resources/user';

export default Vue.extend({
  name: 'ModalDeleteUser',

  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },

  computed: {
    numberOfIntercepts(): number {
      if (!this.user) { return 0; }
      return Object.keys(this.user.data.intercepts).length;
    },
  },

  methods: {
    onOk() {
      this.$store.dispatch('resource/user/remove', this.user && this.user.id);
    },
  },
});
</script>

<style>

</style>
