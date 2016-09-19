(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

class StateManager {

  constructor(element) {
    this.element = element;
    this.state = 'init';
    this.element.classList.add('state-' + this.state);
  }

  change(state) {
    this.element.classList.remove('state-' + this.state);
    this.state = state;
    this.element.classList.add('state-' + this.state);
  }
}

const element = document.getElementById('js-state-manager');
const stateManager = new StateManager(element);

module.exports = stateManager;

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/app/state.js","/app")
},{"b55mWE":5,"buffer":4}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const BluetoothDevice = require('web-bluetooth');
const stateManager = require('./app/state.js');

const filter = {
  name: 'echo',
  service: ['ec00']
};
let blue;

const connectButton = document.getElementById('js-connect');
const disconnectButton = document.getElementById('js-disconnect');

const okButton = document.getElementById('js-ok');

connectButton.addEventListener('click', () => {
  connectButton.disabled = true;
  stateManager.change('connecting');

  blue = new BluetoothDevice(filter);
  blue.connect()
    .then(device => {
      console.log(device);
      stateManager.change('connected');
      connectButton.disabled = false;
    })
    .catch(error => {
      console.log(error);
      stateManager.change('init');
      connectButton.disabled = false;
    });
});

disconnectButton.addEventListener('click', () => {
  if (blue.disconnect()) {
    stateManager.change('init');
  } else {
    console.log('error while disconnect');
  }
});

okButton.addEventListener('click', () => {
  console.log('fffffffffffffffffffffffffffffff1');
  blue.writeValue('fffffffffffffffffffffffffffffff1', 'ok')
    .then(writeSuccess => {
      console.log(writeSuccess);
    })
    .catch(error => {
      console.log(error);
    });
});

// exampleDevice.writeValue('gap.device_name', 'myFitbit' )
//       .then(writeSuccess => {
//         console.log(writeSuccess);
//       });

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_b9735e64.js","/")
},{"./app/state.js":1,"b55mWE":5,"buffer":4,"web-bluetooth":10}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js","/../../node_modules/gulp-browserify/node_modules/base64-js/lib")
},{"b55mWE":5,"buffer":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/buffer/index.js","/../../node_modules/gulp-browserify/node_modules/buffer")
},{"b55mWE":5,"base64-js":3,"buffer":4,"ieee754":6}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/process/browser.js","/../../node_modules/gulp-browserify/node_modules/process")
},{"b55mWE":5,"buffer":4}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"b55mWE":5,"buffer":4}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bluetooth = require('./bluetoothMap');
var errorHandler = require('./errorHandler');

/** BluetoothDevice -
  *
  * @method connect - Establishes a connection with the device
  * @method connected - checks apiDevice to see whether device is connected
  * @method disconnect - terminates the connection with the device and pauses all data stream subscriptions
  * @method getValue - reads the value of a specified characteristic
  * @method writeValue - writes data to a specified characteristic of the device
  * @method startNotifications - attempts to start notifications for changes to device values and attaches an event listener for each data transmission
  * @method stopNotifications - attempts to stop previously started notifications for a provided characteristic
  * @method addCharacteristic - adds a new characteristic object to bluetooth.gattCharacteristicsMapping
  * @method _returnCharacteristic - _returnCharacteristic - returns the value of a cached or resolved characteristic or resolved characteristic
  *
  * @param {object} filters - collection of filters for device selectin. All filters are optional, but at least 1 is required.
  *          .name {string}
  *          .namePrefix {string}
  *          .uuid {string}
  *          .services {array}
  *          .optionalServices {array} - defaults to all available services, use an empty array to get no optional services
  *
  * @return {object} Returns a new instance of BluetoothDevice
  *
  */

var BluetoothDevice = function () {
  function BluetoothDevice(requestParams) {
    _classCallCheck(this, BluetoothDevice);

    this.requestParams = requestParams;
    this.apiDevice = null;
    this.apiServer = null;
    this.cache = {};
  }

  _createClass(BluetoothDevice, [{
    key: 'connected',
    value: function connected() {
      return this.apiDevice ? this.apiDevice.gatt.connected : errorHandler('no_device');
    }

    /** connect - establishes a connection with the device
      *   
      * NOTE: This method must be triggered by a user gesture to satisfy the native API's permissions
      *
      * @return {object} - native browser API device server object
      */

  }, {
    key: 'connect',
    value: function connect() {
      var _this = this;

      var filters = this.requestParams;
      var requestParams = { filters: [] };
      var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]/;

      if (!Object.keys(filters).length) {
        return errorHandler('no_filters');
      }
      if (filters.name) requestParams.filters.push({ name: filters.name });
      if (filters.namePrefix) requestParams.filters.push({ namePrefix: filters.namePrefix });
      if (filters.uuid) {
        if (!filters.uuid.match(uuidRegex)) {
          errorHandler('uuid_error');
        } else {
          requestParams.filters.push({ uuid: filters.uuid });
        }
      }
      if (filters.services) {
        (function () {
          var services = [];
          filters.services.forEach(function (service) {
            if (!bluetooth.gattServiceList.includes(service)) {
              console.warn(service + ' is not a valid service. Please check the service name.');
            } else {
              services.push(service);
            }
          });
          requestParams.filters.push({ services: services });
        })();
      }
      if (filters.optional_services) {
        filters.optional_services.forEach(function (service) {
          if (!bluetooth.gattServiceList.includes(service)) bluetooth.gattServiceList.push(service);
        });
      } else {
        requestParams.optionalServices = bluetooth.gattServiceList;
      }

      return navigator.bluetooth.requestDevice(requestParams).then(function (device) {
        _this.apiDevice = device;
        return device.gatt.connect();
      }).then(function (server) {
        _this.apiServer = server;
        return server;
      }).catch(function (err) {
        return errorHandler('user_cancelled', err);
      });
    }

    /** disconnect - terminates the connection with the device and pauses all data stream subscriptions
      * @return {boolean} - success
      *
      */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.apiServer.connected ? this.apiServer.disconnect() : errorHandler('not_connected');
      return this.apiServer.connected ? errorHandler('issue_disconnecting') : true;
    }

    /** getValue - reads the value of a specified characteristic
      *
      * @param {string} characteristic_name - GATT characteristic  name
      * @return {promise} -  resolves with an object that includes key-value pairs for each of the properties
      *                       successfully read and parsed from the device, as well as the
      *                       raw value object returned by a native readValue request to the
      *                       device characteristic.
      */

  }, {
    key: 'getValue',
    value: function getValue(characteristic_name) {
      var _this2 = this;

      if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        return errorHandler('characteristic_error', null, characteristic_name);
      }

      var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];

      if (!characteristicObj.includedProperties.includes('read')) {
        console.warn('Attempting to access read property of ' + characteristic_name + ',\n                    which is not a included as a supported property of the\n                    characteristic. Attempt will resolve with an object including\n                    only a rawValue property with the native API return\n                    for an attempt to readValue() of ' + characteristic_name + '.');
      }

      return new Promise(function (resolve, reject) {
        return resolve(_this2._returnCharacteristic(characteristic_name));
      }).then(function (characteristic) {
        return characteristic.readValue();
      }).then(function (value) {
        var returnObj = characteristicObj.parseValue ? characteristicObj.parseValue(value) : {};
        returnObj.rawValue = value;
        return returnObj;
      }).catch(function (err) {
        return errorHandler('read_error', err);
      });
    }

    /** writeValue - writes data to a specified characteristic of the device
      *
      * @param {string} characteristic_name - name of the GATT characteristic 
      *     https://www.bluetooth.com/specifications/assigned-numbers/generic-attribute-profile
      *
      * @param {string|number} value - value to write to the requested device characteristic
      *
      *
      * @return {boolean} - Result of attempt to write characteristic where true === successfully written
      */

  }, {
    key: 'writeValue',
    value: function writeValue(characteristic_name, value) {
      var _this3 = this;

      if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        return errorHandler('characteristic_error', null, characteristic_name);
      }

      var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];

      if (!characteristicObj.includedProperties.includes('write')) {
        console.warn('Attempting to access write property of ' + characteristic_name + ',\n                    which is not a included as a supported property of the\n                    characteristic. Attempt will resolve with native API return\n                    for an attempt to writeValue(' + value + ') to ' + characteristic_name + '.');
      }

      return new Promise(function (resolve, reject) {
        return resolve(_this3._returnCharacteristic(characteristic_name));
      }).then(function (characteristic) {
        return characteristic.writeValue(characteristicObj.prepValue ? characteristicObj.prepValue(value) : value);
      }).then(function (changedChar) {
        return true;
      }).catch(function (err) {
        return errorHandler('write_error', err, characteristic_name);
      });
    }

    /** startNotifications - attempts to start notifications for changes to device values and attaches an event listener for each data transmission
      *
      * @param {string} characteristic_name - GATT characteristic name
      * @param {callback} transmissionCallback - callback function to apply to each event while notifications are active
      *
      * @return
      *
      */

  }, {
    key: 'startNotifications',
    value: function startNotifications(characteristic_name, transmissionCallback) {
      var _this4 = this;

      if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        return errorHandler('characteristic_error', null, characteristic_name);
      }

      var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
      var primary_service_name = characteristicObj.primaryServices[0];

      if (!characteristicObj.includedProperties.includes('notify')) {
        console.warn('Attempting to access notify property of ' + characteristic_name + ',\n                    which is not a included as a supported property of the\n                    characteristic. Attempt will resolve with an object including\n                    only a rawValue property with the native API return\n                    for an attempt to startNotifications() for ' + characteristic_name + '.');
      }

      return new Promise(function (resolve, reject) {
        return resolve(_this4._returnCharacteristic(characteristic_name));
      }).then(function (characteristic) {
        characteristic.startNotifications().then(function () {
          _this4.cache[primary_service_name][characteristic_name].notifying = true;
          return characteristic.addEventListener('characteristicvaluechanged', function (event) {
            var eventObj = characteristicObj.parseValue ? characteristicObj.parseValue(event.target.value) : {};
            eventObj.rawValue = event;
            return transmissionCallback(eventObj);
          });
        });
      }).catch(function (err) {
        return errorHandler('start_notifications_error', err, characteristic_name);
      });
    }

    /** stopNotifications - attempts to stop previously started notifications for a provided characteristic
      *
      * @param {string} characteristic_name - GATT characteristic name
      *
      * @return {boolean} success
      *
      */

  }, {
    key: 'stopNotifications',
    value: function stopNotifications(characteristic_name) {
      var _this5 = this;

      if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        return errorHandler('characteristic_error', null, characteristic_name);
      }

      var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
      var primary_service_name = characteristicObj.primaryServices[0];

      if (this.cache[primary_service_name][characteristic_name].notifying) {
        return new Promise(function (resolve, reject) {
          return resolve(_this5._returnCharacteristic(characteristic_name));
        }).then(function (characteristic) {
          characteristic.stopNotifications().then(function () {
            _this5.cache[primary_service_name][characteristic_name].notifying = false;
            return true;
          });
        }).catch(function (err) {
          return errorHandler('stop_notifications_error', err, characteristic_name);
        });
      } else {
        return errorHandler('stop_notifications_not_notifying', null, characteristic_name);
      }
    }

    /**
      * addCharacteristic - adds a new characteristic object to bluetooth.gattCharacteristicsMapping
      *
      * @param {string} characteristic_name - GATT characteristic name or other characteristic
      * @param {string} primary_service_name - GATT primary service name or other parent service of characteristic
      * @param {array} propertiesArr - Array of GATT properties as Strings
      *
      * @return {boolean} - Result of attempt to add characteristic where true === successfully added
      */

  }, {
    key: 'addCharacteristic',
    value: function addCharacteristic(characteristic_name, primary_service_name, propertiesArr) {
      if (bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        return errorHandler('add_characteristic_exists_error', null, characteristic_name);
      }

      if (!characteristic_name || characteristic_name.constructor !== String || !characteristic_name.length) {
        return errorHandler('improper_characteristic_format', null, characteristic_name);
      }

      if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        if (!primary_service_name || !propertiesArr) {
          return errorHandler('new_characteristic_missing_params', null, characteristic_name);
        }
        if (primary_service_name.constructor !== String || !primary_service_name.length) {
          return errorHandler('improper_service_format', null, primary_service_name);
        }
        if (propertiesArr.constructor !== Array || !propertiesArr.length) {
          return errorHandler('improper_properties_format', null, propertiesArr);
        }

        console.warn(characteristic_name + ' is not yet fully supported.');

        bluetooth.gattCharacteristicsMapping[characteristic_name] = {
          primaryServices: [primary_service_name],
          includedProperties: propertiesArr
        };

        return true;
      }
    }

    /**
      * _returnCharacteristic - returns the value of a cached or resolved characteristic or resolved characteristic
      *
      * @param {string} characteristic_name - GATT characteristic name
      * @return {object|false} - the characteristic object, if successfully obtained
      */

  }, {
    key: '_returnCharacteristic',
    value: function _returnCharacteristic(characteristic_name) {
      var _this6 = this;

      if (!bluetooth.gattCharacteristicsMapping[characteristic_name]) {
        return errorHandler('characteristic_error', null, characteristic_name);
      }

      var characteristicObj = bluetooth.gattCharacteristicsMapping[characteristic_name];
      var primary_service_name = characteristicObj.primaryServices[0];

      if (this.cache[primary_service_name] && this.cache[primary_service_name][characteristic_name] && this.cache[primary_service_name][characteristic_name].cachedCharacteristic) {
        return this.cache[primary_service_name][characteristic_name].cachedCharacteristic;
      } else if (this.cache[primary_service_name] && this.cache[primary_service_name].cachedService) {
        this.cache[primary_service_name].cachedService.getCharacteristic(characteristic_name).then(function (characteristic) {
          _this6.cache[primary_service_name][characteristic_name] = { cachedCharacteristic: characteristic };
          return characteristic;
        }).catch(function (err) {
          return errorHandler('_returnCharacteristic_error', err, characteristic_name);
        });
      } else {
        return this.apiServer.getPrimaryService(primary_service_name).then(function (service) {
          _this6.cache[primary_service_name] = { 'cachedService': service };
          return service.getCharacteristic(characteristic_name);
        }).then(function (characteristic) {
          _this6.cache[primary_service_name][characteristic_name] = { cachedCharacteristic: characteristic };
          return characteristic;
        }).catch(function (err) {
          return errorHandler('_returnCharacteristic_error', err, characteristic_name);
        });
      }
    }
  }]);

  return BluetoothDevice;
}();

