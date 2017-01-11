const https = require('https');
const querystring = require('querystring');
const config = require('./config.js');

https.request({
	hostname:'ifconfig.co',
	port:443,
	path:'/',
	method:'GET',
	headers:{
		Accept:'application/json'
	}
}, (res) => {

	res.on('data', (d) => {

		const ip = JSON.parse(d.toString()).ip;

		https.request({
			hostname:'www.ovh.com',
			port:443,
			method:'GET',
			path:'/nic/update?'+querystring.stringify({
				system:'dyndns',
				hostname:config.hostname,
				myip:ip
			}),
			headers:{
				Authorization:'Basic '+new Buffer(config.user+':'+config.pass).toString('base64')
			}
		}, (res) => {

			res.on('data', (d) => {
				process.stdout.write(d.toString());
			});

		}).end();

	});

}).on('error', (e) => {
	process.stderr.write(e);
}).end();