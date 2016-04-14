/**
 * Created by liz on 2016/4/14.
 */
var request= require("request");
var $ = require("cheerio");
var nodeMailer = require('nodemailer');

var user = 'yourQQ@qq.com', //发送邮箱
    pass = 'yourAuthCode'; //不是密码，授权码来源详见：http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256

var transporter = nodeMailer.createTransport({
    host: 'smtp.qq.com',
    secureConnection: true,
    port: 465,
    auth: {
        user: user,
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

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var status =  $(body).find('.strong-new').slice(1).text();
        if(status != "面试中"){
            sendEmail("您的状态变为 " + status);
        }
    }
}

function sendEmail(html){
    transporter.sendMail({
        from: 'yourQQ@qq.com', //发送邮箱
        to: 'youTargetQQ@qq.com', //目标邮箱
        subject: '阿里实习状态已改变！',
        html: html
    });
}

setInterval(function(){
    request(options, callback);
},5000);

