// const imgSz = 64
// var xp = '' 	//stores expresion
// var thicc = 5		//canvas line thiccness (original: 5, dataset_creation: 7)
// const true_labels = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','(',')','^']

// const canvas = document.getElementById("c");
// const context = canvas.getContext("2d");
// let ln_color = "black";
// let canvas_color = "#fafafa";

const webcamElement = document.getElementById('webcam');
const canvas = document.getElementById("c");
const context = canvas.getContext("2d");
const webcam = new Webcam(webcamElement, 'enviroment', canvas);  //user or enviroment
var picture;
var i = new Image();
let d = document.getElementById("crop");
let x, y
let d_h = "480px"
let d_w = "980px"
let d_t	= "210px"
let d_l = "250px"

//VIDEO REALTED OPERATIONS
const start_vdo = function(){
	d.style.display = "none";
	webcamElement.style.display = "block";
	canvas.style.display = "none";
	webcam.start()
   .then(result =>{
      console.log("webcam started");
   })
   .catch(err => {
       console.log(err);
   });
}

const take_pic = function(){
	try{
		picture = webcam.snap();
		i.src = picture;
		webcamElement.style.display = "none";
		canvas.style.display = "block";
  		context.drawImage(i, 0, 0);
  	}
  	catch(e){
  		console.log("...")
  	}
		d.style.left = d_l
		d.style.top = d_t
  	d.style.height = `${Number(canvas.height) - 20}px`;
  	d.style.width = `${Number(canvas.width) - 20}px`;
  	d.style.display = "block";
		d_h = `${Number(canvas.height) - 20}px`;
		d_w = `${Number(canvas.width) - 20}px`;
}

const flip_vdo = function(){
	webcam.flip();
}

const stop_vdo = function(){
	webcamElement.style.display = "none";
	canvas.style.display = "none";
	d.style.display = "none";
	webcam.stop();
}



function crop(){
	a = Number(getComputedStyle(d).getPropertyValue("top").slice(0,-2))
	b = Number(getComputedStyle(d).getPropertyValue("height").slice(0,-2))

	g = Number(getComputedStyle(d).getPropertyValue("left").slice(0,-2))
	h = Number(getComputedStyle(d).getPropertyValue("width").slice(0,-2))

	c_a = Number(getComputedStyle(canvas).getPropertyValue("top").slice(0,-2))
	c_b = Number(getComputedStyle(canvas).getPropertyValue("height").slice(0,-2))

	c_g = Number(getComputedStyle(canvas).getPropertyValue("left").slice(0,-2))
	c_h = Number(getComputedStyle(canvas).getPropertyValue("width").slice(0,-2))

	c_x =  g - c_g;
	c_y = a - c_a;
	// c_x = d.offsetLeft - c.offsetLeft;
	// c_y = d.offsetTop - c.offsetTop;
	console.log(`${g}, ${c_g}`)
	console.log(`${a}, ${c_a}`)
	console.log(c_x);
	console.log(c_y);
	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = h;
	canvas.height = b;
	try{
		context.drawImage(i, c_x, c_y, h, b, 0, 0, h, b);
	}
	catch(e){
		console.log(".......")
	}
	d.style.display = "none";
}


	function func(){
		console.log("hello")

		a = Number(getComputedStyle(d).getPropertyValue("top").slice(0,-2))
		b = Number(getComputedStyle(d).getPropertyValue("height").slice(0,-2))

		g = Number(getComputedStyle(d).getPropertyValue("left").slice(0,-2))
		h = Number(getComputedStyle(d).getPropertyValue("width").slice(0,-2))

		c_a = Number(getComputedStyle(c).getPropertyValue("top").slice(0,-2))
		c_b = Number(getComputedStyle(c).getPropertyValue("height").slice(0,-2))

		c_g = Number(getComputedStyle(c).getPropertyValue("left").slice(0,-2))
		c_h = Number(getComputedStyle(c).getPropertyValue("width").slice(0,-2))

		console.log(c_g+" "+c_h)
		if((a+b > c_a+c_b) || (g+h > c_g+c_h)){
			d.style.width = d_w;
			d.style.height = d_h;
			d.style.top = d_t;
			d.style.left = d_l;
		}
	}


	d.ondragstart = function(event){
		// console.log("dragging");
		x = event.offsetX
		y = event.offsetY
		console.log(event.clientX);
		console.log(event.clientY);
	}

	d.ondragend = function(event){
		// console.log("dragend")
		d.style.top = (event.clientY-y)+"px";
		d.style.left = (event.clientX-x)+"px";
		a = Number(getComputedStyle(d).getPropertyValue("top").slice(0,-2))
		b = Number(getComputedStyle(d).getPropertyValue("height").slice(0,-2))

		g = Number(getComputedStyle(d).getPropertyValue("left").slice(0,-2))
		h = Number(getComputedStyle(d).getPropertyValue("width").slice(0,-2))

		c_a = Number(getComputedStyle(c).getPropertyValue("top").slice(0,-2))
		c_b = Number(getComputedStyle(c).getPropertyValue("height").slice(0,-2))

		c_g = Number(getComputedStyle(c).getPropertyValue("left").slice(0,-2))
		c_h = Number(getComputedStyle(c).getPropertyValue("width").slice(0,-2))

		if((a+b > c_a+c_b) || (g+h > c_g+c_h) || (a < c_a) || (g < c_g)){
			d.style.width = d_w;
			d.style.height = d_h;
			d.style.top = d_t;
			d.style.left = d_l;
		}

	}



//LOADING MODEL
// async function loadModel() {
//     model = undefined;
// 	url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"
//     model = await tf.loadLayersModel(url);
//     console.log("model loaded")
// 		// console.log(model.summary())

