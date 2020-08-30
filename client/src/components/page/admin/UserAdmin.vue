<template>
  <section>
    <div class="mb-2">
      <h2>Users</h2>
      <b-button
        v-b-modal.create-user
        pill
        size="sm"
        class="mx-1"
      >
        New
      </b-button>
    </div>
    <CreateUserModal />
    <b-alert
      :show="items.length === 0 && !$store.getters['resource/user/fetching']"
      variant="warning"
    >
      No users
    </b-alert>
    <b-table
      v-if="items.length > 0 || $store.getters['resource/user/fetching']"
      :items="items"
      :fields="fields"
      :busy="$store.getters['resource/user/fetching']"
    >
      <template
        slot="actions"
        slot-scope="row"
      >
        <b-button
          size="sm"
          variant="danger"
          @click="onDelete(row.item.id)"
        >
          Delete
        </b-button>
      </template>
    </b-table>
    <DeleteUserModal :user="subject" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import CreateUserModal from '@client/components/modal/CreateUser.vue';
import DeleteUserModal from '@client/components/modal/DeleteUser.vue';

import { User } from '@client/store/resource/user';
import { BvTableFieldArray } from 'bootstrap-vue';

interface UserItem {
  id: string;
  interceptsSet: number;
  key: string;
}

interface Data {
  subject: User | undefined;
}

export default Vue.extend({

  name: 'UserAdmin',

  components: {
    CreateUserModal,
    DeleteUserModal,
  },

  data(): Data {
    return {
      subject: undefined,
    };
  },

  computed: {
    users(): User[] {
      return this.$store.getters['resource/user/items'];
    },

    items(): UserItem[] {
      return this.users.map((user: User) => ({
        id: user.id,
        interceptsSet: Object.keys(user.data.intercepts).length,
        key: user.data.key,
      }));
    },

    fields(): BvTableFieldArray {
      return [
        { key: 'key', label: 'Key' },
        { key: 'id', label: 'ID' },
        { key: 'interceptsSet', label: 'Intercepts set' },
        { key: 'actions', label: 'Actions', class: 'text-right' },
      ];
    },
  },

  methods: {
    onDelete(id: string) {
      this.subject = this.users.find((user) => user.id === id);

      if (this.subject) {
        this.$bvModal.show('delete-user');
      }
    },
  },
});
</script>

<style scoped>

</style>
