import Directive from "./vue-config/directive"
import Filters from "./vue-config/filters"
import Mixin from "./vue-config/mixin"
import globalComponets from "./vue-config/globalComponets";

function config(vue, conf) {
  vue.use(Directive, conf && conf.directive)
  vue.use(Filters, conf && conf.filters)
  vue.use(Mixin, conf && conf.mixin)
  vue.use(globalComponets, conf && conf.globalComponets);
}

export default {
  install: function (vue, conf) {
    config(vue, conf);
  }
}