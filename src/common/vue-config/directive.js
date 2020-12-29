import watchObserver from "../watchObserver";
import { Utils } from "@/utils/utils";
import QRCode from "qrcode";
watchObserver.init(entries => {
  // console.log(entries);
  entries.forEach(e => {
    if (e.isIntersecting && ("Chrome" == watchObserver.myBrowser() || "FF" == watchObserver.myBrowser())) {
      let el = e.target;
      // 二维码监听
      if (el._date_qrcode && el._date_qrcode.lazy) {
        if (el._date_qrcode.isUpdate) {
          el._date_qrcode.init();
          el._date_qrcode.isUpdate = false;
        }
      }
      // 图片监听
      if (el._img_data && el._img_data._lazy) {
        el.src = el._img_data._lazy_src;
        // 取消监视
        watchObserver.unobserve(el);
      }
    }
  });
});

// /**
//  * 检测图片 http code
//  * @param {*} url
//  */
// function checkImageStatus(url) {
//   return new Promise((resolve, reject) => {
//     Axios.get(url)
//       .then(img => {
//         resolve(200);
//       })
//       .catch(err => {
//         resolve(err.response.status);
//       });
//   });
// }

function config(vue) {
  // 将错误图片替换为默认图片
  vue.directive("errimg", {
    bind: function(el, binding, vnode) {
      let def = binding.modifiers.m ? "/images/default_pic_m.png" : "/images/default_pic.png";
      if (binding.modifiers.trim && !el.src) {
        el.src = def;
      }
      el.onerror = function() {
        el.src = def;
      };
    },
    // inserted: function (el) {
    //   console.log("errimg inserted")
    // },
  });
  /**
   * 图片渲染
   * error: 不使用错误图片替换，直接显示错误图片
   * lazy: 延迟加载，图片在可视范围内才加载图片
   */
  vue.directive("img", {
    bind: function(el, binding, vnode) {
      let lazy = binding.modifiers.lazy;
      let showError = binding.modifiers.error;
      let m = binding.modifiers.m;
      let head = binding.modifiers.head;
      let def = head ? "/images/avatar_normal_200.jpg" : m ? "/images/default_pic_m.png" : "/images/default_pic.png";
      // console.log(vnode, el.attributes);
      let attrDef = el.attributes["img-def"];
      if (attrDef) {
        def = attrDef;
      }
      let cut = el.attributes["img-cut"];
      let cutHead = el.attributes["img-cut-head"];
      let cutW = el.attributes["img-cut-w"];
      let cutH = el.attributes["img-cut-h"];
      let src = binding.value;
      let cutDef = {
        w: cutHead ? 100 : 276,
        h: cutHead ? 100 : 150,
      };
      el._img_data = {};

      if (cut || cutHead || cutW || cutH) {
        // console.log(src, cutW, cutH, el.attributes.getNamedItem("img-cut-w"));
        el._img_data._cut = true;
        el._img_data._cut_origin = src;
        el._img_data._cut_w = Number(cutW && cutW.value) || cutDef.w;
        el._img_data._cut_h = Number(cutH && cutH.value) || cutDef.h;
        src = Utils.getThumb(src, el._img_data._cut_w, el._img_data._cut_h);
      }

      if ((lazy && "Chrome" == watchObserver.myBrowser()) || (lazy && "FF" == watchObserver.myBrowser())) {
        el.src = def;
        el._img_data._lazy = true;
        el._img_data._lazy_src = src;
        el._img_data._lazy_def = def;
        watchObserver.observe(el);
      } else {
        el.src = src;
      }
      if (!showError) {
        el.onerror = function() {
          // checkImageStatus(el.src).then(code => {
          //   if (code == 415) {
          //     el.src = el._img_data._cut_origin;
          //   } else {
          //     el.src = def;
          //   }
          // });
          if (el._img_data._cut && !el._img_data._cut_use_origin) {
            el._img_data._cut_use_origin = true;
            el.src = el._img_data._cut_origin;
          } else {
            el.src = def;
          }
        };
      }
    },
    update: function(el, binding, vnode, oldVnode) {
      let d = vnode.data.directives[0];
      if (d.value != d.oldValue) {
        let src = binding.value;
        if (el._img_data._cut) {
          src = Utils.getThumb(src, el._img_data._cut_w, el._img_data._cut_h);
        }
        if (
          (el._img_data._lazy && "Chrome" == watchObserver.myBrowser()) ||
          (el._img_data._lazy && "FF" == watchObserver.myBrowser())
        ) {
          el._img_data._lazy_src = src;
          el.src = el._img_data._lazy_def;
          watchObserver.observe(el);
        } else {
          el.src = src;
        }
      }
    },
  });
  // 点击预览图片
  vue.directive("preview", {
    bind: function(el, binding, vnode) {
      let src = binding.value || el.src;
      let sync = binding.modifiers.sync;
      let exp = binding.expression;
      if (exp && binding.expression.indexOf(";") > -1) {
        return;
      }
      if (!sync && !src) {
        return;
      }
      let that = vnode.context;
      el.onclick = function() {
        // console.log(binding.expression)
        // console.log(eval(`that.${binding.expression}`))
        // console.log(that[binding.expression])
        that
          .$alert(`<img src="${sync ? (exp ? eval(`that.${binding.expression}`) : el.src) : src}">`, "预览", {
            customClass: "v-image-preview",
            lockScroll: false,
            showConfirmButton: false,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            dangerouslyUseHTMLString: true,
          })
          .catch(err => {
            // 点击取消
            // console.log(err)
          });
      };
    },
  });
  // 将元素透明
  vue.directive("opacity", {
    bind: function(el, binding, vnode) {
      el.dataset.opacity = el.style.opacity;
      el.style.opacity = binding.value ? 0 : el.dataset.opacity;
    },
    update: function(el, binding) {
      el.style.opacity = binding.value ? 0 : el.dataset.opacity;
    },
  });
  // 将元素透明
  vue.directive("preloading", {
    bind: function(el, binding, vnode) {
      if (binding.modifiers.opacity) {
        el.style.opacity = binding.value ? 0 : 1;
        if (binding.arg && binding.arg.startsWith("delay")) {
          el.dataset.preloading_time = Number(binding.arg.replace("delay", ""));
        }
      } else if (binding.modifiers.backgroud) {
        el.dataset.backgroud = el.style.backgroud;
      }
    },
    update: function(el, binding) {
      if (binding.modifiers.opacity) {
        // console.log(binding)
        // console.log(el.dataset.preloading_time)
        if (!binding.value && el.dataset.preloading_time) {
          setTimeout(() => {
            el.style.opacity = 1;
          }, el.dataset.preloading_time);
        } else {
          el.style.opacity = binding.value ? 0 : 1;
        }
      } else if (binding.modifiers.backgroud) {
        // console.log(binding)
        if (binding.modifiers.white) {
          el.style.backgroud = binding.value ? "#fff" : el.dataset.backgroud;
        } else if (binding.modifiers.black) {
          el.style.backgroud = binding.value ? "#000" : el.dataset.backgroud;
        }
      }
    },
  });

  // 设置title
  vue.directive("title", function(el, binding, vnode) {
    let title_suffix = vnode.context.$setting.title_suffix;
    document.title = binding.value ? binding.value + "-" + title_suffix : title_suffix;
  });

  // 设置菜单激活，通过menu-active-class控制激活类，默认active
  vue.directive("menu-active", function(el, binding, vnode) {
    let menu = vnode.context.$route.meta.menu;
    let className = el.attributes["menu-active-class"];
    className = className ? className.value : "active";
    if (menu == binding.value) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  });

  vue.directive("loadingex", {
    bind: function(el, binding, vnode) {
      let vm = vnode.context;
      let height;
      if (binding.arg && binding.arg.startsWith("h")) {
        height = el.dataset.height = Number(binding.arg.replace("h", ""));
      }

      let loadingexDiv = document.createElement("div");
      loadingexDiv.classList.add("vd-loadingex-div");
      if (height) {
        loadingexDiv.style = `height:${height}px`;
      } else {
        loadingexDiv.classList.add("vd-loadingex-div-flex");
      }
      loadingexDiv.setAttribute("element-loading-background", "#fff");

      el.classList.add("vd-loadingex");
      el.insertBefore(loadingexDiv, el.childNodes[0]);
      el._loadingexDiv = loadingexDiv;
      el._loadingex = vm.$loading({
        target: loadingexDiv,
        fullscreen: false,
      });
      if (!binding.value) {
        el.classList.remove("vd-loadingex");
        loadingexDiv.classList.add("vd-loadingex-close");
        if (el._loadingex) {
          el._loadingex.close();
          el._loadingex = undefined;
        }
      }
    },
    update: function(el, binding, vnode) {
      let div = el._loadingexDiv;

      if (binding.value) {
        el.classList.add("vd-loadingex");
        div.classList.remove("vd-loadingex-close", "vd-loadingex-end");
        if (!el._loadingex) {
          el._loadingex = vnode.context.$loading({
            target: div,
            fullscreen: false,
          });
        }
      } else {
        div.classList.add("vd-loadingex-end");
        if (el._loadingex) {
          el._loadingex.close();
          el._loadingex = undefined;
          setTimeout(() => {
            el.classList.remove("vd-loadingex");
            div.classList.add("vd-loadingex-close");
          }, 300);
          // let transitionEnd = evt => {
          //   el.classList.remove("vd-loadingex");
          //   div.classList.add("vd-loadingex-close");
          //   div.removeEventListener("webkitTransitionEnd", transitionEnd);
          //   div.removeEventListener("transitionEnd", transitionEnd);
          // };
          // div.addEventListener("webkitTransitionEnd", transitionEnd);
          // div.addEventListener("transitionEnd", transitionEnd);
          // setTimeout(() => {
          //   el._loadingex.close();
          //   el._loadingex = undefined;
          // }, 0);
        }
      }
    },
  });

  // loadingx辅助类
  let loadingx = {
    start(el, binding, vnode) {
      let vm = vnode.context;
      if (!binding.modifiers.nopacity) {
        el.classList.add("vd-loadingx-delay");
      }
      el._loadingx = vm.$loading({
        target: el,
        background: "#fff",
        fullscreen: binding.modifiers.fullscreen,
        lock: binding.modifiers.lock,
        body: binding.modifiers.body,
      });
      if (el._delay) {
        el._delayLoading = setTimeout(() => {
          el.classList.remove("vd-loadingx-delay");
          el._delayLoading = null;
        }, el._delay);
      } else {
        el.classList.remove("vd-loadingx-delay");
        el._delayLoading = null;
      }
      // vm.$nextTick(() => {
      // });
    },
    stop(el, binding, vnode) {
      // console.log(el._loadingx);
      if (el._delayLoading) {
        clearTimeout(el._delayLoading);
        el._delayLoading = null;
      }
      if (el._loadingx) {
        el._loadingx.close();
        setTimeout(() => {
          el._loadingx = undefined;
        }, 300);
        el.classList.remove("vd-loadingx-delay");
      }
    },
  };

  vue.directive("loadingx", {
    bind: function(el, binding, vnode) {
      if (binding.arg && binding.arg.startsWith("delay")) {
        el._delay = Number(binding.arg.replace("delay", ""));
      }

      // el.classList.add("vd-loadingx");
      el._loadingx_old = binding.value;
      if (binding.value) {
        loadingx.start(el, binding, vnode);
      }
    },
    update: function(el, binding, vnode) {
      if (binding.value == el._loadingx_old) {
        return;
      }
      el._loadingx_old = binding.value;
      if (binding.value) {
        if (!el._loadingx && !el._delayLoading) {
          if (!binding.modifiers.always) {
            el._delay = 0;
          }
          loadingx.start(el, binding, vnode);
        }
      } else {
        loadingx.stop(el, binding, vnode);
      }
    },
  });

  // 将元素透明
  vue.directive("qrcode", {
    bind: function(el, binding, vnode) {
      el._date_qrcode = {
        value: binding.value,
        init() {
          QRCode.toDataURL(el, el._date_qrcode.value, function(error) {});
        },
      };
      if (binding.modifiers.lazy) {
        el._date_qrcode = {
          ...el._date_qrcode,
          lazy: true,
          isUpdate: true,
        };
        watchObserver.observe(el);
        return;
      }
      if (binding.value) {
        el._date_qrcode.init();
      }
    },
    update: function(el, binding) {
      el._date_qrcode.value = binding.value;
      if (binding.modifiers.lazy) {
        el._date_qrcode.isUpdate = true;
        return;
      }
      if (!binding.modifiers.once) {
        el._date_qrcode.init();
      }
    },
  });
}

export default {
  install: function(vue) {
    config(vue);
  },
};
