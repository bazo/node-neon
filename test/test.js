'use strict';
var mocha = require("mocha");
var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var libsDir = "../lib";

var Neon = require(libsDir + '/neon').Neon;
var neon = new Neon;

describe('neon', function() {

	describe('encode()', function() {

		it('empty array should return brackets', function() {
			assert.equal(
				neon.encode([]),
				'[]'
			);
		});

		it('empty object should return curly brackets', function() {

			assert.equal(
				neon.encode({}),
				'{}'
			);

		});

		it('date object should be stringified', function() {
			var date = new Date;
			assert.equal(
				neon.encode(date),
				date.toString()
			);
		});

		it('numbers should work', function() {

			assert.equal(
				neon.encode([1, 2, 3, 4, 5]),
				'[1, 2, 3, 4, 5]'
			);

			assert.equal(
				neon.encode([1, 1.0, 0, 0.0, -1, -1.2, '1', '1.0', '-1']),
				'[1, 1, 0, 0, -1, -1.2, "1", "1.0", "-1"]'
			);

			assert.equal(
				neon.encode([1, 2, 3]),
				'[1, 2, 3]'
			);

			assert.equal(
				neon.encode({1: 1, 2: 2, 3: 3}),
				'{1: 1, 2: 2, 3: 3}'
			);

		});


		it.skip('should be equal', function() {

			assert.equal(
				neon.encode([
					true, 'TRUE', 'tRuE', 'true',
					false, 'FALSE', 'fAlSe', 'false',
					null, 'NULL', 'nUlL', 'null',
					'yes', 'no', 'on', 'off',
				]),
				'[true, "TRUE", "tRuE", "true", false, "FALSE", "fAlSe", "false", null, "NULL", "nUlL", "null", "yes", "no", "on", "off"]'
			);

			assert.equal(
				neon.encode(['[', ']', '{', '}', ':', ': ', '=', '#']),
				'["[", "]", "{", "}", ":", ": ", "=", "#"]'
			);

			assert.equal(
				neon.encode({'foo': 1, 'bar': [2, 3]}),
				'{foo: 1, bar: [2, 3]}'
			);

			assert.equal(
				neon.encode(neon.decode('item(a, b)')),
				'item(a, b)'
			);

			assert.equal(
				neon.encode(neon.decode('item<item>(a, b)')),
				'item<item>(a, b)'
			);

			assert.equal(
				neon.encode(neon.decode('item(foo: a, bar: b)')),
				'item(foo: a, bar: b)'
			);

			assert.equal(
				neon.encode(neon.decode('[]()')),
				'[]()'
			);

		});

	});

});