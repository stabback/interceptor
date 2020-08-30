<template>
  <b-modal
    id="condition-configuration"
    hide-footer
    title="condition configuration"
  >
    <b-form @submit.prevent="onSubmit">
      <p v-if="intercept">
        Adding to intercept <strong>{{ intercept.data.name }}</strong>
      </p>
      <Errors :errors="$store.getters['resource/condition/errors']" />

      <b-form-group
        label="Type"
      >
        <b-form-radio
          v-model="state.form.conditionType"
          value="url"
          name="condition-type"
        >
          Match a URL pattern
        </b-form-radio>
        <b-form-radio
          v-model="state.form.conditionType"
          value="method"
          name="condition-type"
        >
          Match an API verb
        </b-form-radio>
      </b-form-group>
      <b-form-group
        v-if="state.form.conditionType === 'method'"
        label="Verb"
      >
        <b-form-radio
          v-model="state.form.rule.method.method"
          value="GET"
          name="method-type"
        >
          GET
        </b-form-radio>
        <b-form-radio
          v-model="state.form.rule.method.method"
          value="POST"
          name="method-type"
        >
          POST
        </b-form-radio>
        <b-form-radio
          v-model="state.form.rule.method.method"
          value="PUT"
          name="method-type"
        >
          PUT
        </b-form-radio>
        <b-form-radio
          v-model="state.form.rule.method.method"
          value="DELETE"
          name="method-type"
        >
          DELETE
        </b-form-radio>
        <b-form-radio
          v-model="state.form.rule.method.method"
          value="PATCH"
          name="method-type"
        >
          PATCH
        </b-form-radio>
      </b-form-group>
      <b-form-group
        v-if="state.form.conditionType === 'url'"
        id="configure-condition-pattern"
        label="Pattern"
        label-for="configure-condition-pattern-input"
        description="A full regex pattern (EXMAScript) used to match the URL of a request"
      >
        <a
          href="https://regex101.com/"
          target="_blank"
        >Regex101.com may be useful for testing</a>
        <b-form-input
          id="configure-response-name-input"
          v-model="state.form.rule.url.pattern"
          required
        />
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        :disabled="$store.getters['resource/condition/fetching']"
      >
        Submit
      </b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Errors from '@client/components/Errors.vue';
import { Intercept } from '@client/store/resource/intercept';
import { Domain } from 'domain';
import { User } from '@client/store/resource/user';

const DEFAULT_FORM: {
  rule: {
    method: {
      method: string;
    };
    url: {
      pattern: string;
    };
  };
  conditionType: 'method' | 'url' | '';
} = {
  rule: {
    method: {
      method: '',
    },
    url: {
      pattern: '',
    },
  },
  conditionType: '',
};

export default Vue.extend({

  name: 'ModalConfigureCondition',

  components: {
    Errors,
  },

  props: {
    intercept: {
      type: Object as PropType<Intercept>,
      required: false,
      default: null,
    },
    domain: {
      type: Object as PropType<Domain>,
      required: false,
      default: null,
    },
    user: {
      type: Object as PropType<User>,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      state: {
        form: { ...DEFAULT_FORM },
      },
    };
  },

  methods: {
    async onSubmit() {
      if (this.state.form.conditionType === '') return;

      await this.$store.dispatch('resource/condition/create', {
        intercept: this.intercept.id,
        rule: this.state.form.rule[this.state.form.conditionType],
        conditionType: this.state.form.conditionType,
      });

      if (!this.$store.getters['resource/condition/failed']) {
        this.$bvModal.hide('condition-configuration');
        this.state.form = { ...DEFAULT_FORM };
      }
    },
  },
});
</script>

<style scoped lang="scss">

</style>
