# koa-swapi

[![node](https://img.shields.io/node/v/passport.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://github.com/haowen737/koa-swapi)

> 在Koa中使用更先进的路由

[English](https://github.com/haowen737/koa-swapi/blob/master/README.md) | [中文](https://github.com/haowen737/koa-swapi/blob/master/docs/README-zh.md)

*Koa-swapi* 是一款用起来还算顺手的koa路由中间件, 你可以像 [Hapijs](https://hapijs.com/)一样定义路由, koa-swapi 会进行所有的请求参数校验, 并能生成 [OpenAPI](https://www.openapis.org/) 文档 ([Swagger](https://swagger.io/) RESTful API 文档说明).


## Install

```shell
npm i koa-swapi --save
```

## Usage Guide

Build Schema

```js
const Joi = require('joi')
const { Route, Validator } = require('koa-swapi')

const catSchemas = [
  Route
    .get('/cat/:id')
    .tags(['catt', 'aninaml'])
    .summary('获得一只帅气猫')
    .description('想获得一只帅气猫的时候可以调用这个接口')
    .validate(
      Validator
        .params({
          id: Joi.string().required().min(2).max(4).description('猫的id')
        })
        .query({
          name: Joi.string().required().min(3).max(100).description('猫的名字'),
          sex: Joi.any().required().valid(['0', '1']).description('猫的性别, 0:男, 1:女')
        })
        .output({
          200: {
            body: Joi.string()
          }
        })
    )
    .create('getCat')
]
```

Build Controller

```js
const controller = module.exports = {}

controller.getCat = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'miaomiaomiao'
}
```

Build Api

```js
const { api } = require('koa-swapi')

const apis = [
  api.schemas(catSchemas).handler(catController)
]
```

Register

```js
// app.js
const Koa = require('koa')
const { Swapi } = require('koa-swapi')

const app = new Koa()
const swapi = new Swapi()

swapi.register(app, {
  basePath: '/api',
  apis: apis
})

app.listen(3333)
```

## 感谢

- [hapi](https://hapijs.com/) 路由即文档的一款node框架
- [Joi](https://github.com/hapijs/joi) 语义化的对象数据模式验证库
- [hapi-swagger](https://github.com/glennjones/hapi-swagger)hapi的一款swagger构建插件
- [Swagger UI](https://github.com/swagger-api/swagger-ui) 精美且强大的api接口文档管理平台