# KOA后台管理系统实践

KOA后台管理系统实践
# server 端

`koa + typescript + sequelize + mysql`

# 说明

> 数据库文件在/sql 目录下。

1. `xl_admin_data.sql`是带 demo 数据的；
2. `xl_admin_struct.sql`只有结构；

# 安装和运行

> 请确保已安装 node，mysql

1. 克隆项目
2. 创建数据库并导入 sql 文件
3. 修改 src/config/mysqlBase.ts 文件;

```js
{
    mysqlName: 'xl_admin',
    mysqlUserName: 'root',
    mysqlPassword: 'xunlei@222',
    mysqlIp: 'localhost',
}

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

# 项目部署

```shell
# 服务器安装pm2，防止node服务挂掉
$ npm i -s pm2
# 启动程序，在4000端口启动
$ pm2 start index.js --name 'server'

# 还可能会用到下面指令
# 项目重启
$ pm2 restart all
# 查看启动的node项目
$ pm2 list
# 删除项目进程
$ pm2 delete server

```

# 接口文档

项目启动后，访问：
`http://127.0.0.1:4000/swagger`
