//const tf = require("@tensorflow/tfjs");
//const tfn = require("@tensorflow/tfjs-node");
// const handler = tfn.io.fileSystem("./path/to/your/model.json");
//
// const f= async function(){
//   const model = await tf.loadLayersModel(handler);
// }
//
// f()


const tf = require("@tensorflow/tfjs");
const fs = require('fs');
//const tfn = require("@tensorflow/tfjs-node");
//const handler = tfn.io.fileSystem("./tfjs_model/model.json");

url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"

tf.loadLayersModel(url)
	.then((model)=>{
	console.log("Success")
	// input_xs = tf.tensor2d([
	// 	[1, 0]
	// ]);
	// output = model.predict(input_xs);
	// const outputData = output.dataSync();
  // op = Number(outputData[0] > 0.5);
	// console.log(op)

	// p=89
	// ip = tf.tensor([p/99]);
	// console.log(ip)
	// v=model.predict(ip)
	// //console.log(v.data())
	// v.data()
	// 	.then((res)=>{console.log(res)})
	// 	.catch((e)=>{console.log(e)})
	fs.readFile('img.txt', 'ascii', function(err, data){

	    // Display the file content
			t = data.split(",").map(x =>parseInt(x)).slice(0,-1)
			t = [t]
			t = tf.tensor(t, [1,64,64,1])
			t = t.div(tf.scalar(255))
			// t = [t.dataSync()]
			// t = tf.tensor(t, [1,1,32,32,1])
	    console.log(t);
			v=model.predict(t)
			// console.log(v.argMax().print())
			v.array()
				.then((res)=>{console.log(res[0]); max(res[0]) })
				.catch((e)=>{console.log(e)})
	});
	// t = readImg()
	// console.log(t)
	// v=model.predict(t)
	// //console.log(v.data())
	// v.data()
	// 	.then((res)=>{console.log(res)})
	// 	.catch((e)=>{console.log(e)})


}).catch((e)=>{console.log(e)})

// var fs = require('fs');
//
// Use fs.readFile() method to read the file
// function readImg()
// {
// 	fs.readFile('img.txt', 'ascii', function(err, data){
//
// 	    // Display the file content
// 			t = data.split(",").map(x =>parseInt(x)).slice(0,-1)
// 			t = [t]
// 			t = tf.tensor(t, [1,32,32,1])
// 			t = t.div(tf.scalar(255))
// 			// t = [t.dataSync()]
// 			// t = tf.tensor(t, [1,1,32,32,1])
// 	    // console.log(t);
// 	});
// 	return t;
// }
// readImg()


function max(arr)
{
	p = 0; l = arr[0]
	for (i=1; i<arr.length; i++)
		if(l<arr[i])
		{
			p=i;
			l=arr[i]
		}

	console.log(p)
}
