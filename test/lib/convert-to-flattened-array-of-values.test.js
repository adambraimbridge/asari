const convertToFlattenedArrayOfValues = require('../../src/lib/convert-to-flattened-array-of-values')

describe('lib/convert-to-flattened-array-of-values.js', () => {
	test.each`
		input                        | expected
		${'hello'}                   | ${['hello']}
		${['hello']}                 | ${['hello']}
		${'hello,new'}               | ${['hello', 'new']}
		${'hello,       new'}        | ${['hello', 'new']}
		${['hello,new', 'great,so']} | ${['hello', 'new', 'great', 'so']}
	`('$input returns $expected', ({ input, expected }) => {
		expect(convertToFlattenedArrayOfValues(input)).toEqual(expected)
	})
})
