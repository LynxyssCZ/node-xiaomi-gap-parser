const FRAME_CONTROL = {
	FACTORY_NEW: 0b1,
	CONNECTING: 0b10,
	IS_CENTRAL: 0b100,
	IS_ENCRYPTED: 0b1000,
	MAC_INCLUDE: 0b10000,
	CAPABILITY_INCLUDE: 0b100000,
	EVENT_INCLUDE: 0b1000000,
	MANU_DATA_INCLUDE: 0b10000000,
	MANU_TITLE_INCLUDE: 0b100000000,
	BINDING_CFM: 0b1000000000,
};

const EVENT_ID = {
	4106: (buffer, offset) => ({bat: buffer.readUInt8(offset)}), // BATTERY
	4109: (buffer, offset) => ({
		tmp: buffer.readUInt16LE(offset) / 10,
		hum: buffer.readUInt16LE(offset + 2) /10,
	}), // TEMP_HUM
	4102: (buffer, offset) => ({hum: buffer.readUInt16LE(offset) /10}), // HUM
	4100: (buffer, offset) => ({tmp: buffer.readUInt16LE(offset) /10}), // TEMP
};

function readServiceData(data) {
	if (data.length < 5) return null;
	const buff = Buffer.from(data);
	const result = {};
	let offset = 0;

	const frameControl = ((buff.readUInt8(1) << 8) + buff.readUInt8(0));
	result.productId = buff.readUInt16LE(2);
	result.counter = buff.readUInt8(4);

	offset = 5;

	result.frameControl = Object.keys(FRAME_CONTROL).map(id => {
		return (FRAME_CONTROL[id] & frameControl) && id;
	}).filter(Boolean);

	if (frameControl & FRAME_CONTROL.MAC_INCLUDE) {
		if (data.length < offset + 6) return null;
		result.mac = buff.toString('hex', offset, offset + 5);
		offset += 6;
	}

	if (frameControl & FRAME_CONTROL.CAPABILITY_INCLUDE) {
		if (data.length < offset + 1) return null;
		result.capability = buff.readUInt8(offset);
		offset++;
	}

	if (frameControl & FRAME_CONTROL.EVENT_INCLUDE) {
		if (data.length < offset + 3) return null;
		result.event = readEventData(buff, offset);
	}

	return result;
}

function readEventData(buffer, offset = 0) {
	const eventID = buffer.readUInt16LE(offset);
	const length = buffer.readUInt8(offset + 2);
	let data;

	if (EVENT_ID[eventID] && buffer.length >= (offset + 3 + length)) {
		data = EVENT_ID[eventID](buffer, offset + 3);
	}

	return {
		eventID, length,
		raw: buffer.toString('hex', offset + 3, (offset + 3 + length)),
		data,
	}
}

module.exports = {
	readServiceData,
	readEventData,
	FRAME_CONTROL,
	EVENT_ID
};
