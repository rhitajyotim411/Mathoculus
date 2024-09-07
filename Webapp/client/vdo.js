const webcamElement = document.getElementById('webcam');
const canvas = document.getElementById("c");
const context = canvas.getContext("2d");
const webcam = new Webcam(webcamElement, 'environment', canvas);  //user or enviroment
var picture;
var i = new Image();
let d = document.getElementById("crop");
let vdo_butt = document.getElementById("start_stop");
let snap_butt = document.getElementById("snap");
let evl_butt = document.getElementById("evl");
let isFlipped = false

let x, y
let d_h = "485px"
let d_w = "985px"
let d_t = "235px"
let d_l = "505px"

//starts camera
const start_vdo = function () {
	d.style.display = "none";
	bg.style.display = "none";
	evl_butt.disabled = true;
	webcamElement.style.display = "block";
	canvas.style.display = "none";
	webcam.start()
		.then(result => {
			isFlipped = false;
			snap_butt.disabled = false;
			console.log("webcam started");
		})
		.catch(err => {
			console.log(err);
		});
}

//snaps picture
const take_pic = function () {
	try {
		picture = webcam.snap();
		evl_butt.disabled = false;
		i.src = picture;
		webcamElement.style.display = "none";
		canvas.style.display = "block";
		context.drawImage(i, 0, 0);
		webcam.stop();
	}
	catch (e) {
		console.log("...")
	}
	d.style.left = d_l
	d.style.top = d_t
	d_h = `${Number(canvas.height) - 15}px`;
	d_w = `${Number(canvas.width) - 15}px`;
	d.style.height = d_h
	d.style.width = d_w
	d.style.display = "block";
}

//flips vdo
const flip_vdo = function () {
	if(!isFlipped) {
		webcam.flip();
		isFlipped = true;
	}
}

//stops camera
const stop_vdo = function () {
	snap_butt.disabled = true;
	evl_butt.disabled = true;
	webcamElement.style.display = "none";
	bg.style.display = "block";
	canvas.style.display = "none";
	d.style.display = "none";
	webcam.stop();
}

//snap/cancel wrapper function
const resnap = function(){
	if(snap_butt.innerHTML == "SNAP"){
		snap_butt.innerHTML = "CANCEL";
		snap_butt.style.backgroundColor= "#f44336";
		snap_butt.style.color = "white";
		vdo_butt.innerHTML = "START";
		vdo_butt.style.backgroundColor= "pink";
		vdo_butt.style.color = "black";
		take_pic();
	}
	else if(snap_butt.innerHTML == "CANCEL"){
		snap_butt.innerHTML = "SNAP";
		snap_butt.style.backgroundColor= "pink";
		snap_butt.style.color= "black";
		stop_vdo();
	}
}

//start/stop wrapper function
const start_stop = function(){
	if(snap_butt.innerHTML == "CANCEL"){
		snap_butt.innerHTML = "SNAP";
		snap_butt.style.backgroundColor= "pink";
		snap_butt.style.color= "black";
	}
	if(vdo_butt.innerHTML == "START"){
		vdo_butt.innerHTML = "STOP";
		vdo_butt.style.backgroundColor= "#f44336";
		vdo_butt.style.color= "white";
		start_vdo();
	}
	else if(vdo_butt.innerHTML == "STOP"){
		vdo_butt.innerHTML = "START";
		vdo_butt.style.backgroundColor= "pink";
		vdo_butt.style.color= "black";
		stop_vdo();
	}
}

//cropping the region of interest.
function crop() {
	if(snap_butt.innerHTML == "CANCEL"){
		snap_butt.innerHTML = "SNAP";
		snap_butt.style.backgroundColor= "pink";
		snap_butt.style.color= "black";
	}
	snap_butt.disabled = true;

	a = Number(getComputedStyle(d).getPropertyValue("top").slice(0, -2))
	b = Number(getComputedStyle(d).getPropertyValue("height").slice(0, -2))

	g = Number(getComputedStyle(d).getPropertyValue("left").slice(0, -2))
	h = Number(getComputedStyle(d).getPropertyValue("width").slice(0, -2))

	c_a = Number(getComputedStyle(canvas).getPropertyValue("top").slice(0, -2))
	c_b = Number(getComputedStyle(canvas).getPropertyValue("height").slice(0, -2))

	c_g = Number(getComputedStyle(canvas).getPropertyValue("left").slice(0, -2))
	c_h = Number(getComputedStyle(canvas).getPropertyValue("width").slice(0, -2))

	c_x = g - c_g;
	c_y = a - c_a;
	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = h;
	canvas.height = b;
	try {
		context.drawImage(i, c_x, c_y, h, b, 0, 0, h, b);
	}
	catch (e) {
		console.log(".......")
	}
	d.style.display = "none";
}

//this function is triggered when the user tries to resize the cropping div through the onclick event.
function resize() {
	a = Number(getComputedStyle(d).getPropertyValue("top").slice(0, -2))
	b = Number(getComputedStyle(d).getPropertyValue("height").slice(0, -2))

	g = Number(getComputedStyle(d).getPropertyValue("left").slice(0, -2))
	h = Number(getComputedStyle(d).getPropertyValue("width").slice(0, -2))

	c_a = Number(getComputedStyle(c).getPropertyValue("top").slice(0, -2))
	c_b = Number(getComputedStyle(c).getPropertyValue("height").slice(0, -2))

	c_g = Number(getComputedStyle(c).getPropertyValue("left").slice(0, -2))
	c_h = Number(getComputedStyle(c).getPropertyValue("width").slice(0, -2))

	if ((a + b > c_a + c_b) || (g + h > c_g + c_h)) {
		d.style.width = d_w;
		d.style.height = d_h;
		d.style.top = d_t;
		d.style.left = d_l;
	}
}

//when the user hust starts to drag he cropping div.
d.ondragstart = function (event) {
	x = event.offsetX
	y = event.offsetY
}

d.ondragend = function (event) {
	d.style.top = (event.clientY - y) + "px";
	d.style.left = (event.clientX - x) + "px";

	/*the below checkings are necessary to restric the user
	from taking the cropping div outside the root cropping area.*/
	a = Number(getComputedStyle(d).getPropertyValue("top").slice(0, -2))
	b = Number(getComputedStyle(d).getPropertyValue("height").slice(0, -2))

	g = Number(getComputedStyle(d).getPropertyValue("left").slice(0, -2))
	h = Number(getComputedStyle(d).getPropertyValue("width").slice(0, -2))

	c_a = Number(getComputedStyle(c).getPropertyValue("top").slice(0, -2))
	c_b = Number(getComputedStyle(c).getPropertyValue("height").slice(0, -2))

	c_g = Number(getComputedStyle(c).getPropertyValue("left").slice(0, -2))
	c_h = Number(getComputedStyle(c).getPropertyValue("width").slice(0, -2))

	if ((a + b > c_a + c_b) || (g + h > c_g + c_h) || (a < c_a) || (g < c_g)) {
		d.style.width = d_w;
		d.style.height = d_h;
		d.style.top = d_t;
		d.style.left = d_l;
	}

}

//WHEN THE USER MOVES BACK TO THE SNAP PAGE FROM THE EVALUATION PAGE FOR RETAKING ANOTHER SNAP.
function work(){
	document.getElementById('eval').style.display = "none"
	document.getElementById('Snap').style.display = "none"
	document.getElementById('work').style.display = "block"
	stop_vdo();
}