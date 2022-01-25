const webcamElement = document.getElementById('webcam');
const canvas = document.getElementById("c");
const context = canvas.getContext("2d");
const webcam = new Webcam(webcamElement, 'environment', canvas);  //user or enviroment
var picture;
var i = new Image();
let d = document.getElementById("crop");
let x, y
let d_h = "485px"
let d_w = "985px"
let d_t = "235px"
let d_l = "505px"
let cam_flip = true;


//VIDEO REALTED OPERATIONS
const start_vdo = function () {
	d.style.display = "none";
	bg.style.display = "none";
	webcamElement.style.display = "block";
	canvas.style.display = "none";
	webcam.start()
		.then(result => {
			if(cam_flip){
				flip_vdo();
				cam_flip = false;
			}
			console.log("webcam started");
		})
		.catch(err => {
			console.log(err);
		});
}

const take_pic = function () {
	try {
		picture = webcam.snap();
		i.src = picture;
		webcamElement.style.display = "none";
		canvas.style.display = "block";
		context.drawImage(i, 0, 0);
		cam_flip = true;
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

const flip_vdo = function () {
	webcam.flip();
}

const stop_vdo = function () {
	webcamElement.style.display = "none";
	bg.style.display = "block";
	canvas.style.display = "none";
	d.style.display = "none";
	document.getElementById("xp").value = ''
	cam_flip = true;
	webcam.stop();
}


function crop() {
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
	console.log(`${g}, ${c_g}`)
	console.log(`${a}, ${c_a}`)
	console.log(c_x);
	console.log(c_y);
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


function func() {
	console.log("hello")

	a = Number(getComputedStyle(d).getPropertyValue("top").slice(0, -2))
	b = Number(getComputedStyle(d).getPropertyValue("height").slice(0, -2))

	g = Number(getComputedStyle(d).getPropertyValue("left").slice(0, -2))
	h = Number(getComputedStyle(d).getPropertyValue("width").slice(0, -2))

	c_a = Number(getComputedStyle(c).getPropertyValue("top").slice(0, -2))
	c_b = Number(getComputedStyle(c).getPropertyValue("height").slice(0, -2))

	c_g = Number(getComputedStyle(c).getPropertyValue("left").slice(0, -2))
	c_h = Number(getComputedStyle(c).getPropertyValue("width").slice(0, -2))

	console.log(c_g + " " + c_h)
	if ((a + b > c_a + c_b) || (g + h > c_g + c_h)) {
		d.style.width = d_w;
		d.style.height = d_h;
		d.style.top = d_t;
		d.style.left = d_l;
	}
}


d.ondragstart = function (event) {
	// console.log("dragging");
	x = event.offsetX
	y = event.offsetY
	console.log(event.clientX);
	console.log(event.clientY);
}

d.ondragend = function (event) {
	// console.log("dragend")
	d.style.top = (event.clientY - y) + "px";
	d.style.left = (event.clientX - x) + "px";
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

