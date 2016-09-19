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
  name: 'echo'
};
let blue;

const connectButton = document.getElementById('js-connect');
const disconnectButton = document.getElementById('js-disconnect');

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

  // setTimeout(() => {
  //   stateManager.change('connected');
  //   connectButton.disabled = false;
  // },
	// 1000);
});

disconnectButton.addEventListener('click', () => {
  if ( blue.disconnect() ) {
    stateManager.change('init');
  } else {
    console.log('error while disconnect');
  }
});

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_cd796fed.js","/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvYXBwL3NjcmlwdHMvYXBwL3N0YXRlLmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL2FwcC9zY3JpcHRzL2Zha2VfY2Q3OTZmZWQuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbS9CbHVldG9vdGhEZXZpY2UuanMiLCIvVXNlcnMvai52YWxsZWx1bmdhL1dvcmtzcGFjZXMvdGVzaXMvc2VhbWxlc3MtcG9zdGVyLWNvbnRyb2wvbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG0vYmx1ZXRvb3RoTWFwLmpzIiwiL1VzZXJzL2oudmFsbGVsdW5nYS9Xb3Jrc3BhY2VzL3Rlc2lzL3NlYW1sZXNzLXBvc3Rlci1jb250cm9sL25vZGVfbW9kdWxlcy93ZWItYmx1ZXRvb3RoL2Rpc3QvbnBtL2Vycm9ySGFuZGxlci5qcyIsIi9Vc2Vycy9qLnZhbGxlbHVuZ2EvV29ya3NwYWNlcy90ZXNpcy9zZWFtbGVzcy1wb3N0ZXItY29udHJvbC9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9ucG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3R3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblxuY2xhc3MgU3RhdGVNYW5hZ2VyIHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnN0YXRlID0gJ2luaXQnO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzdGF0ZS0nICsgdGhpcy5zdGF0ZSk7XG4gIH1cblxuICBjaGFuZ2Uoc3RhdGUpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdGUtJyArIHRoaXMuc3RhdGUpO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3RhdGUtJyArIHRoaXMuc3RhdGUpO1xuICB9XG59XG5cbmNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtc3RhdGUtbWFuYWdlcicpO1xuY29uc3Qgc3RhdGVNYW5hZ2VyID0gbmV3IFN0YXRlTWFuYWdlcihlbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGF0ZU1hbmFnZXI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvYXBwL3N0YXRlLmpzXCIsXCIvYXBwXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgQmx1ZXRvb3RoRGV2aWNlID0gcmVxdWlyZSgnd2ViLWJsdWV0b290aCcpO1xuY29uc3Qgc3RhdGVNYW5hZ2VyID0gcmVxdWlyZSgnLi9hcHAvc3RhdGUuanMnKTtcblxuY29uc3QgZmlsdGVyID0ge1xuICBuYW1lOiAnZWNobydcbn07XG5sZXQgYmx1ZTtcblxuY29uc3QgY29ubmVjdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jb25uZWN0Jyk7XG5jb25zdCBkaXNjb25uZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWRpc2Nvbm5lY3QnKTtcblxuY29ubmVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIHN0YXRlTWFuYWdlci5jaGFuZ2UoJ2Nvbm5lY3RpbmcnKTtcblxuICBibHVlID0gbmV3IEJsdWV0b290aERldmljZShmaWx0ZXIpO1xuICBibHVlLmNvbm5lY3QoKVxuICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkZXZpY2UpO1xuICAgICAgc3RhdGVNYW5hZ2VyLmNoYW5nZSgnY29ubmVjdGVkJyk7XG4gICAgICBjb25uZWN0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgc3RhdGVNYW5hZ2VyLmNoYW5nZSgnaW5pdCcpO1xuICAgICAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gIC8vIHNldFRpbWVvdXQoKCkgPT4ge1xuICAvLyAgIHN0YXRlTWFuYWdlci5jaGFuZ2UoJ2Nvbm5lY3RlZCcpO1xuICAvLyAgIGNvbm5lY3RCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgLy8gfSxcblx0Ly8gMTAwMCk7XG59KTtcblxuZGlzY29ubmVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgaWYgKCBibHVlLmRpc2Nvbm5lY3QoKSApIHtcbiAgICBzdGF0ZU1hbmFnZXIuY2hhbmdlKCdpbml0Jyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ2Vycm9yIHdoaWxlIGRpc2Nvbm5lY3QnKTtcbiAgfVxufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV9jZDc5NmZlZC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImI1NW1XRVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBibHVldG9vdGggPSByZXF1aXJlKCcuL2JsdWV0b290aE1hcCcpO1xudmFyIGVycm9ySGFuZGxlciA9IHJlcXVpcmUoJy4vZXJyb3JIYW5kbGVyJyk7XG5cbi8qKiBCbHVldG9vdGhEZXZpY2UgLVxuICAqXG4gICogQG1ldGhvZCBjb25uZWN0IC0gRXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHdpdGggdGhlIGRldmljZVxuICAqIEBtZXRob2QgY29ubmVjdGVkIC0gY2hlY2tzIGFwaURldmljZSB0byBzZWUgd2hldGhlciBkZXZpY2UgaXMgY29ubmVjdGVkXG4gICogQG1ldGhvZCBkaXNjb25uZWN0IC0gdGVybWluYXRlcyB0aGUgY29ubmVjdGlvbiB3aXRoIHRoZSBkZXZpY2UgYW5kIHBhdXNlcyBhbGwgZGF0YSBzdHJlYW0gc3Vic2NyaXB0aW9uc1xuICAqIEBtZXRob2QgZ2V0VmFsdWUgLSByZWFkcyB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgY2hhcmFjdGVyaXN0aWNcbiAgKiBAbWV0aG9kIHdyaXRlVmFsdWUgLSB3cml0ZXMgZGF0YSB0byBhIHNwZWNpZmllZCBjaGFyYWN0ZXJpc3RpYyBvZiB0aGUgZGV2aWNlXG4gICogQG1ldGhvZCBzdGFydE5vdGlmaWNhdGlvbnMgLSBhdHRlbXB0cyB0byBzdGFydCBub3RpZmljYXRpb25zIGZvciBjaGFuZ2VzIHRvIGRldmljZSB2YWx1ZXMgYW5kIGF0dGFjaGVzIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBlYWNoIGRhdGEgdHJhbnNtaXNzaW9uXG4gICogQG1ldGhvZCBzdG9wTm90aWZpY2F0aW9ucyAtIGF0dGVtcHRzIHRvIHN0b3AgcHJldmlvdXNseSBzdGFydGVkIG5vdGlmaWNhdGlvbnMgZm9yIGEgcHJvdmlkZWQgY2hhcmFjdGVyaXN0aWNcbiAgKiBAbWV0aG9kIGFkZENoYXJhY3RlcmlzdGljIC0gYWRkcyBhIG5ldyBjaGFyYWN0ZXJpc3RpYyBvYmplY3QgdG8gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nXG4gICogQG1ldGhvZCBfcmV0dXJuQ2hhcmFjdGVyaXN0aWMgLSBfcmV0dXJuQ2hhcmFjdGVyaXN0aWMgLSByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGNhY2hlZCBvciByZXNvbHZlZCBjaGFyYWN0ZXJpc3RpYyBvciByZXNvbHZlZCBjaGFyYWN0ZXJpc3RpY1xuICAqXG4gICogQHBhcmFtIHtvYmplY3R9IGZpbHRlcnMgLSBjb2xsZWN0aW9uIG9mIGZpbHRlcnMgZm9yIGRldmljZSBzZWxlY3Rpbi4gQWxsIGZpbHRlcnMgYXJlIG9wdGlvbmFsLCBidXQgYXQgbGVhc3QgMSBpcyByZXF1aXJlZC5cbiAgKiAgICAgICAgICAubmFtZSB7c3RyaW5nfVxuICAqICAgICAgICAgIC5uYW1lUHJlZml4IHtzdHJpbmd9XG4gICogICAgICAgICAgLnV1aWQge3N0cmluZ31cbiAgKiAgICAgICAgICAuc2VydmljZXMge2FycmF5fVxuICAqICAgICAgICAgIC5vcHRpb25hbFNlcnZpY2VzIHthcnJheX0gLSBkZWZhdWx0cyB0byBhbGwgYXZhaWxhYmxlIHNlcnZpY2VzLCB1c2UgYW4gZW1wdHkgYXJyYXkgdG8gZ2V0IG5vIG9wdGlvbmFsIHNlcnZpY2VzXG4gICpcbiAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgYSBuZXcgaW5zdGFuY2Ugb2YgQmx1ZXRvb3RoRGV2aWNlXG4gICpcbiAgKi9cblxudmFyIEJsdWV0b290aERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQmx1ZXRvb3RoRGV2aWNlKHJlcXVlc3RQYXJhbXMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmx1ZXRvb3RoRGV2aWNlKTtcblxuICAgIHRoaXMucmVxdWVzdFBhcmFtcyA9IHJlcXVlc3RQYXJhbXM7XG4gICAgdGhpcy5hcGlEZXZpY2UgPSBudWxsO1xuICAgIHRoaXMuYXBpU2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmNhY2hlID0ge307XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmx1ZXRvb3RoRGV2aWNlLCBbe1xuICAgIGtleTogJ2Nvbm5lY3RlZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3RlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwaURldmljZSA/IHRoaXMuYXBpRGV2aWNlLmdhdHQuY29ubmVjdGVkIDogZXJyb3JIYW5kbGVyKCdub19kZXZpY2UnKTtcbiAgICB9XG5cbiAgICAvKiogY29ubmVjdCAtIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB3aXRoIHRoZSBkZXZpY2VcbiAgICAgICogICBcbiAgICAgICogTk9URTogVGhpcyBtZXRob2QgbXVzdCBiZSB0cmlnZ2VyZWQgYnkgYSB1c2VyIGdlc3R1cmUgdG8gc2F0aXNmeSB0aGUgbmF0aXZlIEFQSSdzIHBlcm1pc3Npb25zXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge29iamVjdH0gLSBuYXRpdmUgYnJvd3NlciBBUEkgZGV2aWNlIHNlcnZlciBvYmplY3RcbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2Nvbm5lY3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0KCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLnJlcXVlc3RQYXJhbXM7XG4gICAgICB2YXIgcmVxdWVzdFBhcmFtcyA9IHsgZmlsdGVyczogW10gfTtcbiAgICAgIHZhciB1dWlkUmVnZXggPSAvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVswLTlhLWZdezR9LVswLTlhLWZdLztcblxuICAgICAgaWYgKCFPYmplY3Qua2V5cyhmaWx0ZXJzKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignbm9fZmlsdGVycycpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnMubmFtZSkgcmVxdWVzdFBhcmFtcy5maWx0ZXJzLnB1c2goeyBuYW1lOiBmaWx0ZXJzLm5hbWUgfSk7XG4gICAgICBpZiAoZmlsdGVycy5uYW1lUHJlZml4KSByZXF1ZXN0UGFyYW1zLmZpbHRlcnMucHVzaCh7IG5hbWVQcmVmaXg6IGZpbHRlcnMubmFtZVByZWZpeCB9KTtcbiAgICAgIGlmIChmaWx0ZXJzLnV1aWQpIHtcbiAgICAgICAgaWYgKCFmaWx0ZXJzLnV1aWQubWF0Y2godXVpZFJlZ2V4KSkge1xuICAgICAgICAgIGVycm9ySGFuZGxlcigndXVpZF9lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcXVlc3RQYXJhbXMuZmlsdGVycy5wdXNoKHsgdXVpZDogZmlsdGVycy51dWlkIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVycy5zZXJ2aWNlcykge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBzZXJ2aWNlcyA9IFtdO1xuICAgICAgICAgIGZpbHRlcnMuc2VydmljZXMuZm9yRWFjaChmdW5jdGlvbiAoc2VydmljZSkge1xuICAgICAgICAgICAgaWYgKCFibHVldG9vdGguZ2F0dFNlcnZpY2VMaXN0LmluY2x1ZGVzKHNlcnZpY2UpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihzZXJ2aWNlICsgJyBpcyBub3QgYSB2YWxpZCBzZXJ2aWNlLiBQbGVhc2UgY2hlY2sgdGhlIHNlcnZpY2UgbmFtZS4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlcnZpY2VzLnB1c2goc2VydmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVxdWVzdFBhcmFtcy5maWx0ZXJzLnB1c2goeyBzZXJ2aWNlczogc2VydmljZXMgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVycy5vcHRpb25hbF9zZXJ2aWNlcykge1xuICAgICAgICBmaWx0ZXJzLm9wdGlvbmFsX3NlcnZpY2VzLmZvckVhY2goZnVuY3Rpb24gKHNlcnZpY2UpIHtcbiAgICAgICAgICBpZiAoIWJsdWV0b290aC5nYXR0U2VydmljZUxpc3QuaW5jbHVkZXMoc2VydmljZSkpIGJsdWV0b290aC5nYXR0U2VydmljZUxpc3QucHVzaChzZXJ2aWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0UGFyYW1zLm9wdGlvbmFsU2VydmljZXMgPSBibHVldG9vdGguZ2F0dFNlcnZpY2VMaXN0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHJlcXVlc3RQYXJhbXMpLnRoZW4oZnVuY3Rpb24gKGRldmljZSkge1xuICAgICAgICBfdGhpcy5hcGlEZXZpY2UgPSBkZXZpY2U7XG4gICAgICAgIHJldHVybiBkZXZpY2UuZ2F0dC5jb25uZWN0KCk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChzZXJ2ZXIpIHtcbiAgICAgICAgX3RoaXMuYXBpU2VydmVyID0gc2VydmVyO1xuICAgICAgICByZXR1cm4gc2VydmVyO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCd1c2VyX2NhbmNlbGxlZCcsIGVycik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogZGlzY29ubmVjdCAtIHRlcm1pbmF0ZXMgdGhlIGNvbm5lY3Rpb24gd2l0aCB0aGUgZGV2aWNlIGFuZCBwYXVzZXMgYWxsIGRhdGEgc3RyZWFtIHN1YnNjcmlwdGlvbnNcbiAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBzdWNjZXNzXG4gICAgICAqXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkaXNjb25uZWN0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcbiAgICAgIHRoaXMuYXBpU2VydmVyLmNvbm5lY3RlZCA/IHRoaXMuYXBpU2VydmVyLmRpc2Nvbm5lY3QoKSA6IGVycm9ySGFuZGxlcignbm90X2Nvbm5lY3RlZCcpO1xuICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmVyLmNvbm5lY3RlZCA/IGVycm9ySGFuZGxlcignaXNzdWVfZGlzY29ubmVjdGluZycpIDogdHJ1ZTtcbiAgICB9XG5cbiAgICAvKiogZ2V0VmFsdWUgLSByZWFkcyB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlcmlzdGljX25hbWUgLSBHQVRUIGNoYXJhY3RlcmlzdGljICBuYW1lXG4gICAgICAqIEByZXR1cm4ge3Byb21pc2V9IC0gIHJlc29sdmVzIHdpdGggYW4gb2JqZWN0IHRoYXQgaW5jbHVkZXMga2V5LXZhbHVlIHBhaXJzIGZvciBlYWNoIG9mIHRoZSBwcm9wZXJ0aWVzXG4gICAgICAqICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZnVsbHkgcmVhZCBhbmQgcGFyc2VkIGZyb20gdGhlIGRldmljZSwgYXMgd2VsbCBhcyB0aGVcbiAgICAgICogICAgICAgICAgICAgICAgICAgICAgIHJhdyB2YWx1ZSBvYmplY3QgcmV0dXJuZWQgYnkgYSBuYXRpdmUgcmVhZFZhbHVlIHJlcXVlc3QgdG8gdGhlXG4gICAgICAqICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2UgY2hhcmFjdGVyaXN0aWMuXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdnZXRWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKGNoYXJhY3RlcmlzdGljX25hbWUpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBpZiAoIWJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdjaGFyYWN0ZXJpc3RpY19lcnJvcicsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhcmFjdGVyaXN0aWNPYmogPSBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV07XG5cbiAgICAgIGlmICghY2hhcmFjdGVyaXN0aWNPYmouaW5jbHVkZWRQcm9wZXJ0aWVzLmluY2x1ZGVzKCdyZWFkJykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBdHRlbXB0aW5nIHRvIGFjY2VzcyByZWFkIHByb3BlcnR5IG9mICcgKyBjaGFyYWN0ZXJpc3RpY19uYW1lICsgJyxcXG4gICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIG5vdCBhIGluY2x1ZGVkIGFzIGEgc3VwcG9ydGVkIHByb3BlcnR5IG9mIHRoZVxcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMuIEF0dGVtcHQgd2lsbCByZXNvbHZlIHdpdGggYW4gb2JqZWN0IGluY2x1ZGluZ1xcbiAgICAgICAgICAgICAgICAgICAgb25seSBhIHJhd1ZhbHVlIHByb3BlcnR5IHdpdGggdGhlIG5hdGl2ZSBBUEkgcmV0dXJuXFxuICAgICAgICAgICAgICAgICAgICBmb3IgYW4gYXR0ZW1wdCB0byByZWFkVmFsdWUoKSBvZiAnICsgY2hhcmFjdGVyaXN0aWNfbmFtZSArICcuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKF90aGlzMi5fcmV0dXJuQ2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSkpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcmlzdGljLnJlYWRWYWx1ZSgpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHJldHVybk9iaiA9IGNoYXJhY3RlcmlzdGljT2JqLnBhcnNlVmFsdWUgPyBjaGFyYWN0ZXJpc3RpY09iai5wYXJzZVZhbHVlKHZhbHVlKSA6IHt9O1xuICAgICAgICByZXR1cm5PYmoucmF3VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHJldHVybk9iajtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcigncmVhZF9lcnJvcicsIGVycik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogd3JpdGVWYWx1ZSAtIHdyaXRlcyBkYXRhIHRvIGEgc3BlY2lmaWVkIGNoYXJhY3RlcmlzdGljIG9mIHRoZSBkZXZpY2VcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlcmlzdGljX25hbWUgLSBuYW1lIG9mIHRoZSBHQVRUIGNoYXJhY3RlcmlzdGljIFxuICAgICAgKiAgICAgaHR0cHM6Ly93d3cuYmx1ZXRvb3RoLmNvbS9zcGVjaWZpY2F0aW9ucy9hc3NpZ25lZC1udW1iZXJzL2dlbmVyaWMtYXR0cmlidXRlLXByb2ZpbGVcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB2YWx1ZSAtIHZhbHVlIHRvIHdyaXRlIHRvIHRoZSByZXF1ZXN0ZWQgZGV2aWNlIGNoYXJhY3RlcmlzdGljXG4gICAgICAqXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gUmVzdWx0IG9mIGF0dGVtcHQgdG8gd3JpdGUgY2hhcmFjdGVyaXN0aWMgd2hlcmUgdHJ1ZSA9PT0gc3VjY2Vzc2Z1bGx5IHdyaXR0ZW5cbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3dyaXRlVmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cml0ZVZhbHVlKGNoYXJhY3RlcmlzdGljX25hbWUsIHZhbHVlKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgaWYgKCFibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignY2hhcmFjdGVyaXN0aWNfZXJyb3InLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYXJhY3RlcmlzdGljT2JqID0gYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdO1xuXG4gICAgICBpZiAoIWNoYXJhY3RlcmlzdGljT2JqLmluY2x1ZGVkUHJvcGVydGllcy5pbmNsdWRlcygnd3JpdGUnKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRpbmcgdG8gYWNjZXNzIHdyaXRlIHByb3BlcnR5IG9mICcgKyBjaGFyYWN0ZXJpc3RpY19uYW1lICsgJyxcXG4gICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIG5vdCBhIGluY2x1ZGVkIGFzIGEgc3VwcG9ydGVkIHByb3BlcnR5IG9mIHRoZVxcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMuIEF0dGVtcHQgd2lsbCByZXNvbHZlIHdpdGggbmF0aXZlIEFQSSByZXR1cm5cXG4gICAgICAgICAgICAgICAgICAgIGZvciBhbiBhdHRlbXB0IHRvIHdyaXRlVmFsdWUoJyArIHZhbHVlICsgJykgdG8gJyArIGNoYXJhY3RlcmlzdGljX25hbWUgKyAnLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShfdGhpczMuX3JldHVybkNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpYy53cml0ZVZhbHVlKGNoYXJhY3RlcmlzdGljT2JqLnByZXBWYWx1ZSA/IGNoYXJhY3RlcmlzdGljT2JqLnByZXBWYWx1ZSh2YWx1ZSkgOiB2YWx1ZSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjaGFuZ2VkQ2hhcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignd3JpdGVfZXJyb3InLCBlcnIsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIHN0YXJ0Tm90aWZpY2F0aW9ucyAtIGF0dGVtcHRzIHRvIHN0YXJ0IG5vdGlmaWNhdGlvbnMgZm9yIGNoYW5nZXMgdG8gZGV2aWNlIHZhbHVlcyBhbmQgYXR0YWNoZXMgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVhY2ggZGF0YSB0cmFuc21pc3Npb25cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlcmlzdGljX25hbWUgLSBHQVRUIGNoYXJhY3RlcmlzdGljIG5hbWVcbiAgICAgICogQHBhcmFtIHtjYWxsYmFja30gdHJhbnNtaXNzaW9uQ2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGV2ZW50IHdoaWxlIG5vdGlmaWNhdGlvbnMgYXJlIGFjdGl2ZVxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuXG4gICAgICAqXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdzdGFydE5vdGlmaWNhdGlvbnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydE5vdGlmaWNhdGlvbnMoY2hhcmFjdGVyaXN0aWNfbmFtZSwgdHJhbnNtaXNzaW9uQ2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICBpZiAoIWJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdjaGFyYWN0ZXJpc3RpY19lcnJvcicsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhcmFjdGVyaXN0aWNPYmogPSBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV07XG4gICAgICB2YXIgcHJpbWFyeV9zZXJ2aWNlX25hbWUgPSBjaGFyYWN0ZXJpc3RpY09iai5wcmltYXJ5U2VydmljZXNbMF07XG5cbiAgICAgIGlmICghY2hhcmFjdGVyaXN0aWNPYmouaW5jbHVkZWRQcm9wZXJ0aWVzLmluY2x1ZGVzKCdub3RpZnknKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRpbmcgdG8gYWNjZXNzIG5vdGlmeSBwcm9wZXJ0eSBvZiAnICsgY2hhcmFjdGVyaXN0aWNfbmFtZSArICcsXFxuICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBub3QgYSBpbmNsdWRlZCBhcyBhIHN1cHBvcnRlZCBwcm9wZXJ0eSBvZiB0aGVcXG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLiBBdHRlbXB0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIG9iamVjdCBpbmNsdWRpbmdcXG4gICAgICAgICAgICAgICAgICAgIG9ubHkgYSByYXdWYWx1ZSBwcm9wZXJ0eSB3aXRoIHRoZSBuYXRpdmUgQVBJIHJldHVyblxcbiAgICAgICAgICAgICAgICAgICAgZm9yIGFuIGF0dGVtcHQgdG8gc3RhcnROb3RpZmljYXRpb25zKCkgZm9yICcgKyBjaGFyYWN0ZXJpc3RpY19uYW1lICsgJy4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoX3RoaXM0Ll9yZXR1cm5DaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5zdGFydE5vdGlmaWNhdGlvbnMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczQuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdLm5vdGlmeWluZyA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGNoYXJhY3RlcmlzdGljLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRPYmogPSBjaGFyYWN0ZXJpc3RpY09iai5wYXJzZVZhbHVlID8gY2hhcmFjdGVyaXN0aWNPYmoucGFyc2VWYWx1ZShldmVudC50YXJnZXQudmFsdWUpIDoge307XG4gICAgICAgICAgICBldmVudE9iai5yYXdWYWx1ZSA9IGV2ZW50O1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWlzc2lvbkNhbGxiYWNrKGV2ZW50T2JqKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ3N0YXJ0X25vdGlmaWNhdGlvbnNfZXJyb3InLCBlcnIsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIHN0b3BOb3RpZmljYXRpb25zIC0gYXR0ZW1wdHMgdG8gc3RvcCBwcmV2aW91c2x5IHN0YXJ0ZWQgbm90aWZpY2F0aW9ucyBmb3IgYSBwcm92aWRlZCBjaGFyYWN0ZXJpc3RpY1xuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyaXN0aWNfbmFtZSAtIEdBVFQgY2hhcmFjdGVyaXN0aWMgbmFtZVxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBzdWNjZXNzXG4gICAgICAqXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdzdG9wTm90aWZpY2F0aW9ucycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3BOb3RpZmljYXRpb25zKGNoYXJhY3RlcmlzdGljX25hbWUpIHtcbiAgICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgICBpZiAoIWJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXSkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdjaGFyYWN0ZXJpc3RpY19lcnJvcicsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhcmFjdGVyaXN0aWNPYmogPSBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV07XG4gICAgICB2YXIgcHJpbWFyeV9zZXJ2aWNlX25hbWUgPSBjaGFyYWN0ZXJpc3RpY09iai5wcmltYXJ5U2VydmljZXNbMF07XG5cbiAgICAgIGlmICh0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXS5ub3RpZnlpbmcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShfdGhpczUuX3JldHVybkNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpKTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5zdG9wTm90aWZpY2F0aW9ucygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM1LmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXS5ub3RpZnlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignc3RvcF9ub3RpZmljYXRpb25zX2Vycm9yJywgZXJyLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdzdG9wX25vdGlmaWNhdGlvbnNfbm90X25vdGlmeWluZycsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAgKiBhZGRDaGFyYWN0ZXJpc3RpYyAtIGFkZHMgYSBuZXcgY2hhcmFjdGVyaXN0aWMgb2JqZWN0IHRvIGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1xuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyaXN0aWNfbmFtZSAtIEdBVFQgY2hhcmFjdGVyaXN0aWMgbmFtZSBvciBvdGhlciBjaGFyYWN0ZXJpc3RpY1xuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJpbWFyeV9zZXJ2aWNlX25hbWUgLSBHQVRUIHByaW1hcnkgc2VydmljZSBuYW1lIG9yIG90aGVyIHBhcmVudCBzZXJ2aWNlIG9mIGNoYXJhY3RlcmlzdGljXG4gICAgICAqIEBwYXJhbSB7YXJyYXl9IHByb3BlcnRpZXNBcnIgLSBBcnJheSBvZiBHQVRUIHByb3BlcnRpZXMgYXMgU3RyaW5nc1xuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFJlc3VsdCBvZiBhdHRlbXB0IHRvIGFkZCBjaGFyYWN0ZXJpc3RpYyB3aGVyZSB0cnVlID09PSBzdWNjZXNzZnVsbHkgYWRkZWRcbiAgICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2FkZENoYXJhY3RlcmlzdGljJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkQ2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSwgcHJpbWFyeV9zZXJ2aWNlX25hbWUsIHByb3BlcnRpZXNBcnIpIHtcbiAgICAgIGlmIChibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignYWRkX2NoYXJhY3RlcmlzdGljX2V4aXN0c19lcnJvcicsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWNoYXJhY3RlcmlzdGljX25hbWUgfHwgY2hhcmFjdGVyaXN0aWNfbmFtZS5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8ICFjaGFyYWN0ZXJpc3RpY19uYW1lLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdpbXByb3Blcl9jaGFyYWN0ZXJpc3RpY19mb3JtYXQnLCBudWxsLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0pIHtcbiAgICAgICAgaWYgKCFwcmltYXJ5X3NlcnZpY2VfbmFtZSB8fCAhcHJvcGVydGllc0Fycikge1xuICAgICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ25ld19jaGFyYWN0ZXJpc3RpY19taXNzaW5nX3BhcmFtcycsIG51bGwsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmltYXJ5X3NlcnZpY2VfbmFtZS5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8ICFwcmltYXJ5X3NlcnZpY2VfbmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdpbXByb3Blcl9zZXJ2aWNlX2Zvcm1hdCcsIG51bGwsIHByaW1hcnlfc2VydmljZV9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydGllc0Fyci5jb25zdHJ1Y3RvciAhPT0gQXJyYXkgfHwgIXByb3BlcnRpZXNBcnIubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignaW1wcm9wZXJfcHJvcGVydGllc19mb3JtYXQnLCBudWxsLCBwcm9wZXJ0aWVzQXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUud2FybihjaGFyYWN0ZXJpc3RpY19uYW1lICsgJyBpcyBub3QgeWV0IGZ1bGx5IHN1cHBvcnRlZC4nKTtcblxuICAgICAgICBibHVldG9vdGguZ2F0dENoYXJhY3RlcmlzdGljc01hcHBpbmdbY2hhcmFjdGVyaXN0aWNfbmFtZV0gPSB7XG4gICAgICAgICAgcHJpbWFyeVNlcnZpY2VzOiBbcHJpbWFyeV9zZXJ2aWNlX25hbWVdLFxuICAgICAgICAgIGluY2x1ZGVkUHJvcGVydGllczogcHJvcGVydGllc0FyclxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAgKiBfcmV0dXJuQ2hhcmFjdGVyaXN0aWMgLSByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGNhY2hlZCBvciByZXNvbHZlZCBjaGFyYWN0ZXJpc3RpYyBvciByZXNvbHZlZCBjaGFyYWN0ZXJpc3RpY1xuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyaXN0aWNfbmFtZSAtIEdBVFQgY2hhcmFjdGVyaXN0aWMgbmFtZVxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R8ZmFsc2V9IC0gdGhlIGNoYXJhY3RlcmlzdGljIG9iamVjdCwgaWYgc3VjY2Vzc2Z1bGx5IG9idGFpbmVkXG4gICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdfcmV0dXJuQ2hhcmFjdGVyaXN0aWMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcmV0dXJuQ2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNfbmFtZSkge1xuICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgIGlmICghYmx1ZXRvb3RoLmdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nW2NoYXJhY3RlcmlzdGljX25hbWVdKSB7XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIoJ2NoYXJhY3RlcmlzdGljX2Vycm9yJywgbnVsbCwgY2hhcmFjdGVyaXN0aWNfbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFyYWN0ZXJpc3RpY09iaiA9IGJsdWV0b290aC5nYXR0Q2hhcmFjdGVyaXN0aWNzTWFwcGluZ1tjaGFyYWN0ZXJpc3RpY19uYW1lXTtcbiAgICAgIHZhciBwcmltYXJ5X3NlcnZpY2VfbmFtZSA9IGNoYXJhY3RlcmlzdGljT2JqLnByaW1hcnlTZXJ2aWNlc1swXTtcblxuICAgICAgaWYgKHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdICYmIHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdICYmIHRoaXMuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdLmNhY2hlZENoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXS5jYWNoZWRDaGFyYWN0ZXJpc3RpYztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV0gJiYgdGhpcy5jYWNoZVtwcmltYXJ5X3NlcnZpY2VfbmFtZV0uY2FjaGVkU2VydmljZSkge1xuICAgICAgICB0aGlzLmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXS5jYWNoZWRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljX25hbWUpLnRoZW4oZnVuY3Rpb24gKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgICAgX3RoaXM2LmNhY2hlW3ByaW1hcnlfc2VydmljZV9uYW1lXVtjaGFyYWN0ZXJpc3RpY19uYW1lXSA9IHsgY2FjaGVkQ2hhcmFjdGVyaXN0aWM6IGNoYXJhY3RlcmlzdGljIH07XG4gICAgICAgICAgcmV0dXJuIGNoYXJhY3RlcmlzdGljO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9ySGFuZGxlcignX3JldHVybkNoYXJhY3RlcmlzdGljX2Vycm9yJywgZXJyLCBjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGlTZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UocHJpbWFyeV9zZXJ2aWNlX25hbWUpLnRoZW4oZnVuY3Rpb24gKHNlcnZpY2UpIHtcbiAgICAgICAgICBfdGhpczYuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdID0geyAnY2FjaGVkU2VydmljZSc6IHNlcnZpY2UgfTtcbiAgICAgICAgICByZXR1cm4gc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY19uYW1lKTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgICBfdGhpczYuY2FjaGVbcHJpbWFyeV9zZXJ2aWNlX25hbWVdW2NoYXJhY3RlcmlzdGljX25hbWVdID0geyBjYWNoZWRDaGFyYWN0ZXJpc3RpYzogY2hhcmFjdGVyaXN0aWMgfTtcbiAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWM7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyKCdfcmV0dXJuQ2hhcmFjdGVyaXN0aWNfZXJyb3InLCBlcnIsIGNoYXJhY3RlcmlzdGljX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQmx1ZXRvb3RoRGV2aWNlO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJsdWV0b290aERldmljZTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG0vQmx1ZXRvb3RoRGV2aWNlLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG1cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBibHVldG9vdGhNYXAgPSB7XG5cdGdhdHRDaGFyYWN0ZXJpc3RpY3NNYXBwaW5nOiB7XG5cdFx0YmF0dGVyeV9sZXZlbDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2JhdHRlcnlfc2VydmljZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5J10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5iYXR0ZXJ5X2xldmVsID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRibG9vZF9wcmVzc3VyZV9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnYmxvb2RfcHJlc3N1cmUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGJvZHlfY29tcG9zaXRpb25fZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2JvZHlfY29tcG9zaXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGJvbmRfbWFuYWdlbWVudF9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnYm9uZF9tYW5hZ2VtZW50X2ZlYXR1cmUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGNnbV9mZWF0dXJlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY29udGludW91c19nbHVjb3NlX21vbml0b3JpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGNnbV9zZXNzaW9uX3J1bl90aW1lOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY29udGludW91c19nbHVjb3NlX21vbml0b3JpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGNnbV9zZXNzaW9uX3N0YXJ0X3RpbWU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjb250aW51b3VzX2dsdWNvc2VfbW9uaXRvcmluZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnXVxuXHRcdH0sXG5cdFx0Y2dtX3N0YXR1czoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2NvbnRpbnVvdXNfZ2x1Y29zZV9tb25pdG9yaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRjc2NfZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N5Y2xpbmdfc3BlZWRfYW5kX2NhZGVuY2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRVaW50MTYoMCk7XG5cdFx0XHRcdHZhciB3aGVlbFJldm9sdXRpb25EYXRhU3VwcG9ydGVkID0gZmxhZ3MgJiAweDE7XG5cdFx0XHRcdHZhciBjcmFua1Jldm9sdXRpb25EYXRhU3VwcG9ydGVkID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHZhciBtdWx0aXBsZVNlbnNEYXRhU3VwcG9ydGVkID0gZmxhZ3MgJiAweDM7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0aWYgKHdoZWVsUmV2b2x1dGlvbkRhdGFTdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRyZXN1bHQud2hlZWxfcmV2b2x1dGlvbl9kYXRhX3N1cHBvcnRlZCA9IHdoZWVsUmV2b2x1dGlvbkRhdGFTdXBwb3J0ZWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNyYW5rUmV2b2x1dGlvbkRhdGFTdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRyZXN1bHQuY3JhbmtfcmV2b2x1dGlvbl9kYXRhX3N1cHBvcnRlZCA9IGNyYW5rUmV2b2x1dGlvbkRhdGFTdXBwb3J0ZWQgPyB0cnVlIDogZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG11bHRpcGxlU2Vuc0RhdGFTdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRyZXN1bHQubXVsdGlwbGVfc2Vuc29yc19zdXBwb3J0ZWQgPSBtdWx0aXBsZVNlbnNEYXRhU3VwcG9ydGVkID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjdXJyZW50X3RpbWU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjdXJyZW50X3RpbWUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJywgJ25vdGlmeSddXG5cdFx0fSxcblx0XHRjeWNsaW5nX3Bvd2VyX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjeWNsaW5nX3Bvd2VyJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRmaXJtd2FyZV9yZXZpc2lvbl9zdHJpbmc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGhhcmR3YXJlX3JldmlzaW9uX3N0cmluZzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0aWVlZV8xMTA3M18yMDYwMV9yZWd1bGF0b3J5X2NlcnRpZmljYXRpb25fZGF0YV9saXN0OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHQnZ2FwLmFwcGVhcmFuY2UnOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZ2VuZXJpY19hY2Nlc3MnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdCdnYXAuZGV2aWNlX25hbWUnOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZ2VuZXJpY19hY2Nlc3MnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5kZXZpY2VfbmFtZSA9ICcnO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmJ5dGVMZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHJlc3VsdC5kZXZpY2VfbmFtZSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZhbHVlLmdldFVpbnQ4KGkpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fSxcblx0XHRcdHByZXBWYWx1ZTogZnVuY3Rpb24gcHJlcFZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodmFsdWUubGVuZ3RoKTtcblx0XHRcdFx0dmFyIHByZXBwZWRWYWx1ZSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHRcdFx0XHR2YWx1ZS5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoY2hhciwgaSkge1xuXHRcdFx0XHRcdHByZXBwZWRWYWx1ZS5zZXRVaW50OChpLCBjaGFyLmNoYXJDb2RlQXQoMCkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHByZXBwZWRWYWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdnYXAucGVyaXBoZXJhbF9wcmVmZXJyZWRfY29ubmVjdGlvbl9wYXJhbWV0ZXJzJzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2dlbmVyaWNfYWNjZXNzJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHQnZ2FwLnBlcmlwaGVyYWxfcHJpdmFjeV9mbGFnJzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2dlbmVyaWNfYWNjZXNzJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRnbHVjb3NlX2ZlYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydnbHVjb3NlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRVaW50MTYoMCk7XG5cdFx0XHRcdHJlc3VsdC5sb3dfYmF0dGVyeV9kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDE7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3JfbWFsZnVuY3Rpb25fZGV0ZWN0aW9uX3N1cHBvcnRlZCA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX3NhbXBsZV9zaXplX3N1cHBvcnRlZCA9IGZsYWdzICYgMHg0O1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX3N0cmlwX2luc2VydGlvbl9lcnJvcl9kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDg7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3Jfc3RyaXBfdHlwZV9lcnJvcl9kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDEwO1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX3Jlc3VsdF9oaWdoTG93X2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4MjA7XG5cdFx0XHRcdHJlc3VsdC5zZW5zb3JfdGVtcGVyYXR1cmVfaGlnaExvd19kZXRlY3Rpb25fc3VwcG9ydGVkID0gZmxhZ3MgJiAweDQwO1xuXHRcdFx0XHRyZXN1bHQuc2Vuc29yX3JlYWRfaW50ZXJydXB0aW9uX2RldGVjdGlvbl9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4ODA7XG5cdFx0XHRcdHJlc3VsdC5nZW5lcmFsX2RldmljZV9mYXVsdF9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4MTAwO1xuXHRcdFx0XHRyZXN1bHQudGltZV9mYXVsdF9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4MjAwO1xuXHRcdFx0XHRyZXN1bHQubXVsdGlwbGVfYm9uZF9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4NDAwO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aHR0cF9lbnRpdHlfYm9keToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2h0dHBfcHJveHknXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJ11cblx0XHR9LFxuXHRcdGdsdWNvc2VfbWVhc3VyZW1lbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydnbHVjb3NlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnbm90aWZ5J10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgZmxhZ3MgPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0dmFyIHRpbWVPZmZzZXQgPSBmbGFncyAmIDB4MTtcblx0XHRcdFx0dmFyIGNvbmNlbnRyYXRpb25UeXBlU2FtcGxlTG9jID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHZhciBjb25jZW50cmF0aW9uVW5pdHMgPSBmbGFncyAmIDB4NDtcblx0XHRcdFx0dmFyIHN0YXR1c0FubnVuY2lhdGlvbiA9IGZsYWdzICYgMHg4O1xuXHRcdFx0XHR2YXIgY29udGV4dEluZm9ybWF0aW9uID0gZmxhZ3MgJiAweDEwO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHZhciBpbmRleCA9IDE7XG5cdFx0XHRcdGlmICh0aW1lT2Zmc2V0KSB7XG5cdFx0XHRcdFx0cmVzdWx0LnRpbWVfb2Zmc2V0ID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNvbmNlbnRyYXRpb25UeXBlU2FtcGxlTG9jKSB7XG5cdFx0XHRcdFx0aWYgKGNvbmNlbnRyYXRpb25Vbml0cykge1xuXHRcdFx0XHRcdFx0cmVzdWx0LmdsdWNvc2VfY29uY2VudHJhaXRvbl9tb2xQZXJMID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzdWx0LmdsdWNvc2VfY29uY2VudHJhaXRvbl9rZ1BlckwgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aHR0cF9oZWFkZXJzOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaHR0cF9wcm94eSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGUnXVxuXHRcdH0sXG5cdFx0aHR0cHNfc2VjdXJpdHk6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydodHRwX3Byb3h5J10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICd3cml0ZSddXG5cdFx0fSxcblx0XHRpbnRlcm1lZGlhdGVfdGVtcGVyYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydoZWFsdGhfdGhlcm1vbWV0ZXInXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJywgJ2luZGljYXRlJ11cblx0XHR9LFxuXHRcdGxvY2FsX3RpbWVfaW5mb3JtYXRpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjdXJyZW50X3RpbWUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ3dyaXRlJ11cblx0XHR9LFxuXHRcdG1hbnVmYWN0dXJlcl9uYW1lX3N0cmluZzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0bW9kZWxfbnVtYmVyX3N0cmluZzoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0cG5wX2lkOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRwcm90b2NvbF9tb2RlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaHVtYW5faW50ZXJmYWNlX2RldmljZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnd3JpdGVXaXRob3V0UmVzcG9uc2UnXVxuXHRcdH0sXG5cdFx0cmVmZXJlbmNlX3RpbWVfaW5mb3JtYXRpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydjdXJyZW50X3RpbWUnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHN1cHBvcnRlZF9uZXdfYWxlcnRfY2F0ZWdvcnk6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydhbGVydF9ub3RpZmljYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdGJvZHlfc2Vuc29yX2xvY2F0aW9uOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnaGVhcnRfcmF0ZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciB2YWwgPSB2YWx1ZS5nZXRVaW50OCgwKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRzd2l0Y2ggKHZhbCkge1xuXHRcdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdPdGhlcic7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0NoZXN0Jztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnV3Jpc3QnO1xuXHRcdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdGaW5nZXInO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdIYW5kJztcblx0XHRcdFx0XHRjYXNlIDU6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnRWFyIExvYmUnO1xuXHRcdFx0XHRcdGNhc2UgNjpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdGb290Jztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1Vua25vd24nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBoZWFydF9yYXRlX2NvbnRyb2xfcG9pbnRcblx0XHRoZWFydF9yYXRlX2NvbnRyb2xfcG9pbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydoZWFydF9yYXRlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnd3JpdGUnXSxcblx0XHRcdHByZXBWYWx1ZTogZnVuY3Rpb24gcHJlcFZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG5cdFx0XHRcdHZhciB3cml0ZVZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcblx0XHRcdFx0d3JpdGVWaWV3LnNldFVpbnQ4KDAsIHZhbHVlKTtcblx0XHRcdFx0cmV0dXJuIHdyaXRlVmlldztcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhlYXJ0X3JhdGVfbWVhc3VyZW1lbnQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydoZWFydF9yYXRlJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnbm90aWZ5J10sXG5cdFx0XHQvKipcbiAgIFx0KiBQYXJzZXMgdGhlIGV2ZW50LnRhcmdldC52YWx1ZSBvYmplY3QgYW5kIHJldHVybnMgb2JqZWN0IHdpdGggcmVhZGFibGVcbiAgIFx0KiBrZXktdmFsdWUgcGFpcnMgZm9yIGFsbCBhZHZlcnRpc2VkIGNoYXJhY3RlcmlzdGljIHZhbHVlc1xuICAgXHQqXG4gICBcdCpcdEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUYWtlcyBldmVudC50YXJnZXQudmFsdWUgb2JqZWN0IGZyb20gc3RhcnROb3RpZmljYXRpb25zIG1ldGhvZFxuICAgXHQqXG4gICBcdCogQHJldHVybiB7T2JqZWN0fSByZXN1bHQgUmV0dXJucyByZWFkYWJsZSBvYmplY3Qgd2l0aCByZWxldmFudCBjaGFyYWN0ZXJpc3RpYyB2YWx1ZXNcbiAgIFx0KlxuICAgXHQqL1xuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHZhciByYXRlMTZCaXRzID0gZmxhZ3MgJiAweDE7XG5cdFx0XHRcdHZhciBjb250YWN0RGV0ZWN0ZWQgPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0dmFyIGNvbnRhY3RTZW5zb3JQcmVzZW50ID0gZmxhZ3MgJiAweDQ7XG5cdFx0XHRcdHZhciBlbmVyZ3lQcmVzZW50ID0gZmxhZ3MgJiAweDg7XG5cdFx0XHRcdHZhciByckludGVydmFsUHJlc2VudCA9IGZsYWdzICYgMHgxMDtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHR2YXIgaW5kZXggPSAxO1xuXHRcdFx0XHRpZiAocmF0ZTE2Qml0cykge1xuXHRcdFx0XHRcdHJlc3VsdC5oZWFydFJhdGUgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzdWx0LmhlYXJ0UmF0ZSA9IHZhbHVlLmdldFVpbnQ4KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjb250YWN0U2Vuc29yUHJlc2VudCkge1xuXHRcdFx0XHRcdHJlc3VsdC5jb250YWN0RGV0ZWN0ZWQgPSAhIWNvbnRhY3REZXRlY3RlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZW5lcmd5UHJlc2VudCkge1xuXHRcdFx0XHRcdHJlc3VsdC5lbmVyZ3lFeHBlbmRlZCA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocnJJbnRlcnZhbFByZXNlbnQpIHtcblx0XHRcdFx0XHR2YXIgcnJJbnRlcnZhbHMgPSBbXTtcblx0XHRcdFx0XHRmb3IgKDsgaW5kZXggKyAxIDwgdmFsdWUuYnl0ZUxlbmd0aDsgaW5kZXggKz0gMikge1xuXHRcdFx0XHRcdFx0cnJJbnRlcnZhbHMucHVzaCh2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzdWx0LnJySW50ZXJ2YWxzID0gcnJJbnRlcnZhbHM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNlcmlhbF9udW1iZXJfc3RyaW5nOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZGV2aWNlX2luZm9ybWF0aW9uJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCddXG5cdFx0fSxcblx0XHRzb2Z0d2FyZV9yZXZpc2lvbl9zdHJpbmc6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydkZXZpY2VfaW5mb3JtYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHN1cHBvcnRlZF91bnJlYWRfYWxlcnRfY2F0ZWdvcnk6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydhbGVydF9ub3RpZmljYXRpb24nXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ11cblx0XHR9LFxuXHRcdHN5c3RlbV9pZDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2RldmljZV9pbmZvcm1hdGlvbiddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0dGVtcGVyYXR1cmVfdHlwZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2hlYWx0aF90aGVybW9tZXRlciddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXVxuXHRcdH0sXG5cdFx0ZGVzY3JpcHRvcl92YWx1ZV9jaGFuZ2VkOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsnaW5kaWNhdGUnLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddXG5cdFx0fSxcblx0XHRhcHBhcmVudF93aW5kX2RpcmVjdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmFwcGFyZW50X3dpbmRfZGlyZWN0aW9uID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFwcGFyZW50X3dpbmRfc3BlZWQ6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5hcHBhcmVudF93aW5kX3NwZWVkID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRld19wb2ludDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LmRld19wb2ludCA9IHZhbHVlLmdldEludDgoMCk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRlbGV2YXRpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5lbGV2YXRpb24gPSB2YWx1ZS5nZXRJbnQ4KDApIDw8IDE2IHwgdmFsdWUuZ2V0SW50OCgxKSA8PCA4IHwgdmFsdWUuZ2V0SW50OCgyKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGd1c3RfZmFjdG9yOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQuZ3VzdF9mYWN0b3IgPSB2YWx1ZS5nZXRVaW50OCgwKSAqIDAuMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhlYXRfaW5kZXg6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC5oZWF0X2luZGV4ID0gdmFsdWUuZ2V0SW50OCgwKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGh1bWlkaXR5OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXG5cdFx0XHRcdHJlc3VsdC5odW1pZGl0eSA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpcnJhZGlhbmNlOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXG5cdFx0XHRcdHJlc3VsdC5pcnJhZGlhbmNlID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4xO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmFpbmZhbGw6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cblx0XHRcdFx0cmVzdWx0LnJhaW5mYWxsID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwcmVzc3VyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LnByZXNzdXJlID0gdmFsdWUuZ2V0VWludDMyKDApICogMC4xO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dGVtcGVyYXR1cmU6IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC50ZW1wZXJhdHVyZSA9IHZhbHVlLmdldEludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRydWVfd2luZF9kaXJlY3Rpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC50cnVlX3dpbmRfZGlyZWN0aW9uID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRydWVfd2luZF9zcGVlZDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LnRydWVfd2luZF9zcGVlZCA9IHZhbHVlLmdldFVpbnQxNigwKSAqIDAuMDE7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR1dl9pbmRleDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0cmVzdWx0LnV2X2luZGV4ID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR3aW5kX2NoaWxsOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRyZXN1bHQud2luZF9jaGlsbCA9IHZhbHVlLmdldEludDgoMCk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRiYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnZW52aXJvbm1lbnRhbF9zZW5zaW5nJ10sXG5cdFx0XHRpbmNsdWRlZFByb3BlcnRpZXM6IFsncmVhZCcsICdub3RpZnknLCAnd3JpdGVBdXgnLCAnZXh0UHJvcCddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIHZhbCA9IHZhbHVlLmdldFVpbnQ4KDApO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHN3aXRjaCAodmFsKSB7XG5cdFx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnVW5rbm93bic7XG5cdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnQ29udGludW91c2x5IGZhbGxpbmcnO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ0NvbnRpbm91c2x5IHJpc2luZyc7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmJhcm9tZXRyaWNfcHJlc3N1cmVfdHJlbmQgPSAnRmFsbGluZywgdGhlbiBzdGVhZHknO1xuXHRcdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ1Jpc2luZywgdGhlbiBzdGVhZHknO1xuXHRcdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ0ZhbGxpbmcgYmVmb3JlIGEgbGVzc2VyIHJpc2UnO1xuXHRcdFx0XHRcdGNhc2UgNjpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ0ZhbGxpbmcgYmVmb3JlIGEgZ3JlYXRlciByaXNlJztcblx0XHRcdFx0XHRjYXNlIDc6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdSaXNpbmcgYmVmb3JlIGEgZ3JlYXRlciBmYWxsJztcblx0XHRcdFx0XHRjYXNlIDg6XG5cdFx0XHRcdFx0XHRyZXN1bHQuYmFyb21ldHJpY19wcmVzc3VyZV90cmVuZCA9ICdSaXNpbmcgYmVmb3JlIGEgbGVzc2VyIGZhbGwnO1xuXHRcdFx0XHRcdGNhc2UgOTpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ1N0ZWFkeSc7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJlc3VsdC5iYXJvbWV0cmljX3ByZXNzdXJlX3RyZW5kID0gJ0NvdWxkIG5vdCByZXNvbHZlIHRvIHRyZW5kJztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWFnbmV0aWNfZGVjbGluYXRpb246IHtcblx0XHRcdHByaW1hcnlTZXJ2aWNlczogWydlbnZpcm9ubWVudGFsX3NlbnNpbmcnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJywgJ25vdGlmeScsICd3cml0ZUF1eCcsICdleHRQcm9wJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cblx0XHRcdFx0cmVzdWx0Lm1hZ25ldGljX2RlY2xpbmF0aW9uID0gdmFsdWUuZ2V0VWludDE2KDApICogMC4wMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG1hZ25ldGljX2ZsdXhfZGVuc2l0eV8yRDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0Ly9GSVhNRTogbmVlZCB0byBmaW5kIG91dCBpZiB0aGVzZSB2YWx1ZXMgYXJlIHN0b3JlZCBhdCBkaWZmZXJlbnQgYnl0ZSBhZGRyZXNzZXNcblx0XHRcdFx0Ly8gICAgICAgYmVsb3cgYXNzdW1lcyB0aGF0IHZhbHVlcyBhcmUgc3RvcmVkIGF0IHN1Y2Nlc3NpdmUgYnl0ZSBhZGRyZXNzZXNcblx0XHRcdFx0cmVzdWx0Lm1hZ25ldGljX2ZsdXhfZGVuc2l0eV94X2F4aXMgPSB2YWx1ZS5nZXRJbnQxNigwLCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKSAqIDAuMDAwMDAwMTtcblx0XHRcdFx0cmVzdWx0Lm1hZ25ldGljX2ZsdXhfZGVuc2l0eV95X2F4aXMgPSB2YWx1ZS5nZXRJbnQxNigyLCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKSAqIDAuMDAwMDAwMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG1hZ25ldGljX2ZsdXhfZGVuc2l0eV8zRDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2Vudmlyb25tZW50YWxfc2Vuc2luZyddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnLCAnbm90aWZ5JywgJ3dyaXRlQXV4JywgJ2V4dFByb3AnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0Ly9GSVhNRTogbmVlZCB0byBmaW5kIG91dCBpZiB0aGVzZSB2YWx1ZXMgYXJlIHN0b3JlZCBhdCBkaWZmZXJlbnQgYnl0ZSBhZGRyZXNzZXNcblx0XHRcdFx0Ly8gICAgICAgYmVsb3cgYXNzdW1lcyB0aGF0IHZhbHVlcyBhcmUgc3RvcmVkIGF0IHN1Y2Nlc3NpdmUgYnl0ZSBhZGRyZXNzZXNcblx0XHRcdFx0cmVzdWx0Lm1hZ25ldGljX2ZsdXhfZGVuc2l0eV94X2F4aXMgPSB2YWx1ZS5nZXRJbnQxNigwLCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKSAqIDAuMDAwMDAwMTtcblx0XHRcdFx0cmVzdWx0Lm1hZ25ldGljX2ZsdXhfZGVuc2l0eV95X2F4aXMgPSB2YWx1ZS5nZXRJbnQxNigyLCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKSAqIDAuMDAwMDAwMTtcblx0XHRcdFx0cmVzdWx0Lm1hZ25ldGljX2ZsdXhfZGVuc2l0eV96X2F4aXMgPSB2YWx1ZS5nZXRJbnQxNig0LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKSAqIDAuMDAwMDAwMTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHR4X3Bvd2VyX2xldmVsOiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsndHhfcG93ZXInXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHJlc3VsdC50eF9wb3dlcl9sZXZlbCA9IHZhbHVlLmdldEludDgoMCk7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR3ZWlnaHRfc2NhbGVfZmVhdHVyZToge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ3dlaWdodF9zY2FsZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3JlYWQnXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0SW50MzIoMCk7XG5cdFx0XHRcdHJlc3VsdC50aW1lX3N0YW1wX3N1cHBvcnRlZCA9IGZsYWdzICYgMHgxO1xuXHRcdFx0XHRyZXN1bHQubXVsdGlwbGVfc2Vuc29yc19zdXBwb3J0ZWQgPSBmbGFncyAmIDB4Mjtcblx0XHRcdFx0cmVzdWx0LkJNSV9zdXBwb3J0ZWQgPSBmbGFncyAmIDB4NDtcblx0XHRcdFx0c3dpdGNoIChmbGFncyAmIDB4NzggPj4gMykge1xuXHRcdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdOb3Qgc3BlY2lmaWVkJztcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjUga2cgb3IgMSBsYic7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4yIGtnIG9yIDAuNSBsYic7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4xIGtnIG9yIDAuMiBsYic7XG5cdFx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4wNSBrZyBvciAwLjEgbGInO1xuXHRcdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRcdHJlc3VsdC53ZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdSZXNvbHV0aW9uIG9mIDAuMDIga2cgb3IgMC4wNSBsYic7XG5cdFx0XHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4wMSBrZyBvciAwLjAyIGxiJztcblx0XHRcdFx0XHRjYXNlIDc6XG5cdFx0XHRcdFx0XHRyZXN1bHQud2VpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjAwNSBrZyBvciAwLjAxIGxiJztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LndlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ0NvdWxkIG5vdCByZXNvbHZlJztcblx0XHRcdFx0fVxuXHRcdFx0XHRzd2l0Y2ggKGZsYWdzICYgMHgzODAgPj4gNykge1xuXHRcdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdHJlc3VsdC5oZWlnaHRfbWVhc3VyZW1lbnRfcmVzb2x1dGlvbiA9ICdOb3Qgc3BlY2lmaWVkJztcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjEgbWV0ZXIgb3IgMSBpbmNoJztcblx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnUmVzb2x1dGlvbiBvZiAwLjAwNSBtZXRlciBvciAwLjUgaW5jaCc7XG5cdFx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmhlaWdodF9tZWFzdXJlbWVudF9yZXNvbHV0aW9uID0gJ1Jlc29sdXRpb24gb2YgMC4wMDEgbWV0ZXIgb3IgMC4xIGluY2gnO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0X21lYXN1cmVtZW50X3Jlc29sdXRpb24gPSAnQ291bGQgbm90IHJlc29sdmUnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIFJlbWFpbmluZyBmbGFncyByZXNlcnZlZCBmb3IgZnV0dXJlIHVzZVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y3NjX21lYXN1cmVtZW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3ljbGluZ19zcGVlZF9hbmRfY2FkZW5jZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ25vdGlmeSddLFxuXHRcdFx0cGFyc2VWYWx1ZTogZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLmJ1ZmZlciA/IHZhbHVlIDogbmV3IERhdGFWaWV3KHZhbHVlKTtcblx0XHRcdFx0dmFyIGZsYWdzID0gdmFsdWUuZ2V0VWludDgoMCk7XG5cdFx0XHRcdHZhciB3aGVlbFJldm9sdXRpb24gPSBmbGFncyAmIDB4MTsgLy9pbnRlZ2VyID0gdHJ1dGh5LCAwID0gZmFsc3lcblx0XHRcdFx0dmFyIGNyYW5rUmV2b2x1dGlvbiA9IGZsYWdzICYgMHgyO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHZhciBpbmRleCA9IDE7XG5cdFx0XHRcdGlmICh3aGVlbFJldm9sdXRpb24pIHtcblx0XHRcdFx0XHRyZXN1bHQuY3VtdWxhdGl2ZV93aGVlbF9yZXZvbHV0aW9ucyA9IHZhbHVlLmdldFVpbnQzMihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gNDtcblx0XHRcdFx0XHRyZXN1bHQubGFzdF93aGVlbF9ldmVudF90aW1lX3Blcl8xMDI0cyA9IHZhbHVlLmdldFVpbnQxNihpbmRleCwgLypsaXR0bGUtZW5kaWFuPSovdHJ1ZSk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY3JhbmtSZXZvbHV0aW9uKSB7XG5cdFx0XHRcdFx0cmVzdWx0LmN1bXVsYXRpdmVfY3JhbmtfcmV2b2x1dGlvbnMgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0cmVzdWx0Lmxhc3RfY3JhbmtfZXZlbnRfdGltZV9wZXJfMTAyNHMgPSB2YWx1ZS5nZXRVaW50MTYoaW5kZXgsIC8qbGl0dGxlLWVuZGlhbj0qL3RydWUpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNlbnNvcl9sb2NhdGlvbjoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N5Y2xpbmdfc3BlZWRfYW5kX2NhZGVuY2UnXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydyZWFkJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHR2YXIgdmFsID0gdmFsdWUuZ2V0VWludDE2KDApO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHN3aXRjaCAodmFsKSB7XG5cdFx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ090aGVyJztcblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnVG9wIG9mIHNob3cnO1xuXHRcdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdJbiBzaG9lJztcblx0XHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnSGlwJztcblx0XHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnRnJvbnQgV2hlZWwnO1xuXHRcdFx0XHRcdGNhc2UgNTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdMZWZ0IENyYW5rJztcblx0XHRcdFx0XHRjYXNlIDY6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnUmlnaHQgQ3JhbmsnO1xuXHRcdFx0XHRcdGNhc2UgNzpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdMZWZ0IFBlZGFsJztcblx0XHRcdFx0XHRjYXNlIDg6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnUmlnaHQgUGVkYWwnO1xuXHRcdFx0XHRcdGNhc2UgOTpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdGcm9udCBIdWInO1xuXHRcdFx0XHRcdGNhc2UgMTA6XG5cdFx0XHRcdFx0XHRyZXN1bHQubG9jYXRpb24gPSAnUmVhciBEcm9wb3V0Jztcblx0XHRcdFx0XHRjYXNlIDExOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0NoYWluc3RheSc7XG5cdFx0XHRcdFx0Y2FzZSAxMjpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdSZWFyIFdoZWVsJztcblx0XHRcdFx0XHRjYXNlIDEzOlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1JlYXIgSHViJztcblx0XHRcdFx0XHRjYXNlIDE0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ0NoZXN0Jztcblx0XHRcdFx0XHRjYXNlIDE1OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1NwaWRlcic7XG5cdFx0XHRcdFx0Y2FzZSAxNjpcblx0XHRcdFx0XHRcdHJlc3VsdC5sb2NhdGlvbiA9ICdDaGFpbiBSaW5nJztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmVzdWx0LmxvY2F0aW9uID0gJ1Vua25vd24nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzY19jb250cm9sX3BvaW50OiB7XG5cdFx0XHRwcmltYXJ5U2VydmljZXM6IFsnY3ljbGluZ19zcGVlZF9hbmRfY2FkZW5jZSddLFxuXHRcdFx0aW5jbHVkZWRQcm9wZXJ0aWVzOiBbJ3dyaXRlJywgJ2luZGljYXRlJ10sXG5cdFx0XHRwYXJzZVZhbHVlOiBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuYnVmZmVyID8gdmFsdWUgOiBuZXcgRGF0YVZpZXcodmFsdWUpO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y3ljbGluZ19wb3dlcl9tZWFzdXJlbWVudDoge1xuXHRcdFx0cHJpbWFyeVNlcnZpY2VzOiBbJ2N5Y2xpbmdfcG93ZXInXSxcblx0XHRcdGluY2x1ZGVkUHJvcGVydGllczogWydub3RpZnknXSxcblx0XHRcdHBhcnNlVmFsdWU6IGZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5idWZmZXIgPyB2YWx1ZSA6IG5ldyBEYXRhVmlldyh2YWx1ZSk7XG5cdFx0XHRcdHZhciBmbGFncyA9IHZhbHVlLmdldFVpbnQxNigwKTtcblx0XHRcdFx0dmFyIHBlZGFsX3Bvd2VyX2JhbGFuY2VfcHJlc2VudCA9IGZsYWdzICYgMHgxO1xuXHRcdFx0XHR2YXIgcGVkYWxfcG93ZXJfcmVmZXJlbmNlID0gZmxhZ3MgJiAweDI7XG5cdFx0XHRcdHZhciBhY2N1bXVsYXRlZF90b3JxdWVfcHJlc2VudCA9IGZsYWdzICYgMHg0O1xuXHRcdFx0XHR2YXIgYWNjdW11bGF0ZWRfdG9ycXVlX3NvdXJjZSA9IGZsYWdzICYgMHg4O1xuXHRcdFx0XHR2YXIgd2hlZWxfcmV2b2x1dGlvbl9kYXRhX3ByZXNlbnQgPSBmbGFncyAmIDB4MTA7XG5cdFx0XHRcdHZhciBjcmFua19yZXZvbHV0aW9uX2RhdGFfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIGV4dHJlbWVfZm9yY2VfbWFnbml0dWRlX3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciBleHRyZW1lX3RvcnF1ZV9tYWduaXR1ZGVfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIGV4dHJlbWVfYW5nbGVzX3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciB0b3BfZGVhZF9zcG90X2FuZ2xlX3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciBib3R0b21fZGVhZF9zcG90X2FuZ2xlX3ByZXNlbnQgPSBmbGFncyAmIDB4MTI7XG5cdFx0XHRcdHZhciBhY2N1bXVsYXRlZF9lbmVyZ3lfcHJlc2VudCA9IGZsYWdzICYgMHgxMjtcblx0XHRcdFx0dmFyIG9mZnNldF9jb21wZW5zYXRpb25faW5kaWNhdG9yID0gZmxhZ3MgJiAweDEyO1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRcdHZhciBpbmRleCA9IDE7XG5cdFx0XHRcdC8vV2F0dHMgd2l0aCByZXNvbHV0aW9uIG9mIDFcblx0XHRcdFx0cmVzdWx0Lmluc3RhbnRhbmVvdXNfcG93ZXIgPSB2YWx1ZS5nZXRJbnQxNihpbmRleCk7XG5cdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdGlmIChwZWRhbF9wb3dlcl9yZWZlcmVuY2UpIHtcblx0XHRcdFx0XHQvL1BlcmNlbnRhZ2Ugd2l0aCByZXNvbHV0aW9uIG9mIDEvMlxuXHRcdFx0XHRcdHJlc3VsdC5wZWRhbF9wb3dlcl9iYWxhbmNlID0gdmFsdWUuZ2V0VWludDgoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGFjY3VtdWxhdGVkX3RvcnF1ZV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9QZXJjZW50YWdlIHdpdGggcmVzb2x1dGlvbiBvZiAxLzJcblx0XHRcdFx0XHRyZXN1bHQuYWNjdW11bGF0ZWRfdG9ycXVlID0gdmFsdWUuZ2V0VWludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh3aGVlbF9yZXZvbHV0aW9uX2RhdGFfcHJlc2VudCkge1xuXHRcdFx0XHRcdHJlc3VsdC5jdW11bGF0aXZlX3doZWVsX3Jldm9sdXRpb25zID0gdmFsdWUuVWludDMyKGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSA0O1xuXHRcdFx0XHRcdHJlc3VsdC5sYXN0X3doZWVsX2V2ZW50X3RpbWVfcGVyXzIwNDhzID0gdmFsdWUuVWludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjcmFua19yZXZvbHV0aW9uX2RhdGFfcHJlc2VudCkge1xuXHRcdFx0XHRcdHJlc3VsdC5jdW11bGF0aXZlX2NyYW5rX3Jldm9sdXRpb25zID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRcdHJlc3VsdC5sYXN0X2NyYW5rX2V2ZW50X3RpbWVfcGVyXzEwMjRzID0gdmFsdWUuZ2V0VWludDE2KGluZGV4LCAvKmxpdHRsZS1lbmRpYW49Ki90cnVlKTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHRyZW1lX2ZvcmNlX21hZ25pdHVkZV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9OZXd0b24gbWV0ZXJzIHdpdGggcmVzb2x1dGlvbiBvZiAxIFRPRE86IHVuaXRzP1xuXHRcdFx0XHRcdHJlc3VsdC5tYXhpbXVtX2ZvcmNlX21hZ25pdHVkZSA9IHZhbHVlLmdldEludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHRcdHJlc3VsdC5taW5pbXVtX2ZvcmNlX21hZ25pdHVkZSA9IHZhbHVlLmdldEludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHRyZW1lX3RvcnF1ZV9tYWduaXR1ZGVfcHJlc2VudCkge1xuXHRcdFx0XHRcdC8vTmV3dG9uIG1ldGVycyB3aXRoIHJlc29sdXRpb24gb2YgMSBUT0RPOiB1bml0cz9cblx0XHRcdFx0XHRyZXN1bHQubWF4aW11bV90b3JxdWVfbWFnbml0dWRlID0gdmFsdWUuZ2V0SW50MTYoaW5kZXgpO1xuXHRcdFx0XHRcdGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0cmVzdWx0Lm1pbmltdW1fdG9ycXVlX21hZ25pdHVkZSA9IHZhbHVlLmdldEludDE2KGluZGV4KTtcblx0XHRcdFx0XHRpbmRleCArPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHRyZW1lX2FuZ2xlc19wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiBVSU5UMTIuXG5cdFx0XHRcdFx0Ly9OZXd0b24gbWV0ZXJzIHdpdGggcmVzb2x1dGlvbiBvZiAxIFRPRE86IHVuaXRzP1xuXHRcdFx0XHRcdC8vIHJlc3VsdC5tYXhpbXVtX2FuZ2xlID0gdmFsdWUuZ2V0SW50MTIoaW5kZXgpO1xuXHRcdFx0XHRcdC8vIGluZGV4ICs9IDI7XG5cdFx0XHRcdFx0Ly8gcmVzdWx0Lm1pbmltdW1fYW5nbGUgPSB2YWx1ZS5nZXRJbnQxMihpbmRleCk7XG5cdFx0XHRcdFx0Ly8gaW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9wX2RlYWRfc3BvdF9hbmdsZV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9QZXJjZW50YWdlIHdpdGggcmVzb2x1dGlvbiBvZiAxLzJcblx0XHRcdFx0XHRyZXN1bHQudG9wX2RlYWRfc3BvdF9hbmdsZSA9IHZhbHVlLmdldFVpbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYm90dG9tX2RlYWRfc3BvdF9hbmdsZV9wcmVzZW50KSB7XG5cdFx0XHRcdFx0Ly9QZXJjZW50YWdlIHdpdGggcmVzb2x1dGlvbiBvZiAxLzJcblx0XHRcdFx0XHRyZXN1bHQuYm90dG9tX2RlYWRfc3BvdF9hbmdsZSA9IHZhbHVlLmdldFVpbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYWNjdW11bGF0ZWRfZW5lcmd5X3ByZXNlbnQpIHtcblx0XHRcdFx0XHQvL2tpbG9qb3VsZXMgd2l0aCByZXNvbHV0aW9uIG9mIDEgVE9ETzogdW5pdHM/XG5cdFx0XHRcdFx0cmVzdWx0LmFjY3VtdWxhdGVkX2VuZXJneSA9IHZhbHVlLmdldFVpbnQxNihpbmRleCk7XG5cdFx0XHRcdFx0aW5kZXggKz0gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Z2F0dFNlcnZpY2VMaXN0OiBbJ2FsZXJ0X25vdGlmaWNhdGlvbicsICdhdXRvbWF0aW9uX2lvJywgJ2JhdHRlcnlfc2VydmljZScsICdibG9vZF9wcmVzc3VyZScsICdib2R5X2NvbXBvc2l0aW9uJywgJ2JvbmRfbWFuYWdlbWVudCcsICdjb250aW51b3VzX2dsdWNvc2VfbW9uaXRvcmluZycsICdjdXJyZW50X3RpbWUnLCAnY3ljbGluZ19wb3dlcicsICdjeWNsaW5nX3NwZWVkX2FuZF9jYWRlbmNlJywgJ2RldmljZV9pbmZvcm1hdGlvbicsICdlbnZpcm9ubWVudGFsX3NlbnNpbmcnLCAnZ2VuZXJpY19hY2Nlc3MnLCAnZ2VuZXJpY19hdHRyaWJ1dGUnLCAnZ2x1Y29zZScsICdoZWFsdGhfdGhlcm1vbWV0ZXInLCAnaGVhcnRfcmF0ZScsICdodW1hbl9pbnRlcmZhY2VfZGV2aWNlJywgJ2ltbWVkaWF0ZV9hbGVydCcsICdpbmRvb3JfcG9zaXRpb25pbmcnLCAnaW50ZXJuZXRfcHJvdG9jb2xfc3VwcG9ydCcsICdsaW5rX2xvc3MnLCAnbG9jYXRpb25fYW5kX25hdmlnYXRpb24nLCAnbmV4dF9kc3RfY2hhbmdlJywgJ3Bob25lX2FsZXJ0X3N0YXR1cycsICdwdWxzZV9veGltZXRlcicsICdyZWZlcmVuY2VfdGltZV91cGRhdGUnLCAncnVubmluZ19zcGVlZF9hbmRfY2FkZW5jZScsICdzY2FuX3BhcmFtZXRlcnMnLCAndHhfcG93ZXInLCAndXNlcl9kYXRhJywgJ3dlaWdodF9zY2FsZSddXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJsdWV0b290aE1hcDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiYjU1bVdFXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG0vYmx1ZXRvb3RoTWFwLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3dlYi1ibHVldG9vdGgvZGlzdC9ucG1cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5cInVzZSBzdHJpY3RcIjtcblxuLyoqIGVycm9ySGFuZGxlciAtIENvbnNvbG9kYXRlcyBlcnJvciBtZXNzYWdlIGNvbmZpZ3VyYXRpb24gYW5kIGxvZ2ljXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBlcnJvcktleSAtIG1hcHMgdG8gYSBkZXRhaWxlZCBlcnJvciBtZXNzYWdlXG4qIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFcnJvciAtIHRoZSBuYXRpdmUgQVBJIGVycm9yIG9iamVjdCwgaWYgcHJlc2VudFxuKiBAcGFyYW0ge30gYWx0ZXJuYXRlIC0gXG4qXG4qL1xuZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGVycm9yS2V5LCBuYXRpdmVFcnJvciwgYWx0ZXJuYXRlKSB7XG5cblx0XHR2YXIgZXJyb3JNZXNzYWdlcyA9IHtcblx0XHRcdFx0YWRkX2NoYXJhY3RlcmlzdGljX2V4aXN0c19lcnJvcjogXCJDaGFyYWN0ZXJpc3RpYyBcIiArIGFsdGVybmF0ZSArIFwiIGFscmVhZHkgZXhpc3RzLlwiLFxuXHRcdFx0XHRjaGFyYWN0ZXJpc3RpY19lcnJvcjogXCJDaGFyYWN0ZXJpc3RpYyBcIiArIGFsdGVybmF0ZSArIFwiIG5vdCBmb3VuZC4gQWRkIFwiICsgYWx0ZXJuYXRlICsgXCIgdG8gZGV2aWNlIHVzaW5nIGFkZENoYXJhY3RlcmlzdGljIG9yIHRyeSBhbm90aGVyIGNoYXJhY3RlcmlzdGljLlwiLFxuXHRcdFx0XHRjb25uZWN0X2dhdHQ6IFwiQ291bGQgbm90IGNvbm5lY3QgdG8gR0FUVC4gRGV2aWNlIG1pZ2h0IGJlIG91dCBvZiByYW5nZS4gQWxzbyBjaGVjayB0byBzZWUgaWYgZmlsdGVycyBhcmUgdmFpbGQuXCIsXG5cdFx0XHRcdGNvbm5lY3Rfc2VydmVyOiBcIkNvdWxkIG5vdCBjb25uZWN0IHRvIHNlcnZlciBvbiBkZXZpY2UuXCIsXG5cdFx0XHRcdGNvbm5lY3Rfc2VydmljZTogXCJDb3VsZCBub3QgZmluZCBzZXJ2aWNlLlwiLFxuXHRcdFx0XHRkaXNjb25uZWN0X3RpbWVvdXQ6IFwiVGltZWQgb3V0LiBDb3VsZCBub3QgZGlzY29ubmVjdC5cIixcblx0XHRcdFx0ZGlzY29ubmVjdF9lcnJvcjogXCJDb3VsZCBub3QgZGlzY29ubmVjdCBmcm9tIGRldmljZS5cIixcblx0XHRcdFx0aW1wcm9wZXJfY2hhcmFjdGVyaXN0aWNfZm9ybWF0OiBhbHRlcm5hdGUgKyBcIiBpcyBub3QgYSBwcm9wZXJseSBmb3JtYXR0ZWQgY2hhcmFjdGVyaXN0aWMuXCIsXG5cdFx0XHRcdGltcHJvcGVyX3Byb3BlcnRpZXNfZm9ybWF0OiBhbHRlcm5hdGUgKyBcIiBpcyBub3QgYSBwcm9wZXJseSBmb3JtYXR0ZWQgcHJvcGVydGllcyBhcnJheS5cIixcblx0XHRcdFx0aW1wcm9wZXJfc2VydmljZV9mb3JtYXQ6IGFsdGVybmF0ZSArIFwiIGlzIG5vdCBhIHByb3Blcmx5IGZvcm1hdHRlZCBzZXJ2aWNlLlwiLFxuXHRcdFx0XHRpc3N1ZV9kaXNjb25uZWN0aW5nOiBcIklzc3VlIGRpc2Nvbm5lY3Rpbmcgd2l0aCBkZXZpY2UuXCIsXG5cdFx0XHRcdG5ld19jaGFyYWN0ZXJpc3RpY19taXNzaW5nX3BhcmFtczogYWx0ZXJuYXRlICsgXCIgaXMgbm90IGEgZnVsbHkgc3VwcG9ydGVkIGNoYXJhY3RlcmlzdGljLiBQbGVhc2UgcHJvdmlkZSBhbiBhc3NvY2lhdGVkIHByaW1hcnkgc2VydmljZSBhbmQgYXQgbGVhc3Qgb25lIHByb3BlcnR5LlwiLFxuXHRcdFx0XHRub19kZXZpY2U6IFwiTm8gaW5zdGFuY2Ugb2YgZGV2aWNlIGZvdW5kLlwiLFxuXHRcdFx0XHRub19maWx0ZXJzOiBcIk5vIGZpbHRlcnMgZm91bmQgb24gaW5zdGFuY2Ugb2YgRGV2aWNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpc2l0IGh0dHA6Ly9zYWJlcnRvb3RoLmlvLyNtZXRob2QtbmV3ZGV2aWNlXCIsXG5cdFx0XHRcdG5vX3JlYWRfcHJvcGVydHk6IFwiTm8gcmVhZCBwcm9wZXJ0eSBvbiBjaGFyYWN0ZXJpc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIi5cIixcblx0XHRcdFx0bm9fd3JpdGVfcHJvcGVydHk6IFwiTm8gd3JpdGUgcHJvcGVydHkgb24gdGhpcyBjaGFyYWN0ZXJpc3RpYy5cIixcblx0XHRcdFx0bm90X2Nvbm5lY3RlZDogXCJDb3VsZCBub3QgZGlzY29ubmVjdC4gRGV2aWNlIG5vdCBjb25uZWN0ZWQuXCIsXG5cdFx0XHRcdHBhcnNpbmdfbm90X3N1cHBvcnRlZDogXCJQYXJzaW5nIG5vdCBzdXBwb3J0ZWQgZm9yIGNoYXJhY3RlcnN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIuXCIsXG5cdFx0XHRcdHJlYWRfZXJyb3I6IFwiQ2Fubm90IHJlYWQgdmFsdWUgb24gdGhlIGNoYXJhY3RlcmlzdGljLlwiLFxuXHRcdFx0XHRfcmV0dXJuQ2hhcmFjdGVyaXN0aWNfZXJyb3I6IFwiRXJyb3IgYWNjZXNzaW5nIGNoYXJhY3RlcmlzdGljIFwiICsgYWx0ZXJuYXRlICsgXCIuXCIsXG5cdFx0XHRcdHN0YXJ0X25vdGlmaWNhdGlvbnNfZXJyb3I6IFwiTm90IGFibGUgdG8gcmVhZCBzdHJlYW0gb2YgZGF0YSBmcm9tIGNoYXJhY3RlcmlzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiLlwiLFxuXHRcdFx0XHRzdGFydF9ub3RpZmljYXRpb25zX25vX25vdGlmeTogXCJObyBub3RpZnkgcHJvcGVydHkgZm91bmQgb24gdGhpcyBjaGFyYWN0ZXJpc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIi5cIixcblx0XHRcdFx0c3RvcF9ub3RpZmljYXRpb25zX25vdF9ub3RpZnlpbmc6IFwiTm90aWZpY2F0aW9ucyBub3QgZXN0YWJsaXNoZWQgZm9yIGNoYXJhY3RlcmlzdGljOiBcIiArIGFsdGVybmF0ZSArIFwiIG9yIHlvdSBoYXZlIG5vdCBzdGFydGVkIG5vdGlmaWNhdGlvbnMuXCIsXG5cdFx0XHRcdHN0b3Bfbm90aWZpY2F0aW9uc19lcnJvcjogXCJJc3N1ZSBzdG9wcGluZyBub3RpZmljYXRpb25zIGZvciBjaGFyYWN0ZXJpc3RpYzogXCIgKyBhbHRlcm5hdGUgKyBcIiBvciB5b3UgaGF2ZSBub3Qgc3RhcnRlZCBub3RpZmljYXRpb25zLlwiLFxuXHRcdFx0XHR1c2VyX2NhbmNlbGxlZDogXCJVc2VyIGNhbmNlbGxlZCB0aGUgcGVybWlzc2lvbiByZXF1ZXN0LlwiLFxuXHRcdFx0XHR1dWlkX2Vycm9yOiBcIkludmFsaWQgVVVJRC4gRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gcHJvcGVyIGZvcm1hdHRpbmcgb2YgVVVJRHMsIHZpc2l0IGh0dHBzOi8vd2ViYmx1ZXRvb3RoY2cuZ2l0aHViLmlvL3dlYi1ibHVldG9vdGgvI3V1aWRzXCIsXG5cdFx0XHRcdHdyaXRlX2Vycm9yOiBcIkNvdWxkIG5vdCBjaGFuZ2UgdmFsdWUgb2YgY2hhcmFjdGVyaXN0aWM6IFwiICsgYWx0ZXJuYXRlICsgXCIuXCIsXG5cdFx0XHRcdHdyaXRlX3Blcm1pc3Npb25zOiBhbHRlcm5hdGUgKyBcIiBjaGFyYWN0ZXJpc3RpYyBkb2VzIG5vdCBoYXZlIGEgd3JpdGUgcHJvcGVydHkuXCJcblx0XHR9O1xuXG5cdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZXNbZXJyb3JLZXldKTtcblx0XHRyZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXJyb3JIYW5kbGVyO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbS9lcnJvckhhbmRsZXIuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9kaXN0L25wbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L25wbS9CbHVldG9vdGhEZXZpY2UnKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJiNTVtV0VcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aC9ucG0uanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViLWJsdWV0b290aFwiKSJdfQ==
