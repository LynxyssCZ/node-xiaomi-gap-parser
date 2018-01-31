# xiaomi-gap
Xiaomi GAP sensor data parser

Used for parsing data frames from Xiaomi Mijia brand BLE sensors

## API
### readServiceData
In: `Buffer|Array|String`

Out:
```javascript
result = {
	productId: Number,
	counter: Number,
	frameControl: [],
	mac: String, // Optional,
	capability: CapabilityBitMask, // Optional
	event: {
		eventID: Number,
		length: Number,
		raw: String,
		data: Object,
	} // Optional
}
```

CapabilityBitMask:

Bit | Name | Explanation
----|------|------------
0 | Connectable | True of device is cabable of establishing a connection
1 | beCentral | True of device is cabable of serving as a central device
2 | security | True of device is capable of data encryption
3-4 | bonding | 00 - No MIOT binding, 01 - before MIOT binding, 10 - after MIOT binding

## Usage
To use this library you need to be able to discover the Xiaomi sensor advertising and then pass the Xiaomi service data (`0xfe95`) to it as a `Buffer`. For full example, see `example.js`.

## Supported sensors
### Xiaomi Mijia Bluetooth Temperature and Humidity sensor (with LCD)
This sensor is fully supported in normal operation. Library is able to read Temperature, Humidity and battery levels from frames.

## Sources
Sources used during this project are official Xiaomi MIOT documents available on their site
