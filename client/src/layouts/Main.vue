<template>
  <HeaderedLayout>
    <section
      v-if="user"
      class="pb-2 mb-4 border-bottom"
    >
      <b-container>
        <b-row>
          <b-col>
            <h1>User</h1>
            <p>Selected user: <strong>{{ user.data.key }}</strong></p>
            <div class="my-2">
              <b-button
                :to="{name: 'set-user'}"
                pill
                size="sm"
                class="mx-1"
              >
                Change
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section
      v-if="domain"
      class="pb-2 mb-4 border-bottom"
    >
      <b-container>
        <b-row>
          <b-col>
            <h1>Domain</h1>
            <p>Selected domain: <strong>{{ domain.data.name }}</strong> ({{ domain.data.key }})</p>
            <p>
              Proxying requests from <strong>{{ proxyUrl }}</strong> to
              <strong>{{ domain.data.url }}</strong>
            </p>

            <div class="my-2">
              <b-button
                :to="{name: 'user', params: { user: user.data.key } }"
                pill
                size="sm"
                class="mx-1"
              >
                Change
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <slot />
  </HeaderedLayout>
</template>

<script>
import { DomainMixin, UserMixin } from '@client/mixins';
import HeaderedLayout from './Headered.vue';

export default {

  name: 'MainLayout',

  components: {
    HeaderedLayout,
  },

  mixins: [UserMixin, DomainMixin],

  data() {
    return {
      origin: window.location.origin,
    };
  },

  computed: {
    proxyUrl() {
      if (this.domain && this.user) {
        return `${this.origin}/call/${this.user.data.key}/${this.domain.data.key}`;
      }

      return '';
    },
  },
};
</script>
