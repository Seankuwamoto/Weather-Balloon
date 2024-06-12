/*
*   Created by Sean Kuwamoto and Jaiden Grimminck. Bay School class of 2025.
*   
*   Welcome! This is the settings file. This is where you will setup your files. 
*   Everything you need can be customized from here, and this file is meant to be modified by whoever
*   is using this program. Please do not modify any other files.
*   
*
*   FOLLOW THESE INSTRUCTIONS TO ADD YOUR OWN DATA
*
*   1. Put your csv file in the folder called data. It should be a csv file, and the first row should be a title,
*   the second row should be a list of things you're measuring (e.g.: time,lat,long,...), and the third
*   line should be where the data collection begins. 
*   WARNING: If data collection does not begin on the third row, the program may not work.
*
*   2. Down below, add a new pair of curly braces to the list of files. In it, add the name of your file,
*   a title (it can be whatever you want), and fill in the info for your spreadsheet. Make sure to list
*   which column you data is in. For example, if my spreadsheet was like this: 'time,lat,long,alt' and nothing else, then
*   my spreadsheet data info might look like this:
*   
*   spreadsheet_data_info: {
*       time: 0,
*       latitude: 1,
*       longitude: 2,
*       altitude: 3
*   }
*   
*   Note how the column numbers start from 0. The time column is first, and so you put a 0 for it. Latitude it second, and so you put a 1 for it.
*   If you put your data in starting by counting from 1 into this file, everything will be off.
*
*   The list of possible terms you can use is:
*       date, time, ms_since_last_cycle, fixed, latitude, longitude, altitude, speed, angle, 
*       satellites, avg_thermistor, thermistor_c, gyro_x, gyro_y, gyro_z, accel_x, accel_y,
*       accel_z, mag_x, mag_y, mag_z, live_cam, cam_data
*   Do not use terms beyond this or make up your own names. These names are specific, and making up your own will not do anything.
*   
*   3. Once all that is filled out, run the command "node dataAnalysis.js" in the terminal and then visit the
*   url http://127.0.0.1:3000/ on the same computer. Enjoy!
*
*   4. For further customization, try playing around with EXTRA_SETTINGS and RANGE_OVERRIDES! Contact me with any questions.
*
*   If anything breaks, please contact me at skuwamoto25@bayschoolsf.org. 
*   If it's past May 2026, contact me at sean.kuwamoto@gmail.com.
*/
const FILE_LIST = [
    // you can add multiple files in here if you have multiple different datasets you want to look through. In this example there are four.
    {
        // Put the name of your csv file in here. Make sure to include the ".csv" at the end.
        filename: "MIDNIGHT.CSV",
        // Put the title of your project here. It can be whatever you want.
        title: "Midnight Balloon Data - Sean Kuwamoto & Jaiden Grimminck",
        spreadsheet_info: {
            date: 0,    
            time: 1,
            ms_since_last_cycle: 2,
            fixed: 3,
            latitude: 4,
            longitude: 5,
            altitude: 6, 
            speed: 7,
            angle: 8,
            satellites: 9,
            avg_thermistor: 10, // Avg thermistor voltage readings
            thermistor_c: 11,
            gyro_x: 12,     // Gyroscope
            gyro_y: 13,
            gyro_z: 14,
            accel_x: 15,    // Accelerometer
            accel_y: 16,
            accel_z: 17,
            mag_x: 18,      // Magnometer
            mag_y: 19,
            mag_z: 20,
            live_cam: 21,   // Whether or not the IR camera is live
            cam_data: 22,   // The first column of the camera data
        }
    },
    {
        filename: "DAWN.CSV",
        title: "Dawn Balloon Data - Baker Simmons & Milo Sperry",
        spreadsheet_info: {
            date: 0,    
            time: 1,
            ms_since_last_cycle: 2,
            fixed: 3,
            latitude: 4,
            longitude: 5,
            altitude: 6, 
            speed: 7,
            angle: 8,
            satellites: 9,
            gyro_x: 10,     // Gyroscope
            gyro_y: 11,
            gyro_z: 12,
            accel_x: 13,    // Accelerometer
            accel_y: 14,
            accel_z: 15,
            mag_x: 16,      // Magnometer
            mag_y: 17,
            mag_z: 18,      
            live_cam: 19,   // Whether or not the IR camera is live
            cam_data: 20,   // The first column of the camera data
        }
    },
    {
        filename: "DUSK_CORRECTED.csv",
        title: "Dusk Balloon Data - Kai Spada & Evan Kuo",
        spreadsheet_info: {
            time: 0,
            latitude: 1,
            longitude: 2,
            altitude: 3, 
            speed: 4,
            angle: 5,
            satellites: 6,
            avg_thermistor: 7, // Avg thermistor voltage readings
            thermistor_c: 8,    
            pressure: 10,   // Because DAWN.CSV doesn't have pressure or humidity sensors the column is -1.
            humidity: 11,
            cam_data: 13,   // The first column of the camera data
        }
    },
    {
        filename: "SAM.CSV",
        title: "Balloon Data - Sam Barron",
        spreadsheet_info: {
            date: 0,
            time: 1,
            latitude: 2,
            longitude: 3,
            altitude: 4,
            speed: 5,
            angle: 6,
            satellites: 7,
            cam_data: 8,
        }
    },
    {
        filename: "EXAMPLE_DATA.CSV",
        title: "Example Data - Sean Kuwamoto",
        spreadsheet_info: {
            date: 0,
            time: 1,
            latitude: 2,
            longitude: 3,
            thermistor_c: 4,
            cam_data: 5
        }
    }
]

