const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function(){
    console.log("db connected")
}).catch(function(){
    console.log("db failed...")
})

const credential = mongoose.model("credential",{},"bulkmail")

app.post("/mail",function(req,res){
    var msg = req.body.msg
    var email = req.body.emailList

    credential.find().then(function(data){

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
            user: data[0].toJSON().user,
            pass: data[0].toJSON().pass,
          },
        });
    
        new Promise(async function(resolve,reject){
    
            try{
                for(var i=0; i < email.length; i++)
                    {
                    await transporter.sendMail(
                        {
                            from:"harishrajd6@gmail.com",
                            to:email[i],
                            subject:"hi",
                            text:msg
                        }
                    )
                }
                resolve("success")
            }
            catch(error){
                reject("Failed")
            }
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
    
    }).catch(function(error){
        console.log(error)
    })

})


app.listen(5000,function(){
    console.log("server started..!")
})