import Vue from 'vue';
import { Domain } from '@server/resources/domain';

export default Vue.extend({
  name: 'DomainMixin',

  computed: {
    domain(): Domain {
      return this.$store.getters['resource/domain/itemByData']('key', this.$route.params.domain);
    },
  },
});
