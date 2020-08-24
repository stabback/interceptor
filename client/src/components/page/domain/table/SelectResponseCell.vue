<template>
  <b-form>
    <b-form-group>
      <b-form-select
        placeholder="Default"
        :value="selectedResponse"
        @change="onSelect($event)"
      >
        <option value="USE_DEFAULT">
          Default
        </option>
        <option :value="null">
          Pass through
        </option>

        <optgroup label="Intercept specific">
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </optgroup>
      </b-form-select>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InterceptRowOption } from '@client/views/Domain.vue';

export default Vue.extend({
  name: 'SelectResponseCell',

  props: {
    options: {
      type: Array as PropType<InterceptRowOption[]>,
      required: true,
    },

    selectedResponse: {
      type: String,
      required: false,
      default: '',
    },
  },

  methods: {
    onSelect(response: string) {
      this.$emit('select', response);
    },
  },

});
</script>

<style scoped lang="scss">

</style>
