const express = require('express');
const bodyParser = require('body-parser');
const secureEndpoints = require('./modules/secureEndpoints');
const user = require('./modules/user');
const Token = require('./modules/jwt');
const TokenCheck = require('./modules/jwtTest');


const server = express(); 

server.set('port', (process.env.PORT || 8080));
server.use(express.static('public'));
server.use(bodyParser.json());

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

server.use("/secure", secureEndpoints);


server.post("/user", async function (req, res){
    const newUser = new user(req.body.username, req.body.password);
    await newUser.create();
    res.status(200).json(newUser).end();
});

server.post("/user/login", async function (req, res){
    const userLogin = new user(req.body.username, req.body.password);
    let response = await userLogin.login();
    let headerValue = {
        "alg": "HS256",
        "typ": "JWT"
        };
     let payloadValue = {
        "userId": response
     };
    let token = new Token(headerValue, payloadValue);
    token.result();
    //let tokenString = token.header+"."+token.payload+"."+token.signature;
    let data = {
        "username": userLogin.username,
        "token": token
    };
    
    if(response == null){
        res.status(401).json({msg:"Incorrect username and password"}).end();
    }else {
        res.status(200).json(data).end();
    }
});

server.get("/tasks", function (req, res){
let token = JSON.parse(req.headers.authorization); 
const tokenCheck = new TokenCheck(token.header,token.payload,token.signature)
let tokenRes = tokenCheck.result();
if (tokenRes === true){
    res.status(200).json({msg:"Token ok"})
}else if(tokenRes === false) {
    res.status(403).json({msg:"Bad token"})
}
});