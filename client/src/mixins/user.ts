import Vue from 'vue';
import { User } from '@client/store/resource/user';

export default Vue.extend({
  name: 'UserMixin',

  computed: {
    user(): User {
      return this.$store.getters['resource/user/itemByData']('key', this.$route.params.user);
    },
  },
});
