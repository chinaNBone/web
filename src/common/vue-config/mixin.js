import { mapGetters, mapMutations, mapActions } from "vuex";
import { Utils } from "@/utils/utils.js";

/**
 * 全局混入方法， 主要用于vuex
 */
function mixins(vue, config) {
  if (!config) {
    return;
  }
  let mixed = Object.create({});
  if (config.getter) {
    Utils.extend(true, mixed, {
      computed: {
        ...mapGetters(
          config.getter.value || {
            vx_userInfo: "getUserInfo",
            vx_accessToken: "getAccessToken",
            vx_getRole: "getRole",
          }
        ),
      },
    });
  }
  if (config.mutations) {
    Utils.extend(true, mixed, {
      methods: {
        ...mapMutations(config.mutations.value || {}),
      },
    });
  }
  if (config.actions) {
    Utils.extend(true, mixed, {
      methods: {
        ...mapActions(
          config.actions.value || {
            vxa_logout: "logout",
            vxa_getUserInfo: "getUserInfo",
            vxa_getUserRoles: "getUserRoles",
          }
        ),
      },
    });
  }

  vue.mixin(mixed);
}

export default {
  install: function(vue, config) {
    mixins(vue, config);
  },
};
