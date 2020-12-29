/**
 * 检测元素是否在页面中出现，IE无法使用
 */
export default {
  myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
      //判断是否Opera浏览器
      return "Opera";
    }
    if (userAgent.indexOf("Firefox") > -1) {
      //判断是否Firefox浏览器
      return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
      //判断是否Chrome浏览器
      return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
      //判断是否Safari浏览器
      return "Safari";
    }
    if (
      userAgent.indexOf("compatible") > -1 &&
      userAgent.indexOf("MSIE") > -1 &&
      !isOpera
    ) {
      //判断是否IE浏览器
      return "IE";
    }
  },

  init(entries, config = {}) {
    if ("Chrome" != this.myBrowser() && "FF" != this.myBrowser()) return;
    if (IntersectionObserver) {
      window._lazy_scroll_observer = new IntersectionObserver(entries, config);
    }
  },
  observe(el) {
    if ("Chrome" != this.myBrowser() && "FF" != this.myBrowser()) return;
    if (IntersectionObserver) {
      window._lazy_scroll_observer.observe(el);
    }
  },
  unobserve(el) {
    if ("Chrome" != this.myBrowser() && "FF" != this.myBrowser()) return;
    if (IntersectionObserver) {
      window._lazy_scroll_observer.unobserve(el);
    }
  },
  disconnect(el) {
    if ("Chrome" != this.myBrowser() && "FF" != this.myBrowser()) return;
    if (IntersectionObserver) {
      window._lazy_scroll_observer.disconnect(el);
    }
  }
};
