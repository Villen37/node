var func = {
    getPostData: function (ctx) {
        return new Promise((resove, reject)=>{
            try {
                let str='';
                ctx.req.on('data',(chunk)=>{
                    str += chunk;
                });
                ctx.req.on('end',()=>{
                    resove(str)
                })
            }catch (e) {
                reject(e);
            }

        })
    },
    checkResult: function (result,okUrl,noUrl) {
        try {
            if(result.result.ok){
                if(okUrl) ctx.redirect(okUrl)
            }
        }catch (e) {
            if(noUrl) ctx.redirect(noUrl)
        }
    }
}
module.exports = func;
/*
exports.getPostData = function (ctx) {
    return new Promise((resove, reject)=>{
        try {
            let str='';
            ctx.req.on('data',(chunk)=>{
                str += chunk;
            });
            ctx.req.on('end',()=>{
                resove(str)
            })
        }catch (e) {
            reject(e);
        }

    })
}*/
