const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const axios = require('axios');

router.get('/',async ctx=>{
    ctx.body='Tell me what do you want'
})

router.get('/A00000',async ctx=>{
    let apiList = {
        '/html2img':{'url':'转码url','w':'图片宽度','h':'图片高度','uid':'随便一个数字','force':'1强制生成，默认为取缓存','testUrl':'http://c0o0l.com/tools/html2img?url=https%3A%2F%2Fwww.baidu.com%2F&force=1'}
    }
    ctx.body=apiList
})

router.get('/html2img',async ctx=>{
    let params = ctx.query;
    let url = params.url;
    let callback = {
        msg:'ok',
        code:'A000000',
        data:{

        }
    }
    if(!url){
        callback.msg='we nedd your url';
        callback.code='E00000'
        ctx.body=callback;
        return;
    }
    let phantom = require('phantom');
    let time = new Date();
    let na = Math.random().toString(36).slice(-8)+time.getTime().toString().slice(-8)+'.png';
    let w = params.w || 300;
    let h = params.h || w;
    let s = params.s || 500;
    let uid = params.uid || 111111;
    let imgLocal = './produce_img/'+na;
    let imgPath = path.resolve("./"+imgLocal);

    let force =  params.force || 0;
    let html2img = ctx.cookies.get('html2img');
    console.log(html2img,'---cookie')
    if(force==0 && html2img){
        callback.data.url = html2img;
        ctx.body=callback;
        return;
    }

    return new Promise((resolve, reject)=>{

        phantom.outputEncoding="GBK";
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
                page.open(url).then(function(status) {
                    console.log(status,'--status')
                    page.property('viewportSize', { width: w, height: h });
                    setTimeout(()=>{
                        page.render(imgLocal).then(function() {
                            //上传到其他服务器
                            let imageData = fs.readFileSync(imgPath);
                            let imageDataToBase64 = imageData.toString('base64');
                            if(imageDataToBase64){
                                //let api = 'http://10.16.171.78:8085/api/route/pps/pull/queryUploadShareImage';
                                let api = 'http://toutiao.iqiyi.com/api/route/pps/pull/queryUploadShareImage';
                                let data = {
                                    ppuid: uid,
                                    type:2,
                                    baseStr:imageDataToBase64
                                };
                                axios.post(api,data)
                                    .then(response => {
                                        callback.data.tempUrl = 'http://'+ctx.request.host+'/'+na;
                                        let result = response.data;
                                        if(result.code=='A00000'){
                                            let img = result.data.imageUrl;
                                            if(img){
                                                callback.data.url = img;
                                                //缓存
                                                ctx.cookies.set('html2img',img,{
                                                    maxAge:1000*60*60*24*20, //高优先级
                                                })

                                                fs.unlink(imgLocal,(da)=>{})
                                            }else{
                                                callback.code='E00000';
                                                callback.msg='error'
                                            }

                                        }
                                        resolve(result)
                                        ctx.body=callback;
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        reject(error)
                                        ctx.body=callback;
                                    });
                            }
                            ph.exit();
                        });

                    },s)

                });
            });
        });

    })




})

module.exports = router;

