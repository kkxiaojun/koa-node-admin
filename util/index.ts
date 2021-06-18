/*
 * @Author: zhaoguojun
 * @Date: 2021-06-07 09:51:00
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-17 15:06:29
 */

const CryptoJS = require("crypto-js")
/**
 * @msg: 转化为驼峰形式
 * @param {str} String
 */

function formatResKey(str: string) {
  if (typeof str === "string") {
    return str.replace(/_[a-z]/g, (word) => {
      return word.substring(1, 2).toUpperCase()
    })
  }
  return str
}

/**
 * @msg: 加密
 * @param {before} String
 */

function encrypt(before: string) {
  const secretKey = "com.sunft.foo.key"
  const afterEncrypt = CryptoJS.DES.encrypt(
    before,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString()
  return afterEncrypt
}

/**
 * @msg: 解密
 * @param {before} String
 */

function decrypt(before: string) {
  const secretKey = "com.sunft.foo.key"
  const afterDecrypt = CryptoJS.DES.decrypt(
    before,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8)
  return afterDecrypt
}

/**
 *格式化菜单
 * @param {any[]} menus
 * @param {string} [id]
 * @return {*}
 */
function formatMenus(menus: any[], id?: string) {
  let newMenus: Array<Object> = []
  // 查子级
  if (id) {
    menus.forEach((item) => {
      if (item.parentId === id) {
        newMenus.push({
          hideInMenu: item.isShow === "1" ? false : true,
          router: item.router,
          code: item.code,
          remark: item.remark,
          resourceType: item.resourceType,
          parentId: item.parentId,
          sort: item.sort,
          id: item.id,
          childData: formatMenus(menus, item.id),
          // component: item.component,
          apiUrl: item.apiUrl,
          name: item.name,
        })
      }
    })
    if (newMenus.length === 0) {
      newMenus = null
    }
  } else {
    menus.forEach((item) => {
      if (item.parentId === 0) {
        newMenus.push({
          hideInMenu: item.isShow === "1" ? false : true,
          router: item.router,
          code: item.code,
          remark: item.remark,
          resourceType: item.resourceType,
          parentId: item.parentId,
          sort: item.sort,
          id: item.id,
          childData: formatMenus(menus, item.id),
          // component: item.component,
          apiUrl: item.apiUrl,
          name: item.name,
        })
      }
    })
  }
  return newMenus
}

export { formatResKey, encrypt, decrypt, formatMenus }
