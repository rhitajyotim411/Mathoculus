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
const tfn = require("@tensorflow/tfjs-node");
const handler = tfn.io.fileSystem("./tfjs_model/model.json");
tf.loadLayersModel(handler).then((res)=>{
	console.log(res)
}).catch((e)=>{console.log(e)})