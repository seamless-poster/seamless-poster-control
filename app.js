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
  name: 'MyDevice',
  service: ['12ab']
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

      const added = blue.addCharacteristic(
        '34cd',
        '12ab',
        ['read', 'write', 'notify']
      );

      console.log(added ?
        'success added characteristic' :
        'error added characteristic');
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
  console.log('34cd');
  blue.writeValue('34cd', 'ok')
    .then(writeSuccess => {
      console.log(writeSuccess);
    })
    .catch(error => {
      console.log(error);
    });
});

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_4465ab60.js","/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvYXBwL3NjcmlwdHMvYXBwL3N0YXRlLmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL2FwcC9zY3JpcHRzL2Zha2VfNDQ2NWFiNjAuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbS9CbHVldG9vdGhEZXZpY2UuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG0vYmx1ZXRvb3RoTWFwLmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtL2Vycm9ySGFuZGxlci5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9ucG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3R3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblxuY2xhc3MgU3RhdGVNYW5hZ2VyIHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnN0YXRlID0gJ2luaXQnO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzdGF0ZS0nICsgdGhpcy5zdGF0ZSk7XG4gIH1cblxuICBjaGFuZ2Uoc3RhdGUpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdGUtJyArIHRoaXMuc3RhdGUpO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3RhdGUtJyArIHRoaXMuc3RhdGUpO1xuICB9XG59XG5cbmNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtc3RhdGUtbWFuYWdlcicpO1xuY29uc3Qgc3RhdGVNYW5hZ2VyID0gbmV3IFN0YXRlTWFuYWdlcihlbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGF0ZU1hbmFnZXI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvYXBwL3N0YXRlLmpzXCIsXCIvYXBwXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgQmx1ZXRvb3RoRGV2aWNlID0gcmVxdWlyZSgnd2ViLWJsdWV0b290aCcpO1xuY29uc3Qgc3RhdGVNYW5hZ2VyID0gcmVxdWlyZSgnLi9hcHAvc3RhdGUuanMnKTtcblxuY29uc3QgZmlsdGVyID0ge1xuICBuYW1lOiAnTXlEZXZpY2UnLFxuICBzZXJ2aWNlOiBbJzEyYWInXVxufTtcbmxldCBibHVlO1xuXG5jb25zdCBjb25uZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWNvbm5lY3QnKTtcbmNvbnN0IGRpc2Nvbm5lY3RCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtZGlzY29ubmVjdCcpO1xuXG5jb25zdCBva0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1vaycpO1xuXG5jb25uZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25uZWN0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgc3RhdGVNYW5hZ2VyLmNoYW5nZSgnY29ubmVjdGluZycpO1xuXG4gIGJsdWUgPSBuZXcgQmx1ZXRvb3RoRGV2aWNlKGZpbHRlcik7XG4gIGJsdWUuY29ubmVjdCgpXG4gICAgLnRoZW4oZGV2aWNlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGRldmljZSk7XG4gICAgICBzdGF0ZU1hbmFnZXIuY2hhbmdlKCdjb25uZWN0ZWQnKTtcbiAgICAgIGNvbm5lY3RCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgICAgY29uc3QgYWRkZWQgPSBibHVlLmFkZENoYXJhY3RlcmlzdGljKFxuICAgICAgICAnMzRjZCcsXG4gICAgICAgICcxMmFiJyxcbiAgICAgICAgWydyZWFkJywgJ3dyaXRlJywgJ25vdGlmeSddXG4gICAgICApO1xuXG4gICAgICBjb25zb2xlLmxvZyhhZGRlZCA/XG4gICAgICAgICdzdWNjZXNzIGFkZGVkIGNoYXJhY3RlcmlzdGljJyA6XG4gICAgICAgICdlcnJvciBhZGRlZCBjaGFyYWN0ZXJpc3RpYycpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHN0YXRlTWFuYWdlci5jaGFuZ2UoJ2luaXQnKTtcbiAgICAgIGNvbm5lY3RCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbn0pO1xuXG5kaXNjb25uZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBpZiAoYmx1ZS5kaXNjb25uZWN0KCkpIHtcbiAgICBzdGF0ZU1hbmFnZXIuY2hhbmdlKCdpbml0Jyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ2Vycm9yIHdoaWxlIGRpc2Nvbm5lY3QnKTtcbiAgfVxufSk7XG5cbm9rQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zb2xlLmxvZygnMzRjZCcpO1xuICBibHVlLndyaXRlVmFsdWUoJzM0Y2QnLCAnb2snKVxuICAgIC50aGVuKHdyaXRlU3VjY2VzcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh3cml0ZVN1Y2Nlc3MpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbn0pO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfNDQ2NWFiNjAuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgYmx1ZXRvb3RoID0gcmVxdWlyZSgnLi9ibHVldG9vdGhNYXAnKTtcbnZhciBlcnJvckhhbmRsZXIgPSByZXF1aXJlKCcuL2Vycm9ySGFuZGxlcicpO1xuXG4vKiogQmx1ZXRvb3RoRGV2aWNlIC1cbiAgKlxuICAqIEBtZXRob2QgY29ubmVjdCAtIEVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB3aXRoIHRoZSBkZXZpY2VcbiAgKiBAbWV0aG9kIGNvbm5lY3RlZCAtIGNoZWNrcyBhcGlEZXZpY2UgdG8gc2VlIHdoZXRoZXIgZGV2aWNlIGlzIGNvbm5lY3RlZFxuICAqIEBtZXRob2QgZGlzY29ubmVjdCAtIHRlcm1pbmF0ZXMgdGhlIGNvbm5lY3Rpb24gd2l0aCB0aGUgZGV2aWNlIGFuZCBwYXVzZXMgYWxsIGRhdGEgc3RyZWFtIHN1YnNjcmlwdGlvbnNcbiAgKiBAbWV0aG9kIGdldFZhbHVlIC0gcmVhZHMgdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWVkIGNoYXJhY3RlcmlzdGljXG4gICogQG1ldGhvZCB3cml0ZVZhbHVlIC0gd3JpdGVzIGRhdGEgdG8gYSBzcGVjaWZpZWQgY2hhcmFjdGVyaXN0aWMgb2YgdGhlIGRldmljZVxuICAqIEBtZXRob2Qgc3RhcnROb3RpZmljYXRpb25zIC0gYXR0ZW1wdHMgdG8gc3RhcnQgbm90aWZpY2F0aW9ucyBmb3IgY2hhbmdlcyB0byBkZXZpY2UgdmFsdWVzIGFuZCBhdHRhY2hlcyBhbiBldmVudCBsaXN0ZW5lciBmb3IgZWFjaCBkYXRhIHRyYW5zbWlzc2lvblxuICAqIEBtZXRob2Qgc3RvcE5vdGlmaWNhdGlvbnMgLSBhdHRlbXB0cyB0byBzdG9wIHByZXZpb3VzbHkgc3RhcnRlZCBub3RpZmljYXRpb25zIGZvciBhIHByb3ZpZGVkIGNoYXJhY3RlcmlzdGljXG4gICogQG1ldGhvZCBhZGRDaGFyYWN0ZXJpc3RpYyAtIGFkZHMgYSBuZXcgY2hhcmFjdGVyaXN0aWMgb2JqZWN0IHRvIGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1xuICAqIEBtZXRob2QgX3JldHVybkNoYXJhY3RlcmlzdGljIC0gX3JldHVybkNoYXJhY3RlcmlzdGljIC0gcmV0dXJucyB0aGUgdmFsdWUgb2YgYSBjYWNoZWQgb3IgcmVzb2x2ZWQgY2hhcmFjdGVyaXN0aWMgb3IgcmVzb2x2ZWQgY2hhcmFjdGVyaXN0aWNcbiAgKlxuICAqIEBwYXJhbSB7b2JqZWN0fSBmaWx0ZXJzIC0gY29sbGVjdGlvbiBvZiBmaWx0ZXJzIGZvciBkZXZpY2Ugc2VsZWN0aW4uIEFsbCBmaWx0ZXJzIGFyZSBvcHRpb25hbCwgYnV0IGF0IGxlYXN0IDEgaXMgcmVxdWlyZWQuXG4gICogICAgICAgICAgLm5hbWUge3N0cmluZ31cbiAgKiAgICAgICAgICAubmFtZVByZWZpeCB7c3RyaW5nfVxuICAqICAgICAgICAgIC51dWlkIHtzdHJpbmd9XG4gICogICAgICAgICAgLnNlcnZpY2VzIHthcnJheX1cbiAgKiAgICAgICAgICAub3B0aW9uYWxTZXJ2aWNlcyB7YXJyYXl9IC0gZGVmYXVsdHMgdG8gYWxsIGF2YWlsYWJsZSBzZXJ2aWNlcywgdXNlIGFuIGVtcHR5IGFycmF5IHRvIGdldCBubyBvcHRpb25hbCBzZXJ2aWNlc1xuICAqXG4gICogQHJldHVybiB7b2JqZWN0fSBSZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIEJsdWV0b290aERldmljZVxuICAqXG4gICovXG5cbnZhciBCbHVldG9vdGhEZXZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJsdWV0b290aERldmljZShyZXF1ZXN0UGFyYW1zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJsdWV0b290aERldmljZSk7XG5cbiAgICB0aGlzLnJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0UGFyYW1zO1xuICAgIHRoaXMuYXBpRGV2aWNlID0gbnVsbDtcbiAgICB0aGlzLmFwaVNlcnZlciA9IG51bGw7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEJsdWV0b290aERldmljZSwgW3tcbiAgICBrZXk6ICdjb25uZWN0ZWQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcGlEZXZpY2UgPyB0aGlzLmFwaURldmljZS5nYXR0LmNvbm5lY3RlZCA6IGVycm9ySGFuZGxlcignbm9fZGV2aWNlJyk7XG4gICAgfVxuXG4gICAgLyoqIGNvbm5lY3QgLSBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgZGV2aWNlXG4gICAgICAqICAgXG4gICAgICAqIE5PVEU6IFRoaXMgbWV0aG9kIG11c3QgYmUgdHJpZ2dlcmVkIGJ5IGEgdXNlciBnZXN0dXJlIHRvIHNhdGlzZnkgdGhlIG5hdGl2ZSBBUEkncyBwZXJtaXNzaW9uc1xuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gbmF0aXZlIGJyb3dzZXIgQVBJIGRldmljZSBzZXJ2ZXIgb2JqZWN0XG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdjb25uZWN0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdCgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBmaWx0ZXJzID0gdGhpcy5yZXF1ZXN0UGFyYW1zO1xuICAgICAgdmFyIHJlcXVlc3RQYXJhbXMgPSB7IGZpbHRlcnM6IFtdIH07XG4gICAgICB2YXIgdXVpZFJlZ2V4ID0gL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXS87XG5cbiAgICAgIGlmICghT2JqZWN0LmtleXMoZmlsdGVycykubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ25vX2ZpbHRlcnMnKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzLm5hbWUpIHJlcXVlc3RQYXJhbXMuZmlsdGVycy5wdXNoKHsgbmFtZTogZmlsdGVycy5uYW1lIH0pO1xuICAgICAgaWYgKGZpbHRlcnMubmFtZVByZWZpeCkgcmVxdWVzdFBhcmFtcy5maWx0ZXJzLnB1c2goeyBuYW1lUHJlZml4OiBmaWx0ZXJzLm5hbWVQcmVmaXggfSk7XG4gICAgICBpZiAoZmlsdGVycy51dWlkKSB7XG4gICAgICAgIGlmICghZmlsdGVycy51dWlkLm1hdGNoKHV1aWRSZWdleCkpIHtcbiAgICAgICAgICBlcnJvckhhbmRsZXIoJ3V1aWRfZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXF1ZXN0UGFyYW1zLmZpbHRlcnMucHVzaCh7IHV1aWQ6IGZpbHRlcnMudXVpZCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnMuc2VydmljZXMpIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgc2VydmljZXMgPSBbXTtcbiAgICAgICAgICBmaWx0ZXJzLnNlcnZpY2VzLmZvckVhY2goZnVuY3Rpb24gKHNlcnZpY2UpIHtcbiAgICAgICAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRTZXJ2aWNlTGlzdC5pbmNsdWRlcyhzZXJ2aWNlKSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oc2VydmljZSArICcgaXMgbm90IGEgdmFsaWQgc2VydmljZS4gUGxlYXNlIGNoZWNrIHRoZSBzZXJ2aWNlIG5hbWUuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXJ2aWNlcy5wdXNoKHNlcnZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcXVlc3RQYXJhbXMuZmlsdGVycy5wdXNoKHsgc2VydmljZXM6IHNlcnZpY2VzIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnMub3B0aW9uYWxfc2VydmljZXMpIHtcbiAgICAgICAgZmlsdGVycy5vcHRpb25hbF9zZXJ2aWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XG4gICAgICAgICAgaWYgKCFibHVldG9vdGguZ2F0dFNlcnZpY2VMaXN0LmluY2x1ZGVzKHNlcnZpY2UpKSBibHVldG9vdGguZ2F0dFNlcnZpY2VMaXN0LnB1c2goc2VydmljZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdFBhcmFtcy5vcHRpb25hbFNlcnZpY2VzID0gYmx1ZXRvb3RoLmdhdHRTZXJ2aWNlTGlzdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZShyZXF1ZXN0UGFyYW1zKS50aGVuKGZ1bmN0aW9uIChkZXZpY2UpIHtcbiAgICAgICAgX3RoaXMuYXBpRGV2aWNlID0gZGV2aWNlO1xuICAgICAgICByZXR1cm4gZGV2aWNlLmdhdHQuY29ubmVjdCgpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoc2VydmVyKSB7XG4gICAgICAgIF90aGlzLmFwaVNlcnZlciA9IHNlcnZlcjtcbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcigndXNlcl9jYW5jZWxsZWQnLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIGRpc2Nvbm5lY3QgLSB0ZXJtaW5hdGVzIHRoZSBjb25uZWN0aW9uIHdpdGggdGhlIGRldmljZSBhbmQgcGF1c2VzIGFsbCBkYXRhIHN0cmVhbSBzdWJzY3JpcHRpb25zXG4gICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gc3VjY2Vzc1xuICAgICAgKlxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGlzY29ubmVjdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2Nvbm5lY3QoKSB7XG4gICAgICB0aGlzLmFwaVNlcnZlci5jb25uZWN0ZWQgPyB0aGlzLmFwaVNlcnZlci5kaXNjb25uZWN0KCkgOiBlcnJvckhhbmRsZXIoJ25vdF9jb25uZWN0ZWQnKTtcbiAgICAgIHJldHVybiB0aGlzLmFwaVNlcnZlci5jb25uZWN0ZWQgPyBlcnJvckhhbmRsZXIoJ2lzc3VlX2Rpc2Nvbm5lY3RpbmcnKSA6IHRydWU7XG4gICAgfVxuXG4gICAgLyoqIGdldFZhbHVlIC0gcmVhZHMgdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJpc3RpY19uYW1lIC0gR0FUVCBjaGFyYWN0ZXJpc3RpYyAgbmFtZVxuICAgICAgKiBAcmV0dXJuIHtwcm9taXNlfSAtICByZXNvbHZlcyB3aXRoIGFuIG9iamVjdCB0aGF0IGluY2x1ZGVzIGtleS12YWx1ZSBwYWlycyBmb3IgZWFjaCBvZiB0aGUgcHJvcGVydGllc1xuICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc2Z1bGx5IHJlYWQgYW5kIHBhcnNlZCBmcm9tIHRoZSBkZXZpY2UsIGFzIHdlbGwgYXMgdGhlXG4gICAgICAqICAgICAgICAgICAgICAgICAgICAgICByYXcgdmFsdWUgb2JqZWN0IHJldHVybmVkIGJ5IGEgbmF0aXZlIHJlYWRWYWx1ZSByZXF1ZXN0IHRvIHRoZVxuICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlIGNoYXJhY3RlcmlzdGljLlxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ2V0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZShjaGFyYWN0ZXJpc3RpY19uYW1lKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgaWYgKCFibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignY2hhcmFjdGVyaXN0aWNfZXJyb3InLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYXJhY3RlcmlzdGljT2JqID0gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdO1xuXG4gICAgICBpZiAoIWNoYXJhY3RlcmlzdGljT2JqLmluY2x1ZGVkUHJvcGVydGllcy5pbmNsdWRlcygncmVhZCcpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQXR0ZW1wdGluZyB0byBhY2Nlc3MgcmVhZCBwcm9wZXJ0eSBvZiAnICsgY2hhcmFjdGVyaXN0aWNfbmFtZSArICcsXFxuICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBub3QgYSBpbmNsdWRlZCBhcyBhIHN1cHBvcnRlZCBwcm9wZXJ0eSBvZiB0aGVcXG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLiBBdHRlbXB0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIG9iamVjdCBpbmNsdWRpbmdcXG4gICAgICAgICAgICAgICAgICAgIG9ubHkgYSByYXdWYWx1ZSBwcm9wZXJ0eSB3aXRoIHRoZSBuYXRpdmUgQVBJIHJldHVyblxcbiAgICAgICAgICAgICAgICAgICAgZm9yIGFuIGF0dGVtcHQgdG8gcmVhZFZhbHVlKCkgb2YgJyArIGNoYXJhY3RlcmlzdGljX25hbWUgKyAnLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShfdGhpczIuX3JldHVybkNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciByZXR1cm5PYmogPSBjaGFyYWN0ZXJpc3RpY09iai5wYXJzZVZhbHVlID8gY2hhcmFjdGVyaXN0aWNPYmoucGFyc2VWYWx1ZSh2YWx1ZSkgOiB7fTtcbiAgICAgICAgcmV0dXJuT2JqLnJhd1ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiByZXR1cm5PYmo7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ3JlYWRfZXJyb3InLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIHdyaXRlVmFsdWUgLSB3cml0ZXMgZGF0YSB0byBhIHNwZWNpZmllZCBjaGFyYWN0ZXJpc3RpYyBvZiB0aGUgZGV2aWNlXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJpc3RpY19uYW1lIC0gbmFtZSBvZiB0aGUgR0FUVCBjaGFyYWN0ZXJpc3RpYyBcbiAgICAgICogICAgIGh0dHBzOi8vd3d3LmJsdWV0b290aC5jb20vc3BlY2lmaWNhdGlvbnMvYXNzaWduZWQtbnVtYmVycy9nZW5lcmljLWF0dHJpYnV0ZS1wcm9maWxlXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gdmFsdWUgLSB2YWx1ZSB0byB3cml0ZSB0byB0aGUgcmVxdWVzdGVkIGRldmljZSBjaGFyYWN0ZXJpc3RpY1xuICAgICAgKlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFJlc3VsdCBvZiBhdHRlbXB0IHRvIHdyaXRlIGNoYXJhY3RlcmlzdGljIHdoZXJlIHRydWUgPT09IHN1Y2Nlc3NmdWxseSB3cml0dGVuXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd3cml0ZVZhbHVlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JpdGVWYWx1ZShjaGFyYWN0ZXJpc3RpY19uYW1lLCB2YWx1ZSkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2NoYXJhY3RlcmlzdGljX2Vycm9yJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFyYWN0ZXJpc3RpY09iaiA9IGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXTtcblxuICAgICAgaWYgKCFjaGFyYWN0ZXJpc3RpY09iai5pbmNsdWRlZFByb3BlcnRpZXMuaW5jbHVkZXMoJ3dyaXRlJykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBdHRlbXB0aW5nIHRvIGFjY2VzcyB3cml0ZSBwcm9wZXJ0eSBvZiAnICsgY2hhcmFjdGVyaXN0aWNfbmFtZSArICcsXFxuICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBub3QgYSBpbmNsdWRlZCBhcyBhIHN1cHBvcnRlZCBwcm9wZXJ0eSBvZiB0aGVcXG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLiBBdHRlbXB0IHdpbGwgcmVzb2x2ZSB3aXRoIG5hdGl2ZSBBUEkgcmV0dXJuXFxuICAgICAgICAgICAgICAgICAgICBmb3IgYW4gYXR0ZW1wdCB0byB3cml0ZVZhbHVlKCcgKyB2YWx1ZSArICcpIHRvICcgKyBjaGFyYWN0ZXJpc3RpY19uYW1lICsgJy4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoX3RoaXMzLl9yZXR1cm5DaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShjaGFyYWN0ZXJpc3RpY09iai5wcmVwVmFsdWUgPyBjaGFyYWN0ZXJpc3RpY09iai5wcmVwVmFsdWUodmFsdWUpIDogdmFsdWUpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY2hhbmdlZENoYXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ3dyaXRlX2Vycm9yJywgZXJyLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiBzdGFydE5vdGlmaWNhdGlvbnMgLSBhdHRlbXB0cyB0byBzdGFydCBub3RpZmljYXRpb25zIGZvciBjaGFuZ2VzIHRvIGRldmljZSB2YWx1ZXMgYW5kIGF0dGFjaGVzIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBlYWNoIGRhdGEgdHJhbnNtaXNzaW9uXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJpc3RpY19uYW1lIC0gR0FUVCBjaGFyYWN0ZXJpc3RpYyBuYW1lXG4gICAgICAqIEBwYXJhbSB7Y2FsbGJhY2t9IHRyYW5zbWlzc2lvbkNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBldmVudCB3aGlsZSBub3RpZmljYXRpb25zIGFyZSBhY3RpdmVcbiAgICAgICpcbiAgICAgICogQHJldHVyblxuICAgICAgKlxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnc3RhcnROb3RpZmljYXRpb25zJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnROb3RpZmljYXRpb25zKGNoYXJhY3RlcmlzdGljX25hbWUsIHRyYW5zbWlzc2lvbkNhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgaWYgKCFibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignY2hhcmFjdGVyaXN0aWNfZXJyb3InLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYXJhY3RlcmlzdGljT2JqID0gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdO1xuICAgICAgdmFyIHByaW1hcnlfc2VydmljZV9uYW1lID0gY2hhcmFjdGVyaXN0aWNPYmoucHJpbWFyeVNlcnZpY2VzWzBdO1xuXG4gICAgICBpZiAoIWNoYXJhY3RlcmlzdGljT2JqLmluY2x1ZGVkUHJvcGVydGllcy5pbmNsdWRlcygnbm90aWZ5JykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBdHRlbXB0aW5nIHRvIGFjY2VzcyBub3RpZnkgcHJvcGVydHkgb2YgJyArIGNoYXJhY3RlcmlzdGljX25hbWUgKyAnLFxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgbm90IGEgaW5jbHVkZWQgYXMgYSBzdXBwb3J0ZWQgcHJvcGVydHkgb2YgdGhlXFxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy4gQXR0ZW1wdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBvYmplY3QgaW5jbHVkaW5nXFxuICAgICAgICAgICAgICAgICAgICBvbmx5IGEgcmF3VmFsdWUgcHJvcGVydHkgd2l0aCB0aGUgbmF0aXZlIEFQSSByZXR1cm5cXG4gICAgICAgICAgICAgICAgICAgIGZvciBhbiBhdHRlbXB0IHRvIHN0YXJ0Tm90aWZpY2F0aW9ucygpIGZvciAnICsgY2hhcmFjdGVyaXN0aWNfbmFtZSArICcuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKF90aGlzNC5fcmV0dXJuQ2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSkpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuc3RhcnROb3RpZmljYXRpb25zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXM0LmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXS5ub3RpZnlpbmcgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpYy5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGV2ZW50T2JqID0gY2hhcmFjdGVyaXN0aWNPYmoucGFyc2VWYWx1ZSA/IGNoYXJhY3RlcmlzdGljT2JqLnBhcnNlVmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKSA6IHt9O1xuICAgICAgICAgICAgZXZlbnRPYmoucmF3VmFsdWUgPSBldmVudDtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc21pc3Npb25DYWxsYmFjayhldmVudE9iaik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdzdGFydF9ub3RpZmljYXRpb25zX2Vycm9yJywgZXJyLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiBzdG9wTm90aWZpY2F0aW9ucyAtIGF0dGVtcHRzIHRvIHN0b3AgcHJldmlvdXNseSBzdGFydGVkIG5vdGlmaWNhdGlvbnMgZm9yIGEgcHJvdmlkZWQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlcmlzdGljX25hbWUgLSBHQVRUIGNoYXJhY3RlcmlzdGljIG5hbWVcbiAgICAgICpcbiAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gc3VjY2Vzc1xuICAgICAgKlxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnc3RvcE5vdGlmaWNhdGlvbnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wTm90aWZpY2F0aW9ucyhjaGFyYWN0ZXJpc3RpY19uYW1lKSB7XG4gICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgaWYgKCFibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignY2hhcmFjdGVyaXN0aWNfZXJyb3InLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYXJhY3RlcmlzdGljT2JqID0gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdO1xuICAgICAgdmFyIHByaW1hcnlfc2VydmljZV9uYW1lID0gY2hhcmFjdGVyaXN0aWNPYmoucHJpbWFyeVNlcnZpY2VzWzBdO1xuXG4gICAgICBpZiAodGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0ubm90aWZ5aW5nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoX3RoaXM1Ll9yZXR1cm5DaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgICAgY2hhcmFjdGVyaXN0aWMuc3RvcE5vdGlmaWNhdGlvbnMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNS5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0ubm90aWZ5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ3N0b3Bfbm90aWZpY2F0aW9uc19lcnJvcicsIGVyciwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignc3RvcF9ub3RpZmljYXRpb25zX25vdF9ub3RpZnlpbmcnLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgICogYWRkQ2hhcmFjdGVyaXN0aWMgLSBhZGRzIGEgbmV3IGNoYXJhY3RlcmlzdGljIG9iamVjdCB0byBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlcmlzdGljX25hbWUgLSBHQVRUIGNoYXJhY3RlcmlzdGljIG5hbWUgb3Igb3RoZXIgY2hhcmFjdGVyaXN0aWNcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IHByaW1hcnlfc2VydmljZV9uYW1lIC0gR0FUVCBwcmltYXJ5IHNlcnZpY2UgbmFtZSBvciBvdGhlciBwYXJlbnQgc2VydmljZSBvZiBjaGFyYWN0ZXJpc3RpY1xuICAgICAgKiBAcGFyYW0ge2FycmF5fSBwcm9wZXJ0aWVzQXJyIC0gQXJyYXkgb2YgR0FUVCBwcm9wZXJ0aWVzIGFzIFN0cmluZ3NcbiAgICAgICpcbiAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBSZXN1bHQgb2YgYXR0ZW1wdCB0byBhZGQgY2hhcmFjdGVyaXN0aWMgd2hlcmUgdHJ1ZSA9PT0gc3VjY2Vzc2Z1bGx5IGFkZGVkXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdhZGRDaGFyYWN0ZXJpc3RpYycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZENoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUsIHByaW1hcnlfc2VydmljZV9uYW1lLCBwcm9wZXJ0aWVzQXJyKSB7XG4gICAgICBpZiAoYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2FkZF9jaGFyYWN0ZXJpc3RpY19leGlzdHNfZXJyb3InLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjaGFyYWN0ZXJpc3RpY19uYW1lIHx8IGNoYXJhY3RlcmlzdGljX25hbWUuY29uc3RydWN0b3IgIT09IFN0cmluZyB8fCAhY2hhcmFjdGVyaXN0aWNfbmFtZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignaW1wcm9wZXJfY2hhcmFjdGVyaXN0aWNfZm9ybWF0JywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIGlmICghcHJpbWFyeV9zZXJ2aWNlX25hbWUgfHwgIXByb3BlcnRpZXNBcnIpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCduZXdfY2hhcmFjdGVyaXN0aWNfbWlzc2luZ19wYXJhbXMnLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJpbWFyeV9zZXJ2aWNlX25hbWUuY29uc3RydWN0b3IgIT09IFN0cmluZyB8fCAhcHJpbWFyeV9zZXJ2aWNlX25hbWUubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignaW1wcm9wZXJfc2VydmljZV9mb3JtYXQnLCBudWxsLCBwcmltYXJ5X3NlcnZpY2VfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BlcnRpZXNBcnIuY29uc3RydWN0b3IgIT09IEFycmF5IHx8ICFwcm9wZXJ0aWVzQXJyLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2ltcHJvcGVyX3Byb3BlcnRpZXNfZm9ybWF0JywgbnVsbCwgcHJvcGVydGllc0Fycik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLndhcm4oY2hhcmFjdGVyaXN0aWNfbmFtZSArICcgaXMgbm90IHlldCBmdWxseSBzdXBwb3J0ZWQuJyk7XG5cbiAgICAgICAgYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdID0ge1xuICAgICAgICAgIHByaW1hcnlTZXJ2aWNlczogW3ByaW1hcnlfc2VydmljZV9uYW1lXSxcbiAgICAgICAgICBpbmNsdWRlZFByb3BlcnRpZXM6IHByb3BlcnRpZXNBcnJcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgICogX3JldHVybkNoYXJhY3RlcmlzdGljIC0gcmV0dXJucyB0aGUgdmFsdWUgb2YgYSBjYWNoZWQgb3IgcmVzb2x2ZWQgY2hhcmFjdGVyaXN0aWMgb3IgcmVzb2x2ZWQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlcmlzdGljX25hbWUgLSBHQVRUIGNoYXJhY3RlcmlzdGljIG5hbWVcbiAgICAgICogQHJldHVybiB7b2JqZWN0fGZhbHNlfSAtIHRoZSBjaGFyYWN0ZXJpc3RpYyBvYmplY3QsIGlmIHN1Y2Nlc3NmdWxseSBvYnRhaW5lZFxuICAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnX3JldHVybkNoYXJhY3RlcmlzdGljJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JldHVybkNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpIHtcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgICBpZiAoIWJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdjaGFyYWN0ZXJpc3RpY19lcnJvcicsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhcmFjdGVyaXN0aWNPYmogPSBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV07XG4gICAgICB2YXIgcHJpbWFyeV9zZXJ2aWNlX25hbWUgPSBjaGFyYWN0ZXJpc3RpY09iai5wcmltYXJ5U2VydmljZXNbMF07XG5cbiAgICAgIGlmICh0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXSAmJiB0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXSAmJiB0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXS5jYWNoZWRDaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0uY2FjaGVkQ2hhcmFjdGVyaXN0aWM7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdICYmIHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdLmNhY2hlZFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV0uY2FjaGVkU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKS50aGVuKGZ1bmN0aW9uIChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICAgIF90aGlzNi5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV1bY2hhcmFjdGVyaXN0aWNfbmFtZV0gPSB7IGNhY2hlZENoYXJhY3RlcmlzdGljOiBjaGFyYWN0ZXJpc3RpYyB9O1xuICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpYztcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ19yZXR1cm5DaGFyYWN0ZXJpc3RpY19lcnJvcicsIGVyciwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHByaW1hcnlfc2VydmljZV9uYW1lKS50aGVuKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XG4gICAgICAgICAgX3RoaXM2LmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXSA9IHsgJ2NhY2hlZFNlcnZpY2UnOiBzZXJ2aWNlIH07XG4gICAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgICAgX3RoaXM2LmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXSA9IHsgY2FjaGVkQ2hhcmFjdGVyaXN0aWM6IGNoYXJhY3RlcmlzdGljIH07XG4gICAgICAgICAgcmV0dXJuIGNoYXJhY3RlcmlzdGljO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignX3JldHVybkNoYXJhY3RlcmlzdGljX2Vycm9yJywgZXJyLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJsdWV0b290aERldmljZTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCbHVldG9vdGhEZXZpY2U7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtL0JsdWV0b290aERldmljZS5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmx1ZXRvb3RoTWFwID0ge1xuXHRnYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZzoge1xuXHRcdGJhdHRlcnlfbGV2ZWw6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydiYXR0ZXJ5X3NlcnZpY2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeSddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuYmF0dGVyeV9sZXZlbCA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ymxvb2RfcHJlc3N1cmVfZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Jsb29kX3ByZXNzdXJlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRib2R5X2NvbXBvc2l0aW9uX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydib2R5X2NvbXBvc2l0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRib25kX21hbmFnZW1lbnRfZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2JvbmRfbWFuYWdlbWVudF9mZWF0dXJlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRjZ21fZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2NvbnRpbnVvdXNfZ2x1Y29zZV9tb25pdG9yaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRjZ21fc2Vzc2lvbl9ydW5fdGltZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2NvbnRpbnVvdXNfZ2x1Y29zZV9tb25pdG9yaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRjZ21fc2Vzc2lvbl9zdGFydF90aW1lOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY29udGludW91c19nbHVjb3NlX21vbml0b3JpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJ11cblx0XHR9LFxuXHRcdGNnbV9zdGF0dXM6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjb250aW51b3VzX2dsdWNvc2VfbW9uaXRvcmluZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Y3NjX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjeWNsaW5nX3NwZWVkX2FuZF9jYWRlbmNlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0VWludDE2KDApO1xuXHRcdFx0XHR2YXIgd2hlZWxSZXZvbHV0aW9uRGF0YVN1cHBvcnRlZCA9IGZsYWdzICYgMHgxO1xuXHRcdFx0XHR2YXIgY3JhbmtSZXZvbHV0aW9uRGF0YVN1cHBvcnRlZCA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHR2YXIgbXVsdGlwbGVTZW5zRGF0YVN1cHBvcnRlZCA9IGZsYWdzICYgMHgzO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdGlmICh3aGVlbFJldm9sdXRpb25EYXRhU3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0cmVzdWx0LndoZWVsX3Jldm9sdXRpb25fZGF0YV9zdXBwb3J0ZWQgPSB3aGVlbFJldm9sdXRpb25EYXRhU3VwcG9ydGVkID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjcmFua1Jldm9sdXRpb25EYXRhU3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0cmVzdWx0LmNyYW5rX3Jldm9sdXRpb25fZGF0YV9zdXBwb3J0ZWQgPSBjcmFua1Jldm9sdXRpb25EYXRhU3VwcG9ydGVkID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChtdWx0aXBsZVNlbnNEYXRhU3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0cmVzdWx0Lm11bHRpcGxlX3NlbnNvcnNfc3VwcG9ydGVkID0gbXVsdGlwbGVTZW5zRGF0YVN1cHBvcnRlZCA/IHRydWUgOiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y3VycmVudF90aW1lOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3VycmVudF90aW1lJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZScsICdub3RpZnknXVxuXHRcdH0sXG5cdFx0Y3ljbGluZ19wb3dlcl9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3ljbGluZ19wb3dlciddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0ZmlybXdhcmVfcmV2aXNpb25fc3RyaW5nOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRoYXJkd2FyZV9yZXZpc2lvbl9zdHJpbmc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGllZWVfMTEwNzNfMjA2MDFfcmVndWxhdG9yeV9jZXJ0aWZpY2F0aW9uX2RhdGFfbGlzdDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0J2dhcC5hcHBlYXJhbmNlJzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2dlbmVyaWNfYWNjZXNzJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHQnZ2FwLmRldmljZV9uYW1lJzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2dlbmVyaWNfYWNjZXNzJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZSddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuZGV2aWNlX25hbWUgPSAnJztcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5ieXRlTGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRyZXN1bHQuZGV2aWNlX25hbWUgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh2YWx1ZS5nZXRVaW50OChpKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH0sXG5cdFx0XHRwcmVwVmFsdWU6IGZ1bmN0aW9uIHByZXBWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHZhbHVlLmxlbmd0aCk7XG5cdFx0XHRcdHZhciBwcmVwcGVkVmFsdWUgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcblx0XHRcdFx0dmFsdWUuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGNoYXIsIGkpIHtcblx0XHRcdFx0XHRwcmVwcGVkVmFsdWUuc2V0VWludDgoaSwgY2hhci5jaGFyQ29kZUF0KDApKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBwcmVwcGVkVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnZ2FwLnBlcmlwaGVyYWxfcHJlZmVycmVkX2Nvbm5lY3Rpb25fcGFyYW1ldGVycyc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydnZW5lcmljX2FjY2VzcyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0J2dhcC5wZXJpcGhlcmFsX3ByaXZhY3lfZmxhZyc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydnZW5lcmljX2FjY2VzcyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0Z2x1Y29zZV9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZ2x1Y29zZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0VWludDE2KDApO1xuXHRcdFx0XHRyZXN1bHQubG93X2JhdHRlcnlfZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHgxO1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX21hbGZ1bmN0aW9uX2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl9zYW1wbGVfc2l6ZV9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4NDtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl9zdHJpcF9pbnNlcnRpb25fZXJyb3JfZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHg4O1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX3N0cmlwX3R5cGVfZXJyb3JfZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHgxMDtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl9yZXN1bHRfaGlnaExvd19kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDIwO1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX3RlbXBlcmF0dXJlX2hpZ2hMb3dfZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHg0MDtcblx0XHRcdFx0cmVzdWx0LnNlbnNvcl9yZWFkX2ludGVycnVwdGlvbl9kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDgwO1xuXHRcdFx0XHRyZXN1bHQuZ2VuZXJhbF9kZXZpY2VfZmF1bHRfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDEwMDtcblx0XHRcdFx0cmVzdWx0LnRpbWVfZmF1bHRfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDIwMDtcblx0XHRcdFx0cmVzdWx0Lm11bHRpcGxlX2JvbmRfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDQwMDtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGh0dHBfZW50aXR5X2JvZHk6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydodHRwX3Byb3h5J10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZSddXG5cdFx0fSxcblx0XHRnbHVjb3NlX21lYXN1cmVtZW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZ2x1Y29zZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ25vdGlmeSddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHZhciB0aW1lT2Zmc2V0ID0gZmxhZ3MgJiAweDE7XG5cdFx0XHRcdHZhciBjb25jZW50cmF0aW9uVHlwZVNhbXBsZUxvYyA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHR2YXIgY29uY2VudHJhdGlvblVuaXRzID0gZmxhZ3MgJiAweDQ7XG5cdFx0XHRcdHZhciBzdGF0dXNBbm51bmNpYXRpb24gPSBmbGFncyAmIDB4ODtcblx0XHRcdFx0dmFyIGNvbnRleHRJbmZvcm1hdGlvbiA9IGZsYWdzICYgMHgxMDtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHR2YXIgaW5kZXggPSAxO1xuXHRcdFx0XHRpZiAodGltZU9mZnNldCkge1xuXHRcdFx0XHRcdHJlc3VsdC50aW1lX29mZnNldCA9IHZhbHVlLmdldEludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjb25jZW50cmF0aW9uVHlwZVNhbXBsZUxvYykge1xuXHRcdFx0XHRcdGlmIChjb25jZW50cmF0aW9uVW5pdHMpIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5nbHVjb3NlX2NvbmNlbnRyYWl0b25fbW9sUGVyTCA9IHZhbHVlLmdldEludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5nbHVjb3NlX2NvbmNlbnRyYWl0b25fa2dQZXJMID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGh0dHBfaGVhZGVyczoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2h0dHBfcHJveHknXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJ11cblx0XHR9LFxuXHRcdGh0dHBzX3NlY3VyaXR5OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaHR0cF9wcm94eSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnXVxuXHRcdH0sXG5cdFx0aW50ZXJtZWRpYXRlX3RlbXBlcmF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaGVhbHRoX3RoZXJtb21ldGVyJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZScsICdpbmRpY2F0ZSddXG5cdFx0fSxcblx0XHRsb2NhbF90aW1lX2luZm9ybWF0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3VycmVudF90aW1lJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZSddXG5cdFx0fSxcblx0XHRtYW51ZmFjdHVyZXJfbmFtZV9zdHJpbmc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdG1vZGVsX251bWJlcl9zdHJpbmc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHBucF9pZDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0cHJvdG9jb2xfbW9kZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2h1bWFuX2ludGVyZmFjZV9kZXZpY2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlV2l0aG91dFJlc3BvbnNlJ11cblx0XHR9LFxuXHRcdHJlZmVyZW5jZV90aW1lX2luZm9ybWF0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3VycmVudF90aW1lJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRzdXBwb3J0ZWRfbmV3X2FsZXJ0X2NhdGVnb3J5OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnYWxlcnRfbm90aWZpY2F0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRib2R5X3NlbnNvcl9sb2NhdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2hlYXJ0X3JhdGUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgdmFsID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0c3dpdGNoICh2YWwpIHtcblx0XHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnT3RoZXInO1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdDaGVzdCc7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1dyaXN0Jztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnRmluZ2VyJztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnSGFuZCc7XG5cdFx0XHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0VhciBMb2JlJztcblx0XHRcdFx0XHRjYXNlIDY6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnRm9vdCc7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdVbmtub3duJztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gaGVhcnRfcmF0ZV9jb250cm9sX3BvaW50XG5cdFx0aGVhcnRfcmF0ZV9jb250cm9sX3BvaW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaGVhcnRfcmF0ZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3dyaXRlJ10sXG5cdFx0XHRwcmVwVmFsdWU6IGZ1bmN0aW9uIHByZXBWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuXHRcdFx0XHR2YXIgd3JpdGVWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0XHRcdHdyaXRlVmlldy5zZXRVaW50OCgwLCB2YWx1ZSk7XG5cdFx0XHRcdHJldHVybiB3cml0ZVZpZXc7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoZWFydF9yYXRlX21lYXN1cmVtZW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaGVhcnRfcmF0ZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ25vdGlmeSddLFxuXHRcdFx0LyoqXG4gICBcdCogUGFyc2VzIHRoZSBldmVudC50YXJnZXQudmFsdWUgb2JqZWN0IGFuZCByZXR1cm5zIG9iamVjdCB3aXRoIHJlYWRhYmxlXG4gICBcdCoga2V5LXZhbHVlIHBhaXJzIGZvciBhbGwgYWR2ZXJ0aXNlZCBjaGFyYWN0ZXJpc3RpYyB2YWx1ZXNcbiAgIFx0KlxuICAgXHQqXHRAcGFyYW0ge09iamVjdH0gdmFsdWUgVGFrZXMgZXZlbnQudGFyZ2V0LnZhbHVlIG9iamVjdCBmcm9tIHN0YXJ0Tm90aWZpY2F0aW9ucyBtZXRob2RcbiAgIFx0KlxuICAgXHQqIEByZXR1cm4ge09iamVjdH0gcmVzdWx0IFJldHVybnMgcmVhZGFibGUgb2JqZWN0IHdpdGggcmVsZXZhbnQgY2hhcmFjdGVyaXN0aWMgdmFsdWVzXG4gICBcdCpcbiAgIFx0Ki9cblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHR2YXIgcmF0ZTE2Qml0cyA9IGZsYWdzICYgMHgxO1xuXHRcdFx0XHR2YXIgY29udGFjdERldGVjdGVkID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHZhciBjb250YWN0U2Vuc29yUHJlc2VudCA9IGZsYWdzICYgMHg0O1xuXHRcdFx0XHR2YXIgZW5lcmd5UHJlc2VudCA9IGZsYWdzICYgMHg4O1xuXHRcdFx0XHR2YXIgcnJJbnRlcnZhbFByZXNlbnQgPSBmbGFncyAmIDB4MTA7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0dmFyIGluZGV4ID0gMTtcblx0XHRcdFx0aWYgKHJhdGUxNkJpdHMpIHtcblx0XHRcdFx0XHRyZXN1bHQuaGVhcnRSYXRlID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc3VsdC5oZWFydFJhdGUgPSB2YWx1ZS5nZXRVaW50OChpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29udGFjdFNlbnNvclByZXNlbnQpIHtcblx0XHRcdFx0XHRyZXN1bHQuY29udGFjdERldGVjdGVkID0gISFjb250YWN0RGV0ZWN0ZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGVuZXJneVByZXNlbnQpIHtcblx0XHRcdFx0XHRyZXN1bHQuZW5lcmd5RXhwZW5kZWQgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJySW50ZXJ2YWxQcmVzZW50KSB7XG5cdFx0XHRcdFx0dmFyIHJySW50ZXJ2YWxzID0gW107XG5cdFx0XHRcdFx0Zm9yICg7IGluZGV4ICsgMSA8IHZhbHVlLmJ5dGVMZW5ndGg7IGluZGV4ICs9IDIpIHtcblx0XHRcdFx0XHRcdHJySW50ZXJ2YWxzLnB1c2godmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc3VsdC5yckludGVydmFscyA9IHJySW50ZXJ2YWxzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzZXJpYWxfbnVtYmVyX3N0cmluZzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0c29mdHdhcmVfcmV2aXNpb25fc3RyaW5nOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRzdXBwb3J0ZWRfdW5yZWFkX2FsZXJ0X2NhdGVnb3J5OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnYWxlcnRfbm90aWZpY2F0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRzeXN0ZW1faWQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHRlbXBlcmF0dXJlX3R5cGU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydoZWFsdGhfdGhlcm1vbWV0ZXInXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGRlc2NyaXB0b3JfdmFsdWVfY2hhbmdlZDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ2luZGljYXRlJywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXVxuXHRcdH0sXG5cdFx0YXBwYXJlbnRfd2luZF9kaXJlY3Rpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5hcHBhcmVudF93aW5kX2RpcmVjdGlvbiA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhcHBhcmVudF93aW5kX3NwZWVkOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuYXBwYXJlbnRfd2luZF9zcGVlZCA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZXdfcG9pbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5kZXdfcG9pbnQgPSB2YWx1ZS5nZXRJbnQ4KDApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZWxldmF0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuZWxldmF0aW9uID0gdmFsdWUuZ2V0SW50OCgwKSA8PCAxNiB8IHZhbHVlLmdldEludDgoMSkgPDwgOCB8IHZhbHVlLmdldEludDgoMik7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRndXN0X2ZhY3Rvcjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0Lmd1c3RfZmFjdG9yID0gdmFsdWUuZ2V0VWludDgoMCkgKiAwLjE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoZWF0X2luZGV4OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuaGVhdF9pbmRleCA9IHZhbHVlLmdldEludDgoMCk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRodW1pZGl0eToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblxuXHRcdFx0XHRyZXN1bHQuaHVtaWRpdHkgPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aXJyYWRpYW5jZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblxuXHRcdFx0XHRyZXN1bHQuaXJyYWRpYW5jZSA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJhaW5mYWxsOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXG5cdFx0XHRcdHJlc3VsdC5yYWluZmFsbCA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cHJlc3N1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5wcmVzc3VyZSA9IHZhbHVlLmdldFVpbnQzMigwKSAqIDAuMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRlbXBlcmF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQudGVtcGVyYXR1cmUgPSB2YWx1ZS5nZXRJbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0cnVlX3dpbmRfZGlyZWN0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQudHJ1ZV93aW5kX2RpcmVjdGlvbiA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0cnVlX3dpbmRfc3BlZWQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC50cnVlX3dpbmRfc3BlZWQgPSB2YWx1ZS5nZXRVaW50MTYoMCkgKiAwLjAxO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dXZfaW5kZXg6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC51dl9pbmRleCA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0d2luZF9jaGlsbDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LndpbmRfY2hpbGwgPSB2YWx1ZS5nZXRJbnQ4KDApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YmFyb21ldHJpY19wcmVzc3VyZV90cmVuZDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciB2YWwgPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRzd2l0Y2ggKHZhbCkge1xuXHRcdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ1Vua25vd24nO1xuXHRcdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ0NvbnRpbnVvdXNseSBmYWxsaW5nJztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdDb250aW5vdXNseSByaXNpbmcnO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ0ZhbGxpbmcsIHRoZW4gc3RlYWR5Jztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdSaXNpbmcsIHRoZW4gc3RlYWR5Jztcblx0XHRcdFx0XHRjYXNlIDU6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdGYWxsaW5nIGJlZm9yZSBhIGxlc3NlciByaXNlJztcblx0XHRcdFx0XHRjYXNlIDY6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdGYWxsaW5nIGJlZm9yZSBhIGdyZWF0ZXIgcmlzZSc7XG5cdFx0XHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnUmlzaW5nIGJlZm9yZSBhIGdyZWF0ZXIgZmFsbCc7XG5cdFx0XHRcdFx0Y2FzZSA4OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnUmlzaW5nIGJlZm9yZSBhIGxlc3NlciBmYWxsJztcblx0XHRcdFx0XHRjYXNlIDk6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdTdGVhZHknO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdDb3VsZCBub3QgcmVzb2x2ZSB0byB0cmVuZCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG1hZ25ldGljX2RlY2xpbmF0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXG5cdFx0XHRcdHJlc3VsdC5tYWduZXRpY19kZWNsaW5hdGlvbiA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtYWduZXRpY19mbHV4X2RlbnNpdHlfMkQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdC8vRklYTUU6IG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlc2UgdmFsdWVzIGFyZSBzdG9yZWQgYXQgZGlmZmVyZW50IGJ5dGUgYWRkcmVzc2VzXG5cdFx0XHRcdC8vICAgICAgIGJlbG93IGFzc3VtZXMgdGhhdCB2YWx1ZXMgYXJlIHN0b3JlZCBhdCBzdWNjZXNzaXZlIGJ5dGUgYWRkcmVzc2VzXG5cdFx0XHRcdHJlc3VsdC5tYWduZXRpY19mbHV4X2RlbnNpdHlfeF9heGlzID0gdmFsdWUuZ2V0SW50MTYoMCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSkgKiAwLjAwMDAwMDE7XG5cdFx0XHRcdHJlc3VsdC5tYWduZXRpY19mbHV4X2RlbnNpdHlfeV9heGlzID0gdmFsdWUuZ2V0SW50MTYoMiwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSkgKiAwLjAwMDAwMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtYWduZXRpY19mbHV4X2RlbnNpdHlfM0Q6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdC8vRklYTUU6IG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlc2UgdmFsdWVzIGFyZSBzdG9yZWQgYXQgZGlmZmVyZW50IGJ5dGUgYWRkcmVzc2VzXG5cdFx0XHRcdC8vICAgICAgIGJlbG93IGFzc3VtZXMgdGhhdCB2YWx1ZXMgYXJlIHN0b3JlZCBhdCBzdWNjZXNzaXZlIGJ5dGUgYWRkcmVzc2VzXG5cdFx0XHRcdHJlc3VsdC5tYWduZXRpY19mbHV4X2RlbnNpdHlfeF9heGlzID0gdmFsdWUuZ2V0SW50MTYoMCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSkgKiAwLjAwMDAwMDE7XG5cdFx0XHRcdHJlc3VsdC5tYWduZXRpY19mbHV4X2RlbnNpdHlfeV9heGlzID0gdmFsdWUuZ2V0SW50MTYoMiwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSkgKiAwLjAwMDAwMDE7XG5cdFx0XHRcdHJlc3VsdC5tYWduZXRpY19mbHV4X2RlbnNpdHlfel9heGlzID0gdmFsdWUuZ2V0SW50MTYoNCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSkgKiAwLjAwMDAwMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0eF9wb3dlcl9sZXZlbDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ3R4X3Bvd2VyJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQudHhfcG93ZXJfbGV2ZWwgPSB2YWx1ZS5nZXRJbnQ4KDApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0d2VpZ2h0X3NjYWxlX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWyd3ZWlnaHRfc2NhbGUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldEludDMyKDApO1xuXHRcdFx0XHRyZXN1bHQudGltZV9zdGFtcF9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4MTtcblx0XHRcdFx0cmVzdWx0Lm11bHRpcGxlX3NlbnNvcnNfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHJlc3VsdC5CTUlfc3VwcG9ydGVkID0gZmxhZ3MgJiAweDQ7XG5cdFx0XHRcdHN3aXRjaCAoZmxhZ3MgJiAweDc4ID4+IDMpIHtcblx0XHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnTm90IHNwZWNpZmllZCc7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC41IGtnIG9yIDEgbGInO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMiBrZyBvciAwLjUgbGInO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMSBrZyBvciAwLjIgbGInO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMDUga2cgb3IgMC4xIGxiJztcblx0XHRcdFx0XHRjYXNlIDU6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjAyIGtnIG9yIDAuMDUgbGInO1xuXHRcdFx0XHRcdGNhc2UgNjpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMDEga2cgb3IgMC4wMiBsYic7XG5cdFx0XHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4wMDUga2cgb3IgMC4wMSBsYic7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdDb3VsZCBub3QgcmVzb2x2ZSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChmbGFncyAmIDB4MzgwID4+IDcpIHtcblx0XHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnTm90IHNwZWNpZmllZCc7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmhlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4xIG1ldGVyIG9yIDEgaW5jaCc7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmhlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4wMDUgbWV0ZXIgb3IgMC41IGluY2gnO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdHJlc3VsdC5oZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMDAxIG1ldGVyIG9yIDAuMSBpbmNoJztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmhlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ0NvdWxkIG5vdCByZXNvbHZlJztcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBSZW1haW5pbmcgZmxhZ3MgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSB1c2Vcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGNzY19tZWFzdXJlbWVudDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N5Y2xpbmdfc3BlZWRfYW5kX2NhZGVuY2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydub3RpZnknXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHR2YXIgd2hlZWxSZXZvbHV0aW9uID0gZmxhZ3MgJiAweDE7IC8vaW50ZWdlciA9IHRydXRoeSwgMCA9IGZhbHN5XG5cdFx0XHRcdHZhciBjcmFua1Jldm9sdXRpb24gPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHR2YXIgaW5kZXggPSAxO1xuXHRcdFx0XHRpZiAod2hlZWxSZXZvbHV0aW9uKSB7XG5cdFx0XHRcdFx0cmVzdWx0LmN1bXVsYXRpdmVfd2hlZWxfcmV2b2x1dGlvbnMgPSB2YWx1ZS5nZXRVaW50MzIoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDQ7XG5cdFx0XHRcdFx0cmVzdWx0Lmxhc3Rfd2hlZWxfZXZlbnRfdGltZV9wZXJfMTAyNHMgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNyYW5rUmV2b2x1dGlvbikge1xuXHRcdFx0XHRcdHJlc3VsdC5jdW11bGF0aXZlX2NyYW5rX3Jldm9sdXRpb25zID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRcdHJlc3VsdC5sYXN0X2NyYW5rX2V2ZW50X3RpbWVfcGVyXzEwMjRzID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzZW5zb3JfbG9jYXRpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjeWNsaW5nX3NwZWVkX2FuZF9jYWRlbmNlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHZhbCA9IHZhbHVlLmdldFVpbnQxNigwKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRzd2l0Y2ggKHZhbCkge1xuXHRcdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdPdGhlcic7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1RvcCBvZiBzaG93Jztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnSW4gc2hvZSc7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0hpcCc7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0Zyb250IFdoZWVsJztcblx0XHRcdFx0XHRjYXNlIDU6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnTGVmdCBDcmFuayc7XG5cdFx0XHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1JpZ2h0IENyYW5rJztcblx0XHRcdFx0XHRjYXNlIDc6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnTGVmdCBQZWRhbCc7XG5cdFx0XHRcdFx0Y2FzZSA4OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1JpZ2h0IFBlZGFsJztcblx0XHRcdFx0XHRjYXNlIDk6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnRnJvbnQgSHViJztcblx0XHRcdFx0XHRjYXNlIDEwOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1JlYXIgRHJvcG91dCc7XG5cdFx0XHRcdFx0Y2FzZSAxMTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdDaGFpbnN0YXknO1xuXHRcdFx0XHRcdGNhc2UgMTI6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnUmVhciBXaGVlbCc7XG5cdFx0XHRcdFx0Y2FzZSAxMzpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdSZWFyIEh1Yic7XG5cdFx0XHRcdFx0Y2FzZSAxNDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdDaGVzdCc7XG5cdFx0XHRcdFx0Y2FzZSAxNTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdTcGlkZXInO1xuXHRcdFx0XHRcdGNhc2UgMTY6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnQ2hhaW4gUmluZyc7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdVbmtub3duJztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c2NfY29udHJvbF9wb2ludDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N5Y2xpbmdfc3BlZWRfYW5kX2NhZGVuY2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWyd3cml0ZScsICdpbmRpY2F0ZSddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGN5Y2xpbmdfcG93ZXJfbWVhc3VyZW1lbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjeWNsaW5nX3Bvd2VyJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnbm90aWZ5J10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRVaW50MTYoMCk7XG5cdFx0XHRcdHZhciBwZWRhbF9wb3dlcl9iYWxhbmNlX3ByZXNlbnQgPSBmbGFncyAmIDB4MTtcblx0XHRcdFx0dmFyIHBlZGFsX3Bvd2VyX3JlZmVyZW5jZSA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHR2YXIgYWNjdW11bGF0ZWRfdG9ycXVlX3ByZXNlbnQgPSBmbGFncyAmIDB4NDtcblx0XHRcdFx0dmFyIGFjY3VtdWxhdGVkX3RvcnF1ZV9zb3VyY2UgPSBmbGFncyAmIDB4ODtcblx0XHRcdFx0dmFyIHdoZWVsX3Jldm9sdXRpb25fZGF0YV9wcmVzZW50ID0gZmxhZ3MgJiAweDEwO1xuXHRcdFx0XHR2YXIgY3JhbmtfcmV2b2x1dGlvbl9kYXRhX3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciBleHRyZW1lX2ZvcmNlX21hZ25pdHVkZV9wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgZXh0cmVtZV90b3JxdWVfbWFnbml0dWRlX3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciBleHRyZW1lX2FuZ2xlc19wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgdG9wX2RlYWRfc3BvdF9hbmdsZV9wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgYm90dG9tX2RlYWRfc3BvdF9hbmdsZV9wcmVzZW50ID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgYWNjdW11bGF0ZWRfZW5lcmd5X3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciBvZmZzZXRfY29tcGVuc2F0aW9uX2luZGljYXRvciA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHR2YXIgaW5kZXggPSAxO1xuXHRcdFx0XHQvL1dhdHRzIHdpdGggcmVzb2x1dGlvbiBvZiAxXG5cdFx0XHRcdHJlc3VsdC5pbnN0YW50YW5lb3VzX3Bvd2VyID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgpO1xuXHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRpZiAocGVkYWxfcG93ZXJfcmVmZXJlbmNlKSB7XG5cdFx0XHRcdFx0Ly9QZXJjZW50YWdlIHdpdGggcmVzb2x1dGlvbiBvZiAxLzJcblx0XHRcdFx0XHRyZXN1bHQucGVkYWxfcG93ZXJfYmFsYW5jZSA9IHZhbHVlLmdldFVpbnQ4KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRlZF90b3JxdWVfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8vUGVyY2VudGFnZSB3aXRoIHJlc29sdXRpb24gb2YgMS8yXG5cdFx0XHRcdFx0cmVzdWx0LmFjY3VtdWxhdGVkX3RvcnF1ZSA9IHZhbHVlLmdldFVpbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAod2hlZWxfcmV2b2x1dGlvbl9kYXRhX3ByZXNlbnQpIHtcblx0XHRcdFx0XHRyZXN1bHQuY3VtdWxhdGl2ZV93aGVlbF9yZXZvbHV0aW9ucyA9IHZhbHVlLlVpbnQzMihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gNDtcblx0XHRcdFx0XHRyZXN1bHQubGFzdF93aGVlbF9ldmVudF90aW1lX3Blcl8yMDQ4cyA9IHZhbHVlLlVpbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY3JhbmtfcmV2b2x1dGlvbl9kYXRhX3ByZXNlbnQpIHtcblx0XHRcdFx0XHRyZXN1bHQuY3VtdWxhdGl2ZV9jcmFua19yZXZvbHV0aW9ucyA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0XHRyZXN1bHQubGFzdF9jcmFua19ldmVudF90aW1lX3Blcl8xMDI0cyA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXh0cmVtZV9mb3JjZV9tYWduaXR1ZGVfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8vTmV3dG9uIG1ldGVycyB3aXRoIHJlc29sdXRpb24gb2YgMSBUT0RPOiB1bml0cz9cblx0XHRcdFx0XHRyZXN1bHQubWF4aW11bV9mb3JjZV9tYWduaXR1ZGUgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0XHRyZXN1bHQubWluaW11bV9mb3JjZV9tYWduaXR1ZGUgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXh0cmVtZV90b3JxdWVfbWFnbml0dWRlX3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL05ld3RvbiBtZXRlcnMgd2l0aCByZXNvbHV0aW9uIG9mIDEgVE9ETzogdW5pdHM/XG5cdFx0XHRcdFx0cmVzdWx0Lm1heGltdW1fdG9ycXVlX21hZ25pdHVkZSA9IHZhbHVlLmdldEludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRcdHJlc3VsdC5taW5pbXVtX3RvcnF1ZV9tYWduaXR1ZGUgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXh0cmVtZV9hbmdsZXNfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8vVE9ETzogVUlOVDEyLlxuXHRcdFx0XHRcdC8vTmV3dG9uIG1ldGVycyB3aXRoIHJlc29sdXRpb24gb2YgMSBUT0RPOiB1bml0cz9cblx0XHRcdFx0XHQvLyByZXN1bHQubWF4aW11bV9hbmdsZSA9IHZhbHVlLmdldEludDEyKGluZGV4KTtcblx0XHRcdFx0XHQvLyBpbmRleCArPSAyO1xuXHRcdFx0XHRcdC8vIHJlc3VsdC5taW5pbXVtX2FuZ2xlID0gdmFsdWUuZ2V0SW50MTIoaW5kZXgpO1xuXHRcdFx0XHRcdC8vIGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRvcF9kZWFkX3Nwb3RfYW5nbGVfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8vUGVyY2VudGFnZSB3aXRoIHJlc29sdXRpb24gb2YgMS8yXG5cdFx0XHRcdFx0cmVzdWx0LnRvcF9kZWFkX3Nwb3RfYW5nbGUgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGJvdHRvbV9kZWFkX3Nwb3RfYW5nbGVfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8vUGVyY2VudGFnZSB3aXRoIHJlc29sdXRpb24gb2YgMS8yXG5cdFx0XHRcdFx0cmVzdWx0LmJvdHRvbV9kZWFkX3Nwb3RfYW5nbGUgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGFjY3VtdWxhdGVkX2VuZXJneV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9raWxvam91bGVzIHdpdGggcmVzb2x1dGlvbiBvZiAxIFRPRE86IHVuaXRzP1xuXHRcdFx0XHRcdHJlc3VsdC5hY2N1bXVsYXRlZF9lbmVyZ3kgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGdhdHRTZXJ2aWNlTGlzdDogWydhbGVydF9ub3RpZmljYXRpb24nLCAnYXV0b21hdGlvbl9pbycsICdiYXR0ZXJ5X3NlcnZpY2UnLCAnYmxvb2RfcHJlc3N1cmUnLCAnYm9keV9jb21wb3NpdGlvbicsICdib25kX21hbmFnZW1lbnQnLCAnY29udGludW91c19nbHVjb3NlX21vbml0b3JpbmcnLCAnY3VycmVudF90aW1lJywgJ2N5Y2xpbmdfcG93ZXInLCAnY3ljbGluZ19zcGVlZF9hbmRfY2FkZW5jZScsICdkZXZpY2VfaW5mb3JtYXRpb24nLCAnZW52aXJvbm1lbnRhbF9zZW5zaW5nJywgJ2dlbmVyaWNfYWNjZXNzJywgJ2dlbmVyaWNfYXR0cmlidXRlJywgJ2dsdWNvc2UnLCAnaGVhbHRoX3RoZXJtb21ldGVyJywgJ2hlYXJ0X3JhdGUnLCAnaHVtYW5faW50ZXJmYWNlX2RldmljZScsICdpbW1lZGlhdGVfYWxlcnQnLCAnaW5kb29yX3Bvc2l0aW9uaW5nJywgJ2ludGVybmV0X3Byb3RvY29sX3N1cHBvcnQnLCAnbGlua19sb3NzJywgJ2xvY2F0aW9uX2FuZF9uYXZpZ2F0aW9uJywgJ25leHRfZHN0X2NoYW5nZScsICdwaG9uZV9hbGVydF9zdGF0dXMnLCAncHVsc2Vfb3hpbWV0ZXInLCAncmVmZXJlbmNlX3RpbWVfdXBkYXRlJywgJ3J1bm5pbmdfc3BlZWRfYW5kX2NhZGVuY2UnLCAnc2Nhbl9wYXJhbWV0ZXJzJywgJ3R4X3Bvd2VyJywgJ3VzZXJfZGF0YScsICd3ZWlnaHRfc2NhbGUnXVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBibHVldG9vdGhNYXA7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtL2JsdWV0b290aE1hcC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKiBlcnJvckhhbmRsZXIgLSBDb25zb2xvZGF0ZXMgZXJyb3IgbWVzc2FnZSBjb25maWd1cmF0aW9uIGFuZCBsb2dpY1xuKlxuKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JLZXkgLSBtYXBzIHRvIGEgZGV0YWlsZWQgZXJyb3IgbWVzc2FnZVxuKiBAcGFyYW0ge29iamVjdH0gbmF0aXZlRXJyb3IgLSB0aGUgbmF0aXZlIEFQSSBlcnJvciBvYmplY3QsIGlmIHByZXNlbnRcbiogQHBhcmFtIHt9IGFsdGVybmF0ZSAtIFxuKlxuKi9cbmZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcktleSwgbmF0aXZlRXJyb3IsIGFsdGVybmF0ZSkge1xuXG5cdFx0dmFyIGVycm9yTWVzc2FnZXMgPSB7XG5cdFx0XHRcdGFkZF9jaGFyYWN0ZXJpc3RpY19leGlzdHNfZXJyb3I6IFwiQ2hhcmFjdGVyaXN0aWMgXCIgKyBhbHRlcm5hdGUgKyBcIiBhbHJlYWR5IGV4aXN0cy5cIixcblx0XHRcdFx0Y2hhcmFjdGVyaXN0aWNfZXJyb3I6IFwiQ2hhcmFjdGVyaXN0aWMgXCIgKyBhbHRlcm5hdGUgKyBcIiBub3QgZm91bmQuIEFkZCBcIiArIGFsdGVybmF0ZSArIFwiIHRvIGRldmljZSB1c2luZyBhZGRDaGFyYWN0ZXJpc3RpYyBvciB0cnkgYW5vdGhlciBjaGFyYWN0ZXJpc3RpYy5cIixcblx0XHRcdFx0Y29ubmVjdF9nYXR0OiBcIkNvdWxkIG5vdCBjb25uZWN0IHRvIEdBVFQuIERldmljZSBtaWdodCBiZSBvdXQgb2YgcmFuZ2UuIEFsc28gY2hlY2sgdG8gc2VlIGlmIGZpbHRlcnMgYXJlIHZhaWxkLlwiLFxuXHRcdFx0XHRjb25uZWN0X3NlcnZlcjogXCJDb3VsZCBub3QgY29ubmVjdCB0byBzZXJ2ZXIgb24gZGV2aWNlLlwiLFxuXHRcdFx0XHRjb25uZWN0X3NlcnZpY2U6IFwiQ291bGQgbm90IGZpbmQgc2VydmljZS5cIixcblx0XHRcdFx0ZGlzY29ubmVjdF90aW1lb3V0OiBcIlRpbWVkIG91dC4gQ291bGQgbm90IGRpc2Nvbm5lY3QuXCIsXG5cdFx0XHRcdGRpc2Nvbm5lY3RfZXJyb3I6IFwiQ291bGQgbm90IGRpc2Nvbm5lY3QgZnJvbSBkZXZpY2UuXCIsXG5cdFx0XHRcdGltcHJvcGVyX2NoYXJhY3RlcmlzdGljX2Zvcm1hdDogYWx0ZXJuYXRlICsgXCIgaXMgbm90IGEgcHJvcGVybHkgZm9ybWF0dGVkIGNoYXJhY3RlcmlzdGljLlwiLFxuXHRcdFx0XHRpbXByb3Blcl9wcm9wZXJ0aWVzX2Zvcm1hdDogYWx0ZXJuYXRlICsgXCIgaXMgbm90IGEgcHJvcGVybHkgZm9ybWF0dGVkIHByb3BlcnRpZXMgYXJyYXkuXCIsXG5cdFx0XHRcdGltcHJvcGVyX3NlcnZpY2VfZm9ybWF0OiBhbHRlcm5hdGUgKyBcIiBpcyBub3QgYSBwcm9wZXJseSBmb3JtYXR0ZWQgc2VydmljZS5cIixcblx0XHRcdFx0aXNzdWVfZGlzY29ubmVjdGluZzogXCJJc3N1ZSBkaXNjb25uZWN0aW5nIHdpdGggZGV2aWNlLlwiLFxuXHRcdFx0XHRuZXdfY2hhcmFjdGVyaXN0aWNfbWlzc2luZ19wYXJhbXM6IGFsdGVybmF0ZSArIFwiIGlzIG5vdCBhIGZ1bGx5IHN1cHBvcnRlZCBjaGFyYWN0ZXJpc3RpYy4gUGxlYXNlIHByb3ZpZGUgYW4gYXNzb2NpYXRlZCBwcmltYXJ5IHNlcnZpY2UgYW5kIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eS5cIixcblx0XHRcdFx0bm9fZGV2aWNlOiBcIk5vIGluc3RhbmNlIG9mIGRldmljZSBmb3VuZC5cIixcblx0XHRcdFx0bm9fZmlsdGVyczogXCJObyBmaWx0ZXJzIGZvdW5kIG9uIGluc3RhbmNlIG9mIERldmljZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHBsZWFzZSB2aXNpdCBodHRwOi8vc2FiZXJ0b290aC5pby8jbWV0aG9kLW5ld2RldmljZVwiLFxuXHRcdFx0XHRub19yZWFkX3Byb3BlcnR5OiBcIk5vIHJlYWQgcHJvcGVydHkgb24gY2hhcmFjdGVyaXN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIuXCIsXG5cdFx0XHRcdG5vX3dyaXRlX3Byb3BlcnR5OiBcIk5vIHdyaXRlIHByb3BlcnR5IG9uIHRoaXMgY2hhcmFjdGVyaXN0aWMuXCIsXG5cdFx0XHRcdG5vdF9jb25uZWN0ZWQ6IFwiQ291bGQgbm90IGRpc2Nvbm5lY3QuIERldmljZSBub3QgY29ubmVjdGVkLlwiLFxuXHRcdFx0XHRwYXJzaW5nX25vdF9zdXBwb3J0ZWQ6IFwiUGFyc2luZyBub3Qgc3VwcG9ydGVkIGZvciBjaGFyYWN0ZXJzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiLlwiLFxuXHRcdFx0XHRyZWFkX2Vycm9yOiBcIkNhbm5vdCByZWFkIHZhbHVlIG9uIHRoZSBjaGFyYWN0ZXJpc3RpYy5cIixcblx0XHRcdFx0X3JldHVybkNoYXJhY3RlcmlzdGljX2Vycm9yOiBcIkVycm9yIGFjY2Vzc2luZyBjaGFyYWN0ZXJpc3RpYyBcIiArIGFsdGVybmF0ZSArIFwiLlwiLFxuXHRcdFx0XHRzdGFydF9ub3RpZmljYXRpb25zX2Vycm9yOiBcIk5vdCBhYmxlIHRvIHJlYWQgc3RyZWFtIG9mIGRhdGEgZnJvbSBjaGFyYWN0ZXJpc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIi5cIixcblx0XHRcdFx0c3RhcnRfbm90aWZpY2F0aW9uc19ub19ub3RpZnk6IFwiTm8gbm90aWZ5IHByb3BlcnR5IGZvdW5kIG9uIHRoaXMgY2hhcmFjdGVyaXN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIuXCIsXG5cdFx0XHRcdHN0b3Bfbm90aWZpY2F0aW9uc19ub3Rfbm90aWZ5aW5nOiBcIk5vdGlmaWNhdGlvbnMgbm90IGVzdGFibGlzaGVkIGZvciBjaGFyYWN0ZXJpc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIiBvciB5b3UgaGF2ZSBub3Qgc3RhcnRlZCBub3RpZmljYXRpb25zLlwiLFxuXHRcdFx0XHRzdG9wX25vdGlmaWNhdGlvbnNfZXJyb3I6IFwiSXNzdWUgc3RvcHBpbmcgbm90aWZpY2F0aW9ucyBmb3IgY2hhcmFjdGVyaXN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIgb3IgeW91IGhhdmUgbm90IHN0YXJ0ZWQgbm90aWZpY2F0aW9ucy5cIixcblx0XHRcdFx0dXNlcl9jYW5jZWxsZWQ6IFwiVXNlciBjYW5jZWxsZWQgdGhlIHBlcm1pc3Npb24gcmVxdWVzdC5cIixcblx0XHRcdFx0dXVpZF9lcnJvcjogXCJJbnZhbGlkIFVVSUQuIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHByb3BlciBmb3JtYXR0aW5nIG9mIFVVSURzLCB2aXNpdCBodHRwczovL3dlYmJsdWV0b290aGNnLmdpdGh1Yi5pby93ZWItYmx1ZXRvb3RoLyN1dWlkc1wiLFxuXHRcdFx0XHR3cml0ZV9lcnJvcjogXCJDb3VsZCBub3QgY2hhbmdlIHZhbHVlIG9mIGNoYXJhY3RlcmlzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiLlwiLFxuXHRcdFx0XHR3cml0ZV9wZXJtaXNzaW9uczogYWx0ZXJuYXRlICsgXCIgY2hhcmFjdGVyaXN0aWMgZG9lcyBub3QgaGF2ZSBhIHdyaXRlIHByb3BlcnR5LlwiXG5cdFx0fTtcblxuXHRcdHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2VzW2Vycm9yS2V5XSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVycm9ySGFuZGxlcjtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG0vZXJyb3JIYW5kbGVyLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG1cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9ucG0vQmx1ZXRvb3RoRGV2aWNlJyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvbnBtLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGhcIikiXX0=
