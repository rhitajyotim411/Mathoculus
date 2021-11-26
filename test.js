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
//const tfn = require("@tensorflow/tfjs-node");
//const handler = tfn.io.fileSystem("./tfjs_model/model.json");
url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"

tf.loadLayersModel(url).then((model)=>{
	console.log("Success")
	// input_xs = tf.tensor2d([
	// 	[1, 0]
	// ]);
	// output = model.predict(input_xs);
	// const outputData = output.dataSync();
  // op = Number(outputData[0] > 0.5);
	// console.log(op)

	p=89
	ip = tf.tensor1d([p/99]);
	v=model.predict(ip)
	console.log(v.dataSync())

}).catch((e)=>{console.log(e)})
