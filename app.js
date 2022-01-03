require("dotenv").config();

const http = require("http")
const fs = require("fs")
const pyshell = require("python-shell")
const fsp = require("fs").promises
const path = require("path")
const p = "images/"
const port = process.env.PORT
const host = process.env.HOST

const imgSz = 32

const { Image, createCanvas } = require('canvas');
const canvas = createCanvas(imgSz, imgSz);
const ctx = canvas.getContext('2d');
const tf = require("@tensorflow/tfjs");
const url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"

async function loadLocalImage (filename) {
  try {
    var img = new Image()
    //console.log('imageloaded')
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => { throw err };
    img.src = filename;
    image = tf.browser.fromPixels(canvas, 1);
    image = image.div(tf.scalar(255))
    return image
  } catch (err) {
    console.log(err);
  }
}

async function getResult(n, response)
{
  try
  {
    for (i=0; i<n; i++)
    {
      img = await loadLocalImage(`${p}ROI_${i}.png`)
      response.write(`<img id="img${i}" src="` + canvas.toDataURL() + '" />\n')
    }
    response.end()
  } catch (error) {
    console.log(error);
  }
}

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
            var buffer = Buffer.from(data, 'base64');
            writeFileToSystem(buffer, response);
        });

    }

//----------saving image to server side folder

    function writeFileToSystem(buffer, response){
        fsp.readdir(p)
            .then((data)=>{
                for(i of data){
                  if(i==".dummy") continue
                  fsp.unlink(path.join(p,i))
                    .then(()=>{})
                    .catch((e)=>{
                      console.log(e)
                    })
                }
                fs.writeFile(`${p}/image.png`, buffer, function(err) {
                    if(err)
                        console.log(err);
                    runScript(response)
                });
            })
            .catch((e)=>{
                console.log(e)
            })
    }
    function runScript(response){
        pyshell.PythonShell.run("segri.py", null, function(err, result){
            if(!err){
                console.log("script ran successfully...")
                console.log(result.length)
                getResult(result.length, response)
            }
            else
                console.log(err);
        })
    }
})

server.listen(port,host,()=>{
    console.log(`listening to ${host}:${port}`)
})
