/*
 * @Author: zhaoguojun
 * @Date: 2021-06-07 09:51:00
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-12 19:17:07
 */
import { createHmac } from 'crypto'
/**
 *格式化菜单
 * @param {any[]} menus
 * @param {string} [id]
 * @return {*}
 */
function formatMenus(menus: any[], id?: string) {
  let newMenus: Array<any> = []
  // 查子级
  if (id) {
    menus.forEach((item) => {
      if (item.parentId === id) {
        newMenus.push({
          isShow: item.isShow,
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
          isShow: item.isShow,
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

/**
 * 创建secret hash
 * @param {string} text
 * @return {*}  {string}
 */
function createSecretHash(text: string): string {
  const secret = 'zhanghaoquanxian'
  const current_date = new Date().valueOf().toString()
  const hash = createHmac('sha256', text)
    .update(current_date + text)
    .digest('hex')
  return hash
}

/**
 * 创建ID hash
 * @param {string} text
 * @return {*}  {string}
 */
function createIdHash(text: string): string {
  const current_date = new Date().valueOf().toString()
  const random = Math.random().toString()
  const hash = createHmac('md5', current_date + random)
    .update(text)
    .digest('hex')
  return hash
}
/**
 * @param {string} url
 * @return {*}
 */
function getHostByUrl(url: string) {
  const result = url && String(url).split('/')[2]
  return result
}

export { formatMenus, createIdHash, createSecretHash, getHostByUrl }
