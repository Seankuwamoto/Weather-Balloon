// RUN PROGRAM BY TYPING "node dataAnalysis.js" then going to local ip adress on port 3000 on browser.


// Number of data rows to use. 0 means all.
const NUM_ROWS = 0;

// How many samples for the average upward speed
const UPWARD_SPEED_SAMPLES = 100;

const customData = require('./customData.js');
const FILE_LIST = customData.FILE_LIST;
const EXTRA_SETTINGS = customData.EXTRA_SETTINGS;
const RANGE_OVERRIDES = customData.RANGE_OVERRIDES;

const STARTING_MODE = 0;

// Libraries
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const fs = require('fs');
const colormap = require('colormap');

// Inferno colormap function from 0 to 1
const colors = colormap({
    colormap: 'inferno',
    nshades: 256,
    format: 'hex',
    alpha: 1
});
// Jet colormap function from 0 to 1
const extraColors = colormap({
    colormap: 'jet',
    nshades: 256,
    format: 'hex',
    alpha: 1
})

// Cached data
let cachedData = [];
for (let i = 0; i <= FILE_LIST.length; i++) {
    cachedData.push([]);
}

// Socket.io
const io = new Server(server);
function sendData(data, ID) {
    io.to(ID).emit('dt', { data: data, userID: ID});
}
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/public/script.js');
});
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/public/styles.css');
});

