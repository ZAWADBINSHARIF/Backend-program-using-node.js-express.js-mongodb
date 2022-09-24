const http = require('http');
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path');
const eventEmitter = require('events');
const logEvent = require('./logEvents.js');

const PORT = process.env.PORT || 3500;

class Emitter extends eventEmitter { };
const myEmitter = new Emitter();

myEmitter.on('log', (msg, fileName) => logEvent(msg, fileName));

let serverFile = async (filePath, contentType, response) => {
    try {
        const rowData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image')
                ? 'utf8' : '');
        const data = contentType === 'application/json'
            ? JSON.parse(rowData)
            : rowData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType });
        response.end(contentType === 'application/json'
            ? JSON.stringify(rowData)
            : rowData);
    } catch (err) {
        myEmitter.emit('log', `${err.name} : ${err.message}`, 'errorLog.txt');
        response.statusCode = 500;
        response.end();
    }

}

const server = http.createServer((req, res) => {
    let contentType;
    let extention = path.extname(req.url);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');
    switch (extention) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;
    };


    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'view', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'view', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'view', req.url)
                    : path.join(__dirname, req.url);

    if (!extention && req.url.slice(-1) !== '/') filePath += '.html';

    let fileExists = fs.existsSync(filePath)

    if (fileExists) {
        serverFile(filePath, contentType, res)
    } else {
        console.log(path.parse(filePath).base);
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                // old-page
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            default:
                // 404 page
                serverFile(path.join(__dirname, 'view', '404.html'), 'text/html', res)
                break;
        }
    }

    console.log(req.url, '\n', filePath)

});

server.listen(PORT, () => console.log(`Server on running : ${PORT}`));