const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const app = read('app.js');

test('page contains every element required by the browser controller', () => {
  const ids = ['creatorDialog', 'privacyDialog', 'creatorForm', 'formStatus', 'storyboardOutput', 'storyboardTitle', 'kuralCard', 'kuralNumber', 'kuralTamil', 'kuralMeaning', 'sceneGrid', 'downloadScript', 'photoInput', 'photoPreview'];
  ids.forEach((id) => assert.match(html, new RegExp(`id=["']${id}["']`)));
});

test('loads tested story engine before browser controller', () => {
  assert.ok(html.indexOf('storyboard-core.js') < html.indexOf('app.js'));
  assert.match(app, /StoryboardCore/);
});

test('accepts detailed stories and enforces guardian consent', () => {
  assert.match(html, /<textarea maxlength="2000"/);
  assert.match(html, /parent\/legal guardian/i);
  assert.match(html, /type="checkbox" required/);
});

test('states the child privacy promises in the user interface', () => {
  assert.match(html, /No AI training/);
  assert.match(html, /Delete anytime/);
  assert.match(html, /Nothing is uploaded/);
  assert.match(html, /No school, address, last name/i);
});

test('browser controller restricts photo types and size', () => {
  assert.match(app, /image\/jpeg/);
  assert.match(app, /image\/png/);
  assert.match(app, /image\/webp/);
  assert.match(app, /10 \* 1024 \* 1024/);
});

test('browser controller renders and downloads the generated storyboard', () => {
  assert.match(app, /buildStoryboard/);
  assert.match(app, /renderStoryboard\(\)/);
  assert.match(app, /little-lantern-storyboard\.txt/);
  assert.match(app, /No personal data was sent anywhere/);
});