io.on('connection', (socket) => {
    console.log(socket.id);
    console.log('a user connected');

    if (STARTING_MODE >= FILE_LIST.length) {
        throw new Error("You cannot start with file number " + (STARTING_MODE + 1) + " because there are only " + FILE_LIST.length + " files.");
    }
    for (let override of RANGE_OVERRIDES) {
        let name = override.filename;
        for (let i = 0; i < FILE_LIST.length; i++) {
            if (FILE_LIST[i].filename.toLowerCase() === name.toLowerCase()) {
                override.mode = i;
                continue;
            }
        }
    }
    sendData({
        mode: STARTING_MODE,
        title: FILE_LIST[STARTING_MODE].title,
        data: getData(STARTING_MODE),
        available: getAvailable(STARTING_MODE),
    }, socket.id);
    sendData(colors, socket.id);        // Colors
    sendData(extraColors, socket.id);   // More colors
    sendData({
        EXTRA_SETTINGS: EXTRA_SETTINGS,
        RANGE_OVERRIDES: RANGE_OVERRIDES,
    }, socket.id);

    socket.on('request data', (msg) => {
        // Wraparound
        if (msg.mode === FILE_LIST.length) msg.mode = 0;

        console.log('Data requested: ' + msg.mode + " From user: " + msg.userID);
        sendData({
            mode: msg.mode,
            title: FILE_LIST[msg.mode].title,
            data: getData(msg.mode),
            available: getAvailable(msg.mode),
        }, socket.id);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});



// Processing data
class dataStruct {
    constructor(date="6/7/23" /* data correction */, time="0:0:0:0", ms_since_last_cycle="N/A", fixed=false, latitude=0, longitude=0, altitude=0, speed=0, angle=0, satellites=0, avg_thermistor="N/A", thermistor_c="N/A", gyro_x="N/A", gyro_y="N/A", gyro_z="N/A", accel_x="N/A", accel_y="N/A", accel_z="N/A", mag_x="N/A", mag_y="N/A", mag_z="N/A", live_cam=true, cam_data=[]) {
        this.date = date;
        this.time = time;
        this.ms_since_last_cycle = ms_since_last_cycle;
        this.fixed = fixed;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.speed = speed;
        this.angle = angle;
        this.satellites = satellites;
        this.avg_thermistor = avg_thermistor;
        this.thermistor_c = thermistor_c;
        this.gyro_x = gyro_x;
        this.gyro_y = gyro_y;
        this.gyro_z = gyro_z;
        this.accel_x = accel_x;
        this.accel_y = accel_y;
        this.accel_z = accel_z;
        this.mag_x = mag_x;
        this.mag_y = mag_y;
        this.mag_z = mag_z;
        this.live_cam = live_cam;
        this.cam_data = cam_data;
        this.max_temp;
        this.min_temp;
        this.humidity = "N/A"; // <-- Fix this
        this.pressure = "N/A";
        this.upward_speed = 0;
        this.avg_upward_speed = 0;
    }
}


function getDataRaw(mode) {

    const filename = FILE_LIST[mode].filename;
    
    if (filename.slice(-4).toLowerCase() !== ".csv") {
        throw new Error("File " + filename + " is not a csv file. Make sure to include .csv at the end of your file names!");
    }
    let dat;
    
    try {
        dat = fs.readFileSync('data/' + filename, { encoding: 'utf8', flag: 'r' });
    }
    catch {
        throw new Error("Unable to find " + filename + ". Please check that the file name is spelled correctly, and that it is in the data folder.")
    }
    
    let e = dat.split('\r\n').slice(2);
    if (NUM_ROWS == 0) return e.slice(0, e.length - 1);
    else return e.slice(0, NUM_ROWS);
    
}

function getData(mode) {
    if (cachedData[mode].length > 0) {
        console.log("Retrieving cached data for file " + mode + " (" + FILE_LIST[mode].title + ")...")
        return cachedData[mode];
    }
    const DATA = getDataRaw(mode);

    let data = [];
    let mostRecentCameraData = new Array(768).fill('N/A');
    for (let i = 0; i < DATA.length; i++) {
        const row = DATA[i].split(',');
        let dataObj = new dataStruct();

        // TODO
        for (let [key, value] of Object.entries(FILE_LIST[mode].spreadsheet_info)) {
            let result = row[value];
            if (result === undefined) continue;
            // Time correction
            if (key === 'time' && result.split('').filter(x => (x === ':')).length === 2) result += ':000';
            // Boolean conversion
            else if (key === 'fixed' || key === 'live_cam') result = Boolean(+result);
            // camera data
            else if (key === 'cam_data') {
                result = row.slice(value, value + 768).map(parseFloat);
                // console.log(result);
                // Fills array if it's less than 768 long
                result = result.concat(Array(768).fill('N/A')).slice(0,768);
                // Replaces garbage values with most recent values
                result = result.map((x, i) => {
                    if (isNaN(x)) {
                        return mostRecentCameraData[i];
                    }
                    else {
                        mostRecentCameraData[i] = x;
                        return x;
                    }
                });
            }
            // Integer conversion
            else if (key !== 'date' && key !== 'time') result = parseFloat(result);

            dataObj[key] = result;
        }

        // if (mode === "SEANJAIDEN") {
        //     rowItems = row.split(',').map((x, i) => {
        //         // Date and time
        //         if (i == 0 || i == 1) return String(x);
        //         // fixed and live cam
        //         if (i == 3 ||  i == 21) return Boolean(+x);
        //         // The rest are just numbers
        //         else return parseFloat(x);
        //     });
        //     dataObj = new dataStruct(...rowItems);
        //     let camData = row.split(',').slice(22);
        //     camData.pop();
        //     dataObj.cam_data = camData;
            
        
        //     // Data correction
        //     dataObj.live_cam = (i % 30 < 24);
        // }
        // else if (mode === "KAIEVAN") {
        //     rowItems = row.split(',');
        //     dataObj = new dataStruct();
        //     dataObj.time = rowItems[0] + ":000";
        //     dataObj.latitude = rowItems[1];
        //     dataObj.longitude = rowItems[2];
        //     dataObj.altitude = rowItems[3];
        //     dataObj.speed = rowItems[4];
        //     dataObj.angle = rowItems[5];
        //     dataObj.satellites = rowItems[6];
        //     dataObj.avg_thermistor = rowItems[7];
        //     dataObj.thermistor_c = rowItems[8];
        //     dataObj.pressure = rowItems[10];
        //     dataObj.humidity = rowItems[11];
        //     let cameraVals = rowItems.slice(13).map(parseFloat).slice(0, 768);
        //     if (isNaN(cameraVals[0])) {
        //         dataObj.cam_data = mostRecentCameraData;
        //     }
        //     else {
        //         dataObj.cam_data = cameraVals;
        //         mostRecentCameraData = cameraVals;
        //     }
        // }
        // else if (mode === "BAKERMILO") {
        //     rowItems = row.split(',').map((x, i) => {
        //         // Date and time
        //         if (i == 0 || i == 1) return String(x);
        //         // fixed and live cam
        //         if (i == 3 ||  i == 19) return Boolean(+x);
        //         // The rest are just numbers
        //         else return parseFloat(x);
        //     });
        //     dataObj = new dataStruct();
        //     dataObj.date = rowItems[0];
        //     dataObj.time = rowItems[1];
        //     dataObj.ms_since_last_cycle = rowItems[2];
        //     dataObj.fixed = rowItems[3];
        //     dataObj.latitude = rowItems[4];
        //     dataObj.longitude = rowItems[5];
        //     dataObj.altitude = rowItems[6];
        //     dataObj.speed = rowItems[7];
        //     dataObj.angle = rowItems[8];
        //     dataObj.satellites = rowItems[9];
        //     dataObj.gyro_x = rowItems[10];
        //     dataObj.gyro_y = rowItems[11];
        //     dataObj.gyro_z = rowItems[12];
        //     dataObj.accel_x = rowItems[13];
        //     dataObj.accel_y = rowItems[14];
        //     dataObj.accel_z = rowItems[15];
        //     dataObj.mag_x = rowItems[16];
        //     dataObj.mag_y = rowItems[17];
        //     dataObj.mag_z = rowItems[18];
        //     dataObj.live_cam = rowItems[19];
        //     dataObj.cam_data = rowItems.slice(20);
        //     dataObj.cam_data.pop();

        //     for (let i = 0; i < dataObj.cam_data.length; i++) {
        //         let pixel = dataObj.cam_data[i];
        //         if (isNaN(pixel) || pixel === undefined || pixel === null) {
        //             dataObj.cam_data[i] = mostRecentCameraData[i];
        //         }
        //         else {
        //             mostRecentCameraData[i] = pixel;
        //         }
        //     }
        // }
        // else if (mode === "SAM") {
        //     rowItems = row.split(',').map((x, i) => {
        //         // Date and time
        //         if (i == 0 || i == 1) return String(x);
        //         // The rest are just numbers
        //         else return parseFloat(x);
        //     });
        //     dataObj = new dataStruct();
        //     dataObj.date = rowItems[0];
        //     dataObj.time = rowItems[1] + ":000";
        //     dataObj.latitude = rowItems[2];
        //     dataObj.longitude = rowItems[3];
        //     dataObj.altitude = rowItems[4];
        //     dataObj.speed = rowItems[5];
        //     dataObj.angle = rowItems[6];
        //     dataObj.satellites = rowItems[7];
        //     dataObj.cam_data = rowItems.slice(8);
        //     dataObj.cam_data.pop();
        //     if (dataObj.cam_data.length === 704) {
        //         dataObj.cam_data = dataObj.cam_data.concat(new Array(64).fill('N/A'));
        //     }

        //     for (let i = 0; i < dataObj.cam_data.length; i++) {
        //         let pixel = dataObj.cam_data[i];
        //         if (isNaN(pixel) || pixel === undefined || pixel === null) {
        //             dataObj.cam_data[i] = mostRecentCameraData[i];
        //         }
        //         else {
        //             mostRecentCameraData[i] = pixel;
        //         }
        //     }
        // }

        dataObj.max_temp = Math.max(...dataObj.cam_data.filter(x => x !== 'N/A'));
        dataObj.min_temp = Math.min(...dataObj.cam_data.filter(x => x !== 'N/A'));
        if (i > 0) {
            dataObj.upward_speed = (dataObj.altitude - data[i-1].altitude);
        }
        let samples = [];
        for (let j = -UPWARD_SPEED_SAMPLES; j < 0; j++) {
            if (i + j < 0) continue;
            let sample = data[i + j];
            if (sample) {
                samples.push(sample.upward_speed);
            }
        }
        if (samples.length > 0) {
            dataObj.avg_upward_speed = samples.reduce((a, b) => a + b, 0) / samples.length;
        }
        dataObj.upward_speed = Math.round(dataObj.upward_speed * 100) / 100;
        dataObj.avg_upward_speed = Math.round(dataObj.avg_upward_speed * 100) / 100;
        data.push(dataObj);
        // It takes a WHILE to convert the image data to colors.
        if (i % 2000 == 0) console.log("Loading: " + Math.round(i / DATA.length * 1000) / 10 + "%");
    }
    console.log("Sucessfully cached data for file " + mode + " (" + FILE_LIST[mode].title + ")!");
    console.log("\x1b[32m" + "Loading complete! Please visit\x1b[34m http://127.0.0.1:3000/\x1b[32m to see your website." + "\x1b[0m")
    cachedData[mode] = data;
    return data;
}

function getAvailable(mode) {
    let keys = Object.keys(FILE_LIST[mode].spreadsheet_info);
    let [gyro, mag, accel] = [false, false, false];

    if (keys.filter(x => x.includes('gyro')).length > 0) gyro = true;
    if (keys.filter(x => x.includes('mag')).length > 0) mag = true;
    if (keys.filter(x => x.includes('accel')).length > 0) accel = true;

    keys = keys.filter(x => !(x.includes('gyro') || x.includes('mag') || x.includes('accel')));

    if (gyro) keys.push('gyro_xyz');
    if (mag) keys.push('mag_xyz');
    if (accel) keys.push('accel_xyz');

    return keys;
}



