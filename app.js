require("dotenv").config();

const http = require("http")
const fs = require("fs")
const pyshell = require("python-shell")
const fsp = require("fs").promises
const path = require("path")
const p = "images/"
const port = process.env.PORT
const host = process.env.HOST

const { Image, createCanvas } = require('canvas');
const canvas = createCanvas(64, 64);
const ctx = canvas.getContext('2d');
const img_dir = 'images/ROI_0.png';
const tf = require("@tensorflow/tfjs");
const url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"

async function loadLocalImage (filename) {
  try {
    var img = new Image()
    console.log('imageloaded')
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => { throw err };
    img.src = filename;
    image = tf.browser.fromPixels(canvas, 1);
    console.log(image)
    return image;
  } catch (err) {
    console.log(err);
  }
}

// async function loadModel() {
//   model = undefined;
//   // url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"
//   model = await tf.loadLayersModel(url);
//   console.log("model loaded")
//   return model
//   //console.log(model.summary())
// }
// loadModel()

async function getImage(filename) {
    try {
      this.image = await loadLocalImage(filename);
    } catch (error) {
      console.log('error loading image', error);
    }
    console.log( tf.tensor( [ image.arraySync() ] ) )
    tf.loadLayersModel(url)
    	.then((model)=>{
    	console.log("Success")
      v = model.predict( tf.tensor( [ this.image.arraySync() ] ) )
			res = tf.tensor( v.dataSync() ).argMax().dataSync()
			console.log( res[0] )
    })
    // return this.image;
      // v = model.predict( tf.tensor( [ this.image.arraySync() ] ) )
			// res = tf.tensor( v.dataSync() ).argMax().dataSync()
			// console.log( res[0] )
  }
// getImage(img_dir)

const server = http.createServer(function (request, response) {
    // loadModel()
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
                for(i of data){
                  if(i==".dummy") continue
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
                    // getImage(img_dir)
                });
            })
            .catch((e)=>{
                console.log(e)
            })
    }
    function runScript(){
        pyshell.PythonShell.run("segri.py", null, function(err, result){
            if(!err){
                console.log("script ran successfully...")
                console.log(result.length)
                getImage(img_dir)
            }
            else
                console.log(err);
        })
    }
})

server.listen(port,host,()=>{
    console.log(`listening to ${host}:${port}`)
})