/*
*   Down here are extra settings
*   They control how your data is graphed
*   The label and units are automatically placed on the graph
*   The range is the start and end points for where you want it to graph
*/
const EXTRA_SETTINGS = {
    time: {
        label: "Time",
        range: ["13:39:11:0", "17:20:00:0"],
        units: "(UTC)",
    },
    ms_since_last_cycle: {
        label: "Time since last cycle",
        range: [1000, 1050],
        units: "(ms)",
    },
    fixed: {
        label: "Satellites fixed",
        range: [-1.5, 1.5],
        units: "none",
    },
    latitude: {
        label: "Latitude",
        range: [3910, 3940],
        units: "none",
    },
    longitude: {
        label: "Longitude",
        range: [12130, 12160],
        units: "none",
    },
    altitude: {
        label: "Altitude",
        range: [0, 32200],
        units: "(m)",
    }, 
    speed: {
        label: "Speed",
        range: [0, 40],
        units: "(km/h)",
    },
    angle: {
        label: "Angle",
        range: [0, 360],
        units: "º",
    },
    satellites: {
        label: "Number of Satellites",
        range: [0, 20],
        units: "none",
    },
    avg_thermistor: {
        label: "Average Thermistor Reading",
        range: [400, 1100],
        units: "(V)",
    },
    thermistor_c: {
        label: "Temperature",
        range: [-60 , 25],
        units: "(ºC)",
    },
    gyro_xyz: {
        label: "Gyroscope",
        range: [-0.3, 0.3],
        units: "(º/s)",
    },
    accel_xyz: {
        label: "Accelerometer",
        range: [-1, 1],
        units: "(m/s²)",
    },
    mag_xyz: {
        label: "Magnetometer",
        range: [-50, 50],
        units: "(uT)",
    },
    pressure: {
        label: "Pressure",
        range: [0, 1200],
        units: "(hPa)",
    },
    humidity: {
        label: "Relative humidity",
        range: [0, 100],
        units: "(%)",
    },
    upward_speed: {
        label: "Upward speed",
        range: [-15, 5],
        units: "(m/s)",
    },
    avg_upward_speed: {
        label: "Average upward speed",
        range: [-15, 5],
        units: "(m/s)"
    },
    frame: {
        label: "Current frame",
        range: [0, 16500],
        units: "none",
    },
}

// If you would like specific ranges for specific csv files, you can override them here:
const RANGE_OVERRIDES = [
    { 
        filename: "DAWN.csv",
        overrides: {
            time: ["13:39:11:0", "17:20:00:0"],
            avg_thermistor: [300, 1000],
        }
    },
    { 
        filename: "SAM.csv",
        overrides: {
            time: ["12:39:11:0", "14:20:00:0"],
            altitude: [0, 14000]
        }
    },
    {
        filename: "EXAMPLE_DATA.CSV",
        overrides: {
            frame: [0, 198],
            thermistor_c: [13, 20]
        }
    }
    
]
module.exports = {
    FILE_LIST,
    EXTRA_SETTINGS,
    RANGE_OVERRIDES,
}