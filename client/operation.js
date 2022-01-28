const imgSz = 64
var xp = '' 	//stores expresion
var thicc = 5		//canvas line thiccness (original: 5, dataset_creation: 7)
const true_labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'x', '/', '(', ')', '^']
//const canvas = document.getElementById("c");

async function loadModel() {
	model = undefined;
	url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"
	model = await tf.loadLayersModel(url);
	console.log("model loaded")
	// console.log(model.summary())

	document.getElementById('wait').style.display = "none"
	document.getElementById('work').style.display = "block"
	document.getElementById('sidenav').style.display = "block"
}
loadModel()


const convert = function () {
	return new Promise(function (resolve, reject) {
		let png = canvas.toDataURL("image/png")
		var msg = JSON.stringify(png);
		//console.log(msg)
		var xhr = new XMLHttpRequest();
		// console.log(xhr.open('POST',"/convert",true));
		xhr.open('POST', "/convert", true)
		xhr.send(msg);
		xhr.onload = (res) => {
			// console.log(res['target']['response']);
			srvRes = res['target']['response'];
			resolve(srvRes)
		};
		//alert('file is saved');
	});
}

function getResult() {	//reads image from canvas
	return new Promise((resolve) => {
		console.clear()
		// document.getElementById("heading").style.display = "none"
		// document.getElementById("xp").style.display = "block"
		// document.getElementById("xp").value = 'Calculating...'

		convert().then(function (res) {
			//console.log(res)
			document.getElementById('imgRd').innerHTML = res
			var l = document.getElementById("imgRd").childElementCount - 1;
			// if (l < 1) {
			// 	document.getElementById("xp").value = "BLANK Expression";
			// 	return;
			// }
			var imgs = [document.getElementById(`eval_img`)]

			for (let i = 0; i < l; i++) {
				imgs.push(document.getElementById(`img${i}`))
			}

			resolve(imgs)
			// var img = document.getElementById(`eval_img`)
			// img.onload = function () {
			// 	xp = ''
			// 	for (let i = 0; i < l; i++) {
			// 		var img = document.getElementById(`img${i}`)
			// 		console.log(img.id);
			// 		imgT = tf.browser.fromPixels(img, 1); //reads image to be sent to model
			// 		// console.log(imgT)
			// 		ans(imgT, i)	//PREDICT
			// 	}
			// try {
			// 	xp_res = Math.round((eval(xp.replaceAll("^", "**")) + Number.EPSILON) * 10000) / 10000
			// 	document.getElementById("xp").value = `${xp.replaceAll("*", "x")} = ${xp_res}`
			// }
			// catch (err) {
			// 	document.getElementById("xp").value = "Erroneous expression: " + xp.replaceAll("*", "x")
			// }
			// }
		}).catch(function (err) {
			console.error(err);
		});
	})
}

function pred(img) { // predicts ans
	//prediction
	temp = img.div(tf.scalar(255))
	v = model.predict(tf.tensor([temp.arraySync()]))
	res = tf.tensor(v.dataSync()).argMax().dataSync()
	console.log(true_labels[res[0]])
	console.log(v.arraySync()[0][res[0]])
	console.log(v.arraySync()[0])
	xp += true_labels[res[0]];
	return {
		"Symbl": true_labels[res[0]],
		"acc": v.arraySync()[0][res[0]]
	};
}

function resPg(btn) {
	document.getElementById('work').style.display = "none"
	document.getElementById('eval').style.display = "block"
	document.getElementById(btn).style.display = "block"

	let d = document.getElementById('eval')
	d.innerHTML = ''
	xp = ''

	getResult().then((imgs) => {
		if (imgs.length <= 1)
			alert("No Expression Given !!")

		d.appendChild(imgs[0])
		d.appendChild(document.createElement("br"))
		d.appendChild(document.createElement("br"))
		let tbl = document.createElement("table")
		tbl.id = "resTbl"
		tbl.cellSpacing = "0"
		// tbl.style.border = "5px solid black"
		d.appendChild(tbl)

		let l = imgs.length - 1

		for (let i = 0; i < Math.floor(l / 5); i++) {
			let tempR = document.createElement("tr")
			tbl.appendChild(tempR)
			for (let j = 0; j < 5; j++) {
				let tempH = document.createElement("th")
				tempH.style.border = "2px solid black"
				tempH.style.padding = "25px"
				tempR.appendChild(tempH)
				tempH.appendChild(imgs[(i * 5 + j) + 1])

				tempH.appendChild(document.createElement("br"))
				tempH.appendChild(document.createElement("br"))
				let temp = document.createElement("span")
				temp.style.fontSize = "25px"
				tempH.appendChild(temp)

				let ans = pred(tf.browser.fromPixels(imgs[(i * 5 + j) + 1], 1))
				temp.innerHTML = ans.Symbl

				tempH.appendChild(document.createElement("br"))
				tempH.appendChild(document.createElement("br"))
				temp = document.createElement("span")
				temp.style.fontSize = "25px"
				tempH.appendChild(temp)
				temp.innerHTML = `${ans.acc * 100}`.slice(0, 6)
			}
		}

		let tempR = document.createElement("tr")
		tbl.appendChild(tempR)
		for (let i = Math.floor(l / 5) * 5; i < l; i++) {
			let tempH = document.createElement("th")
			tempH.style.border = "2px solid black"
			tempH.style.padding = "25px"
			tempR.appendChild(tempH)
			tempH.appendChild(imgs[i + 1])

			tempH.appendChild(document.createElement("br"))
			tempH.appendChild(document.createElement("br"))
			let temp = document.createElement("span")
			temp.style.fontSize = "25px"
			tempH.appendChild(temp)

			let ans = pred(tf.browser.fromPixels(imgs[i + 1], 1))
			temp.innerHTML = ans.Symbl

			tempH.appendChild(document.createElement("br"))
			tempH.appendChild(document.createElement("br"))
			temp = document.createElement("span")
			temp.style.fontSize = "25px"
			tempH.appendChild(temp)
			temp.innerHTML = `${ans.acc * 100}`.slice(0, 6)
		}

		d.appendChild(document.createElement("br"))
		d.appendChild(document.createElement("br"))

		let temp = document.createElement("span")
		temp.align = "center"
		temp.style.fontSize = "45px"
		d.appendChild(temp)

		xp = xp.replaceAll("x", "*")

		try {
			let xp_res = Math.round((eval(xp.replaceAll("^", "**")) + Number.EPSILON) * 10000) / 10000
			temp.innerHTML = `${xp.replaceAll("*", "x")} = ${xp_res}`
		}
		catch (err) {
			temp.innerHTML = "Erroneous expression: " + xp.replaceAll("*", "x")
		}

		d.appendChild(document.createElement("br"))
		d.appendChild(document.createElement("br"))
	})
}
