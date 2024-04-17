（原作者说不要用，还没有完全实现！希望大神继续改进。）
使用:

    let cron = new CronJob('* * * * * *', function(){
        console.log('You will see this message every second');  // 原作者是每秒钟的setInterval, 我改成了每小时的。
    });
    cron.start() // 原作者是在构造函数直接开始，我为了需要方法开始。

    cron.stop() // 当然也有停止。
    
可用的 Cron 模式（可网上搜索一下语法）:

    星号Asterisk. E.g. *
    范围Ranges. E.g. 1-3,5
    步骤Steps. E.g. */2
    
[Read up on cron patterns here](http://help.sap.com/saphelp_xmii120/helpdata/en/44/89a17188cc6fb5e10000000a155369/content.htm).

另一个例子:

    new CronJob('00 30 11 * * 2-6', function(){
        // Runs every weekday (Monday through Friday) 每周运行（周一到周五）
        // at 11:30:00 AM. It does not run on Saturday在上午11点30分，周六日不运行。
        // or Sunday.
    });
