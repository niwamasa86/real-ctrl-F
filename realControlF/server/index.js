require('dotenv').config()
const express = require('express')
const http = require('http')
const https = require('https')
const multer = require('multer')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const localAddress = require('./utils/address.js')

const app = express()
// const options = {
// 	key : fs.readFileSync(path.join(__dirname, '/../key/key.pem')),
// 	cert: fs.readFileSync(path.join(__dirname, '/../key/cert.pem'))
// }
// const server = https.createServer(options, app)
const portHTTP = process.env.PORT_HTTP
// const portHTTPS = process.env.PORT_HTTPS

// app.use(history()) // URLがなかったらindex.htmlに飛ぶ
app.use(bodyParser.json({limit: '50mb'}))
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)

const uploadedPath = __dirname + '/uploaded'
if (!fs.existsSync(uploadedPath)) {
	fs.mkdirSync(uploadedPath)
}

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		const dateDirectory = '/' + new Date().toLocaleDateString()
		const fileDirectory =  dateDirectory + '/' + uuidv4()
		if (!fs.existsSync(uploadedPath + dateDirectory)) {
			fs.mkdirSync(uploadedPath + dateDirectory)
		}
		if (!fs.existsSync(uploadedPath + fileDirectory)) {
			fs.mkdirSync(uploadedPath + fileDirectory)
		}
		cb(null, uploadedPath + fileDirectory)
	},
	filename: function(req, file, cb) {
		const extension = fileManager.extension(file)
		if(extension) {
			cb(null, `${file.fieldname}.${extension}`)
		}
	}
})

const upload = multer({
	storage: storage
})

app.use('', express.static(__dirname + '/../public'))

// // httpへのアクセスは全てhttpsへリダイレクトする
// http.createServer((express()).all('*', (request, response) => {
// 	response.redirect(`https://${request.hostname}${request.url}`)
// })).listen(portHTTP, () => {
// 	// console.log('start HTTP server listening')
// 	// console.log(localAddress.toHTTP(portHTTP))
// })

const api_key = `AIzaSyDrVpHg5DF8UHMQEIhLQ_eu6fMwdq6mE68`;
const url = `https://vision.googleapis.com/v1/images:annotate`;

app.post('/api/vision', (req, res) => {
	const method = "POST";
	const body = JSON.stringify(req.body);
	const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
	};
	fetch(`${url}?key=${api_key}`, {method, headers, body})
		.then((response)=> response.json())
		.then(json => { console.log(JSON.stringify(json.responses[0].textAnnotations)); return json })
		.then(json => res.send(json))
		.catch(console.error)
})

app.post('/api/upload', upload.fields([
	{ name: 'origin', maxCount: 1 },
	{ name: 'thumbnail', maxCount: 1 }
]), (req, res) => {
	// try {
	// 	req.body.mode = JSON.parse(req.body.mode)
	// } catch(e) {
	// 	res.status(400)
	// 	res.send({ ok: false, error: Error.type.json('mode') })
	// 	return
	// }
	// if (Model.API.Upload.validate(req.body, (error) => {
	// 	console.log(error)
	// 	res.status(400)
	// 	res.send({ ok: false, error: error })
	// })) {
	// 	appMethods.upload(req.body, {
	// 		origin: req.files['origin'][0],
	// 		thumbnail: req.files['thumbnail'][0]
	// 	}, res)
	// 	monitorCounter.upload++
	// 	mackerel.push('upload', monitorCounter.upload)
	// }
})

// server.listen(portHTTPS, () => {
// 	console.log('start HTTPS server listening')
// 	console.log(localAddress.toHTTPS(portHTTPS))
// })

app.listen(portHTTP, () => {
	console.log('start HTTP server listening ' + portHTTP)
	// console.log(localAddress.toHTTPS(portHTTPS))
})
