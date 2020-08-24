<template>
  <b-list-group-item>
    <h2>Conditions</h2>
    <div class="my-3">
      <b-button
        v-if="!locked"
        pill
        size="sm"
        class="mx-1"
        @click="onAdd()"
      >
        New
      </b-button>
      <b-button
        v-b-modal.condition-help
        pill
        variant="info"
        size="sm"
        class="mx-1"
      >
        Help
      </b-button>
    </div>
    <b-alert
      variant="danger"
      :show="conditions.length === 0"
    >
      This intercept has no conditions and will never be triggered
    </b-alert>
    <div v-if="conditions.length > 0">
      <p>Intercept will be triggered if all of the following are true:</p>
      <b-list-group>
        <b-list-group-item
          v-for="condition of conditions"
          :key="condition.id"
        >
          <b-button
            v-if="!locked"
            size="sm"
            variant="danger"
            @click="onDelete(condition.id)"
          >
            Delete
          </b-button>

          <span
            v-if="condition.data.type === 'url'"
          >
            URL matches pattern <strong>{{ condition.data.rule.pattern }}</strong>
          </span>

          <span
            v-if="condition.data.type === 'method'"
          >
            Request verb is <strong>{{ condition.data.rule.method }}</strong>
          </span>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-list-group-item>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ConditionDetails',

  props: {
    conditions: {
      type: Array,
      required: true,
    },
    locked: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onAdd() {
      this.$emit('add');
    },

    onDelete(id: string) {
      this.$emit('delete', id);
    },
  },

});
</script>

<style scoped lang="scss">

</style>
