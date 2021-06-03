/**
 * https://serialport.io/docs/guide-errors  you can find serialport document from the url
 * npm install -g @serialport/list or @serialport/terminal or  serialport-repl  you can install a software that make you get serialport list
 * @author icezhang
 */
var robot = require('robotjs');
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 9999 });



server.on('open', function open() {

    console.log('connected');
});

server.on('close', function close() {
    console.log('disconnected');
});

server.on('connection', function connection(ws, req) {
    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    const clientName = ip + port;
    console.log('%s is connected', clientName);
    //ws.send("Welcome " + clientName);
    ws.on('message', function incoming(message) {
        console.log('received: %s from %s', message, clientName);
    });
});


/**
 * there are serveral Parsers that parse the serialport data
 *
 * const Readline = require('@serialport/parser-readline')
 * const parser = new Readline()
 * const ByteLength = require('@serialport/parser-byte-length')
 * const parser = new ByteLength({length: 1025})
 * const Delimiter = require('@serialport/parser-delimiter')
 * let splitBuffer = Buffer.from([0x68, 0x65 ,0x6C,0x6C ,0x6F ,0x77 ,0x6F ,0x72 ,0x6C ,0x64]);
 * @author icezhang
 */

//声明串口数据  分行解析器
var pointArr = new Array();
// const Readline = require('@serialport/parser-readline')
// const parser = new Readline()
const Delimiter = require('@serialport/parser-delimiter');
let splitBuffer = Buffer.from([0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x77, 0x6F, 0x72, 0x6C, 0x64]);
const parser = new Delimiter({ delimiter: splitBuffer });
//串口初始化
const SerialPort = require('serialport');
const { CLOSING } = require('ws');

SerialPort.list().then(ports => {
    console.info('=========================================================================================\r\n');
    console.info('hello ,there are serialport lists that we selected from your device\r\n');
    ports.forEach(function (port) {
        console.info('port:%s\r\n', port.path);
    });
    console.info('=========================================================================================\r\n');
});

