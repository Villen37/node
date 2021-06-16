var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var Config = require('./config.js');

class Db{
    static getInstance(){
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.dbClient='';
        this.connect();
    }
    connect(){
        let self = this;
        return new Promise((resolve,reject)=>{
            if(!self.dbClient){
                MongoClient.connect(Config.dbUrl,{
                    useNewUrlParser: true,
                    useUnifiedTopology: true     //这个即是报的警告
                },(err,client)=>{
                    if(err){
                        reject(err)
                    }else{
                        let cli = client.db(Config.dbName);
                        self.dbClient = cli
                        resolve(cli)
                    }
                })
                /*MongoClient.connection.on('error',()=>{
                    console.log('----链接失败')
                })*/
            }else{
                resolve(self.dbClient)
            }
        })
    }
    //mongodb 字符串转对象
    getObjectId(id){
        return new ObjectID(id);
    }
    find(collectionName, json){
        return new Promise((resolve,reject)=>{
            this.connect().then(db=>{
                var result = db.collection(collectionName).find(json);
                //console.log(result,'----')
                result.toArray((err,docs)=>{
                    if(err){
                        reject(err);
                        return
                    }else{
                        resolve(docs)
                    }
                })
            })

        })
    }
    insert(collectionName, json){
        return new Promise((resolve,reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err){
                        reject(err);
                        return
                    }else{
                        resolve(result)
                    }
                });
            })

        })
    }
    update(collectionName,option,dataJson){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).updateOne(option,{
                    $set:dataJson
                },(err,result)=>{
                    if(err){
                        reject(err);
                        return
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    remove(collectionName,option){
        return new Promise((resove,reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).removeOne(option,(err,result)=>{
                    if(err){
                        reject(err);
                        return
                    }else{
                        resove(result)
                    }
                })
            })
        })
    }
}
module.exports = Db.getInstance();

/*var myDb = new Db.getInstance();

console.time('start')
myDb.find('user',{}).then(result=>{
    console.log(result)
    console.timeEnd('start')
})

setTimeout(()=>{
    console.time('start1')
    myDb.find('user',{}).then(result=>{
        console.log(result)
        console.timeEnd('start1')
    })
},3000)*/
