/**
 * Created by liz on 2016/4/14.
 */
var request= require("request");
var $ = require("cheerio");
var nodeMailer = require('nodemailer');

var from = 'yourQQ@qq.com', //发送邮箱
    pass = 'yourAuthCode', //不是密码，授权码来源详见：http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256
    to = 'yourTargetQQ@qq.com';
var transporter = nodeMailer.createTransport({
    host: 'smtp.qq.com',
    secureConnection: true,
    port: 465,
    auth: {
        user: from,
        pass: pass
    }
});

//cookie来自你访问的myJobApply.htm的cookie,可以在chrome下用F12->network里面看到http头信息，复制到下面就可以了

var options = {
    url: 'https://campus.alibaba.com/myJobApply.htm',
    headers: {
        'User-Agent': 'request',
        'cookie': ''
    }
};
var inter;

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var status =  $(body).find('.strong-new').slice(1,2).text();
        console.log("当前状态: ",status,' '+new Date().toLocaleString());
        if(status != "面试中"){
            sendEmail("您的状态变为 " + status);
            clearInterval(inter);
        }
    }
}

function sendEmail(html){
    transporter.sendMail({
        from: from, //发送邮箱
        to: to, //目标邮箱
        subject: '阿里实习状态已改变！',
        html: html
    });
}

request(options, callback);

inter = setInterval(function(){
    request(options, callback);
},1000 * 30);

