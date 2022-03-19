const imgSz = 64
var xp = '' 	//stores expresion
const true_labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'x', '/', '(', ')', '^']

// loads model from a cload storage (here github)
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

//sends XHR
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

// stores an array of HTML image objects
function getResult() {
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

//predicts symbols
async function pred(img) {
	return new Promise((resolve) => {
        img.onload = async () => {
			temp = tf.browser.fromPixels(img, 1)
			temp = temp.div(tf.scalar(255))
			v = model.predict(tf.tensor([temp.arraySync()]))
			res = tf.tensor(v.dataSync()).argMax().dataSync()
			xp += true_labels[res[0]];
			resolve({
				"Symbl": true_labels[res[0]],
				"acc": v.arraySync()[0][res[0]]
			})
		}
    })
}

//creates result pages dynamically
function resPg(btn) {
	document.getElementById('work').style.display = "none"
	document.getElementById('wait2').style.display = "block"

	let d = document.getElementById('eval')
	d.innerHTML = ""
	xp = ""
	let res_head = document.createElement("h1");
	res_head.id = "res_h1";
	res_head.innerHTML = "CHARACTERS RECOGNISED AND THIER ACCURACY"
	d.appendChild(res_head);

	let temp_d = document.createElement("div")
	temp_d.style.fontFamily = "monospace"
	temp_d.style.width = "700px";
	temp_d.align = "center";
	temp_d.style.position = "fixed";
	temp_d.style.left = "200px";
	d.appendChild(temp_d)

	getResult().then(async (imgs) => {
		//blank expression check
		if (imgs.length <= 1) {
			alert("No Expression Given !!")
			document.getElementById('wait2').style.display = "none"
			work()
			return
		}

		temp_d.appendChild(imgs[0])
		temp_d.appendChild(document.createElement("br"))
		temp_d.appendChild(document.createElement("br"))
		temp_d.appendChild(document.createElement("br"))

		imgs[0].onload = () => {
			document.getElementById('wait2').style.display = "none"
			document.getElementById('eval').style.display = "block"
			document.getElementById(btn).style.display = "block"
			document.getElementById(btn).style.cursor = "pointer"
		}
		//legend creation
		let lgnd = document.createElement("div");
		lgnd.innerHTML =
		'<div id="encl"> <div id="d_sp1"></div> <span id="sp1">ACCURACY</span> <div id="d_sp2"></div> <span id="sp2">CHARACTER</span></div>';
		lgnd.classList.add("lgnd-style");
		temp_d.appendChild(lgnd);
		temp_d.appendChild(document.createElement("br"))
		temp_d.appendChild(document.createElement("br"))

		let tbl = document.createElement("table")
		tbl.id = "resTbl" //table id
		tbl.classList.add('tbl')
		d.appendChild(tbl)

		let l = imgs.length - 1

		//table creation
		for (let i = 1; i <= l; i++) {
			let tempR = document.createElement("tr")
			tbl.appendChild(tempR)

			let tempH = document.createElement("th")
			tempH.style.border = "5px solid black"
			tempH.style.padding = "25px"
			tempH.style.width = "120px"
			tempR.appendChild(tempH)
			tempH.appendChild(imgs[i])
			tempH = document.createElement("th")
			tempH.style.border = "5px solid black"
			tempH.style.padding = "25px"
			tempH.style.width = "120px"
			tempR.appendChild(tempH)

			let temp = document.createElement("span")
			temp.style.fontSize = "30px"
			temp.style.color = "maroon"
			tempH.appendChild(temp)

			let ans = await pred(imgs[i])
			temp.innerHTML = `<b>${ans.Symbl}</b>`
			tempH.appendChild(document.createElement("br"))
			tempH.appendChild(document.createElement("br"))

			temp = document.createElement("span")
			temp.style.fontSize = "30px"
			temp.style.color = "darkgreen"
			tempH.appendChild(temp)
			temp.innerHTML = `${ans.acc * 100}`.slice(0, 6)+"%"

		}

		let expr_head = document.createElement("h1");
		expr_head.innerHTML = "EVALUATED EXPRESSION";
		expr_head.style.fontSize = "25px"
		temp_d.appendChild(expr_head);

		xp = xp.replaceAll("x", "*")
		let expr_p = document.createElement("p");
		expr_p.style.textAlign = "center";
		expr_p.style.fontSize = "35px"
		expr_p.style.margin = "0px"

		//display result
		try {
			let xp_res = Math.round((eval(xp.replaceAll("^", "**")) + Number.EPSILON) * 10000) / 10000
			expr_p.innerHTML = `${xp.replaceAll("*", "x")} = ${xp_res}`
		}
		catch (err) {
			expr_p.innerHTML = "<b>Erroneous expression: </b>" + xp.replaceAll("*", "x")
		}
		temp_d.appendChild(expr_p);
	})
}
