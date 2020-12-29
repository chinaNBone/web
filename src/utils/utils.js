import moment from "moment";

function extend() {
  // 默认不进行深拷贝
  let deep = false;
  let name, options, src, copy, clone, copyIsArray;
  let length = arguments.length;
  // 记录要复制的对象的下标
  let i = 1;
  // 第一个参数不传布尔值的情况下，target 默认是第一个参数
  let target = arguments[0] || {};
  // 如果第一个参数是布尔值，第二个参数是 target
  if (typeof target == "boolean") {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  // 如果target不是对象，我们是无法进行复制的，所以设为 {}
  if (typeof target !== "object") {
    target = {};
  }

  // 循环遍历要复制的对象们
  for (; i < length; i++) {
    // 获取当前对象
    options = arguments[i];
    // 要求不能为空 避免 extend(a,,b) 这种情况
    if (options != null) {
      for (name in options) {
        // 目标属性值
        src = target[name];
        // 要复制的对象的属性值
        copy = options[name];

        // 解决循环引用
        if (target === copy) {
          continue;
        }

        // 要递归的对象必须是 plainObject 或者数组
        if (
          deep &&
          copy &&
          (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          // 要复制的对象属性值类型需要与目标属性值相同
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
function isPlainObject(obj) {
  let proto, Ctor;

  // (1) null 肯定不是 Plain Object
  // (2) 使用 Object.property.toString 排除部分宿主对象，比如 window、navigator、global
  if (!obj || {}.toString.call(obj) !== "[object Object]") {
    return false;
  }

  proto = Object.getPrototypeOf(obj);

  // 只有从用 {} 字面量和 new Object 构造的对象，它的原型链才是 null
  if (!proto) {
    return true;
  }

  // (1) 如果 constructor 是对象的一个自有属性，则 Ctor 为 true，函数最后返回 false
  // (2) Function.prototype.toString 无法自定义，以此来判断是同一个内置函数
  Ctor = {}.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  );
}

//对文本内容进行标签处理
function formatHtml(details) {
  if (!details) {
    return;
  }
  let temp = details;
  temp = temp.replace(/\n|\r\n/g, "<br/>");
  temp = temp.replace(/\s/g, "&nbsp;");
  return temp;
}
//时间天数计算 时间戳
function DateDiff(sDate1, sDate2) {
  //sDate1和sDate2是 时间戳 格式
  var iDays;
  iDays = parseInt(Math.abs(sDate1 - sDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  return iDays;
}

const tree = {
  /**
   * 转换树形结构，添加parent节点
   * @param {tree} tree
   * @param {node} parent
   */
  convertTree(tree, parent) {
    if (isNaN(tree.length)) {
      tree = [tree];
    }
    for (let key in tree) {
      let node = tree[key];
      node.parent = parent;
      if (node.childrenList && node.childrenList.length > 0) {
        this.convertTree(node.childrenList, node);
      }
    }
  },

  /**
   * 根据tree的key值，获取tree的节点
   * @param {tree} tree
   * @param {string} key
   * @param {string} value
   */
  getTreeNodes(tree, key, value) {
    let select = [];
    if (isNaN(tree.length)) {
      tree = [tree];
    }
    for (let i in tree) {
      let node = tree[i];
      if (node[key] == value) {
        select.push(node);
      }
      if (node.childrenList && node.childrenList.length > 0) {
        select = select.concat(
          this.getTreeNodes(node.childrenList, key, value)
        );
      }
    }
    return select;
  },
  /**
   * 获取节点的路径
   * @param {tree} tree
   * @param {string|object} key (key | node)
   * @param {string} value
   */
  getNodePath(tree, key, value) {
    let node =
      typeof key === "string" ? this.getTreeNodes(tree, key, value)[0] : key;
    let path = [];
    while (true) {
      if (!node) {
        return path;
      }
      path.unshift(node);
      node = node.parent;
    }
  },
};

const area = {
  // 去除空的childrenList属性，用于级联选择器
  trim(areaList) {
    areaList.forEach(el => {
      if (el.childrenList) {
        if (el.childrenList.length > 0) {
          area.trim(el.childrenList);
        } else {
          delete el.childrenList;
        }
      }
    });
  },
  // 将 area list转化为 area map
  toMap(areaList) {
    return list.toMap(areaList, {
      key: "id",
      value: "name",
      children: "childrenList",
    });
  },
};

const list = {
  /**
   * 将 list 转化为 map
   * @param {*} origin 原始 list
   * @param {*} opt
   *        key -- map的key对应的list元素属性
   *        value -- map的value对应的list元素属性
   *        children -- 若存在，则将子集也一并转化，值为children的属性值
   * @param {*} map
   */
  toMap(
    origin,
    opt = { key: "id", value: "title", children: "childrenList" },
    map = {}
  ) {
    origin.forEach(el => {
      map[el[opt.key]] = opt.value ? el[opt.value] : el;
      if (opt.children && el[opt.children] && el[opt.children].length > 0) {
        list.toMap(el[opt.children], opt, map);
      }
    });
    return map;
  },

  /**
   * 将 list 转化为 tree
   * @param {*} list 原始 list
   * @param {*} opt
   *        root -- 树的第一级的父id, 则将所有父id为该值的节点，添加到树的第一级; 如果未设置根节点，则将所有父节点为null的节点添加到树的第一级
   *        id -- 节点id的key值
   *        parentId -- 节点父id的key值
   *        parentNode -- 父节点的属性值
   *        childNode -- 子节点的属性值
   * @param {*} tree
   */
  toTree(
    list,
    opt = {
      root: null,
      id: "id",
      parentId: "parentId",
      parentNode: "parent",
      childNode: "childrenList",
    },
    tree = []
  ) {
    if (list == null || list.length < 1) {
      return [];
    }
    let map = this.toMap(list, { key: "id", value: null });
    list.forEach(el => {
      // 设置parent节点
      let parent = map[el[opt.parentId]];
      if (!parent) {
        // 如果是根节点，则添加到树的第一级
        // 如果未设置根节点，则将所有parent为null的节点添加到树的第一级
        if (!opt.root || el[opt.parentId] == opt.root) {
          tree.push(el);
        }
        return;
      }
      el[opt.parentNode] = parent;
      if (!parent[opt.childNode]) {
        parent[opt.childNode] = [el];
      } else {
        parent[opt.childNode].push(el);
      }
    });
    return tree;
  },
};

function getDateDuration(t1, t2, abs = true) {
  let duration = moment.duration(moment(t1) - moment(t2)).asDays();
  return abs ? Math.abs(duration) : duration;
}

/**
 * 获取缩略图地址
 * @param {*} url     图片地址
 * @param {*} width
 * @param {*} height
 */
function getThumb(url, width = 100, height = 100) {
  if (!url) {
    return "";
  }
  let last = url.lastIndexOf(".");
  return `${url.slice(0, last)}_${width}x${height}${url.slice(last)}`;
}

/**
 * 设置网站title
 * @param {string} title
 */
function setTitle(title) {
  title && typeof title === "string" && (document.title = title);
}

/**
 * 获取菜单active项
 * 如 /index/student/add，通过/区分层数，会过滤空值的层数，所以区分后菜单key值为[ index, student, add ]
 * /index/student/add = index/student/add = index//student//add
 *
 * @param {*} route 路由参数
 * @param {*} index 需要获取的层数，默认为 0
 * @param {*} prefix 需要加的路由前缀，默认为 /
 */
function getMenu(route, index = 0, prefix = "/") {
  let menuPath = route.meta.menuPath;
  // 分离层数
  let path = menuPath.split("/");
  // 过滤空值的层数
  path = path.filter(el => el != "");
  if (!path || path.length == 0) {
    return prefix;
  }
  // 如果index是数组形式
  if (index.length) {
    let full = "";
    index.forEach(i => {
      if (path[i]) {
        full += prefix + path[i];
      }
    });
    return full;
  }
  return prefix + path[index];
}

export const Utils = {
  isPlainObject,
  extend,
  formatHtml,
  DateDiff,
  tree,
  area,
  list,
  getDateDuration,
  getThumb,
  setTitle,
  getMenu,
};
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$utils", {
      value: Utils,
    });
  },
  Utils,
};
