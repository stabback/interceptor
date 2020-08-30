<template>
  <div>
    <b-modal
      id="response-configuration"
      hide-footer
      title="Response configuration"
    >
      <b-form @submit.prevent="onSubmit()">
        <p v-if="intercept">
          Adding to intercept <strong>{{ intercept.data.name }}</strong>
        </p>
        <Errors :errors="$store.getters['resource/response/errors']" />

        <b-form-group
          id="configure-response-name"
          label="Name"
          label-for="configure-response-name-input"
          description="
            A friendly name for organizational purposes only.
            This does not affect the response at all.  Must be unique.
          "
        >
          <b-form-input
            id="configure-response-name-input"
            v-model="state.form.name"
            required
          />
        </b-form-group>

        <b-form-group
          id="configure-response-has-body"
        >
          <b-form-checkbox
            id="configure-response-has-body"
            v-model="state.form.hasBody"
          >
            This response has a body
          </b-form-checkbox>
        </b-form-group>

        <div v-if="state.form.hasBody">
          <b-form-group
            id="configure-response-body"
            label="Body"
            description="The response body."
          >
            <b-form-checkbox
              v-model="state.useCodeEditor"
              name="use-code-editor"
              switch
            >
              Use code editor
            </b-form-checkbox>
            <codemirror
              v-if="state.useCodeEditor"
              v-model="state.form.body"
              :options="editorOptions"
            />
            <b-form-textarea
              v-else
              v-model="state.form.body"
              placeholder=""
              rows="6"
            />
          </b-form-group>
        </div>
        <p v-else>
          (This response will not return a body)
        </p>

        <b-form-group
          id="configure-response-headers"
          label="Headers"
          label-for="configure-response-headers-input"
          description="The response headers."
        >
          <b-list-group>
            <b-list-group-item
              v-for="(value, key) in state.form.headers"
              :key="key"
            >
              {{ key }}: {{ value }}
            </b-list-group-item>
          </b-list-group>
          <b-button
            v-b-modal.header-configuration
            pill
            size="sm"
            class="mt-2"
          >
            Edit
          </b-button>
        </b-form-group>

        <b-form-group
          id="configure-response-delay"
          label="Delay"
          label-for="configure-response-delay-input"
          description="
            A delay in ms before the response is sent back.
            Useful for intercepting long-running requests.
          "
        >
          <b-input-group append="ms">
            <b-form-input
              id="configure-response-delay-input"
              v-model="state.form.delay"
              type="number"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group
          id="configure-response-status"
          label="Status"
          label-for="configure-response-status-input"
          description="The HTTP status code that is returned"
        >
          <b-form-input
            id="configure-response-status-input"
            v-model="state.form.status"
            type="number"
          />
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          :disabled="state.fetching"
        >
          Submit
        </b-button>
      </b-form>
    </b-modal>
    <HeadersModal v-model="state.form.headers" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { codemirror } from 'vue-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';

import HeadersModal from '@client/components/modal/Headers.vue';

import Errors from '@client/components/Errors.vue';
import { Intercept } from '@client/store/resource/intercept';

const DEFAULT_FORM = {
  body: '',
  delay: 200,
  hasBody: true,
  headers: {
    'Content-Type': 'application/json',
  },
  id: '',
  name: '',
  status: 200,
};

export default Vue.extend({
  name: 'ModalConfigureResponse',

  components: {
    Errors,
    HeadersModal,
    codemirror,
  },

  props: {
    intercept: {
      type: Object as PropType<Intercept>,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      state: {
        form: { ...DEFAULT_FORM },
        newHeader: {
          name: '',
          value: '',
        },
        useCodeEditor: true,
      },
      editorOptions: {
        tabSize: 2,
        mode: 'application/json',
        theme: 'xq-light',
        lineNumbers: true,
        line: true,
      },
    };
  },

  methods: {
    async onSubmit() {
      const item = {
        intercept: this.intercept.id,
        ...this.state.form,
        headers: Object.entries(this.state.form.headers).map(([name, value]) => ({ name, value })),
      };

      if (this.state.form.hasBody) {
        item.body = this.state.form.body;
      }

      await this.$store.dispatch('resource/response/create', item);

      if (!this.$store.getters['resource/response/failed']) {
        this.$bvModal.hide('response-configuration');
        this.state.form = { ...DEFAULT_FORM };
      }
    },

  },

});
</script>

<style lang="scss">
.vue-codemirror {
  cursor: text;
}
</style>
