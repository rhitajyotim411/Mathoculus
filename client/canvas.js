const canvas = document.getElementById("c");
const context = canvas.getContext("2d");
let ln_color = "black";
let canvas_color = "#fafafa";

//MOUSE EVENTS
context.fillStyle = canvas_color;
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

const draw = function(event){
	context.strokeStyle = ln_color;
	context.lineTo(event.offsetX, event.offsetY);
	context.moveTo(event.offsetX, event.offsetY);
	context.stroke();
}

//CLEARING THE CANVAS
function clrCnv(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = canvas_color;
	context.lineWidth = thicc;
	context.fillRect(0, 0, canvas.width, canvas.height);
	document.getElementById("xp").value= ''
}

//ERASER
const toggle = function(flag){
	let toggle_but = document.getElementById("mode")
	if(toggle_but.innerHTML == "ERASE" && flag){
		document.querySelector(".paper").style.boxShadow= " 1px 1px 6px 8px #f44336";
		ln_color = canvas_color;
		context.lineWidth = 30;
		toggle_but.innerHTML = "WRITE";
		document.getElementById("mode").style.backgroundColor= "#f44336";
		document.getElementById("mode").style.color= "white";
	}
	else if(toggle_but.innerHTML == "WRITE"){
		canvas.style.border = "0px solid black";
		document.querySelector(".paper").style.boxShadow= "none";
		ln_color = "black";
		context.lineWidth = thicc;
		toggle_but.innerHTML = "ERASE";
		document.getElementById("mode").style.backgroundColor= "pink";
		document.getElementById("mode").style.color= "black";
	}
}