module.exports = BluetoothDevice;
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/web-bluetooth/dist/npm/BluetoothDevice.js","/../../node_modules/web-bluetooth/dist/npm")
},{"./bluetoothMap":8,"./errorHandler":9,"b55mWE":5,"buffer":4}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var bluetoothMap = {
	gattCharacteristicsMapping: {
		battery_level: {
			primaryServices: ['battery_service'],
			includedProperties: ['read', 'notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.battery_level = value.getUint8(0);
				return result;
			}
		},
		blood_pressure_feature: {
			primaryServices: ['blood_pressure'],
			includedProperties: ['read']
		},
		body_composition_feature: {
			primaryServices: ['body_composition'],
			includedProperties: ['read']
		},
		bond_management_feature: {
			primaryServices: ['bond_management_feature'],
			includedProperties: ['read']
		},
		cgm_feature: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		cgm_session_run_time: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		cgm_session_start_time: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read', 'write']
		},
		cgm_status: {
			primaryServices: ['continuous_glucose_monitoring'],
			includedProperties: ['read']
		},
		csc_feature: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint16(0);
				var wheelRevolutionDataSupported = flags & 0x1;
				var crankRevolutionDataSupported = flags & 0x2;
				var multipleSensDataSupported = flags & 0x3;
				var result = {};
				if (wheelRevolutionDataSupported) {
					result.wheel_revolution_data_supported = wheelRevolutionDataSupported ? true : false;
				}
				if (crankRevolutionDataSupported) {
					result.crank_revolution_data_supported = crankRevolutionDataSupported ? true : false;
				}
				if (multipleSensDataSupported) {
					result.multiple_sensors_supported = multipleSensDataSupported ? true : false;
				}
				return result;
			}
		},
		current_time: {
			primaryServices: ['current_time'],
			includedProperties: ['read', 'write', 'notify']
		},
		cycling_power_feature: {
			primaryServices: ['cycling_power'],
			includedProperties: ['read']
		},
		firmware_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		hardware_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		ieee_11073_20601_regulatory_certification_data_list: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		'gap.appearance': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		'gap.device_name': {
			primaryServices: ['generic_access'],
			includedProperties: ['read', 'write'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.device_name = '';
				for (var i = 0; i < value.byteLength; i++) {
					result.device_name += String.fromCharCode(value.getUint8(i));
				}
				return result;
			},
			prepValue: function prepValue(value) {
				var buffer = new ArrayBuffer(value.length);
				var preppedValue = new DataView(buffer);
				value.split('').forEach(function (char, i) {
					preppedValue.setUint8(i, char.charCodeAt(0));
				});
				return preppedValue;
			}
		},
		'gap.peripheral_preferred_connection_parameters': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		'gap.peripheral_privacy_flag': {
			primaryServices: ['generic_access'],
			includedProperties: ['read']
		},
		glucose_feature: {
			primaryServices: ['glucose'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				var flags = value.getUint16(0);
				result.low_battery_detection_supported = flags & 0x1;
				result.sensor_malfunction_detection_supported = flags & 0x2;
				result.sensor_sample_size_supported = flags & 0x4;
				result.sensor_strip_insertion_error_detection_supported = flags & 0x8;
				result.sensor_strip_type_error_detection_supported = flags & 0x10;
				result.sensor_result_highLow_detection_supported = flags & 0x20;
				result.sensor_temperature_highLow_detection_supported = flags & 0x40;
				result.sensor_read_interruption_detection_supported = flags & 0x80;
				result.general_device_fault_supported = flags & 0x100;
				result.time_fault_supported = flags & 0x200;
				result.multiple_bond_supported = flags & 0x400;
				return result;
			}
		},
		http_entity_body: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		glucose_measurement: {
			primaryServices: ['glucose'],
			includedProperties: ['notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint8(0);
				var timeOffset = flags & 0x1;
				var concentrationTypeSampleLoc = flags & 0x2;
				var concentrationUnits = flags & 0x4;
				var statusAnnunciation = flags & 0x8;
				var contextInformation = flags & 0x10;
				var result = {};
				var index = 1;
				if (timeOffset) {
					result.time_offset = value.getInt16(index, /*little-endian=*/true);
					index += 2;
				}
				if (concentrationTypeSampleLoc) {
					if (concentrationUnits) {
						result.glucose_concentraiton_molPerL = value.getInt16(index, /*little-endian=*/true);
						index += 2;
					} else {
						result.glucose_concentraiton_kgPerL = value.getInt16(index, /*little-endian=*/true);
						index += 2;
					}
				}
				return result;
			}
		},
		http_headers: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		https_security: {
			primaryServices: ['http_proxy'],
			includedProperties: ['read', 'write']
		},
		intermediate_temperature: {
			primaryServices: ['health_thermometer'],
			includedProperties: ['read', 'write', 'indicate']
		},
		local_time_information: {
			primaryServices: ['current_time'],
			includedProperties: ['read', 'write']
		},
		manufacturer_name_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		model_number_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		pnp_id: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		protocol_mode: {
			primaryServices: ['human_interface_device'],
			includedProperties: ['read', 'writeWithoutResponse']
		},
		reference_time_information: {
			primaryServices: ['current_time'],
			includedProperties: ['read']
		},
		supported_new_alert_category: {
			primaryServices: ['alert_notification'],
			includedProperties: ['read']
		},
		body_sensor_location: {
			primaryServices: ['heart_rate'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var val = value.getUint8(0);
				var result = {};
				switch (val) {
					case 0:
						result.location = 'Other';
					case 1:
						result.location = 'Chest';
					case 2:
						result.location = 'Wrist';
					case 3:
						result.location = 'Finger';
					case 4:
						result.location = 'Hand';
					case 5:
						result.location = 'Ear Lobe';
					case 6:
						result.location = 'Foot';
					default:
						result.location = 'Unknown';
				}
				return result;
			}
		},
		// heart_rate_control_point
		heart_rate_control_point: {
			primaryServices: ['heart_rate'],
			includedProperties: ['write'],
			prepValue: function prepValue(value) {
				var buffer = new ArrayBuffer(1);
				var writeView = new DataView(buffer);
				writeView.setUint8(0, value);
				return writeView;
			}
		},
		heart_rate_measurement: {
			primaryServices: ['heart_rate'],
			includedProperties: ['notify'],
			/**
   	* Parses the event.target.value object and returns object with readable
   	* key-value pairs for all advertised characteristic values
   	*
   	*	@param {Object} value Takes event.target.value object from startNotifications method
   	*
   	* @return {Object} result Returns readable object with relevant characteristic values
   	*
   	*/
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint8(0);
				var rate16Bits = flags & 0x1;
				var contactDetected = flags & 0x2;
				var contactSensorPresent = flags & 0x4;
				var energyPresent = flags & 0x8;
				var rrIntervalPresent = flags & 0x10;
				var result = {};
				var index = 1;
				if (rate16Bits) {
					result.heartRate = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				} else {
					result.heartRate = value.getUint8(index);
					index += 1;
				}
				if (contactSensorPresent) {
					result.contactDetected = !!contactDetected;
				}
				if (energyPresent) {
					result.energyExpended = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				if (rrIntervalPresent) {
					var rrIntervals = [];
					for (; index + 1 < value.byteLength; index += 2) {
						rrIntervals.push(value.getUint16(index, /*little-endian=*/true));
					}
					result.rrIntervals = rrIntervals;
				}
				return result;
			}
		},
		serial_number_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		software_revision_string: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		supported_unread_alert_category: {
			primaryServices: ['alert_notification'],
			includedProperties: ['read']
		},
		system_id: {
			primaryServices: ['device_information'],
			includedProperties: ['read']
		},
		temperature_type: {
			primaryServices: ['health_thermometer'],
			includedProperties: ['read']
		},
		descriptor_value_changed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['indicate', 'writeAux', 'extProp']
		},
		apparent_wind_direction: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.apparent_wind_direction = value.getUint16(0) * 0.01;
				return result;
			}
		},
		apparent_wind_speed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.apparent_wind_speed = value.getUint16(0) * 0.01;
				return result;
			}
		},
		dew_point: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.dew_point = value.getInt8(0);
				return result;
			}
		},
		elevation: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.elevation = value.getInt8(0) << 16 | value.getInt8(1) << 8 | value.getInt8(2);
				return result;
			}
		},
		gust_factor: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.gust_factor = value.getUint8(0) * 0.1;
				return result;
			}
		},
		heat_index: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.heat_index = value.getInt8(0);
				return result;
			}
		},
		humidity: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.humidity = value.getUint16(0) * 0.01;
				return result;
			}
		},
		irradiance: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.irradiance = value.getUint16(0) * 0.1;
				return result;
			}
		},
		rainfall: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.rainfall = value.getUint16(0) * 0.001;
				return result;
			}
		},
		pressure: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.pressure = value.getUint32(0) * 0.1;
				return result;
			}
		},
		temperature: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.temperature = value.getInt16(0) * 0.01;
				return result;
			}
		},
		true_wind_direction: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.true_wind_direction = value.getUint16(0) * 0.01;
				return result;
			}
		},
		true_wind_speed: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.true_wind_speed = value.getUint16(0) * 0.01;
				return result;
			}
		},
		uv_index: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.uv_index = value.getUint8(0);
				return result;
			}
		},
		wind_chill: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.wind_chill = value.getInt8(0);
				return result;
			}
		},
		barometric_pressure_trend: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var val = value.getUint8(0);
				var result = {};
				switch (val) {
					case 0:
						result.barometric_pressure_trend = 'Unknown';
					case 1:
						result.barometric_pressure_trend = 'Continuously falling';
					case 2:
						result.barometric_pressure_trend = 'Continously rising';
					case 3:
						result.barometric_pressure_trend = 'Falling, then steady';
					case 4:
						result.barometric_pressure_trend = 'Rising, then steady';
					case 5:
						result.barometric_pressure_trend = 'Falling before a lesser rise';
					case 6:
						result.barometric_pressure_trend = 'Falling before a greater rise';
					case 7:
						result.barometric_pressure_trend = 'Rising before a greater fall';
					case 8:
						result.barometric_pressure_trend = 'Rising before a lesser fall';
					case 9:
						result.barometric_pressure_trend = 'Steady';
					default:
						result.barometric_pressure_trend = 'Could not resolve to trend';
				}
				return result;
			}
		},
		magnetic_declination: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};

				result.magnetic_declination = value.getUint16(0) * 0.01;
				return result;
			}
		},
		magnetic_flux_density_2D: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				//FIXME: need to find out if these values are stored at different byte addresses
				//       below assumes that values are stored at successive byte addresses
				result.magnetic_flux_density_x_axis = value.getInt16(0, /*little-endian=*/true) * 0.0000001;
				result.magnetic_flux_density_y_axis = value.getInt16(2, /*little-endian=*/true) * 0.0000001;
				return result;
			}
		},
		magnetic_flux_density_3D: {
			primaryServices: ['environmental_sensing'],
			includedProperties: ['read', 'notify', 'writeAux', 'extProp'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				//FIXME: need to find out if these values are stored at different byte addresses
				//       below assumes that values are stored at successive byte addresses
				result.magnetic_flux_density_x_axis = value.getInt16(0, /*little-endian=*/true) * 0.0000001;
				result.magnetic_flux_density_y_axis = value.getInt16(2, /*little-endian=*/true) * 0.0000001;
				result.magnetic_flux_density_z_axis = value.getInt16(4, /*little-endian=*/true) * 0.0000001;
				return result;
			}
		},
		tx_power_level: {
			primaryServices: ['tx_power'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				result.tx_power_level = value.getInt8(0);
				return result;
			}
		},
		weight_scale_feature: {
			primaryServices: ['weight_scale'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var result = {};
				var flags = value.getInt32(0);
				result.time_stamp_supported = flags & 0x1;
				result.multiple_sensors_supported = flags & 0x2;
				result.BMI_supported = flags & 0x4;
				switch (flags & 0x78 >> 3) {
					case 0:
						result.weight_measurement_resolution = 'Not specified';
					case 1:
						result.weight_measurement_resolution = 'Resolution of 0.5 kg or 1 lb';
					case 2:
						result.weight_measurement_resolution = 'Resolution of 0.2 kg or 0.5 lb';
					case 3:
						result.weight_measurement_resolution = 'Resolution of 0.1 kg or 0.2 lb';
					case 4:
						result.weight_measurement_resolution = 'Resolution of 0.05 kg or 0.1 lb';
					case 5:
						result.weight_measurement_resolution = 'Resolution of 0.02 kg or 0.05 lb';
					case 6:
						result.weight_measurement_resolution = 'Resolution of 0.01 kg or 0.02 lb';
					case 7:
						result.weight_measurement_resolution = 'Resolution of 0.005 kg or 0.01 lb';
					default:
						result.weight_measurement_resolution = 'Could not resolve';
				}
				switch (flags & 0x380 >> 7) {
					case 0:
						result.height_measurement_resolution = 'Not specified';
					case 1:
						result.height_measurement_resolution = 'Resolution of 0.1 meter or 1 inch';
					case 2:
						result.height_measurement_resolution = 'Resolution of 0.005 meter or 0.5 inch';
					case 3:
						result.height_measurement_resolution = 'Resolution of 0.001 meter or 0.1 inch';
					default:
						result.height_measurement_resolution = 'Could not resolve';
				}
				// Remaining flags reserved for future use
				return result;
			}
		},
		csc_measurement: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint8(0);
				var wheelRevolution = flags & 0x1; //integer = truthy, 0 = falsy
				var crankRevolution = flags & 0x2;
				var result = {};
				var index = 1;
				if (wheelRevolution) {
					result.cumulative_wheel_revolutions = value.getUint32(index, /*little-endian=*/true);
					index += 4;
					result.last_wheel_event_time_per_1024s = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				if (crankRevolution) {
					result.cumulative_crank_revolutions = value.getUint16(index, /*little-endian=*/true);
					index += 2;
					result.last_crank_event_time_per_1024s = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				return result;
			}
		},
		sensor_location: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['read'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var val = value.getUint16(0);
				var result = {};
				switch (val) {
					case 0:
						result.location = 'Other';
					case 1:
						result.location = 'Top of show';
					case 2:
						result.location = 'In shoe';
					case 3:
						result.location = 'Hip';
					case 4:
						result.location = 'Front Wheel';
					case 5:
						result.location = 'Left Crank';
					case 6:
						result.location = 'Right Crank';
					case 7:
						result.location = 'Left Pedal';
					case 8:
						result.location = 'Right Pedal';
					case 9:
						result.location = 'Front Hub';
					case 10:
						result.location = 'Rear Dropout';
					case 11:
						result.location = 'Chainstay';
					case 12:
						result.location = 'Rear Wheel';
					case 13:
						result.location = 'Rear Hub';
					case 14:
						result.location = 'Chest';
					case 15:
						result.location = 'Spider';
					case 16:
						result.location = 'Chain Ring';
					default:
						result.location = 'Unknown';
				}
				return result;
			}
		},
		sc_control_point: {
			primaryServices: ['cycling_speed_and_cadence'],
			includedProperties: ['write', 'indicate'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				return result;
			}
		},
		cycling_power_measurement: {
			primaryServices: ['cycling_power'],
			includedProperties: ['notify'],
			parseValue: function parseValue(value) {
				value = value.buffer ? value : new DataView(value);
				var flags = value.getUint16(0);
				var pedal_power_balance_present = flags & 0x1;
				var pedal_power_reference = flags & 0x2;
				var accumulated_torque_present = flags & 0x4;
				var accumulated_torque_source = flags & 0x8;
				var wheel_revolution_data_present = flags & 0x10;
				var crank_revolution_data_present = flags & 0x12;
				var extreme_force_magnitude_present = flags & 0x12;
				var extreme_torque_magnitude_present = flags & 0x12;
				var extreme_angles_present = flags & 0x12;
				var top_dead_spot_angle_present = flags & 0x12;
				var bottom_dead_spot_angle_present = flags & 0x12;
				var accumulated_energy_present = flags & 0x12;
				var offset_compensation_indicator = flags & 0x12;
				var result = {};
				var index = 1;
				//Watts with resolution of 1
				result.instantaneous_power = value.getInt16(index);
				index += 2;
				if (pedal_power_reference) {
					//Percentage with resolution of 1/2
					result.pedal_power_balance = value.getUint8(index);
					index += 1;
				}
				if (accumulated_torque_present) {
					//Percentage with resolution of 1/2
					result.accumulated_torque = value.getUint16(index);
					index += 2;
				}
				if (wheel_revolution_data_present) {
					result.cumulative_wheel_revolutions = value.Uint32(index);
					index += 4;
					result.last_wheel_event_time_per_2048s = value.Uint16(index);
					index += 2;
				}
				if (crank_revolution_data_present) {
					result.cumulative_crank_revolutions = value.getUint16(index, /*little-endian=*/true);
					index += 2;
					result.last_crank_event_time_per_1024s = value.getUint16(index, /*little-endian=*/true);
					index += 2;
				}
				if (extreme_force_magnitude_present) {
					//Newton meters with resolution of 1 TODO: units?
					result.maximum_force_magnitude = value.getInt16(index);
					index += 2;
					result.minimum_force_magnitude = value.getInt16(index);
					index += 2;
				}
				if (extreme_torque_magnitude_present) {
					//Newton meters with resolution of 1 TODO: units?
					result.maximum_torque_magnitude = value.getInt16(index);
					index += 2;
					result.minimum_torque_magnitude = value.getInt16(index);
					index += 2;
				}
				if (extreme_angles_present) {
					//TODO: UINT12.
					//Newton meters with resolution of 1 TODO: units?
					// result.maximum_angle = value.getInt12(index);
					// index += 2;
					// result.minimum_angle = value.getInt12(index);
					// index += 2;
				}
				if (top_dead_spot_angle_present) {
					//Percentage with resolution of 1/2
					result.top_dead_spot_angle = value.getUint16(index);
					index += 2;
				}
				if (bottom_dead_spot_angle_present) {
					//Percentage with resolution of 1/2
					result.bottom_dead_spot_angle = value.getUint16(index);
					index += 2;
				}
				if (accumulated_energy_present) {
					//kilojoules with resolution of 1 TODO: units?
					result.accumulated_energy = value.getUint16(index);
					index += 2;
				}
				return result;
			}
		}
	},
	gattServiceList: ['alert_notification', 'automation_io', 'battery_service', 'blood_pressure', 'body_composition', 'bond_management', 'continuous_glucose_monitoring', 'current_time', 'cycling_power', 'cycling_speed_and_cadence', 'device_information', 'environmental_sensing', 'generic_access', 'generic_attribute', 'glucose', 'health_thermometer', 'heart_rate', 'human_interface_device', 'immediate_alert', 'indoor_positioning', 'internet_protocol_support', 'link_loss', 'location_and_navigation', 'next_dst_change', 'phone_alert_status', 'pulse_oximeter', 'reference_time_update', 'running_speed_and_cadence', 'scan_parameters', 'tx_power', 'user_data', 'weight_scale']
};

