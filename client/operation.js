const imgSz = 64
var xp = '' 	//stores expresion
var thicc = 5		//canvas line thiccness (original: 5, dataset_creation: 7)
const true_labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'x', '/', '(', ')', '^']

async function loadModel() {
	model = undefined;
	url = "https://raw.githubusercontent.com/SXCSEM6-project/ModelStore/main/model.json"
	model = await tf.loadLayersModel(url);
	console.log("model loaded")

	document.getElementById('wait').style.display = "none"
	document.getElementById('work').style.display = "block"
	document.getElementById('sidenav').style.display = "block"
}
loadModel()


const convert = function () {
	return new Promise(function (resolve, reject) {
		let png = canvas.toDataURL("image/png")
		var msg = JSON.stringify(png);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "/convert", true)
		xhr.send(msg);
		xhr.onload = (res) => {
			srvRes = res['target']['response'];
			resolve(srvRes)
		};
	});
}

function getResult() {	//reads image from canvas
	return new Promise((resolve) => {
		console.clear()

		convert().then(function (res) {
			let para_ele = document.createElement("p");
			para_ele.innerHTML = res;
			document.body.appendChild(para_ele);
			var l = para_ele.childElementCount - 1;

			var imgs = [document.getElementById(`eval_img`)]

			for (let i = 0; i < l; i++) {
				imgs.push(document.getElementById(`img${i}`))
			}
			para_ele.remove();
			resolve(imgs)

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
	document.getElementById('wait2').style.display = "block"
	document.getElementById(btn).style.display = "block"

	let d = document.getElementById('eval')
	d.innerHTML = ""
	xp = ""
	let res_head = document.createElement("h1");
	res_head.id = "res_h1";
	res_head.align = "center";
	res_head.innerHTML = "THE IDENTIFIED CHARACTERS"
	d.appendChild(res_head);

	let lgnd = document.createElement("div");
	lgnd.innerHTML = 
	'<div id="encl"> <div id="d_sp1"></div> <span id="sp1">ACCURACY</span> <div id="d_sp2"></div> <span id="sp2">CHARACTER</span></div>';
	lgnd.classList.add("lgnd-style");
	d.appendChild(lgnd);


	getResult().then((imgs) => {
		if (imgs.length <= 1) {
			alert("No Expression Given !!")
			document.getElementById('wait2').style.display = "none"
			work()
			return
		}

		d.appendChild(imgs[0])
		imgs[0].onload = () => {
			document.getElementById('wait2').style.display = "none"
			document.getElementById('eval').style.display = "block"
		}
		d.appendChild(document.createElement("br"))
		d.appendChild(document.createElement("br"))


		let tbl = document.createElement("table")
		tbl.id = "resTbl" //table id
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
				temp.style.fontSize = "30px"
				temp.style.color = "maroon"
				tempH.appendChild(temp)

				let ans = pred(tf.browser.fromPixels(imgs[(i * 5 + j) + 1], 1))
				temp.innerHTML = ans.Symbl

				tempH.appendChild(document.createElement("br"))
				tempH.appendChild(document.createElement("br"))
				temp = document.createElement("span")
				temp.style.fontSize = "30px"
				temp.style.color = "darkgreen"
				tempH.appendChild(temp)
				temp.innerHTML = `${ans.acc * 100}`.slice(0, 6)+"%"
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
			temp.style.fontSize = "30px"
			temp.style.color = "maroon"
			tempH.appendChild(temp)

			let ans = pred(tf.browser.fromPixels(imgs[i + 1], 1))
			temp.innerHTML = ans.Symbl

			tempH.appendChild(document.createElement("br"))
			tempH.appendChild(document.createElement("br"))
			temp = document.createElement("span")
			temp.style.fontSize = "30px"
			temp.style.color = "darkgreen"
			tempH.appendChild(temp)
			temp.innerHTML = `${ans.acc * 100}`.slice(0, 6)+"%"
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
