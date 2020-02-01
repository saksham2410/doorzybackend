const express = require("express");
const cors = require("cors");
require("dotenv").config();
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var http = require("https");
const querystring=require('querystring');
// app.use(
//     cors({
//       origin: '*'
//     })
//   );
app.post('/api/sendotp',(request,response,next) =>
{
    var flag=0;
    const params={
        template_id:'5dac02d7d6fc05265e48f5f1',
        mobile:request.body.phone,
        authkey:'299889AtoI1ccEli5dabf539',
        otp_length:6,
        otp_expiry:1,
        invisible:1
    }

    const postdata=querystring.stringify(params);
    // console.log(postdata);

    var options={
        'method' : 'POST',
        'hostname' : 'control.msg91.com',
        'port' : null,
        'path' : `api/sendotp.php?${postdata}`,
        "headers" : {}
    };
    var url=`https://api.msg91.com/api/v5/otp?${postdata}`;
    
    console.log(url);
    var req=http.request(url,(res)=>{
        var chunks=[];
        res.on("data",(chunk)=>{chunks.push(chunk);});
        res.on("end",()=>{
            var body=Buffer.concat(chunks);
            var obj=JSON.parse(body.toString());
            // code_id=obj.message;
            type=obj.type;
            if(type=='error'){
                flag=1;
            }
            console.log(obj);
        });
    });
    if(flag==1)
        response.status(404).send(`{"message":"Some error Occured"}`);
    else
        response.send(`{"message":"otp sent successfully"}`);
    req.end();
});

app.post('/api/resendotp',(request,response,next)=>
{
    const params={
        country:91,
        retrytype:'text',
        mobile : request.headers.pno,
        authkey : '299889AtoI1ccEli5dabf539',
    };

    var flag=0;
    var mobileResponse;
    var query=querystring.stringify(params);
    console.log(query);
    var url=`https://control.msg91.com/api/retryotp.php?${params}`;
    var req=https.request(url,(res)=>{
        var chunks=[];
        res.on("data",(chunk)=>{chunks.push(chunk);});
        res.on("end",()=>{
            var body=Buffer.concat(chunks);
            console.log(body.toString());
            var obj=JSON.parse();
            if(obj.type===`error`){
                flag=1;
            }
            console.log(obj);
            mobileResponse=obj;
        });
    });
    if(flag==0)
        response.send(mobileResponse);
    else
        response.send({message:"Error Occured"});
    req.end();
});

app.post('/api/verifyotp',(request,response,next)=>
{
    var flag=0;
    var mobileResponse;
    const params={
        otp : request.body.otp,
        mobile : request.body.phone,
        authkey : '299889AtoI1ccEli5dabf539',
        // request_id : code_id
    };
    var query=querystring.stringify(params);
    var url=`https://api.msg91.com/api/v5/otp/verify?${query}`;

    var req=http.request(url,(res)=>{
        var chunks=[];
        res.on("data",(chunk)=>{
            chunks.push(chunk);
        });
        res.on("end",()=>{
            var body=Buffer.concat(chunks);
            var obj=JSON.parse(body.toString());
            console.log(obj);
            if(obj.type==`error`){
                flag=1;
            }
        });
    });
    if(flag==0)
    response.send({success:true});
    else
        response.send({success:false});
    req.end();
})
const PORT = process.env.PORT || 3000;
app.listen(PORT);