module.exports = bluetoothMap;
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/web-bluetooth/dist/npm/bluetoothMap.js","/../../node_modules/web-bluetooth/dist/npm")
},{"b55mWE":5,"buffer":4}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";

/** errorHandler - Consolodates error message configuration and logic
*
* @param {string} errorKey - maps to a detailed error message
* @param {object} nativeError - the native API error object, if present
* @param {} alternate - 
*
*/
function errorHandler(errorKey, nativeError, alternate) {

		var errorMessages = {
				add_characteristic_exists_error: "Characteristic " + alternate + " already exists.",
				characteristic_error: "Characteristic " + alternate + " not found. Add " + alternate + " to device using addCharacteristic or try another characteristic.",
				connect_gatt: "Could not connect to GATT. Device might be out of range. Also check to see if filters are vaild.",
				connect_server: "Could not connect to server on device.",
				connect_service: "Could not find service.",
				disconnect_timeout: "Timed out. Could not disconnect.",
				disconnect_error: "Could not disconnect from device.",
				improper_characteristic_format: alternate + " is not a properly formatted characteristic.",
				improper_properties_format: alternate + " is not a properly formatted properties array.",
				improper_service_format: alternate + " is not a properly formatted service.",
				issue_disconnecting: "Issue disconnecting with device.",
				new_characteristic_missing_params: alternate + " is not a fully supported characteristic. Please provide an associated primary service and at least one property.",
				no_device: "No instance of device found.",
				no_filters: "No filters found on instance of Device. For more information, please visit http://sabertooth.io/#method-newdevice",
				no_read_property: "No read property on characteristic: " + alternate + ".",
				no_write_property: "No write property on this characteristic.",
				not_connected: "Could not disconnect. Device not connected.",
				parsing_not_supported: "Parsing not supported for characterstic: " + alternate + ".",
				read_error: "Cannot read value on the characteristic.",
				_returnCharacteristic_error: "Error accessing characteristic " + alternate + ".",
				start_notifications_error: "Not able to read stream of data from characteristic: " + alternate + ".",
				start_notifications_no_notify: "No notify property found on this characteristic: " + alternate + ".",
				stop_notifications_not_notifying: "Notifications not established for characteristic: " + alternate + " or you have not started notifications.",
				stop_notifications_error: "Issue stopping notifications for characteristic: " + alternate + " or you have not started notifications.",
				user_cancelled: "User cancelled the permission request.",
				uuid_error: "Invalid UUID. For more information on proper formatting of UUIDs, visit https://webbluetoothcg.github.io/web-bluetooth/#uuids",
				write_error: "Could not change value of characteristic: " + alternate + ".",
				write_permissions: alternate + " characteristic does not have a write property."
		};

		throw new Error(errorMessages[errorKey]);
		return false;
}

