/*
*   Created by Sean Kuwamoto and Jaiden Grimminck. Bay School class of 2025.
*   
*   Welcome! This is the settings file. This is where you will setup your files. 
*   
*
*   FOLLOW THESE INSTRUCTIONS TO ADD YOUR OWN DATA
*   File setup instructions:
*
*   1. Put your file in the data folder. It should be a csv file, and the first line should be a title,
*   the second line should be a list of things you're measuring (e.g.: time,lat,long,...), and the third
*   line should be where the data collection begins. 
*   WARNING: If data collection does not begin on the third row, the program may not work.
*
*   2. Down below, add a new pair of curly braces to the list of files. In it, add the name of your file,
*   a title (it can be whatever you want), and fill in the info for your spreadsheet. Make sure to list
*   which column you data is in. For example, if my spreadsheet was like this: 'time,lat,long,alt', then
*   my spreadsheet data info might look like this:
*   
*   spreadsheet_data_info: {
*       time: {
*           label: "Time",
*           range: ["13:39:11:0", "17:20:00:0"],
*           units: "(UTC)",
*           column_in_spreadsheet: 0
*       },
*       latitude: {
*           label: "Latitude",
*           range: [3910, 3940],
*           units: "none",
*           column_in_spreadsheet: 1
*       },
*       longitude: {
*           label: "Longitude",
*           range: [12130, 12160],
*           units: "none",
*           column_in_spreadsheet: 2
*       },
*       altitude: {
*           label: "Altitude",
*           range: [0, 32200],
*           units: "(m)",
*           column_in_spreadsheet: 3
*       }, 
*   }
*
*   Note how the column numbers start from 0. The time column is first, and so you put a 0 for it. Latitude it second, and so you put a 1 for it.
*   If you put your data in starting by counting from 1 into this file, everything will be off.
*   
*   3. Once all that is filled out, run the command "node dataAnalysis.js" in the terminal and then visit the
*   url http://127.0.0.1:3000/ on the same computer. Enjoy!
*
*   If anything breaks, please contact me at skuwamoto25@bayschoolsf.org. 
*   If it's past May 2026, contact me at sean.kuwamoto@gmail.com.
*/
const FILE_LIST = [
    // you can add multiple files in here if you have multiple different datasets you want to look through. In this example there are four.
    {
        // Put the name of your csv file in here. Make sure to include the ".csv" at the end.
        filename: "DAWN.CSV",
        // Put the title of your project here. It can be whatever you want.
        title: "Midnight Balloon Data - Sean Kuwamoto & Jaiden Grimminck",
        // Put the date in here.
        date: "6/7/23",
        spreadsheet_info: {
            time: {
                label: "Time",
                range: ["13:39:11:0", "17:20:00:0"],
                units: "(UTC)",
                column_in_spreadsheet: 1
            },
            ms_since_last_cycle: {
                label: "Time since last cycle",
                range: [1000, 1050],
                units: "(ms)",
                column_in_spreadsheet: 2
            },
            latitude: {
                label: "Latitude",
                range: [3910, 3940],
                units: "none",
                column_in_spreadsheet: 0
            },
            longitude: {
                label: "Longitude",
                range: [12130, 12160],
                units: "none",
                column_in_spreadsheet: 0
            },
            altitude: {
                label: "Altitude",
                range: [0, 32200],
                units: "(m)",
                column_in_spreadsheet: 0
            }, 
            speed: {
                label: "Speed",
                range: [0, 40],
                units: "(km/h)",
                column_in_spreadsheet: 0
            },
            satellites: {
                label: "Number of Satellites",
                range: [0, 20],
                units: "none",
                column_in_spreadsheet: 0
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
                column_in_spreadsheet: 0
            },
            gyro_xyz: {
                label: "Gyroscope",
                range: [-0.3, 0.3],
                units: "(º/s)",
                column_in_spreadsheet: 0
            },
            accel_xyz: {
                label: "Accelerometer",
                range: [-1, 1],
                units: "(m/s²)",
                column_in_spreadsheet: 0
            },
            mag_xyz: {
                label: "Magnetometer",
                range: [-50, 50],
                units: "(uT)",
                column_in_spreadsheet: 0
            },
            pressure: {
                label: "Pressure",
                range: [0, 1200],
                units: "(hPa)",
                column_in_spreadsheet: 0
            },
            humidity: {
                label: "Relative humidity",
                range: [0, 100],
                units: "(%)",
                column_in_spreadsheet: 0
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
            // This one is calculated automatically, no need to input a column number.
            frame: {
                label: "Current frame",
                data_range: [0, 16500],
                units: "none",
            },
        }
    }
]