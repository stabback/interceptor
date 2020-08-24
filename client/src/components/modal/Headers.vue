<template>
  <div>
    <b-modal
      id="header-configuration"
      title="Headers"
    >
      <b-form @submit.prevent="onAddHeader()">
        <b-form-group
          id="configure-response-headers"
          label="Headers"
          label-for="configure-response-headers-input"
          description="The response headers."
        >
          <b-list-group>
            <b-list-group-item
              v-for="(v, key) in value"
              :key="key"
            >
              <b-button
                variant="danger"
                size="sm"
                @click="onRemoveHeader(key)"
              >
                Remove
              </b-button> {{ key }}: {{ v }}
            </b-list-group-item>
            <b-list-group-item>
              <b-form-group
                id="new-header-name"
                label="Name"
                label-for="new-header-name-input"
              >
                <b-form-input
                  id="new-header-name-input"
                  v-model="state.newHeader.name"
                  list="header-names"
                />
              </b-form-group>
              <b-form-group
                id="new-header-value"
                label="Value"
                label-for="new-header-value-input"
              >
                <b-form-input
                  id="new-header-value-input"
                  v-model="state.newHeader.value"
                  :list="valuesList"
                />
              </b-form-group>
              <b-button
                variant="success"
                type="submit"
              >
                Add
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </b-form-group>
      </b-form>

      <div
        slot="modal-footer"
        class="w-100"
      >
        <b-button
          variant="primary"
          size="sm"
          class="float-right"
          @click="$bvModal.hide('header-configuration')"
        >
          Done
        </b-button>
      </div>
    </b-modal>

    <datalist id="header-names">
      <option
        v-for="(values, name) in headers"
        :key="name"
      >
        {{ name }}
      </option>
    </datalist>

    <datalist
      v-for="(values, name) in headers"
      :id="`header-values-${name}`"
      :key="`values-${name}`"
    >
      <option
        v-for="v in values"
        :key="v"
      >
        {{ v }}
      </option>
    </datalist>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HEADERS from '@client/constants/headers.json';

interface Data {
  headers: typeof HEADERS;
  state: {
    newHeader: {
      name: keyof typeof HEADERS | '';
      value: string;
    };
  };
}

export default Vue.extend({
  name: 'ModalHeaders',

  props: {
    value: {
      type: Object,
      required: true,
      default() { return {}; },
    },
  },

  data(): Data {
    return {
      headers: HEADERS,
      state: {
        newHeader: {
          name: '',
          value: '',
        },
      },
    };
  },

  computed: {
    valuesList(): string {
      if (
        this.state.newHeader.name === ''
        || !this.headers[this.state.newHeader.name]
      ) {
        return '';
      }

      return `header-values-${this.state.newHeader.name}`;
    },
  },

  methods: {
    onAddHeader() {
      if (!this.state.newHeader.name || !this.state.newHeader.value) { return; }
      this.$emit('input', {
        ...this.value,
        [this.state.newHeader.name]: this.state.newHeader.value,
      });

      this.state.newHeader.name = '';
      this.state.newHeader.value = '';
    },

    onRemoveHeader(name: string) {
      const val = { ...this.value };
      delete val[name];
      this.$emit('input', val);
    },
  },
});
</script>

<style scoped lang="scss">

</style>