module.exports = errorHandler;
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/web-bluetooth/dist/npm/errorHandler.js","/../../node_modules/web-bluetooth/dist/npm")
},{"b55mWE":5,"buffer":4}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = require('./dist/npm/BluetoothDevice');

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/web-bluetooth/npm.js","/../../node_modules/web-bluetooth")
},{"./dist/npm/BluetoothDevice":7,"b55mWE":5,"buffer":4}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvYXBwL3NjcmlwdHMvYXBwL3N0YXRlLmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL2FwcC9zY3JpcHRzL2Zha2VfYjk3MzVlNjQuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbS9CbHVldG9vdGhEZXZpY2UuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG0vYmx1ZXRvb3RoTWFwLmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtL2Vycm9ySGFuZGxlci5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9ucG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuXG5jbGFzcyBTdGF0ZU1hbmFnZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMuc3RhdGUgPSAnaW5pdCc7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N0YXRlLScgKyB0aGlzLnN0YXRlKTtcbiAgfVxuXG4gIGNoYW5nZShzdGF0ZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzdGF0ZS0nICsgdGhpcy5zdGF0ZSk7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzdGF0ZS0nICsgdGhpcy5zdGF0ZSk7XG4gIH1cbn1cblxuY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1zdGF0ZS1tYW5hZ2VyJyk7XG5jb25zdCBzdGF0ZU1hbmFnZXIgPSBuZXcgU3RhdGVNYW5hZ2VyKGVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRlTWFuYWdlcjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9hcHAvc3RhdGUuanNcIixcIi9hcHBcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5jb25zdCBCbHVldG9vdGhEZXZpY2UgPSByZXF1aXJlKCd3ZWItYmx1ZXRvb3RoJyk7XG5jb25zdCBzdGF0ZU1hbmFnZXIgPSByZXF1aXJlKCcuL2FwcC9zdGF0ZS5qcycpO1xuXG5jb25zdCBmaWx0ZXIgPSB7XG4gIG5hbWU6ICdlY2hvJyxcbiAgc2VydmljZTogWydlYzAwJ11cbn07XG5sZXQgYmx1ZTtcblxuY29uc3QgY29ubmVjdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jb25uZWN0Jyk7XG5jb25zdCBkaXNjb25uZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWRpc2Nvbm5lY3QnKTtcblxuY29uc3Qgb2tCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtb2snKTtcblxuY29ubmVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIHN0YXRlTWFuYWdlci5jaGFuZ2UoJ2Nvbm5lY3RpbmcnKTtcblxuICBibHVlID0gbmV3IEJsdWV0b290aERldmljZShmaWx0ZXIpO1xuICBibHVlLmNvbm5lY3QoKVxuICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkZXZpY2UpO1xuICAgICAgc3RhdGVNYW5hZ2VyLmNoYW5nZSgnY29ubmVjdGVkJyk7XG4gICAgICBjb25uZWN0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgc3RhdGVNYW5hZ2VyLmNoYW5nZSgnaW5pdCcpO1xuICAgICAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xufSk7XG5cbmRpc2Nvbm5lY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGlmIChibHVlLmRpc2Nvbm5lY3QoKSkge1xuICAgIHN0YXRlTWFuYWdlci5jaGFuZ2UoJ2luaXQnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnZXJyb3Igd2hpbGUgZGlzY29ubmVjdCcpO1xuICB9XG59KTtcblxub2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMScpO1xuICBibHVlLndyaXRlVmFsdWUoJ2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYxJywgJ29rJylcbiAgICAudGhlbih3cml0ZVN1Y2Nlc3MgPT4ge1xuICAgICAgY29uc29sZS5sb2cod3JpdGVTdWNjZXNzKTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG59KTtcblxuLy8gZXhhbXBsZURldmljZS53cml0ZVZhbHVlKCdnYXAuZGV2aWNlX25hbWUnLCAnbXlGaXRiaXQnIClcbi8vICAgICAgIC50aGVuKHdyaXRlU3VjY2VzcyA9PiB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKHdyaXRlU3VjY2Vzcyk7XG4vLyAgICAgICB9KTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2I5NzM1ZTY0LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIGJsdWV0b290aCA9IHJlcXVpcmUoJy4vYmx1ZXRvb3RoTWFwJyk7XG52YXIgZXJyb3JIYW5kbGVyID0gcmVxdWlyZSgnLi9lcnJvckhhbmRsZXInKTtcblxuLyoqIEJsdWV0b290aERldmljZSAtXG4gICpcbiAgKiBAbWV0aG9kIGNvbm5lY3QgLSBFc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgZGV2aWNlXG4gICogQG1ldGhvZCBjb25uZWN0ZWQgLSBjaGVja3MgYXBpRGV2aWNlIHRvIHNlZSB3aGV0aGVyIGRldmljZSBpcyBjb25uZWN0ZWRcbiAgKiBAbWV0aG9kIGRpc2Nvbm5lY3QgLSB0ZXJtaW5hdGVzIHRoZSBjb25uZWN0aW9uIHdpdGggdGhlIGRldmljZSBhbmQgcGF1c2VzIGFsbCBkYXRhIHN0cmVhbSBzdWJzY3JpcHRpb25zXG4gICogQG1ldGhvZCBnZXRWYWx1ZSAtIHJlYWRzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBjaGFyYWN0ZXJpc3RpY1xuICAqIEBtZXRob2Qgd3JpdGVWYWx1ZSAtIHdyaXRlcyBkYXRhIHRvIGEgc3BlY2lmaWVkIGNoYXJhY3RlcmlzdGljIG9mIHRoZSBkZXZpY2VcbiAgKiBAbWV0aG9kIHN0YXJ0Tm90aWZpY2F0aW9ucyAtIGF0dGVtcHRzIHRvIHN0YXJ0IG5vdGlmaWNhdGlvbnMgZm9yIGNoYW5nZXMgdG8gZGV2aWNlIHZhbHVlcyBhbmQgYXR0YWNoZXMgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVhY2ggZGF0YSB0cmFuc21pc3Npb25cbiAgKiBAbWV0aG9kIHN0b3BOb3RpZmljYXRpb25zIC0gYXR0ZW1wdHMgdG8gc3RvcCBwcmV2aW91c2x5IHN0YXJ0ZWQgbm90aWZpY2F0aW9ucyBmb3IgYSBwcm92aWRlZCBjaGFyYWN0ZXJpc3RpY1xuICAqIEBtZXRob2QgYWRkQ2hhcmFjdGVyaXN0aWMgLSBhZGRzIGEgbmV3IGNoYXJhY3RlcmlzdGljIG9iamVjdCB0byBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdcbiAgKiBAbWV0aG9kIF9yZXR1cm5DaGFyYWN0ZXJpc3RpYyAtIF9yZXR1cm5DaGFyYWN0ZXJpc3RpYyAtIHJldHVybnMgdGhlIHZhbHVlIG9mIGEgY2FjaGVkIG9yIHJlc29sdmVkIGNoYXJhY3RlcmlzdGljIG9yIHJlc29sdmVkIGNoYXJhY3RlcmlzdGljXG4gICpcbiAgKiBAcGFyYW0ge29iamVjdH0gZmlsdGVycyAtIGNvbGxlY3Rpb24gb2YgZmlsdGVycyBmb3IgZGV2aWNlIHNlbGVjdGluLiBBbGwgZmlsdGVycyBhcmUgb3B0aW9uYWwsIGJ1dCBhdCBsZWFzdCAxIGlzIHJlcXVpcmVkLlxuICAqICAgICAgICAgIC5uYW1lIHtzdHJpbmd9XG4gICogICAgICAgICAgLm5hbWVQcmVmaXgge3N0cmluZ31cbiAgKiAgICAgICAgICAudXVpZCB7c3RyaW5nfVxuICAqICAgICAgICAgIC5zZXJ2aWNlcyB7YXJyYXl9XG4gICogICAgICAgICAgLm9wdGlvbmFsU2VydmljZXMge2FycmF5fSAtIGRlZmF1bHRzIHRvIGFsbCBhdmFpbGFibGUgc2VydmljZXMsIHVzZSBhbiBlbXB0eSBhcnJheSB0byBnZXQgbm8gb3B0aW9uYWwgc2VydmljZXNcbiAgKlxuICAqIEByZXR1cm4ge29iamVjdH0gUmV0dXJucyBhIG5ldyBpbnN0YW5jZSBvZiBCbHVldG9vdGhEZXZpY2VcbiAgKlxuICAqL1xuXG52YXIgQmx1ZXRvb3RoRGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBCbHVldG9vdGhEZXZpY2UocmVxdWVzdFBhcmFtcykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCbHVldG9vdGhEZXZpY2UpO1xuXG4gICAgdGhpcy5yZXF1ZXN0UGFyYW1zID0gcmVxdWVzdFBhcmFtcztcbiAgICB0aGlzLmFwaURldmljZSA9IG51bGw7XG4gICAgdGhpcy5hcGlTZXJ2ZXIgPSBudWxsO1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhCbHVldG9vdGhEZXZpY2UsIFt7XG4gICAga2V5OiAnY29ubmVjdGVkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdGVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXBpRGV2aWNlID8gdGhpcy5hcGlEZXZpY2UuZ2F0dC5jb25uZWN0ZWQgOiBlcnJvckhhbmRsZXIoJ25vX2RldmljZScpO1xuICAgIH1cblxuICAgIC8qKiBjb25uZWN0IC0gZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHdpdGggdGhlIGRldmljZVxuICAgICAgKiAgIFxuICAgICAgKiBOT1RFOiBUaGlzIG1ldGhvZCBtdXN0IGJlIHRyaWdnZXJlZCBieSBhIHVzZXIgZ2VzdHVyZSB0byBzYXRpc2Z5IHRoZSBuYXRpdmUgQVBJJ3MgcGVybWlzc2lvbnNcbiAgICAgICpcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSAtIG5hdGl2ZSBicm93c2VyIEFQSSBkZXZpY2Ugc2VydmVyIG9iamVjdFxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnY29ubmVjdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZmlsdGVycyA9IHRoaXMucmVxdWVzdFBhcmFtcztcbiAgICAgIHZhciByZXF1ZXN0UGFyYW1zID0geyBmaWx0ZXJzOiBbXSB9O1xuICAgICAgdmFyIHV1aWRSZWdleCA9IC9eWzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl0vO1xuXG4gICAgICBpZiAoIU9iamVjdC5rZXlzKGZpbHRlcnMpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdub19maWx0ZXJzJyk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVycy5uYW1lKSByZXF1ZXN0UGFyYW1zLmZpbHRlcnMucHVzaCh7IG5hbWU6IGZpbHRlcnMubmFtZSB9KTtcbiAgICAgIGlmIChmaWx0ZXJzLm5hbWVQcmVmaXgpIHJlcXVlc3RQYXJhbXMuZmlsdGVycy5wdXNoKHsgbmFtZVByZWZpeDogZmlsdGVycy5uYW1lUHJlZml4IH0pO1xuICAgICAgaWYgKGZpbHRlcnMudXVpZCkge1xuICAgICAgICBpZiAoIWZpbHRlcnMudXVpZC5tYXRjaCh1dWlkUmVnZXgpKSB7XG4gICAgICAgICAgZXJyb3JIYW5kbGVyKCd1dWlkX2Vycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVxdWVzdFBhcmFtcy5maWx0ZXJzLnB1c2goeyB1dWlkOiBmaWx0ZXJzLnV1aWQgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzLnNlcnZpY2VzKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHNlcnZpY2VzID0gW107XG4gICAgICAgICAgZmlsdGVycy5zZXJ2aWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XG4gICAgICAgICAgICBpZiAoIWJsdWV0b290aC5nYXR0U2VydmljZUxpc3QuaW5jbHVkZXMoc2VydmljZSkpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKHNlcnZpY2UgKyAnIGlzIG5vdCBhIHZhbGlkIHNlcnZpY2UuIFBsZWFzZSBjaGVjayB0aGUgc2VydmljZSBuYW1lLicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VydmljZXMucHVzaChzZXJ2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXF1ZXN0UGFyYW1zLmZpbHRlcnMucHVzaCh7IHNlcnZpY2VzOiBzZXJ2aWNlcyB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzLm9wdGlvbmFsX3NlcnZpY2VzKSB7XG4gICAgICAgIGZpbHRlcnMub3B0aW9uYWxfc2VydmljZXMuZm9yRWFjaChmdW5jdGlvbiAoc2VydmljZSkge1xuICAgICAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRTZXJ2aWNlTGlzdC5pbmNsdWRlcyhzZXJ2aWNlKSkgYmx1ZXRvb3RoLmdhdHRTZXJ2aWNlTGlzdC5wdXNoKHNlcnZpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RQYXJhbXMub3B0aW9uYWxTZXJ2aWNlcyA9IGJsdWV0b290aC5nYXR0U2VydmljZUxpc3Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UocmVxdWVzdFBhcmFtcykudGhlbihmdW5jdGlvbiAoZGV2aWNlKSB7XG4gICAgICAgIF90aGlzLmFwaURldmljZSA9IGRldmljZTtcbiAgICAgICAgcmV0dXJuIGRldmljZS5nYXR0LmNvbm5lY3QoKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHNlcnZlcikge1xuICAgICAgICBfdGhpcy5hcGlTZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICAgIHJldHVybiBzZXJ2ZXI7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ3VzZXJfY2FuY2VsbGVkJywgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiBkaXNjb25uZWN0IC0gdGVybWluYXRlcyB0aGUgY29ubmVjdGlvbiB3aXRoIHRoZSBkZXZpY2UgYW5kIHBhdXNlcyBhbGwgZGF0YSBzdHJlYW0gc3Vic2NyaXB0aW9uc1xuICAgICAgKiBAcmV0dXJuIHtib29sZWFufSAtIHN1Y2Nlc3NcbiAgICAgICpcbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2Rpc2Nvbm5lY3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICAgICAgdGhpcy5hcGlTZXJ2ZXIuY29ubmVjdGVkID8gdGhpcy5hcGlTZXJ2ZXIuZGlzY29ubmVjdCgpIDogZXJyb3JIYW5kbGVyKCdub3RfY29ubmVjdGVkJyk7XG4gICAgICByZXR1cm4gdGhpcy5hcGlTZXJ2ZXIuY29ubmVjdGVkID8gZXJyb3JIYW5kbGVyKCdpc3N1ZV9kaXNjb25uZWN0aW5nJykgOiB0cnVlO1xuICAgIH1cblxuICAgIC8qKiBnZXRWYWx1ZSAtIHJlYWRzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBjaGFyYWN0ZXJpc3RpY1xuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyaXN0aWNfbmFtZSAtIEdBVFQgY2hhcmFjdGVyaXN0aWMgIG5hbWVcbiAgICAgICogQHJldHVybiB7cHJvbWlzZX0gLSAgcmVzb2x2ZXMgd2l0aCBhbiBvYmplY3QgdGhhdCBpbmNsdWRlcyBrZXktdmFsdWUgcGFpcnMgZm9yIGVhY2ggb2YgdGhlIHByb3BlcnRpZXNcbiAgICAgICogICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NmdWxseSByZWFkIGFuZCBwYXJzZWQgZnJvbSB0aGUgZGV2aWNlLCBhcyB3ZWxsIGFzIHRoZVxuICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgcmF3IHZhbHVlIG9iamVjdCByZXR1cm5lZCBieSBhIG5hdGl2ZSByZWFkVmFsdWUgcmVxdWVzdCB0byB0aGVcbiAgICAgICogICAgICAgICAgICAgICAgICAgICAgIGRldmljZSBjaGFyYWN0ZXJpc3RpYy5cbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2dldFZhbHVlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoY2hhcmFjdGVyaXN0aWNfbmFtZSkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2NoYXJhY3RlcmlzdGljX2Vycm9yJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFyYWN0ZXJpc3RpY09iaiA9IGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXTtcblxuICAgICAgaWYgKCFjaGFyYWN0ZXJpc3RpY09iai5pbmNsdWRlZFByb3BlcnRpZXMuaW5jbHVkZXMoJ3JlYWQnKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRpbmcgdG8gYWNjZXNzIHJlYWQgcHJvcGVydHkgb2YgJyArIGNoYXJhY3RlcmlzdGljX25hbWUgKyAnLFxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgbm90IGEgaW5jbHVkZWQgYXMgYSBzdXBwb3J0ZWQgcHJvcGVydHkgb2YgdGhlXFxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy4gQXR0ZW1wdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBvYmplY3QgaW5jbHVkaW5nXFxuICAgICAgICAgICAgICAgICAgICBvbmx5IGEgcmF3VmFsdWUgcHJvcGVydHkgd2l0aCB0aGUgbmF0aXZlIEFQSSByZXR1cm5cXG4gICAgICAgICAgICAgICAgICAgIGZvciBhbiBhdHRlbXB0IHRvIHJlYWRWYWx1ZSgpIG9mICcgKyBjaGFyYWN0ZXJpc3RpY19uYW1lICsgJy4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoX3RoaXMyLl9yZXR1cm5DaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWMucmVhZFZhbHVlKCk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgcmV0dXJuT2JqID0gY2hhcmFjdGVyaXN0aWNPYmoucGFyc2VWYWx1ZSA/IGNoYXJhY3RlcmlzdGljT2JqLnBhcnNlVmFsdWUodmFsdWUpIDoge307XG4gICAgICAgIHJldHVybk9iai5yYXdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gcmV0dXJuT2JqO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdyZWFkX2Vycm9yJywgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiB3cml0ZVZhbHVlIC0gd3JpdGVzIGRhdGEgdG8gYSBzcGVjaWZpZWQgY2hhcmFjdGVyaXN0aWMgb2YgdGhlIGRldmljZVxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyaXN0aWNfbmFtZSAtIG5hbWUgb2YgdGhlIEdBVFQgY2hhcmFjdGVyaXN0aWMgXG4gICAgICAqICAgICBodHRwczovL3d3dy5ibHVldG9vdGguY29tL3NwZWNpZmljYXRpb25zL2Fzc2lnbmVkLW51bWJlcnMvZ2VuZXJpYy1hdHRyaWJ1dGUtcHJvZmlsZVxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHZhbHVlIC0gdmFsdWUgdG8gd3JpdGUgdG8gdGhlIHJlcXVlc3RlZCBkZXZpY2UgY2hhcmFjdGVyaXN0aWNcbiAgICAgICpcbiAgICAgICpcbiAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBSZXN1bHQgb2YgYXR0ZW1wdCB0byB3cml0ZSBjaGFyYWN0ZXJpc3RpYyB3aGVyZSB0cnVlID09PSBzdWNjZXNzZnVsbHkgd3JpdHRlblxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnd3JpdGVWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdyaXRlVmFsdWUoY2hhcmFjdGVyaXN0aWNfbmFtZSwgdmFsdWUpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICBpZiAoIWJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdjaGFyYWN0ZXJpc3RpY19lcnJvcicsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhcmFjdGVyaXN0aWNPYmogPSBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV07XG5cbiAgICAgIGlmICghY2hhcmFjdGVyaXN0aWNPYmouaW5jbHVkZWRQcm9wZXJ0aWVzLmluY2x1ZGVzKCd3cml0ZScpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQXR0ZW1wdGluZyB0byBhY2Nlc3Mgd3JpdGUgcHJvcGVydHkgb2YgJyArIGNoYXJhY3RlcmlzdGljX25hbWUgKyAnLFxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgbm90IGEgaW5jbHVkZWQgYXMgYSBzdXBwb3J0ZWQgcHJvcGVydHkgb2YgdGhlXFxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy4gQXR0ZW1wdCB3aWxsIHJlc29sdmUgd2l0aCBuYXRpdmUgQVBJIHJldHVyblxcbiAgICAgICAgICAgICAgICAgICAgZm9yIGFuIGF0dGVtcHQgdG8gd3JpdGVWYWx1ZSgnICsgdmFsdWUgKyAnKSB0byAnICsgY2hhcmFjdGVyaXN0aWNfbmFtZSArICcuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKF90aGlzMy5fcmV0dXJuQ2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSkpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoY2hhcmFjdGVyaXN0aWNPYmoucHJlcFZhbHVlID8gY2hhcmFjdGVyaXN0aWNPYmoucHJlcFZhbHVlKHZhbHVlKSA6IHZhbHVlKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNoYW5nZWRDaGFyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCd3cml0ZV9lcnJvcicsIGVyciwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogc3RhcnROb3RpZmljYXRpb25zIC0gYXR0ZW1wdHMgdG8gc3RhcnQgbm90aWZpY2F0aW9ucyBmb3IgY2hhbmdlcyB0byBkZXZpY2UgdmFsdWVzIGFuZCBhdHRhY2hlcyBhbiBldmVudCBsaXN0ZW5lciBmb3IgZWFjaCBkYXRhIHRyYW5zbWlzc2lvblxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyaXN0aWNfbmFtZSAtIEdBVFQgY2hhcmFjdGVyaXN0aWMgbmFtZVxuICAgICAgKiBAcGFyYW0ge2NhbGxiYWNrfSB0cmFuc21pc3Npb25DYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZXZlbnQgd2hpbGUgbm90aWZpY2F0aW9ucyBhcmUgYWN0aXZlXG4gICAgICAqXG4gICAgICAqIEByZXR1cm5cbiAgICAgICpcbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3N0YXJ0Tm90aWZpY2F0aW9ucycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0Tm90aWZpY2F0aW9ucyhjaGFyYWN0ZXJpc3RpY19uYW1lLCB0cmFuc21pc3Npb25DYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2NoYXJhY3RlcmlzdGljX2Vycm9yJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFyYWN0ZXJpc3RpY09iaiA9IGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXTtcbiAgICAgIHZhciBwcmltYXJ5X3NlcnZpY2VfbmFtZSA9IGNoYXJhY3RlcmlzdGljT2JqLnByaW1hcnlTZXJ2aWNlc1swXTtcblxuICAgICAgaWYgKCFjaGFyYWN0ZXJpc3RpY09iai5pbmNsdWRlZFByb3BlcnRpZXMuaW5jbHVkZXMoJ25vdGlmeScpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQXR0ZW1wdGluZyB0byBhY2Nlc3Mgbm90aWZ5IHByb3BlcnR5IG9mICcgKyBjaGFyYWN0ZXJpc3RpY19uYW1lICsgJyxcXG4gICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIG5vdCBhIGluY2x1ZGVkIGFzIGEgc3VwcG9ydGVkIHByb3BlcnR5IG9mIHRoZVxcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMuIEF0dGVtcHQgd2lsbCByZXNvbHZlIHdpdGggYW4gb2JqZWN0IGluY2x1ZGluZ1xcbiAgICAgICAgICAgICAgICAgICAgb25seSBhIHJhd1ZhbHVlIHByb3BlcnR5IHdpdGggdGhlIG5hdGl2ZSBBUEkgcmV0dXJuXFxuICAgICAgICAgICAgICAgICAgICBmb3IgYW4gYXR0ZW1wdCB0byBzdGFydE5vdGlmaWNhdGlvbnMoKSBmb3IgJyArIGNoYXJhY3RlcmlzdGljX25hbWUgKyAnLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShfdGhpczQuX3JldHVybkNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgIGNoYXJhY3RlcmlzdGljLnN0YXJ0Tm90aWZpY2F0aW9ucygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzNC5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0ubm90aWZ5aW5nID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWMuYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBldmVudE9iaiA9IGNoYXJhY3RlcmlzdGljT2JqLnBhcnNlVmFsdWUgPyBjaGFyYWN0ZXJpc3RpY09iai5wYXJzZVZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSkgOiB7fTtcbiAgICAgICAgICAgIGV2ZW50T2JqLnJhd1ZhbHVlID0gZXZlbnQ7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNtaXNzaW9uQ2FsbGJhY2soZXZlbnRPYmopO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignc3RhcnRfbm90aWZpY2F0aW9uc19lcnJvcicsIGVyciwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogc3RvcE5vdGlmaWNhdGlvbnMgLSBhdHRlbXB0cyB0byBzdG9wIHByZXZpb3VzbHkgc3RhcnRlZCBub3RpZmljYXRpb25zIGZvciBhIHByb3ZpZGVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJpc3RpY19uYW1lIC0gR0FUVCBjaGFyYWN0ZXJpc3RpYyBuYW1lXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHN1Y2Nlc3NcbiAgICAgICpcbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3N0b3BOb3RpZmljYXRpb25zJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcE5vdGlmaWNhdGlvbnMoY2hhcmFjdGVyaXN0aWNfbmFtZSkge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2NoYXJhY3RlcmlzdGljX2Vycm9yJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFyYWN0ZXJpc3RpY09iaiA9IGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXTtcbiAgICAgIHZhciBwcmltYXJ5X3NlcnZpY2VfbmFtZSA9IGNoYXJhY3RlcmlzdGljT2JqLnByaW1hcnlTZXJ2aWNlc1swXTtcblxuICAgICAgaWYgKHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdLm5vdGlmeWluZykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKF90aGlzNS5fcmV0dXJuQ2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSkpO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICAgIGNoYXJhY3RlcmlzdGljLnN0b3BOb3RpZmljYXRpb25zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczUuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdLm5vdGlmeWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdzdG9wX25vdGlmaWNhdGlvbnNfZXJyb3InLCBlcnIsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ3N0b3Bfbm90aWZpY2F0aW9uc19ub3Rfbm90aWZ5aW5nJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICAqIGFkZENoYXJhY3RlcmlzdGljIC0gYWRkcyBhIG5ldyBjaGFyYWN0ZXJpc3RpYyBvYmplY3QgdG8gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJpc3RpY19uYW1lIC0gR0FUVCBjaGFyYWN0ZXJpc3RpYyBuYW1lIG9yIG90aGVyIGNoYXJhY3RlcmlzdGljXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcmltYXJ5X3NlcnZpY2VfbmFtZSAtIEdBVFQgcHJpbWFyeSBzZXJ2aWNlIG5hbWUgb3Igb3RoZXIgcGFyZW50IHNlcnZpY2Ugb2YgY2hhcmFjdGVyaXN0aWNcbiAgICAgICogQHBhcmFtIHthcnJheX0gcHJvcGVydGllc0FyciAtIEFycmF5IG9mIEdBVFQgcHJvcGVydGllcyBhcyBTdHJpbmdzXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gUmVzdWx0IG9mIGF0dGVtcHQgdG8gYWRkIGNoYXJhY3RlcmlzdGljIHdoZXJlIHRydWUgPT09IHN1Y2Nlc3NmdWxseSBhZGRlZFxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnYWRkQ2hhcmFjdGVyaXN0aWMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lLCBwcmltYXJ5X3NlcnZpY2VfbmFtZSwgcHJvcGVydGllc0Fycikge1xuICAgICAgaWYgKGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdhZGRfY2hhcmFjdGVyaXN0aWNfZXhpc3RzX2Vycm9yJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghY2hhcmFjdGVyaXN0aWNfbmFtZSB8fCBjaGFyYWN0ZXJpc3RpY19uYW1lLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHwgIWNoYXJhY3RlcmlzdGljX25hbWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2ltcHJvcGVyX2NoYXJhY3RlcmlzdGljX2Zvcm1hdCcsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICBpZiAoIXByaW1hcnlfc2VydmljZV9uYW1lIHx8ICFwcm9wZXJ0aWVzQXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignbmV3X2NoYXJhY3RlcmlzdGljX21pc3NpbmdfcGFyYW1zJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW1hcnlfc2VydmljZV9uYW1lLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHwgIXByaW1hcnlfc2VydmljZV9uYW1lLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2ltcHJvcGVyX3NlcnZpY2VfZm9ybWF0JywgbnVsbCwgcHJpbWFyeV9zZXJ2aWNlX25hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzQXJyLmNvbnN0cnVjdG9yICE9PSBBcnJheSB8fCAhcHJvcGVydGllc0Fyci5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdpbXByb3Blcl9wcm9wZXJ0aWVzX2Zvcm1hdCcsIG51bGwsIHByb3BlcnRpZXNBcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS53YXJuKGNoYXJhY3RlcmlzdGljX25hbWUgKyAnIGlzIG5vdCB5ZXQgZnVsbHkgc3VwcG9ydGVkLicpO1xuXG4gICAgICAgIGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSA9IHtcbiAgICAgICAgICBwcmltYXJ5U2VydmljZXM6IFtwcmltYXJ5X3NlcnZpY2VfbmFtZV0sXG4gICAgICAgICAgaW5jbHVkZWRQcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzQXJyXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICAqIF9yZXR1cm5DaGFyYWN0ZXJpc3RpYyAtIHJldHVybnMgdGhlIHZhbHVlIG9mIGEgY2FjaGVkIG9yIHJlc29sdmVkIGNoYXJhY3RlcmlzdGljIG9yIHJlc29sdmVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJpc3RpY19uYW1lIC0gR0FUVCBjaGFyYWN0ZXJpc3RpYyBuYW1lXG4gICAgICAqIEByZXR1cm4ge29iamVjdHxmYWxzZX0gLSB0aGUgY2hhcmFjdGVyaXN0aWMgb2JqZWN0LCBpZiBzdWNjZXNzZnVsbHkgb2J0YWluZWRcbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ19yZXR1cm5DaGFyYWN0ZXJpc3RpYycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9yZXR1cm5DaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgaWYgKCFibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignY2hhcmFjdGVyaXN0aWNfZXJyb3InLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYXJhY3RlcmlzdGljT2JqID0gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdO1xuICAgICAgdmFyIHByaW1hcnlfc2VydmljZV9uYW1lID0gY2hhcmFjdGVyaXN0aWNPYmoucHJpbWFyeVNlcnZpY2VzWzBdO1xuXG4gICAgICBpZiAodGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV0gJiYgdGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0gJiYgdGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0uY2FjaGVkQ2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdLmNhY2hlZENoYXJhY3RlcmlzdGljO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXSAmJiB0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXS5jYWNoZWRTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdLmNhY2hlZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSkudGhlbihmdW5jdGlvbiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgICBfdGhpczYuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdID0geyBjYWNoZWRDaGFyYWN0ZXJpc3RpYzogY2hhcmFjdGVyaXN0aWMgfTtcbiAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWM7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdfcmV0dXJuQ2hhcmFjdGVyaXN0aWNfZXJyb3InLCBlcnIsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaVNlcnZlci5nZXRQcmltYXJ5U2VydmljZShwcmltYXJ5X3NlcnZpY2VfbmFtZSkudGhlbihmdW5jdGlvbiAoc2VydmljZSkge1xuICAgICAgICAgIF90aGlzNi5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV0gPSB7ICdjYWNoZWRTZXJ2aWNlJzogc2VydmljZSB9O1xuICAgICAgICAgIHJldHVybiBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICAgIF90aGlzNi5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0gPSB7IGNhY2hlZENoYXJhY3RlcmlzdGljOiBjaGFyYWN0ZXJpc3RpYyB9O1xuICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpYztcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ19yZXR1cm5DaGFyYWN0ZXJpc3RpY19lcnJvcicsIGVyciwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBCbHVldG9vdGhEZXZpY2U7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmx1ZXRvb3RoRGV2aWNlO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbS9CbHVldG9vdGhEZXZpY2UuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGJsdWV0b290aE1hcCA9IHtcblx0Z2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmc6IHtcblx0XHRiYXR0ZXJ5X2xldmVsOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnYmF0dGVyeV9zZXJ2aWNlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmJhdHRlcnlfbGV2ZWwgPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJsb29kX3ByZXNzdXJlX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydibG9vZF9wcmVzc3VyZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Ym9keV9jb21wb3NpdGlvbl9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnYm9keV9jb21wb3NpdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Ym9uZF9tYW5hZ2VtZW50X2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydib25kX21hbmFnZW1lbnRfZmVhdHVyZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Y2dtX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjb250aW51b3VzX2dsdWNvc2VfbW9uaXRvcmluZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Y2dtX3Nlc3Npb25fcnVuX3RpbWU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjb250aW51b3VzX2dsdWNvc2VfbW9uaXRvcmluZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Y2dtX3Nlc3Npb25fc3RhcnRfdGltZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2NvbnRpbnVvdXNfZ2x1Y29zZV9tb25pdG9yaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZSddXG5cdFx0fSxcblx0XHRjZ21fc3RhdHVzOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY29udGludW91c19nbHVjb3NlX21vbml0b3JpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGNzY19mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3ljbGluZ19zcGVlZF9hbmRfY2FkZW5jZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldFVpbnQxNigwKTtcblx0XHRcdFx0dmFyIHdoZWVsUmV2b2x1dGlvbkRhdGFTdXBwb3J0ZWQgPSBmbGFncyAmIDB4MTtcblx0XHRcdFx0dmFyIGNyYW5rUmV2b2x1dGlvbkRhdGFTdXBwb3J0ZWQgPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0dmFyIG11bHRpcGxlU2Vuc0RhdGFTdXBwb3J0ZWQgPSBmbGFncyAmIDB4Mztcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRpZiAod2hlZWxSZXZvbHV0aW9uRGF0YVN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdHJlc3VsdC53aGVlbF9yZXZvbHV0aW9uX2RhdGFfc3VwcG9ydGVkID0gd2hlZWxSZXZvbHV0aW9uRGF0YVN1cHBvcnRlZCA/IHRydWUgOiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY3JhbmtSZXZvbHV0aW9uRGF0YVN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdHJlc3VsdC5jcmFua19yZXZvbHV0aW9uX2RhdGFfc3VwcG9ydGVkID0gY3JhbmtSZXZvbHV0aW9uRGF0YVN1cHBvcnRlZCA/IHRydWUgOiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobXVsdGlwbGVTZW5zRGF0YVN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdHJlc3VsdC5tdWx0aXBsZV9zZW5zb3JzX3N1cHBvcnRlZCA9IG11bHRpcGxlU2Vuc0RhdGFTdXBwb3J0ZWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGN1cnJlbnRfdGltZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N1cnJlbnRfdGltZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnLCAnbm90aWZ5J11cblx0XHR9LFxuXHRcdGN5Y2xpbmdfcG93ZXJfZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N5Y2xpbmdfcG93ZXInXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGZpcm13YXJlX3JldmlzaW9uX3N0cmluZzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0aGFyZHdhcmVfcmV2aXNpb25fc3RyaW5nOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRpZWVlXzExMDczXzIwNjAxX3JlZ3VsYXRvcnlfY2VydGlmaWNhdGlvbl9kYXRhX2xpc3Q6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdCdnYXAuYXBwZWFyYW5jZSc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydnZW5lcmljX2FjY2VzcyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0J2dhcC5kZXZpY2VfbmFtZSc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydnZW5lcmljX2FjY2VzcyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmRldmljZV9uYW1lID0gJyc7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUuYnl0ZUxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0cmVzdWx0LmRldmljZV9uYW1lICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodmFsdWUuZ2V0VWludDgoaSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9LFxuXHRcdFx0cHJlcFZhbHVlOiBmdW5jdGlvbiBwcmVwVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih2YWx1ZS5sZW5ndGgpO1xuXHRcdFx0XHR2YXIgcHJlcHBlZFZhbHVlID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0XHRcdHZhbHVlLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGFyLCBpKSB7XG5cdFx0XHRcdFx0cHJlcHBlZFZhbHVlLnNldFVpbnQ4KGksIGNoYXIuY2hhckNvZGVBdCgwKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gcHJlcHBlZFZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J2dhcC5wZXJpcGhlcmFsX3ByZWZlcnJlZF9jb25uZWN0aW9uX3BhcmFtZXRlcnMnOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZ2VuZXJpY19hY2Nlc3MnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdCdnYXAucGVyaXBoZXJhbF9wcml2YWN5X2ZsYWcnOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZ2VuZXJpY19hY2Nlc3MnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGdsdWNvc2VfZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2dsdWNvc2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldFVpbnQxNigwKTtcblx0XHRcdFx0cmVzdWx0Lmxvd19iYXR0ZXJ5X2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4MTtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl9tYWxmdW5jdGlvbl9kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3Jfc2FtcGxlX3NpemVfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDQ7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3Jfc3RyaXBfaW5zZXJ0aW9uX2Vycm9yX2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4ODtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl9zdHJpcF90eXBlX2Vycm9yX2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4MTA7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3JfcmVzdWx0X2hpZ2hMb3dfZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHgyMDtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl90ZW1wZXJhdHVyZV9oaWdoTG93X2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4NDA7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3JfcmVhZF9pbnRlcnJ1cHRpb25fZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHg4MDtcblx0XHRcdFx0cmVzdWx0LmdlbmVyYWxfZGV2aWNlX2ZhdWx0X3N1cHBvcnRlZCA9IGZsYWdzICYgMHgxMDA7XG5cdFx0XHRcdHJlc3VsdC50aW1lX2ZhdWx0X3N1cHBvcnRlZCA9IGZsYWdzICYgMHgyMDA7XG5cdFx0XHRcdHJlc3VsdC5tdWx0aXBsZV9ib25kX3N1cHBvcnRlZCA9IGZsYWdzICYgMHg0MDA7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRodHRwX2VudGl0eV9ib2R5OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaHR0cF9wcm94eSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnXVxuXHRcdH0sXG5cdFx0Z2x1Y29zZV9tZWFzdXJlbWVudDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2dsdWNvc2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydub3RpZnknXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHR2YXIgdGltZU9mZnNldCA9IGZsYWdzICYgMHgxO1xuXHRcdFx0XHR2YXIgY29uY2VudHJhdGlvblR5cGVTYW1wbGVMb2MgPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0dmFyIGNvbmNlbnRyYXRpb25Vbml0cyA9IGZsYWdzICYgMHg0O1xuXHRcdFx0XHR2YXIgc3RhdHVzQW5udW5jaWF0aW9uID0gZmxhZ3MgJiAweDg7XG5cdFx0XHRcdHZhciBjb250ZXh0SW5mb3JtYXRpb24gPSBmbGFncyAmIDB4MTA7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0dmFyIGluZGV4ID0gMTtcblx0XHRcdFx0aWYgKHRpbWVPZmZzZXQpIHtcblx0XHRcdFx0XHRyZXN1bHQudGltZV9vZmZzZXQgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29uY2VudHJhdGlvblR5cGVTYW1wbGVMb2MpIHtcblx0XHRcdFx0XHRpZiAoY29uY2VudHJhdGlvblVuaXRzKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZ2x1Y29zZV9jb25jZW50cmFpdG9uX21vbFBlckwgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZ2x1Y29zZV9jb25jZW50cmFpdG9uX2tnUGVyTCA9IHZhbHVlLmdldEludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRodHRwX2hlYWRlcnM6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydodHRwX3Byb3h5J10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZSddXG5cdFx0fSxcblx0XHRodHRwc19zZWN1cml0eToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2h0dHBfcHJveHknXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJ11cblx0XHR9LFxuXHRcdGludGVybWVkaWF0ZV90ZW1wZXJhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2hlYWx0aF90aGVybW9tZXRlciddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnLCAnaW5kaWNhdGUnXVxuXHRcdH0sXG5cdFx0bG9jYWxfdGltZV9pbmZvcm1hdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N1cnJlbnRfdGltZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnXVxuXHRcdH0sXG5cdFx0bWFudWZhY3R1cmVyX25hbWVfc3RyaW5nOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRtb2RlbF9udW1iZXJfc3RyaW5nOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRwbnBfaWQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHByb3RvY29sX21vZGU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydodW1hbl9pbnRlcmZhY2VfZGV2aWNlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZVdpdGhvdXRSZXNwb25zZSddXG5cdFx0fSxcblx0XHRyZWZlcmVuY2VfdGltZV9pbmZvcm1hdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N1cnJlbnRfdGltZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0c3VwcG9ydGVkX25ld19hbGVydF9jYXRlZ29yeToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2FsZXJ0X25vdGlmaWNhdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Ym9keV9zZW5zb3JfbG9jYXRpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydoZWFydF9yYXRlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHZhbCA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHN3aXRjaCAodmFsKSB7XG5cdFx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ090aGVyJztcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnQ2hlc3QnO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdXcmlzdCc7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0Zpbmdlcic7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0hhbmQnO1xuXHRcdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdFYXIgTG9iZSc7XG5cdFx0XHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0Zvb3QnO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnVW5rbm93bic7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIGhlYXJ0X3JhdGVfY29udHJvbF9wb2ludFxuXHRcdGhlYXJ0X3JhdGVfY29udHJvbF9wb2ludDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2hlYXJ0X3JhdGUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWyd3cml0ZSddLFxuXHRcdFx0cHJlcFZhbHVlOiBmdW5jdGlvbiBwcmVwVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcblx0XHRcdFx0dmFyIHdyaXRlVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHRcdFx0XHR3cml0ZVZpZXcuc2V0VWludDgoMCwgdmFsdWUpO1xuXHRcdFx0XHRyZXR1cm4gd3JpdGVWaWV3O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVhcnRfcmF0ZV9tZWFzdXJlbWVudDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2hlYXJ0X3JhdGUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydub3RpZnknXSxcblx0XHRcdC8qKlxuICAgXHQqIFBhcnNlcyB0aGUgZXZlbnQudGFyZ2V0LnZhbHVlIG9iamVjdCBhbmQgcmV0dXJucyBvYmplY3Qgd2l0aCByZWFkYWJsZVxuICAgXHQqIGtleS12YWx1ZSBwYWlycyBmb3IgYWxsIGFkdmVydGlzZWQgY2hhcmFjdGVyaXN0aWMgdmFsdWVzXG4gICBcdCpcbiAgIFx0Klx0QHBhcmFtIHtPYmplY3R9IHZhbHVlIFRha2VzIGV2ZW50LnRhcmdldC52YWx1ZSBvYmplY3QgZnJvbSBzdGFydE5vdGlmaWNhdGlvbnMgbWV0aG9kXG4gICBcdCpcbiAgIFx0KiBAcmV0dXJuIHtPYmplY3R9IHJlc3VsdCBSZXR1cm5zIHJlYWRhYmxlIG9iamVjdCB3aXRoIHJlbGV2YW50IGNoYXJhY3RlcmlzdGljIHZhbHVlc1xuICAgXHQqXG4gICBcdCovXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0dmFyIHJhdGUxNkJpdHMgPSBmbGFncyAmIDB4MTtcblx0XHRcdFx0dmFyIGNvbnRhY3REZXRlY3RlZCA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHR2YXIgY29udGFjdFNlbnNvclByZXNlbnQgPSBmbGFncyAmIDB4NDtcblx0XHRcdFx0dmFyIGVuZXJneVByZXNlbnQgPSBmbGFncyAmIDB4ODtcblx0XHRcdFx0dmFyIHJySW50ZXJ2YWxQcmVzZW50ID0gZmxhZ3MgJiAweDEwO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHZhciBpbmRleCA9IDE7XG5cdFx0XHRcdGlmIChyYXRlMTZCaXRzKSB7XG5cdFx0XHRcdFx0cmVzdWx0LmhlYXJ0UmF0ZSA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXN1bHQuaGVhcnRSYXRlID0gdmFsdWUuZ2V0VWludDgoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNvbnRhY3RTZW5zb3JQcmVzZW50KSB7XG5cdFx0XHRcdFx0cmVzdWx0LmNvbnRhY3REZXRlY3RlZCA9ICEhY29udGFjdERldGVjdGVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlbmVyZ3lQcmVzZW50KSB7XG5cdFx0XHRcdFx0cmVzdWx0LmVuZXJneUV4cGVuZGVkID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChyckludGVydmFsUHJlc2VudCkge1xuXHRcdFx0XHRcdHZhciByckludGVydmFscyA9IFtdO1xuXHRcdFx0XHRcdGZvciAoOyBpbmRleCArIDEgPCB2YWx1ZS5ieXRlTGVuZ3RoOyBpbmRleCArPSAyKSB7XG5cdFx0XHRcdFx0XHRyckludGVydmFscy5wdXNoKHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXN1bHQucnJJbnRlcnZhbHMgPSByckludGVydmFscztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c2VyaWFsX251bWJlcl9zdHJpbmc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHNvZnR3YXJlX3JldmlzaW9uX3N0cmluZzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0c3VwcG9ydGVkX3VucmVhZF9hbGVydF9jYXRlZ29yeToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2FsZXJ0X25vdGlmaWNhdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0c3lzdGVtX2lkOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHR0ZW1wZXJhdHVyZV90eXBlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaGVhbHRoX3RoZXJtb21ldGVyJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRkZXNjcmlwdG9yX3ZhbHVlX2NoYW5nZWQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydpbmRpY2F0ZScsICd3cml0ZUF1eCcsICdleHRQcm9wJ11cblx0XHR9LFxuXHRcdGFwcGFyZW50X3dpbmRfZGlyZWN0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuYXBwYXJlbnRfd2luZF9kaXJlY3Rpb24gPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YXBwYXJlbnRfd2luZF9zcGVlZDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmFwcGFyZW50X3dpbmRfc3BlZWQgPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGV3X3BvaW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuZGV3X3BvaW50ID0gdmFsdWUuZ2V0SW50OCgwKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGVsZXZhdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmVsZXZhdGlvbiA9IHZhbHVlLmdldEludDgoMCkgPDwgMTYgfCB2YWx1ZS5nZXRJbnQ4KDEpIDw8IDggfCB2YWx1ZS5nZXRJbnQ4KDIpO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z3VzdF9mYWN0b3I6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5ndXN0X2ZhY3RvciA9IHZhbHVlLmdldFVpbnQ4KDApICogMC4xO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGVhdF9pbmRleDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmhlYXRfaW5kZXggPSB2YWx1ZS5nZXRJbnQ4KDApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aHVtaWRpdHk6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cblx0XHRcdFx0cmVzdWx0Lmh1bWlkaXR5ID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGlycmFkaWFuY2U6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cblx0XHRcdFx0cmVzdWx0LmlycmFkaWFuY2UgPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyYWluZmFsbDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblxuXHRcdFx0XHRyZXN1bHQucmFpbmZhbGwgPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAwMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHByZXNzdXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQucHJlc3N1cmUgPSB2YWx1ZS5nZXRVaW50MzIoMCkgKiAwLjE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0ZW1wZXJhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LnRlbXBlcmF0dXJlID0gdmFsdWUuZ2V0SW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dHJ1ZV93aW5kX2RpcmVjdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LnRydWVfd2luZF9kaXJlY3Rpb24gPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dHJ1ZV93aW5kX3NwZWVkOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQudHJ1ZV93aW5kX3NwZWVkID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHV2X2luZGV4OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQudXZfaW5kZXggPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHdpbmRfY2hpbGw6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC53aW5kX2NoaWxsID0gdmFsdWUuZ2V0SW50OCgwKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgdmFsID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0c3dpdGNoICh2YWwpIHtcblx0XHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdVbmtub3duJztcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdDb250aW51b3VzbHkgZmFsbGluZyc7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnQ29udGlub3VzbHkgcmlzaW5nJztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdGYWxsaW5nLCB0aGVuIHN0ZWFkeSc7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnUmlzaW5nLCB0aGVuIHN0ZWFkeSc7XG5cdFx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnRmFsbGluZyBiZWZvcmUgYSBsZXNzZXIgcmlzZSc7XG5cdFx0XHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnRmFsbGluZyBiZWZvcmUgYSBncmVhdGVyIHJpc2UnO1xuXHRcdFx0XHRcdGNhc2UgNzpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ1Jpc2luZyBiZWZvcmUgYSBncmVhdGVyIGZhbGwnO1xuXHRcdFx0XHRcdGNhc2UgODpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ1Jpc2luZyBiZWZvcmUgYSBsZXNzZXIgZmFsbCc7XG5cdFx0XHRcdFx0Y2FzZSA5OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnU3RlYWR5Jztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnQ291bGQgbm90IHJlc29sdmUgdG8gdHJlbmQnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtYWduZXRpY19kZWNsaW5hdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblxuXHRcdFx0XHRyZXN1bHQubWFnbmV0aWNfZGVjbGluYXRpb24gPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWFnbmV0aWNfZmx1eF9kZW5zaXR5XzJEOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHQvL0ZJWE1FOiBuZWVkIHRvIGZpbmQgb3V0IGlmIHRoZXNlIHZhbHVlcyBhcmUgc3RvcmVkIGF0IGRpZmZlcmVudCBieXRlIGFkZHJlc3Nlc1xuXHRcdFx0XHQvLyAgICAgICBiZWxvdyBhc3N1bWVzIHRoYXQgdmFsdWVzIGFyZSBzdG9yZWQgYXQgc3VjY2Vzc2l2ZSBieXRlIGFkZHJlc3Nlc1xuXHRcdFx0XHRyZXN1bHQubWFnbmV0aWNfZmx1eF9kZW5zaXR5X3hfYXhpcyA9IHZhbHVlLmdldEludDE2KDAsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpICogMC4wMDAwMDAxO1xuXHRcdFx0XHRyZXN1bHQubWFnbmV0aWNfZmx1eF9kZW5zaXR5X3lfYXhpcyA9IHZhbHVlLmdldEludDE2KDIsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpICogMC4wMDAwMDAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWFnbmV0aWNfZmx1eF9kZW5zaXR5XzNEOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHQvL0ZJWE1FOiBuZWVkIHRvIGZpbmQgb3V0IGlmIHRoZXNlIHZhbHVlcyBhcmUgc3RvcmVkIGF0IGRpZmZlcmVudCBieXRlIGFkZHJlc3Nlc1xuXHRcdFx0XHQvLyAgICAgICBiZWxvdyBhc3N1bWVzIHRoYXQgdmFsdWVzIGFyZSBzdG9yZWQgYXQgc3VjY2Vzc2l2ZSBieXRlIGFkZHJlc3Nlc1xuXHRcdFx0XHRyZXN1bHQubWFnbmV0aWNfZmx1eF9kZW5zaXR5X3hfYXhpcyA9IHZhbHVlLmdldEludDE2KDAsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpICogMC4wMDAwMDAxO1xuXHRcdFx0XHRyZXN1bHQubWFnbmV0aWNfZmx1eF9kZW5zaXR5X3lfYXhpcyA9IHZhbHVlLmdldEludDE2KDIsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpICogMC4wMDAwMDAxO1xuXHRcdFx0XHRyZXN1bHQubWFnbmV0aWNfZmx1eF9kZW5zaXR5X3pfYXhpcyA9IHZhbHVlLmdldEludDE2KDQsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpICogMC4wMDAwMDAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dHhfcG93ZXJfbGV2ZWw6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWyd0eF9wb3dlciddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LnR4X3Bvd2VyX2xldmVsID0gdmFsdWUuZ2V0SW50OCgwKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHdlaWdodF9zY2FsZV9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnd2VpZ2h0X3NjYWxlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRJbnQzMigwKTtcblx0XHRcdFx0cmVzdWx0LnRpbWVfc3RhbXBfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDE7XG5cdFx0XHRcdHJlc3VsdC5tdWx0aXBsZV9zZW5zb3JzX3N1cHBvcnRlZCA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHRyZXN1bHQuQk1JX3N1cHBvcnRlZCA9IGZsYWdzICYgMHg0O1xuXHRcdFx0XHRzd2l0Y2ggKGZsYWdzICYgMHg3OCA+PiAzKSB7XG5cdFx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ05vdCBzcGVjaWZpZWQnO1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuNSBrZyBvciAxIGxiJztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjIga2cgb3IgMC41IGxiJztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjEga2cgb3IgMC4yIGxiJztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjA1IGtnIG9yIDAuMSBsYic7XG5cdFx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4wMiBrZyBvciAwLjA1IGxiJztcblx0XHRcdFx0XHRjYXNlIDY6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjAxIGtnIG9yIDAuMDIgbGInO1xuXHRcdFx0XHRcdGNhc2UgNzpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMDA1IGtnIG9yIDAuMDEgbGInO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnQ291bGQgbm90IHJlc29sdmUnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAoZmxhZ3MgJiAweDM4MCA+PiA3KSB7XG5cdFx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmhlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ05vdCBzcGVjaWZpZWQnO1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHJlc3VsdC5oZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMSBtZXRlciBvciAxIGluY2gnO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdHJlc3VsdC5oZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMDA1IG1ldGVyIG9yIDAuNSBpbmNoJztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjAwMSBtZXRlciBvciAwLjEgaW5jaCc7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJlc3VsdC5oZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdDb3VsZCBub3QgcmVzb2x2ZSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gUmVtYWluaW5nIGZsYWdzIHJlc2VydmVkIGZvciBmdXR1cmUgdXNlXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjc2NfbWVhc3VyZW1lbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjeWNsaW5nX3NwZWVkX2FuZF9jYWRlbmNlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnbm90aWZ5J10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0dmFyIHdoZWVsUmV2b2x1dGlvbiA9IGZsYWdzICYgMHgxOyAvL2ludGVnZXIgPSB0cnV0aHksIDAgPSBmYWxzeVxuXHRcdFx0XHR2YXIgY3JhbmtSZXZvbHV0aW9uID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0dmFyIGluZGV4ID0gMTtcblx0XHRcdFx0aWYgKHdoZWVsUmV2b2x1dGlvbikge1xuXHRcdFx0XHRcdHJlc3VsdC5jdW11bGF0aXZlX3doZWVsX3Jldm9sdXRpb25zID0gdmFsdWUuZ2V0VWludDMyKGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSA0O1xuXHRcdFx0XHRcdHJlc3VsdC5sYXN0X3doZWVsX2V2ZW50X3RpbWVfcGVyXzEwMjRzID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjcmFua1Jldm9sdXRpb24pIHtcblx0XHRcdFx0XHRyZXN1bHQuY3VtdWxhdGl2ZV9jcmFua19yZXZvbHV0aW9ucyA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0XHRyZXN1bHQubGFzdF9jcmFua19ldmVudF90aW1lX3Blcl8xMDI0cyA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c2Vuc29yX2xvY2F0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3ljbGluZ19zcGVlZF9hbmRfY2FkZW5jZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciB2YWwgPSB2YWx1ZS5nZXRVaW50MTYoMCk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0c3dpdGNoICh2YWwpIHtcblx0XHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnT3RoZXInO1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdUb3Agb2Ygc2hvdyc7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0luIHNob2UnO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdIaXAnO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdGcm9udCBXaGVlbCc7XG5cdFx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0xlZnQgQ3JhbmsnO1xuXHRcdFx0XHRcdGNhc2UgNjpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdSaWdodCBDcmFuayc7XG5cdFx0XHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0xlZnQgUGVkYWwnO1xuXHRcdFx0XHRcdGNhc2UgODpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdSaWdodCBQZWRhbCc7XG5cdFx0XHRcdFx0Y2FzZSA5OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0Zyb250IEh1Yic7XG5cdFx0XHRcdFx0Y2FzZSAxMDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdSZWFyIERyb3BvdXQnO1xuXHRcdFx0XHRcdGNhc2UgMTE6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnQ2hhaW5zdGF5Jztcblx0XHRcdFx0XHRjYXNlIDEyOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1JlYXIgV2hlZWwnO1xuXHRcdFx0XHRcdGNhc2UgMTM6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnUmVhciBIdWInO1xuXHRcdFx0XHRcdGNhc2UgMTQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnQ2hlc3QnO1xuXHRcdFx0XHRcdGNhc2UgMTU6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnU3BpZGVyJztcblx0XHRcdFx0XHRjYXNlIDE2OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0NoYWluIFJpbmcnO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnVW5rbm93bic7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNjX2NvbnRyb2xfcG9pbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjeWNsaW5nX3NwZWVkX2FuZF9jYWRlbmNlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnd3JpdGUnLCAnaW5kaWNhdGUnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjeWNsaW5nX3Bvd2VyX21lYXN1cmVtZW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3ljbGluZ19wb3dlciddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ25vdGlmeSddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0VWludDE2KDApO1xuXHRcdFx0XHR2YXIgcGVkYWxfcG93ZXJfYmFsYW5jZV9wcmVzZW50ID0gZmxhZ3MgJiAweDE7XG5cdFx0XHRcdHZhciBwZWRhbF9wb3dlcl9yZWZlcmVuY2UgPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0dmFyIGFjY3VtdWxhdGVkX3RvcnF1ZV9wcmVzZW50ID0gZmxhZ3MgJiAweDQ7XG5cdFx0XHRcdHZhciBhY2N1bXVsYXRlZF90b3JxdWVfc291cmNlID0gZmxhZ3MgJiAweDg7XG5cdFx0XHRcdHZhciB3aGVlbF9yZXZvbHV0aW9uX2RhdGFfcHJlc2VudCA9IGZsYWdzICYgMHgxMDtcblx0XHRcdFx0dmFyIGNyYW5rX3Jldm9sdXRpb25fZGF0YV9wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgZXh0cmVtZV9mb3JjZV9tYWduaXR1ZGVfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIGV4dHJlbWVfdG9ycXVlX21hZ25pdHVkZV9wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgZXh0cmVtZV9hbmdsZXNfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIHRvcF9kZWFkX3Nwb3RfYW5nbGVfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIGJvdHRvbV9kZWFkX3Nwb3RfYW5nbGVfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIGFjY3VtdWxhdGVkX2VuZXJneV9wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgb2Zmc2V0X2NvbXBlbnNhdGlvbl9pbmRpY2F0b3IgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0dmFyIGluZGV4ID0gMTtcblx0XHRcdFx0Ly9XYXR0cyB3aXRoIHJlc29sdXRpb24gb2YgMVxuXHRcdFx0XHRyZXN1bHQuaW5zdGFudGFuZW91c19wb3dlciA9IHZhbHVlLmdldEludDE2KGluZGV4KTtcblx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0aWYgKHBlZGFsX3Bvd2VyX3JlZmVyZW5jZSkge1xuXHRcdFx0XHRcdC8vUGVyY2VudGFnZSB3aXRoIHJlc29sdXRpb24gb2YgMS8yXG5cdFx0XHRcdFx0cmVzdWx0LnBlZGFsX3Bvd2VyX2JhbGFuY2UgPSB2YWx1ZS5nZXRVaW50OChpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYWNjdW11bGF0ZWRfdG9ycXVlX3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL1BlcmNlbnRhZ2Ugd2l0aCByZXNvbHV0aW9uIG9mIDEvMlxuXHRcdFx0XHRcdHJlc3VsdC5hY2N1bXVsYXRlZF90b3JxdWUgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHdoZWVsX3Jldm9sdXRpb25fZGF0YV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0cmVzdWx0LmN1bXVsYXRpdmVfd2hlZWxfcmV2b2x1dGlvbnMgPSB2YWx1ZS5VaW50MzIoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDQ7XG5cdFx0XHRcdFx0cmVzdWx0Lmxhc3Rfd2hlZWxfZXZlbnRfdGltZV9wZXJfMjA0OHMgPSB2YWx1ZS5VaW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNyYW5rX3Jldm9sdXRpb25fZGF0YV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0cmVzdWx0LmN1bXVsYXRpdmVfY3JhbmtfcmV2b2x1dGlvbnMgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0cmVzdWx0Lmxhc3RfY3JhbmtfZXZlbnRfdGltZV9wZXJfMTAyNHMgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4dHJlbWVfZm9yY2VfbWFnbml0dWRlX3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL05ld3RvbiBtZXRlcnMgd2l0aCByZXNvbHV0aW9uIG9mIDEgVE9ETzogdW5pdHM/XG5cdFx0XHRcdFx0cmVzdWx0Lm1heGltdW1fZm9yY2VfbWFnbml0dWRlID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0cmVzdWx0Lm1pbmltdW1fZm9yY2VfbWFnbml0dWRlID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4dHJlbWVfdG9ycXVlX21hZ25pdHVkZV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9OZXd0b24gbWV0ZXJzIHdpdGggcmVzb2x1dGlvbiBvZiAxIFRPRE86IHVuaXRzP1xuXHRcdFx0XHRcdHJlc3VsdC5tYXhpbXVtX3RvcnF1ZV9tYWduaXR1ZGUgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0XHRyZXN1bHQubWluaW11bV90b3JxdWVfbWFnbml0dWRlID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4dHJlbWVfYW5nbGVzX3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL1RPRE86IFVJTlQxMi5cblx0XHRcdFx0XHQvL05ld3RvbiBtZXRlcnMgd2l0aCByZXNvbHV0aW9uIG9mIDEgVE9ETzogdW5pdHM/XG5cdFx0XHRcdFx0Ly8gcmVzdWx0Lm1heGltdW1fYW5nbGUgPSB2YWx1ZS5nZXRJbnQxMihpbmRleCk7XG5cdFx0XHRcdFx0Ly8gaW5kZXggKz0gMjtcblx0XHRcdFx0XHQvLyByZXN1bHQubWluaW11bV9hbmdsZSA9IHZhbHVlLmdldEludDEyKGluZGV4KTtcblx0XHRcdFx0XHQvLyBpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b3BfZGVhZF9zcG90X2FuZ2xlX3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL1BlcmNlbnRhZ2Ugd2l0aCByZXNvbHV0aW9uIG9mIDEvMlxuXHRcdFx0XHRcdHJlc3VsdC50b3BfZGVhZF9zcG90X2FuZ2xlID0gdmFsdWUuZ2V0VWludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChib3R0b21fZGVhZF9zcG90X2FuZ2xlX3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL1BlcmNlbnRhZ2Ugd2l0aCByZXNvbHV0aW9uIG9mIDEvMlxuXHRcdFx0XHRcdHJlc3VsdC5ib3R0b21fZGVhZF9zcG90X2FuZ2xlID0gdmFsdWUuZ2V0VWludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRlZF9lbmVyZ3lfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8va2lsb2pvdWxlcyB3aXRoIHJlc29sdXRpb24gb2YgMSBUT0RPOiB1bml0cz9cblx0XHRcdFx0XHRyZXN1bHQuYWNjdW11bGF0ZWRfZW5lcmd5ID0gdmFsdWUuZ2V0VWludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRnYXR0U2VydmljZUxpc3Q6IFsnYWxlcnRfbm90aWZpY2F0aW9uJywgJ2F1dG9tYXRpb25faW8nLCAnYmF0dGVyeV9zZXJ2aWNlJywgJ2Jsb29kX3ByZXNzdXJlJywgJ2JvZHlfY29tcG9zaXRpb24nLCAnYm9uZF9tYW5hZ2VtZW50JywgJ2NvbnRpbnVvdXNfZ2x1Y29zZV9tb25pdG9yaW5nJywgJ2N1cnJlbnRfdGltZScsICdjeWNsaW5nX3Bvd2VyJywgJ2N5Y2xpbmdfc3BlZWRfYW5kX2NhZGVuY2UnLCAnZGV2aWNlX2luZm9ybWF0aW9uJywgJ2Vudmlyb25tZW50YWxfc2Vuc2luZycsICdnZW5lcmljX2FjY2VzcycsICdnZW5lcmljX2F0dHJpYnV0ZScsICdnbHVjb3NlJywgJ2hlYWx0aF90aGVybW9tZXRlcicsICdoZWFydF9yYXRlJywgJ2h1bWFuX2ludGVyZmFjZV9kZXZpY2UnLCAnaW1tZWRpYXRlX2FsZXJ0JywgJ2luZG9vcl9wb3NpdGlvbmluZycsICdpbnRlcm5ldF9wcm90b2NvbF9zdXBwb3J0JywgJ2xpbmtfbG9zcycsICdsb2NhdGlvbl9hbmRfbmF2aWdhdGlvbicsICduZXh0X2RzdF9jaGFuZ2UnLCAncGhvbmVfYWxlcnRfc3RhdHVzJywgJ3B1bHNlX294aW1ldGVyJywgJ3JlZmVyZW5jZV90aW1lX3VwZGF0ZScsICdydW5uaW5nX3NwZWVkX2FuZF9jYWRlbmNlJywgJ3NjYW5fcGFyYW1ldGVycycsICd0eF9wb3dlcicsICd1c2VyX2RhdGEnLCAnd2VpZ2h0X3NjYWxlJ11cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmx1ZXRvb3RoTWFwO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbS9ibHVldG9vdGhNYXAuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblwidXNlIHN0cmljdFwiO1xuXG4vKiogZXJyb3JIYW5kbGVyIC0gQ29uc29sb2RhdGVzIGVycm9yIG1lc3NhZ2UgY29uZmlndXJhdGlvbiBhbmQgbG9naWNcbipcbiogQHBhcmFtIHtzdHJpbmd9IGVycm9yS2V5IC0gbWFwcyB0byBhIGRldGFpbGVkIGVycm9yIG1lc3NhZ2VcbiogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUVycm9yIC0gdGhlIG5hdGl2ZSBBUEkgZXJyb3Igb2JqZWN0LCBpZiBwcmVzZW50XG4qIEBwYXJhbSB7fSBhbHRlcm5hdGUgLSBcbipcbiovXG5mdW5jdGlvbiBlcnJvckhhbmRsZXIoZXJyb3JLZXksIG5hdGl2ZUVycm9yLCBhbHRlcm5hdGUpIHtcblxuXHRcdHZhciBlcnJvck1lc3NhZ2VzID0ge1xuXHRcdFx0XHRhZGRfY2hhcmFjdGVyaXN0aWNfZXhpc3RzX2Vycm9yOiBcIkNoYXJhY3RlcmlzdGljIFwiICsgYWx0ZXJuYXRlICsgXCIgYWxyZWFkeSBleGlzdHMuXCIsXG5cdFx0XHRcdGNoYXJhY3RlcmlzdGljX2Vycm9yOiBcIkNoYXJhY3RlcmlzdGljIFwiICsgYWx0ZXJuYXRlICsgXCIgbm90IGZvdW5kLiBBZGQgXCIgKyBhbHRlcm5hdGUgKyBcIiB0byBkZXZpY2UgdXNpbmcgYWRkQ2hhcmFjdGVyaXN0aWMgb3IgdHJ5IGFub3RoZXIgY2hhcmFjdGVyaXN0aWMuXCIsXG5cdFx0XHRcdGNvbm5lY3RfZ2F0dDogXCJDb3VsZCBub3QgY29ubmVjdCB0byBHQVRULiBEZXZpY2UgbWlnaHQgYmUgb3V0IG9mIHJhbmdlLiBBbHNvIGNoZWNrIHRvIHNlZSBpZiBmaWx0ZXJzIGFyZSB2YWlsZC5cIixcblx0XHRcdFx0Y29ubmVjdF9zZXJ2ZXI6IFwiQ291bGQgbm90IGNvbm5lY3QgdG8gc2VydmVyIG9uIGRldmljZS5cIixcblx0XHRcdFx0Y29ubmVjdF9zZXJ2aWNlOiBcIkNvdWxkIG5vdCBmaW5kIHNlcnZpY2UuXCIsXG5cdFx0XHRcdGRpc2Nvbm5lY3RfdGltZW91dDogXCJUaW1lZCBvdXQuIENvdWxkIG5vdCBkaXNjb25uZWN0LlwiLFxuXHRcdFx0XHRkaXNjb25uZWN0X2Vycm9yOiBcIkNvdWxkIG5vdCBkaXNjb25uZWN0IGZyb20gZGV2aWNlLlwiLFxuXHRcdFx0XHRpbXByb3Blcl9jaGFyYWN0ZXJpc3RpY19mb3JtYXQ6IGFsdGVybmF0ZSArIFwiIGlzIG5vdCBhIHByb3Blcmx5IGZvcm1hdHRlZCBjaGFyYWN0ZXJpc3RpYy5cIixcblx0XHRcdFx0aW1wcm9wZXJfcHJvcGVydGllc19mb3JtYXQ6IGFsdGVybmF0ZSArIFwiIGlzIG5vdCBhIHByb3Blcmx5IGZvcm1hdHRlZCBwcm9wZXJ0aWVzIGFycmF5LlwiLFxuXHRcdFx0XHRpbXByb3Blcl9zZXJ2aWNlX2Zvcm1hdDogYWx0ZXJuYXRlICsgXCIgaXMgbm90IGEgcHJvcGVybHkgZm9ybWF0dGVkIHNlcnZpY2UuXCIsXG5cdFx0XHRcdGlzc3VlX2Rpc2Nvbm5lY3Rpbmc6IFwiSXNzdWUgZGlzY29ubmVjdGluZyB3aXRoIGRldmljZS5cIixcblx0XHRcdFx0bmV3X2NoYXJhY3RlcmlzdGljX21pc3NpbmdfcGFyYW1zOiBhbHRlcm5hdGUgKyBcIiBpcyBub3QgYSBmdWxseSBzdXBwb3J0ZWQgY2hhcmFjdGVyaXN0aWMuIFBsZWFzZSBwcm92aWRlIGFuIGFzc29jaWF0ZWQgcHJpbWFyeSBzZXJ2aWNlIGFuZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkuXCIsXG5cdFx0XHRcdG5vX2RldmljZTogXCJObyBpbnN0YW5jZSBvZiBkZXZpY2UgZm91bmQuXCIsXG5cdFx0XHRcdG5vX2ZpbHRlcnM6IFwiTm8gZmlsdGVycyBmb3VuZCBvbiBpbnN0YW5jZSBvZiBEZXZpY2UuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlzaXQgaHR0cDovL3NhYmVydG9vdGguaW8vI21ldGhvZC1uZXdkZXZpY2VcIixcblx0XHRcdFx0bm9fcmVhZF9wcm9wZXJ0eTogXCJObyByZWFkIHByb3BlcnR5IG9uIGNoYXJhY3RlcmlzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiLlwiLFxuXHRcdFx0XHRub193cml0ZV9wcm9wZXJ0eTogXCJObyB3cml0ZSBwcm9wZXJ0eSBvbiB0aGlzIGNoYXJhY3RlcmlzdGljLlwiLFxuXHRcdFx0XHRub3RfY29ubmVjdGVkOiBcIkNvdWxkIG5vdCBkaXNjb25uZWN0LiBEZXZpY2Ugbm90IGNvbm5lY3RlZC5cIixcblx0XHRcdFx0cGFyc2luZ19ub3Rfc3VwcG9ydGVkOiBcIlBhcnNpbmcgbm90IHN1cHBvcnRlZCBmb3IgY2hhcmFjdGVyc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIi5cIixcblx0XHRcdFx0cmVhZF9lcnJvcjogXCJDYW5ub3QgcmVhZCB2YWx1ZSBvbiB0aGUgY2hhcmFjdGVyaXN0aWMuXCIsXG5cdFx0XHRcdF9yZXR1cm5DaGFyYWN0ZXJpc3RpY19lcnJvcjogXCJFcnJvciBhY2Nlc3NpbmcgY2hhcmFjdGVyaXN0aWMgXCIgKyBhbHRlcm5hdGUgKyBcIi5cIixcblx0XHRcdFx0c3RhcnRfbm90aWZpY2F0aW9uc19lcnJvcjogXCJOb3QgYWJsZSB0byByZWFkIHN0cmVhbSBvZiBkYXRhIGZyb20gY2hhcmFjdGVyaXN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIuXCIsXG5cdFx0XHRcdHN0YXJ0X25vdGlmaWNhdGlvbnNfbm9fbm90aWZ5OiBcIk5vIG5vdGlmeSBwcm9wZXJ0eSBmb3VuZCBvbiB0aGlzIGNoYXJhY3RlcmlzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiLlwiLFxuXHRcdFx0XHRzdG9wX25vdGlmaWNhdGlvbnNfbm90X25vdGlmeWluZzogXCJOb3RpZmljYXRpb25zIG5vdCBlc3RhYmxpc2hlZCBmb3IgY2hhcmFjdGVyaXN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIgb3IgeW91IGhhdmUgbm90IHN0YXJ0ZWQgbm90aWZpY2F0aW9ucy5cIixcblx0XHRcdFx0c3RvcF9ub3RpZmljYXRpb25zX2Vycm9yOiBcIklzc3VlIHN0b3BwaW5nIG5vdGlmaWNhdGlvbnMgZm9yIGNoYXJhY3RlcmlzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiIG9yIHlvdSBoYXZlIG5vdCBzdGFydGVkIG5vdGlmaWNhdGlvbnMuXCIsXG5cdFx0XHRcdHVzZXJfY2FuY2VsbGVkOiBcIlVzZXIgY2FuY2VsbGVkIHRoZSBwZXJtaXNzaW9uIHJlcXVlc3QuXCIsXG5cdFx0XHRcdHV1aWRfZXJyb3I6IFwiSW52YWxpZCBVVUlELiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBwcm9wZXIgZm9ybWF0dGluZyBvZiBVVUlEcywgdmlzaXQgaHR0cHM6Ly93ZWJibHVldG9vdGhjZy5naXRodWIuaW8vd2ViLWJsdWV0b290aC8jdXVpZHNcIixcblx0XHRcdFx0d3JpdGVfZXJyb3I6IFwiQ291bGQgbm90IGNoYW5nZSB2YWx1ZSBvZiBjaGFyYWN0ZXJpc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIi5cIixcblx0XHRcdFx0d3JpdGVfcGVybWlzc2lvbnM6IGFsdGVybmF0ZSArIFwiIGNoYXJhY3RlcmlzdGljIGRvZXMgbm90IGhhdmUgYSB3cml0ZSBwcm9wZXJ0eS5cIlxuXHRcdH07XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlc1tlcnJvcktleV0pO1xuXHRcdHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcnJvckhhbmRsZXI7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtL2Vycm9ySGFuZGxlci5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvbnBtL0JsdWV0b290aERldmljZScpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL25wbS5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoXCIpIl19
