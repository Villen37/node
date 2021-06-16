
const Koa = require('koa');
const Router = require('koa-router');


const path = require('path');
const render = require('koa-art-template');
const static = require('koa-static');
const koaBody = require('koa-body');
const common = require('./module/common');
const DB = require('./module/db');
const Log = require('./module/log')

var admin = require('./routes/admin');
var tools = require('./routes/tools');

var router = new Router();
var app = new Koa();

Log.access('hello')
setTimeout(()=>{
    Log.access('hello2')
},2000)

//模板引擎配置(要在app后)
render(app,{
    root:path.join(__dirname,'views'),
    extname:'.html',
    debug: process.env.NODE_ENV !== 'production'

})
//静态文件中间件（可多个  ）
app.use(static(__dirname+'/static'))
app.use(static(__dirname+'/produce_img'))

//body中间件
app.use(koaBody());

//中间件——应用
app.use(async (ctx,next)=>{
    //继续
    await next();
    if(ctx.status==404){
        ctx.body = 'Sorry，没有找到陆地'
    }
})

router.get('/', async (ctx,next)=>{
    ctx.cookies.set('loginname','hello',{
        maxAge:60*1000*1, //高优先级
        expires: new Date(new Date().getTime()+6*1000)
    })
    ctx.body='hellow';

})


//动态路由
router.get('/news/:param', async (ctx,next)=>{
    console.log(ctx.params) ///news/id数字
    ctx.body='hello news'
})

//层级路由
router.use('/admin',admin.routes())
router.use('/tools',tools.routes())



app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000)