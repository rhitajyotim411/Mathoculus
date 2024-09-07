require("dotenv").config();

const http = require("http")
const fs = require("fs")
const pyshell = require("python-shell")
const fsp = require("fs").promises
const path = require("path")
const p = "images/"
const port = process.env.PORT
const host = process.env.HOST

const server = http.createServer(server_func);

//server process
async function server_func(request, response) {
    let post = '';

    // Index
    if (request.url == "/") {
        const data = await fsp.readFile("web/index.html", "utf-8")
        response.end(data)
    }
    if (request.url == "/home.css") {
        const data = await fsp.readFile("styles/home.css", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/css' });
        response.end(data)
    }
    if (request.url == '/home.js') {
        const data = await fsp.readFile("client/home.js", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/javascript' });
        response.end(data)
    }

    // Canvas
    if (request.url == "/draw") {
        const data = await fsp.readFile("web/canvas.html", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.end(data)
    }
    if (request.url == "/canvas.css") {
        const data = await fsp.readFile("styles/canvas.css", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/css' });
        response.end(data)
    }
    if (request.url == '/canvas.js') {
        const data = await fsp.readFile("client/canvas.js", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/javascript' });
        response.end(data)
    }

    // Video
    if (request.url == "/snap") {
        const data = await fsp.readFile("web/vdo.html", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.end(data)
    }
    if (request.url == "/vdo.css") {
        const data = await fsp.readFile("styles/vdo.css", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/css' });
        response.end(data)
    }
    if (request.url == '/vdo.js') {
        const data = await fsp.readFile("client/vdo.js", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/javascript' });
        response.end(data)
    }

    //about us
    if (request.url == "/about") {
        const data = await fsp.readFile("web/about.html", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.end(data)
    }


    // Result Page
    if (request.url == '/res.css') {
        const data = await fsp.readFile("styles/res.css", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/css' });
        response.end(data)
    }

    // Operation JS
    if (request.url == '/operation.js') {
        const data = await fsp.readFile("client/operation.js", "utf-8")
        response.writeHead(200, { 'Content-type': 'text/javascript' });
        response.end(data)
    }

    // Images
    if (request.url == "/home_bg.jpg") {
        const data = await fsp.readFile("res/home_bg.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }
    if (request.url == "/calc.jpg") {
        const data = await fsp.readFile("res/calc.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }
    if (request.url == "/brush.jpg") {
        const data = await fsp.readFile("res/brush.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }
    if (request.url == "/cam.jpg") {
        const data = await fsp.readFile("res/cam.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }
    if (request.url == "/snap.png") {
        const data = await fsp.readFile("res/snap.png")
        response.writeHead(200, { 'Content-type': 'image/png' });
        response.end(data)
    }
    if (request.url == "/draw.png") {
        const data = await fsp.readFile("res/draw.png")
        response.writeHead(200, { 'Content-type': 'image/png' });
        response.end(data)
    }

    //about us
    if (request.url == "/grp.png") {
        const data = await fsp.readFile("res/grp.png")
        response.writeHead(200, { 'Content-type': 'image/png' });
        response.end(data)
    }
    if (request.url == "/ankita.jpg") {
        const data = await fsp.readFile("res/ankita.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }
    if (request.url == "/srirup.jpg") {
        const data = await fsp.readFile("res/srirup.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }
    if (request.url == "/rhitajyoti.jpg") {
        const data = await fsp.readFile("res/rhitajyoti.jpg")
        response.writeHead(200, { 'Content-type': 'image/jpg' });
        response.end(data)
    }

    // Icon
    if (request.url == '/favicon.ico') {
        const data = fs.readFileSync("favicon.ico")
        response.writeHead(200, { 'Content-type': 'image/ico' });
        response.end(data)
    }

    //image recieving process
    if (request.method == 'POST' && request.url == "/convert") {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            post = JSON.parse(body);
            var data = post.replace(/^data:image\/\w+;base64,/, "");
            var buffer = Buffer.from(data, 'base64');
            writeFileToSystem(buffer)
                .then((flag) => {
                    if (flag)
                        return runScript()
                })
                .then((length) => {
                    console.log("In promise: " + length)
                    getResult(length, response)
                })
                .catch((err) => {
                    console.log(err)
                })
        });

    }
}

function writeFileToSystem(buffer) {
    //deletes previous files
    return new Promise((resolve, reject) => {
        fsp.readdir(p)
            .then((data) => {
                for (i of data) {
                    if (i == ".dummy")
                        continue
                    fsp.unlink(path.join(p, i))
                        .catch((e) => {
                            console.log(e)
                        })
                }
                fs.writeFile(`${p}/image.png`, buffer, {mode: 0o777}, function (err) {
                    if (err)
                        reject(err)
                    resolve(true);
                });
            })
            .catch((e) => {
                console.log(e)
            })
    })
}

//runs a python file for image processing
async function runScript() {
    return new Promise((resolve, reject) => {
        pyshell.PythonShell.run("segri.py", null, function (err, result) {
            if (!err) {
                console.log("script ran successfully...")
                console.log("In runscript " + result.length)
                resolve(result.length - 1);
            }
            else
                console.log(err);
            reject(err)
        })
    })
}

//send response to client
async function getResult(n, response) {
    try {
        let data = await fsp.readFile(`${p}image.png`,"base64");
        data = "data:image/png;base64,"+data;
        response.write('<img id="eval_img" src="' + data + '" />\n')

        for (i = 0; i < n; i++) {
            let data = await fsp.readFile(`${p}ROI_${i}.png`,"base64");
            data = "data:image/png;base64,"+data;
            response.write(`<img id="img${i}" src="` + data + '" />\n')
        }
        response.end()
    } catch (error) {
        console.log(error);
    }
}

//start server process
server.listen(port, host, () => {
    console.log(`listening to ${host}:${port}`)
})
