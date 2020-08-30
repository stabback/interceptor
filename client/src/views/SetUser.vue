<template>
  <MainLayout>
    <b-container>
      <b-row>
        <b-col>
          <h1>User</h1>
          <p>Select the user you would like to configure</p>
          <b-button
            v-b-modal.create-user
            pill
            size="sm"
            class="mx-1"
          >
            New
          </b-button>
          <b-button
            v-b-modal.user-help
            pill
            variant="info"
            size="sm"
            class="mx-1"
          >
            Help
          </b-button>
          <CreateUserModal />
          <b-modal
            id="user-help"
            title="User help"
            header-bg-variant="info"
            header-text-variant="light"
            hide-footer
          >
            <UserHelp :title="false" />
          </b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-5">
          <Loader :loading="usersFetching">
            <b-list-group v-if="users">
              <b-list-group-item
                v-for="user in users"
                :key="user.id"
                :to="{ name: 'user', params: {user: user.data.key} }"
                class="d-flex justify-content-between align-items-center"
              >
                {{ user.data.key }}
                <b-badge variant="primary">
                  {{ Object.keys(user.data.intercepts).length }} intercepts set
                </b-badge>
              </b-list-group-item>
            </b-list-group>
          </Loader>
        </b-col>
      </b-row>
    </b-container>
  </MainLayout>
</template>

<script lang="ts">
import UserHelp from '@client/components/help/Users.vue';
import Loader from '@client/components/Loader.vue';
import CreateUserModal from '@client/components/modal/CreateUser.vue';
import MainLayout from '@client/layouts/Main.vue';
import Vue from 'vue';
import { User } from '@client/store/resource/user';

export default Vue.extend({
  name: 'SetUser',

  components: {
    CreateUserModal,
    Loader,
    MainLayout,
    UserHelp,
  },

  computed: {
    users(): User[] {
      return [...this.$store.getters['resource/user/items']].sort(
        (a, b) => a.data.key.localeCompare(b.data.key),
      );
    },

    usersFetching(): boolean {
      return this.$store.getters['resource/user/fetching'];
    },
  },

  created() {
    if (this.$store.getters['resource/user/items'].length === 0) {
      this.$store.dispatch('resource/user/getMany');
    }
  },

  methods: {

  },
});
</script>