// 	document.getElementById('wait').style.display="none"
//   	document.getElementById('work').style.display="block"
// }
// loadModel()




// //MOUSE EVENTS
// context.fillStyle = canvas_color;
// context.lineWidth = thicc;
// context.fillRect(0, 0, canvas.width, canvas.height);
// canvas.addEventListener("mousedown", (event)=>{
// 	context.beginPath();
// 	context.moveTo(event.offsetX, event.offsetY);
// 	canvas.addEventListener("mousemove",draw,false)
// }, false)
// canvas.addEventListener("mouseup", (event)=>{
// 	canvas.removeEventListener("mousemove",draw,false);
// }, false);
// document.body.addEventListener("mouseup", (event)=>{
// 	canvas.removeEventListener("mousemove",draw,false);
// }, false);




//TOUCH EVENTS
// context.fillRect(0, 0, canvas.width, canvas.height);
// canvas.addEventListener("touchstart", (event)=>{
// 	context.beginPath();
// 	context.moveTo(event.touches[0].clientX - canvas.offsetLeft, event.touches[0].clientY - canvas.offsetTop);
// 	canvas.addEventListener("touchmove",draw_touch,false)
// }, false)
// canvas.addEventListener("touchend", (event)=>{
// 	canvas.removeEventListener("touchmove",draw_touch,false);
// }, false);
// document.body.addEventListener("touchend", (event)=>{
// 	canvas.removeEventListener("touchmove",draw_touch,false);
// }, false);

// const draw = function(event){
// 	context.strokeStyle = ln_color;
// 	context.lineTo(event.offsetX, event.offsetY);
// 	context.moveTo(event.offsetX, event.offsetY);
// 	context.stroke();
// }

// const draw_touch = function(event){
// 	context.strokeStyle = ln_color;
// 	context.lineTo(event.touches[0].clientX - canvas.offsetLeft, event.touches[0].clientY - canvas.offsetTop);
// 	context.moveTo(event.touches[0].clientX - canvas.offsetLeft, event.touches[0].clientY - canvas.offsetTop);
// 	context.stroke();
// }





//CLEARING THE CANVAS
// function clrCnv(){
// 	context.clearRect(0, 0, canvas.width, canvas.height);
// 	context.fillStyle = canvas_color;
// 	context.lineWidth = thicc;
// 	context.fillRect(0, 0, canvas.width, canvas.height);
// 	document.getElementById("xp").value= ''
// 	toggle(false)
// }




//ERASER
// const toggle = function(flag){
// 	let toggle_but = document.getElementById("mode")
// 	if(toggle_but.innerHTML == "ERASE" && flag){
// 		canvas.style.border = "2px solid red";
// 		ln_color = canvas_color;
// 		context.lineWidth = 30;
// 		toggle_but.innerHTML = "WRITE";
// 	}
// 	else if(toggle_but.innerHTML == "WRITE"){
// 		canvas.style.border = "0px solid black";
// 		ln_color = "black";
// 		context.lineWidth = thicc;
// 		toggle_but.innerHTML = "ERASE";
// 	}
// }



//SERVER INTARACTION
// const convert = function(){
// 	return new Promise(function(resolve, reject){
// 		let png = canvas.toDataURL("image/png")
// 		var msg = JSON.stringify(png);
// 		//console.log(msg)
//   		var xhr = new XMLHttpRequest();
//   		// console.log(xhr.open('POST',"/convert",true));
// 		xhr.open('POST',"/convert",true)
// 		xhr.send(msg);
// 		xhr.onload = (res) => {
// 			// console.log(res['target']['response']);
//       		srvRes = res['target']['response'];
// 			resolve(srvRes)
// 		};
//   		//alert('file is saved');
// 	});
// }


// function  getResult(){	//reads image from canvas
// 	console.clear()
// 	toggle(false)
// 	document.getElementById("xp").value= 'Calculating...'

// 	convert().then(function(res) {
// 		//console.log(res)
// 		document.getElementById('imgRd').innerHTML = res
// 		var l = document.getElementById("imgRd").childElementCount;
// 		var img = document.getElementById(`img${l-1}`)
// 		img.onload = function() {
// 			xp = ''
// 			for(let i=0;i<l;i++) {
// 				var img = document.getElementById(`img${i}`)
// 				console.log(img.id);
// 				imgT = tf.browser.fromPixels(img,1); //reads image to be sent to model
// 				// console.log(imgT)
// 				ans(imgT,i)	//PREDICT
// 			}
// 			try{
// 				xp_res = Math.round((eval(xp.replaceAll("^","**")) + Number.EPSILON) * 10000) / 10000
// 				document.getElementById("xp").value= `${xp} = ${xp_res}`
// 			}
// 			catch(err){
// 				document.getElementById("xp").value= "Erroneous expression: " + xp
// 			}
// 		}
// 	}).catch (function(err) {
//    	console.error(err);
//   });
// }



// function ans(img, i){ //thickens img and predicts ans
// 	//pooling
// 	cnv = document.createElement("canvas")
// 	cnv.id = `cnv${i}`
// 	cnv.height = imgSz
// 	cnv.width = imgSz
// 	document.getElementById('imgRd').appendChild(cnv)
// 	temp = tf.pool(img, 3, 'max', 'same')		//pooling
// 	temp = temp.div(tf.scalar(255))
// 	tf.browser.toPixels(temp, document.getElementById(`cnv${i}`))		//visual analysis


// 	//prediction
// 	v = model.predict( tf.tensor( [ temp.arraySync() ] ) )
// 	res = tf.tensor( v.dataSync() ).argMax().dataSync()
// 	console.log( true_labels[ res[0] ] )
// 	console.log( v.arraySync()[0][ res[0] ] )
// 	console.log( v.arraySync()[0] )
// 	xp+=true_labels[ res[0] ];
// }
