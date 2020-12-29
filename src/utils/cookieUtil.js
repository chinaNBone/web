import Cookies from 'js-cookie'

class CookieUtil {

  constructor() {
    this.domain = '' //暂且不用
    this.expireTime = null
  }

  set(cookiteParam) {
    var { key, value, expires, path, success } = cookiteParam
    CookieUtil.checkKey(key)
    Cookies.set(key, value, { expires: expires || this.expires, path: path || '/' })
    success && success()
  }

  get(key) {
    CookieUtil.checkKey(key)
    return Cookies.get(key)
  }

  remove(cookiteParam) {
    var { key, path, success } = cookiteParam
    CookieUtil.checkKey(key)
    Cookies.remove(key, { path: path || '/' })
    success && success()
  }

  static checkKey(key) {
    if (!key) {
      throw new Error('key不能为空!')
    }
    if (typeof key === 'object') {
      throw new Error('key不能是一个对象！')
    }
  }

}

export default new CookieUtil()