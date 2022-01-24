const imgSz = 64
var xp = '' 	//stores expresion
var thicc = 5		//canvas line thiccness (original: 5, dataset_creation: 7)
const true_labels = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','(',')','^']
//const canvas = document.getElementById("c");

async function loadModel() {
    model = undefined;
	url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"
    model = await tf.loadLayersModel(url);
    console.log("model loaded")
		// console.log(model.summary())

	document.getElementById('wait').style.display="none"
  	document.getElementById('work').style.display="block"
}
loadModel()


const convert = function(){
	return new Promise(function(resolve, reject){
		let png = canvas.toDataURL("image/png")
		var msg = JSON.stringify(png);
		//console.log(msg)
  		var xhr = new XMLHttpRequest();
  		// console.log(xhr.open('POST',"/convert",true));
		xhr.open('POST',"/convert",true)
		xhr.send(msg);
		xhr.onload = (res) => {
			// console.log(res['target']['response']);
      		srvRes = res['target']['response'];
			resolve(srvRes)
		};
  		//alert('file is saved');
	});
}

function  getResult(){	//reads image from canvas
	console.clear()
	document.getElementById("heading").style.display= "none"
	document.getElementById("xp").style.display= "block"
	document.getElementById("xp").value= 'Calculating...'

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
				imgT = tf.browser.fromPixels(img,1); //reads image to be sent to model
				// console.log(imgT)
				ans(imgT,i)	//PREDICT
			}
			try{
				xp_res = Math.round((eval(xp.replaceAll("^","**")) + Number.EPSILON) * 10000) / 10000
				document.getElementById("xp").value= `${xp.replaceAll("*","x")} = ${xp_res}`
			}
			catch(err){
				document.getElementById("xp").value= "Erroneous expression: " + xp.replaceAll("*","x")
			}
		}
	}).catch (function(err) {
   	console.error(err);
  });
}

function ans(img, i){ // predicts ans
//prediction
  temp = img.div(tf.scalar(255))
	v = model.predict( tf.tensor( [ temp.arraySync() ] ) )
	res = tf.tensor( v.dataSync() ).argMax().dataSync()
	console.log( true_labels[ res[0] ] )
	console.log( v.arraySync()[0][ res[0] ] )
	console.log( v.arraySync()[0] )
	xp+=true_labels[ res[0] ];
}
