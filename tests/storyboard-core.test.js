const test = require('node:test');
const assert = require('node:assert/strict');
const { kuralLibrary, extractKuralNumber, makeScenes, escapeHtml, buildStoryboard } = require('../storyboard-core');

const supportedNumbers = [1, 76, 99, 102, 108, 129, 391, 396, 619, 999];

test('contains all ten supported Kurals with complete content', () => {
  assert.deepEqual(Object.keys(kuralLibrary).map(Number), supportedNumbers);
  for (const kural of Object.values(kuralLibrary)) {
    assert.ok(kural.title.trim());
    assert.match(kural.tamil, /[\u0B80-\u0BFF]/u);
    assert.ok(kural.meaning.trim());
  }
});

test('extracts valid Kural numbers from common input formats', () => {
  assert.equal(extractKuralNumber('Kural 391 — Education'), 391);
  assert.equal(extractKuralNumber('999'), 999);
  assert.equal(extractKuralNumber('Try kural108 today'), 108);
});

test('rejects missing and out-of-range Kural numbers', () => {
  assert.equal(extractKuralNumber('Kindness'), null);
  assert.equal(extractKuralNumber('Kural 0'), null);
  assert.equal(extractKuralNumber('Kural 1331'), null);
});

test('turns a detailed story into exactly five ordered scenes', () => {
  const source = ['Maya read the plan.', 'She built a bridge.', 'It fell down!', 'She studied again.', 'Her new bridge held.'];
  const scenes = makeScenes(source.join(' '));
  assert.equal(scenes.length, 5);
  source.forEach((sentence) => assert.ok(scenes.join(' ').includes(sentence)));
});

test('normalizes whitespace and fills blank scene slots', () => {
  const scenes = makeScenes('  Maya\n\ntries again.  ');
  assert.equal(scenes.length, 5);
  assert.equal(scenes[0], 'Maya tries again.');
  scenes.forEach((scene) => assert.ok(scene.trim()));
});

test('provides five safe fallback scenes for a blank story', () => {
  const scenes = makeScenes('');
  assert.equal(scenes.length, 5);
  assert.ok(scenes.every(Boolean));
});

test('escapes user-controlled HTML before rendering', () => {
  assert.equal(escapeHtml('<script>"x" & \'y\'</script>'), '&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;');
});

test('builds a canonical Kural storyboard and downloadable script', () => {
  const result = buildStoryboard({ theme: 'Kural 391 — Learning', story: 'Maya reads. Maya builds.' });
  assert.equal(result.number, 391);
  assert.equal(result.title, 'The Bridge That Maya Studied');
  assert.equal(result.kural, kuralLibrary[391]);
  assert.equal(result.scenes.length, 5);
  assert.match(result.script, /Thirukkural 391/);
  assert.match(result.script, /கற்க கசடறக் கற்பவை/);
  assert.match(result.script, /Scene 5:/);
});

test('uses a custom theme when the number is unknown', () => {
  const result = buildStoryboard({ theme: 'Sharing at school', story: 'A child shares.' });
  assert.equal(result.number, null);
  assert.equal(result.kural, null);
  assert.equal(result.title, 'Sharing at school');
  assert.doesNotMatch(result.script, /Thirukkural/);
});

test('builds valid storyboards for every supported Kural', () => {
  for (const number of supportedNumbers) {
    const result = buildStoryboard({ theme: `Kural ${number}`, story: 'One. Two. Three. Four. Five.' });
    assert.equal(result.number, number);
    assert.ok(result.kural);
    assert.equal(result.scenes.length, 5);
  }
});