// process.stdin.on('data',(input)=>{
//   console.info("please input ")
//   input = input.toString().trim();
//   console.info(input)
//
//
// })wwww
let leftIndexArr;
let rightIndexArr;
var lastKey = [], newkey, down = [], up = []
const balanceDiff = 100;
leftIndexArr = new Array();
rightIndexArr = new Array();
getLeftMatrixIndex();
getRightMatrixIndex();
let i = 1
let timer
let time = 333
const port = new SerialPort('com4', { baudRate: 115200, autoOpen: true });
//管道添加解析器
port.pipe(parser);
parser.on('data', function (data) {

    pointArr = new Array();
    let buffer = new Buffer(data);

    for (var i = 0; i < buffer.length; i++) {
        pointArr[i] = buffer.readUInt8(i);
    }
    // console.info(pointArr)
    var nowKey = new Array();

    var keyArr = new Array();

    for (var i = 0; i < 8; i++) {
        let keyBoardValue = pointArr[i * 4] + pointArr[i * 4 + 1] * 256 > 130 ? 1 : 0;
        keyArr.push(keyBoardValue);

    }
    // console.log(keyArr)


    // if (keyArr[5] == 1) {
    //     //console.log(nowKey)
    //     nowKey.push('W')
    //     robot.keyToggle('W', 'down');
    //     robot.keyToggle('W', 'up');
    // }
    // if (keyArr[4] == 1) {
    //     nowKey.push('D')
    //     robot.keyToggle('D', 'down');
    //     robot.keyToggle('D', 'up');

    // }
    // if (keyArr[2] == 1) {
    //     nowKey.push('S')
    //     robot.keyToggle('S', 'down');
    //     robot.keyToggle('S', 'up');
    // }
    // if (keyArr[1] == 1) {
    //     nowKey.push('A')
    //     robot.keyToggle('A', 'down');
    //     robot.keyToggle('A', 'up');
    // }

    // if (timer) {

    //     return
    // } else {

    //     timer = setInterval(() => {
    //         // if (keyArr[5] == 1) {
    //         //     console.log('W')
    //         //     nowKey.push('W')
    //         //     robot.keyToggle('W', 'down');
    //         // }
    //         // if (keyArr[4] == 1) {
    //         //     nowKey.push('D')
    //         //     robot.keyToggle('D', 'down');
    //         //     console.log('D')
        
    //         // }
    //         // if (keyArr[2] == 1) {
    //         //     nowKey.push('S')
    //         //     console.log('S')
    //         //     robot.keyToggle('S', 'down');
                
    //         // }
    //         // if (keyArr[1] == 1) {
    //         //     nowKey.push('A')
    //         //     robot.keyToggle('A', 'down');
    //         //     console.log('A')
    //         // }
    //         if (keyArr[5] == 1) {
    //             //console.log(nowKey)
    //             nowKey.push('W')
    //         }
    //         if (keyArr[4] == 1) {
    //             nowKey.push('D')
        
        
    //         }
    //         if (keyArr[2] == 1) {
    //             nowKey.push('S')
        
    //         }
    //         if (keyArr[1] == 1) {
    //             nowKey.push('A')
    //         }
        
        
    //         lastKey.forEach((key, index) => {
    //             if (nowKey.includes(key)) {

    //             } else {
    //                 robot.keyToggle(key, 'up')
    //                 down.splice(down.indexOf(key, 1))
    //                 console.log(key,'up')
    //             }
    //         })
    //         nowKey.forEach((key, index) => {
    //             if (lastKey.includes(key)) {
        
    //             } else {
    //                 robot.keyToggle(key, 'down')
    //                 down.push(key)
    //                 console.log(key,'down')
    //             }
    //         })
    //         lastKey = [...nowKey]

    //         clearInterval(timer)
    //         timer = null
    //     }, time);
    // }



    if (keyArr[3] == 1) {
        //console.log(nowKey)
        nowKey.push('W')
    }
    if (keyArr[2] == 1) {
        nowKey.push('D')


    }
    if (keyArr[0] == 1) {
        nowKey.push('S')

    }
    if (keyArr[1] == 1) {
        nowKey.push('A')
    }


    lastKey.forEach((key, index) => {
        if (nowKey.includes(key)) {
            
        } else {
            robot.keyToggle(key, 'up')
            down.splice(down.indexOf(key, 1))
            console.log('up')
        }
    })
    nowKey.forEach((key, index) => {
        if (lastKey.includes(key)) {

        } else {
            robot.keyToggle(key, 'down')
            down.push(key)
            console.log('down')
        }
    })
    lastKey = [...nowKey]

    // else {
    //     robot.keyToggle('W', 'up');
    //     robot.keyToggle('D', 'up');
    //     robot.keyToggle('A', 'up');
    //     robot.keyToggle('S', 'up');
    // }
    // let upSum = getUpDown(pointArr, 0);//后退
    // let downSum = getUpDown(pointArr, 1);//前进
    // var leftSum = getRightLeftSum(pointArr, leftIndexArr);
    // var rightSum = getRightLeftSum(pointArr, rightIndexArr);

    // var diffDownUp = downSum - upSum;

    // if (Math.abs(diffDownUp) > 250) {
    //     if (diffDownUp > 250) {

    //         var diffLeftRight = leftSum - rightSum;
    //         if (Math.abs(diffLeftRight) > 250) {
    //             if (diffLeftRight > 150) {
    //                 console.info('right');
    //                 robot.typeString('WA')
    //             } else if (diffLeftRight < -150) {
    //                 console.info('left');
    //                 robot.typeString('WD')
    //             } else {
    //                 robot.typeString('W')
    //             }

    //         } else {

    //         }
    //     } else {
    //         console.info('down');

    //         var diffLeftRight = leftSum - rightSum;
    //         if (Math.abs(diffLeftRight) > 250) {
    //             if (diffLeftRight > 150) {
    //                 console.info('right');
    //                 robot.typeString('SA')
    //             } else if (diffLeftRight < -150) {
    //                 console.info('left');
    //             }
    //         } else {
    //             //平衡
    //         }


    //         // var diffLeftRight = leftSum - rightSum;
    //         // if (Math.abs(diffLeftRight) > 250) {
    //         //     if (diffLeftRight > 150) {
    //         //         console.info('right');
    //         //         //robot.keyToggle('D', 'down');
    //         //         robot.keyTap('D')
    //         //         rightFlag = true;
    //         //         leftFlag = false;
    //         //     } else if (diffLeftRight < -150) {
    //         //         console.info('left');
    //         //         //robot.keyToggle('A', 'down');
    //         //         robot.keyTap('D')
    //         //
    //         //     } else {
    //         //
    //         //     }
    //         //
    //         // } else {
    //         //
    //         // }


    //     }}
});



function getSum(dataArr, start, end) {
    var sum = 0;
    var startIndex = parseInt(start);
    var endIndex = parseInt(end);
    for (var i = startIndex; i < endIndex; i++) {
        sum = sum + dataArr[i];
    }
    return sum;
}

function getUpDown(dataArr, flag) {
    if (flag == 0) {
        return getSum(dataArr, 0, 511);
    }
    if (flag == 1) {
        return getSum(dataArr, 512, 1024);
    }
}

function getLeftMatrixIndex() {

    for (var x = 0; x < 32; x++) {
        for (var y = 0; y < 16; y++) {
            var index = y + 32 * x;
            leftIndexArr.push(index);
        }
    }
    console.info(leftIndexArr);
}

function getRightMatrixIndex() {
    for (var x = 0; x < 32; x++) {
        for (var y = 0; y < 16; y++) {
            var index = 16 + y + 32 * x;
            rightIndexArr.push(index);
        }
    }
    console.info(rightIndexArr);
}

function getRightLeftSum(dataArr, indexArr) {
    var sum = 0;
    for (var i = 0; i < indexArr.length; i++) {
        sum = sum + dataArr[indexArr[i]];
    }
    return sum;
}


