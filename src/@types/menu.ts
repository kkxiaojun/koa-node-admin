export interface Menu {
  name: string
  router: string
  parentId?: number
  code?: string
  isShow?: number
}

export interface MenuData {
  name: string
  router: string
  parentId?: number
  code?: string
  isShow?: number
  childData?: Array<Menu> | null
}
