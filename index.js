const express = require('express')
const app = express();
const ID = ''
const SECRET = ''
const REGION =  'us-east-2'
const AWS = require("aws-sdk");
const PORT = 3005
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views","./views");

const docClient = new AWS.DynamoDB.DocumentClient({
    region: REGION,
    accessKeyId: ID,
    secretAccessKey: SECRET
})

app.get('/get', (req, res) => {
    const params_scanStudent ={
        TableName: "Cart",
    };
    docClient.scan(params_scanStudent,onScan)
    function onScan(err,data){
        if(err){
            console.log("Loi khi scan",JSON.stringify(err,null,2))
            res.send(err)
        }
        else{
            const list = data.Items
            res.render('trangchu', {list})
        }
    }
})

app.post('/add',(req,res)=>{    
  
    const id = req.body.id
    const ten = req.body.ten
    const dongia = req.body.dongia
    const soluong = req.body.soluong
   

   const params_add = {
    TableName: "Cart",
    Item :{
        "id" : parseInt(id),
        "ten" : ten,
        "dongia" :dongia,
        "soluong":soluong,  
    }
    }

    // const params_scanStudent ={
    //     TableName: "Cart",
    // };
    // let list = [];
    // docClient.scan(params_scanStudent,(err,data)=>{
    //     if(err){
    //         console.log("Loi khi scan",JSON.stringify(err,null,2))
    //         res.send(err)
    //     }
        
    //         list = data.Items
            
    // })
  
    // for(var i =0 ;i<list.length;i++){
      
    //     if(list[i].id==id){
    //         var soluongmoi =parseInt(soluong)+parseInt(list[i].soluong);
          
    //         const params_updateStudent ={
    //             TableName:"Cart",
    //             Key:{
    //                 "id":parseInt(id)
    //             },
    //             UpdateExpression: "set ten= :ten, soluong = :soluong, dongia = :dongia ",
    //             ExpressionAttributeValues:{
    //                 ":ten": ten,
    //                 ":soluong":soluongmoi,
    //                 ":dongia":dongia,
    //             },
    //             ReturnValues:"UPDATED_NEW"
    //         }
    //         docClient.update(params_updateStudent,(err,data) =>{
    //             if(err){
    //                 console.log("Loi khi update: " , JSON.stringify(err,null,2))
    //                 return res.json({msg:"false"})
    //             }
    //             else{
    //                 console.log("update sinh vien thanh cong!!!",JSON.stringify(err,null,2))
    //                 return res.redirect('/')
    //             }
    //         })
    //     }
    // }
    

    docClient.put(params_add,(err,data) =>{
        if(err){
            console.log("Loi khong the them  ",JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("Them thanh cong : ",JSON.stringify(data,null,2))
            return res.redirect('/get')
        }
    })
    
    
})


app.use(cors())


app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    const params_deleteStudent = {
        TableName :"Cart",
        Key:{
            "id":parseInt(id)
        }
    };
   
    docClient.delete(params_deleteStudent,(err,data)=>{
        if(err){
            console.log("Loi khi xoa !!!",JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("Xoa thanh cong!!!",JSON.stringify(data,null,2))
            return res.redirect('/get')
        }
    })
})


app.listen(PORT, () => console.log(`Server connected port ${PORT}`))

// app.use('/',)