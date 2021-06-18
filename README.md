# server端
`koa + typescript + sequelize + mysql`

## 说明
> 数据库文件在/sql目录下。

## 安装和运行
> 请确保已安装node，mysql

1. 克隆项目
2. 创建数据库并导入sql文件
2. 修改config/sequelizeBase.js文件

```js
const Sequelize = require('sequelize');
// 参数依次为：要导入的数据库名，账号，密码
const sequelize = new Sequelize('common', 'root', '123456', {
    // 数据库ip
    host: '127.0.0.1',
    dialect: 'mysql'
});

module.exports = sequelize;
```
4. 进入项目根目录执行：

```shell
// 安装依赖
yarn

// 开发环境运行
yarn dev

// 打包测试环境产物
yarn build:test

// 运行测试环境环境资源
yarn serve:test

// 打包部署环境产物
yarn build:prod

// 运行生产环境资源
yarn serve:prod

// 检查代码风格
yarn lint

//停止运行
yarn stop
```
## 项目部署

```shell
# 服务器安装pm2，防止node服务挂掉
$ npm i -s pm2 
# 启动程序，在4000端口启动
$ pm2 start index.js --name 'server'
# 有安装防火墙的需要打开4000端口
$ firewall-cmd --zone=public --add-port=4000/tcp
# 重启防火墙
$ firewall-cmd --reload

# 还可能会用到下面指令
# 项目重启
$ pm2 restart all
# 查看启动的node项目
$ pm2 list
# 删除项目进程
$ pm2 delete ant-back-server

```

## 方案设想
1. 登陆url： http://www.demo.com/autoLogin?appkey=1&timestamp=2121323123&sign={md5加密的appScret}
2. server端，接受appkey和sign，对sign进行校验；并查找appKey是否存在；不存在直接sso处理；存在验证权限和返回权限
3. server端，角色管理：超级管理员、管理员、游客

## 技术选型
1. 业务上主要考虑 koa和egg的方案；
egg是基于koa的一个框架；koa更像是一个库；egg是MVC模式的框架，集成封装，方便使用；
koa是轻量级的库，考虑要做的系统业务也不复杂，koa上手简单；
所以是选择egg作为业务开发
2. 数据存储：管理系统业务关联性比较强，考虑用关系型数据库mysql；
3. 操作mysql数据库，考虑增加sequelize辅助操作数据库，提高效率；
