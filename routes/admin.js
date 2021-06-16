const router = require('koa-router')();

router.get('/',async ctx=>{
    ctx.body='hello admin'
})
router.get('/list',async ctx=>{
    ctx.body='hello admin list'
})
router.get('/test',async ctx=>{
    ctx.body='显示中文信息'
})

module.exports=router;
