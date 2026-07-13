const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSuggestions } = require('../utils/suggestions');

test('buildSuggestions returns substitutes and seasonal ideas', () => {
  const suggestions = buildSuggestions([{ name: 'Milk' }, { name: 'Bread' }]);
  assert.ok(suggestions.some((item) => item.name === 'Almond Milk'));
  assert.ok(suggestions.some((item) => item.name === 'Butter'));
  assert.ok(suggestions.length >= 2);
});
