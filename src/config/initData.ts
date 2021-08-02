module.exports = {
  appData: {
    appSecret:
      'd7e1342551ace542d870dbafeca495ec26140730a0973cc042e31b7772f5c9ec',
    appId: '3b839710761b5268feba2b97e453e5b8',
    remark: 'sso账号权限管理',
    appName: '账号权限系统',
  },
  menuData: [
    {
      name: '应用管理',
      router: '/application',
      resourceType: 'menu',
      parentId: 0,
      code: 'app-management',
      isShow: 1,
    },
    {
      name: '应用列表',
      router: '/application/list',
      resourceType: 'button',
      code: 'app-list',
      isShow: 1,
    },
  ],
  adminParent: {
    router: '/admin',
    name: '系统管理',
    parentId: 0,
    code: 'admin',
    isShow: 1,
  },
  adminData: [
    {
      router: '/admin/menu',
      parentId: 0,
      name: '菜单管理',
      code: '/admin/menu',
      isShow: 1,
    },
    {
      router: '/admin/role',
      code: '/admin/role',
      name: '角色管理',
      parentId: 0,
      isShow: 1,
    },
    {
      router: '/admin/user',
      code: '/admin/user',
      name: '用户管理',
      parentId: 0,
      isShow: 1,
    },
  ],
  visitorRoleData: {
    id: 10,
    roleName: '游客',
    role: 'visitor',
    remark: '账号权限系统的游客',
    isSuper: 0,
  },
  roleData: {
    roleName: '超级管理员',
    role: 'root',
    remark: '账号权限系统的超级管理员',
    isSuper: 1,
  },
}
