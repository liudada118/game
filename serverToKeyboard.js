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
// })
let leftIndexArr;
let rightIndexArr;
const balanceDiff = 100;
leftIndexArr = new Array();
rightIndexArr = new Array();
getLeftMatrixIndex();
getRightMatrixIndex();
const port = new SerialPort('com10', { baudRate: 400000, autoOpen: true });
//管道添加解析器
port.pipe(parser);
parser.on('data', function (data) {
    pointArr = new Array();
    let buffer = new Buffer(data);

    for (var i = 0; i < buffer.length; i++) {
        pointArr[i] = buffer.readUInt8(i);
    }

    let upSum = getUpDown(pointArr, 0);//后退
    let downSum = getUpDown(pointArr, 1);//前进
    var leftSum = getRightLeftSum(pointArr, leftIndexArr);
    var rightSum = getRightLeftSum(pointArr, rightIndexArr);

    var diffDownUp = downSum - upSum;

    if (Math.abs(diffDownUp) > 250) {
        if (diffDownUp > 250) {

            var diffLeftRight = leftSum - rightSum;
            if (Math.abs(diffLeftRight) > 250) {
                if (diffLeftRight > 150) {
                    console.info('right');
                    robot.typeString('WA')
                } else if (diffLeftRight < -150) {
                    console.info('left');
                    robot.typeString('WD')
                } else {
                    robot.typeString('W')
                }

            } else {

            }
        } else {
            console.info('down');

            var diffLeftRight = leftSum - rightSum;
            if (Math.abs(diffLeftRight) > 250) {
                if (diffLeftRight > 150) {
                    console.info('right');
                    robot.typeString('SA')
                } else if (diffLeftRight < -150) {
                    console.info('left');
                }
            } else {
                //平衡
            }


            // var diffLeftRight = leftSum - rightSum;
            // if (Math.abs(diffLeftRight) > 250) {
            //     if (diffLeftRight > 150) {
            //         console.info('right');
            //         //robot.keyToggle('D', 'down');
            //         robot.keyTap('D')
            //         rightFlag = true;
            //         leftFlag = false;
            //     } else if (diffLeftRight < -150) {
            //         console.info('left');
            //         //robot.keyToggle('A', 'down');
            //         robot.keyTap('D')
            //
            //     } else {
            //
            //     }
            //
            // } else {
            //
            // }


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


