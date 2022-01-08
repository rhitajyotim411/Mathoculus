const imgSz = 64
var xp = '' 	//stores expresion
var thicc = 5		//canvas line thiccness (original: 5, dataset_creation: 7)
const true_labels = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/']

const canvas = document.getElementById("c");
const context = canvas.getContext("2d");
context.fillStyle = "white";
context.lineWidth = thicc;
context.fillRect(0, 0, canvas.width, canvas.height);
canvas.addEventListener("mousedown", (event)=>{
	context.beginPath();
	context.moveTo(event.offsetX, event.offsetY);
	canvas.addEventListener("mousemove",draw,false)
}, false)
canvas.addEventListener("mouseup", (event)=>{
	canvas.removeEventListener("mousemove",draw,false);
}, false);
document.body.addEventListener("mouseup", (event)=>{
	canvas.removeEventListener("mousemove",draw,false);
}, false);


async function loadModel() {
    model = undefined;
		url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"
    model = await tf.loadLayersModel(url);
    console.log("model loaded")
		//console.log(model.summary())
}
loadModel()

const draw = function(event){
	context.lineTo(event.offsetX, event.offsetY);
	context.moveTo(event.offsetX, event.offsetY);
	context.stroke();
}

function getImg()	//reads image from canvas
{
	console.clear();
	convert().then(function(res) {
		//console.log(res)
		document.getElementById('imgRd').innerHTML = res
		var l = document.getElementById("imgRd").childElementCount;
		var img = document.getElementById(`img${l-1}`)
		img.onload = function() {
			xp = ''
			for(let i=0;i<l;i++) {
				var img = document.getElementById(`img${i}`)
				console.log(img.id);
				imgT = tf.browser.fromPixels(img,1);
				// console.log(imgT)
				ans(imgT,i)
			}
			document.getElementById("xp").value= `${xp} = ${eval(xp).toFixed(4)}`
		}
	}).catch (function(err) {
   	console.error(err);
  });
}

function clrCnv()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "white";
	context.lineWidth = thicc;
	context.fillRect(0, 0, canvas.width, canvas.height);
}

const convert = function()
{
	return new Promise(function(resolve, reject){
	let png = canvas.toDataURL("image/png")
	var msg = JSON.stringify(png);
	//console.log(msg)
  		var xhr = new XMLHttpRequest();
  		// console.log(xhr.open('POST',"/convert",true));
		xhr.open('POST',"/convert",true)
		xhr.onload = (res) => {
			// console.log(res['target']['response']);
      	srvRes = res['target']['response'];
			// document.getElementById('imgRd').innerHTML = message;
			// getImg()
			resolve(srvRes)
		};
		xhr.send(msg);
  		//alert('file is saved');
	});
}

function ans(img, i) //thiccs img and predicts ans
{
	//pooling
	cnv = document.createElement("canvas")
	cnv.id = `cnv${i}`
	cnv.height = imgSz
	cnv.width = imgSz
	document.getElementById('imgRd').appendChild(cnv)
	temp = tf.pool(img, 3, 'max', 'same')		//pooling
	temp = temp.div(tf.scalar(255))
	tf.browser.toPixels(temp, document.getElementById(`cnv${i}`))		//visual analysis
	//prediction
	v = model.predict( tf.tensor( [ temp.arraySync() ] ) )
	res = tf.tensor( v.dataSync() ).argMax().dataSync()
	console.log( res[0] )
	xp+=true_labels[ res[0] ];
}
