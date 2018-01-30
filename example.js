const noble = require('noble');
const XiaomiServiceReader = require('./index');

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		noble.startScanning([], true);
	} else {
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral) {
	const {advertisement, id, rssi, address} = peripheral;
	const {localName, serviceData, serviceUuids} = advertisement;
	let xiaomiData = null;

	for (let i in serviceData) {
		if (serviceData[i].uuid.toString('hex') === 'fe95') {
			xiaomiData = serviceData[i].data;
		}
	}

	if (!xiaomiData) return;

	console.log({
		id, address, localName, rssi,
		data: JSON.stringify(XiaomiServiceReader.readServiceData(xiaomiData)),
	})
});
