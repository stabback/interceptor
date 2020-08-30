import Vue from 'vue';
import { Domain } from '@client/store/resource/domain';

export default Vue.extend({
  name: 'DomainMixin',

  computed: {
    domain(): Domain {
      return this.$store.getters['resource/domain/itemByData']('key', this.$route.params.domain);
    },
  },
});
