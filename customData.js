/*
*   Created by Sean Kuwamoto and Jaiden Grimminck. Bay School class of 2025.
*   
*   Welcome! This is the settings file. This is where you will setup your files. 
*   Everything you need can be customized from here, and this file is meant to be modified by whoever
*   is using this program. Please do not modify any other files.
*   
*   Please visit https://github.com/Seankuwamoto/Weather-Balloon for the most recent version
*   of this code and a complete list of instructions.
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
*   my spreadsheet dinf might look like this:
*   
*    {
*       filename: "example_data.csv",
*       title: "Example",
*       spreadsheet_info: {
*           time: 0,
*           latitude: 1,
*           longitude: 2,
*           altitude: 3
*        }
*    }
*   
*   
*   
*   Note how the column numbers start from 0. The time column is first, and so you put a 0 for it. Latitude it second, and so you put a 1 for it.
*   If you put your data in starting by counting from 1 into this file, everything will be off.
*
*   IMPORTANT: The list of possible terms you can use is:
*       date, time, ms_since_last_cycle, fixed, latitude, longitude, altitude, speed, angle, 
*       satellites, avg_thermistor, thermistor_c, gyro_x, gyro_y, gyro_z, accel_x, accel_y,
*       accel_z, mag_x, mag_y, mag_z, live_cam, cam_data, pressure,humidity
*   Do not use terms beyond this or make up your own names. These names are specific, and making up your own will not do anything.
*   
*    For cam_data, use the column number to indicate the first column that your camera data starts in. Your camera data will take up many more columns,
*    but all you need to give to the program is just the position of the first one.
*
*   3. Once all that is filled out, run the command "node dataAnalysis.js" in the terminal and then visit the
*   url http://127.0.0.1:3000/ on the same computer. Enjoy!
*
*   4. For further customization, try playing around with EXTRA_SETTINGS and RANGE_OVERRIDES! Contact me with any questions.
*
*   If anything breaks, please contact me at skuwamoto25@bayschoolsf.org. 
*   If it's past May 2025, contact me at sean.kuwamoto@gmail.com.
*/
const FILE_LIST = [
    // you can add multiple files in here if you have multiple different datasets you want to look through. In this example there are two.
    {
        filename: "EXAMPLE_DATA_1.CSV",
        title: "Example Data - Sean Kuwamoto",
        spreadsheet_info: {
            date: 0,
            time: 1,
            latitude: 2,
            longitude: 3,
            thermistor_c: 4,
            cam_data: 5
        }
    },
    {
        filename: "EXAMPLE_DATA_2.CSV",
        title: "Example Data #2 - Sean Kuwamoto",
        spreadsheet_info: {
            date: 0,
            time: 1,
            latitude: 2,
            ms_since_last_cycle: 3,
            longitude: 4,
            altitude: 5,
            cam_data: 6
        }
    },
]

/*
*   Down here are extra settings
*   They control how your data is graphed
*   The label and units are automatically placed on the graph
*   What you'll probably want to change here are the ranges: make them custom to fit your graph.
*   For example, if you know that your satellite flew up to 30,000 km, you might want to make the 
*   altitude range go from 0 to 31000 so that you can see its whole journey.
*/
const EXTRA_SETTINGS = {
    time: {
        label: "Time",
        range: ["15:40:00:0", "15:44:00:0"],
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

// If you would like specific ranges for specific csv files, you can override the general ranges here.
// There's no point in using these settings if you're only using 1 CSV file.
const RANGE_OVERRIDES = [
    {
        filename: "EXAMPLE_DATA_1.CSV",
        overrides: {
            frame: [0, 198],
            thermistor_c: [13, 20],
            latitude: [39.507, 39.513]
        }
    },
    {
        filename: "EXAMPLE_DATA_2.CSV",
        overrides: {
            altitude: [0, 100]
        }
    },
]

// If you have multiple files, you can change this so that when the website
// loads it always starts on a specific one. 0 means the first file, 1 means
// the second, etc.
const STARTING_MODE = 0;

module.exports = {
    FILE_LIST,
    EXTRA_SETTINGS,
    RANGE_OVERRIDES,
    STARTING_MODE,
}
