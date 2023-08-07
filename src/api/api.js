const fs = require('fs');
const path = require('path');

//check if the api driver env point to a valid driver

//check if the driver file exists
const driverFile = path.join(__dirname ,`drivers/${process.env.TRANSLATION_API_DRIVER}.js`);
if (!fs.existsSync(driverFile)) {
    console.error(`[FATAL] The translation api driver "${process.env.TRANSLATION_API_DRIVER}" does not exists.`);
    console.error(`[FATAL] Please check that the TRANSLATION_API_DRIVER env variable is properly set or add a driver.`);
    console.error(`[FATAL] Check the README.md for more informations.`);
    process.exit(1);
}

//check if the drivers contains the required methods
const requiredMethods = ['init', 'translate'];
const driver = require(driverFile);
for (const method of requiredMethods) {
    if (!(method in driver)) {
        console.error(`[FATAL] The translation api driver "${process.env.TRANSLATION_API_DRIVER}" does not contains a ${method} method.`);
        console.error(`[FATAL] Please check that the TRANSLATION_API_DRIVER env variable is properly set or add a driver.`);
        console.error(`[FATAL] Check the README.md for more information.`);
        process.exit(1);
    }
}

// get the translation api driver from the env variable TRANSLATION_API_DRIVER
module.exports = driver;