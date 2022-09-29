const fs = require('fs');
const fsPromises = require('fs').promises
const path = require('path');
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');



const logEvents = async (message, fileName) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy \t [h:mm:ss aa]')}`;
    const logItem = `${uuid()} \t ${dateTime} \t ${message} \n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem);
    } catch (err) {
        console.error(err)
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.path}`, 'reqLog.txt');
    next();
}

module.exports = { logEvents, logger };
