require("dotenv").config();

const http = require("http")
const fs = require("fs")
const pyshell = require("python-shell")
const fsp = require("fs").promises
const path = require("path")
const p = "images/"
const port = process.env.PORT
const host = process.env.HOST


const server = http.createServer(function (request, response) {
    let post='';
    if(request.url == "/"){
        const data = fs.readFileSync("canvas.html","utf-8")
        response.end(data)
    }
    //main
    if (request.method == 'POST' && request.url=="/convert") {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {

//-------------parsing data from json to string

            post = JSON.parse(body);
            var data = post.replace(/^data:image\/\w+;base64,/, "");
            var buf = Buffer.from(data, 'base64');
            writeFileToSystem(buf);
        });
    }

//----------saving image to server side folder

    function writeFileToSystem(buf){
        fsp.readdir(p)
            .then((data)=>{
                if(data.length != 0){
                    for(i of data){
                      fsp.unlink(path.join(p,i))
                        .then(()=>{})
                        .catch((e)=>{
                          console.log(e)
                        })
                    }
                    fs.writeFile(`${p}/image.png`, buf, function(err) {
                        if(err)
                            console.log(err);
                        runScript()
                    });
                }
                else{
                    fs.writeFile(`${p}/image.png`, buf, function(err) {
                        if(err)
                            console.log(err);
                        runScript()
                    });
                    return
                }
            })
            .catch((e)=>{
                console.log(e)
            })
    }
    function runScript(){
        pyshell.PythonShell.run("segri.py", null, function(err, result){
            if(!err){
                console.log("script ran successfully...")
                console.log(result)
            }
            else
                console.log(err);
        })
    }
})

server.listen(port,host,()=>{
    console.log(`listening to ${host}:${port}`)
})
