<template>
  <b-list-group-item>
    <h2>Responses</h2>
    <div class="my-3">
      <b-button
        pill
        size="sm"
        class="mx-1"
        @click="onAdd()"
      >
        New
      </b-button>
      <b-button
        v-b-modal.response-help
        pill
        variant="info"
        size="sm"
        class="mx-1"
      >
        Help
      </b-button>
    </div>
    <b-alert
      variant="warning"
      :show="responses.length === 0"
    >
      This intercept has no unique responses
    </b-alert>
    <div v-if="responses.length > 0">
      <b-list-group>
        <b-list-group-item
          v-for="response of responses"
          :key="response.id"
          :variant="response.isActive ? 'primary' : ''"
        >
          <div class="d-flex justify-content-between">
            <span>
              {{ response.data.name }}
            </span>
            <div>
              <b-button
                v-b-toggle="'response-' + response.id"
                size="sm"
                variant="secondary"
              >
                Toggle Details
              </b-button>
              <b-button
                size="sm"
                variant="primary"
                class="ml-2"
                :disabled="response.isActive"
                @click="onSelect(response.id)"
              >
                {{ response.isActive ? 'Activated' : 'Activate' }}
              </b-button>
            </div>
          </div>
          <b-collapse
            :id="'response-' + response.id"
            class="my-2 p-1"
          >
            <b-list-group>
              <b-list-group-item>
                <h5>Body</h5>
                <pre v-if="response.data.body !== undefined">{{ response.data.body }}</pre>
                <b-alert
                  v-else
                  variant="warning"
                  :show="true"
                >
                  Response has no body
                </b-alert>
              </b-list-group-item>
              <b-list-group-item>
                <h5>Status</h5>
                <pre>{{ response.data.status }}</pre>
              </b-list-group-item>
              <b-list-group-item>
                <h5>Delay</h5>
                <pre>{{ response.data.delay }}ms</pre>
              </b-list-group-item>
              <b-list-group-item>
                <h5>Headers</h5>
                <pre>{{ response.data.headers }}</pre>
              </b-list-group-item>
            </b-list-group>
          </b-collapse>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-list-group-item>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ResponseDetails',

  props: {
    responses: {
      type: Array,
      required: true,
    },
  },

  methods: {
    onAdd() {
      this.$emit('add');
    },

    onSelect(id: string) {
      this.$emit('select', id);
    },
  },

});
</script>

<style scoped lang="scss">

</style>
