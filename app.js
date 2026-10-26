const creator = document.querySelector('#creatorDialog');
const privacy = document.querySelector('#privacyDialog');
const form = document.querySelector('#creatorForm');
const status = document.querySelector('#formStatus');
const output = document.querySelector('#storyboardOutput');

const kuralLibrary = {
  1: { title: 'The First Note', tamil: 'அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு', meaning: 'Every great creation begins from its source.' },
  76: { title: 'The Courage to Protect', tamil: 'அறத்திற்கே அன்புசார் பென்ப அறியார் மறத்திற்கும் அஃதே துணை', meaning: 'Love supports both virtue and courageous action.' },
  99: { title: 'The Two Sentences', tamil: 'இன்சொல் இனிதீன்றல் காண்பான் எவன்கொலோ வன்சொல் வழங்கு வது', meaning: 'When kind words bring joy, why choose harsh ones?' },
  102: { title: 'The Little Umbrella', tamil: 'காலத்தினாற் செய்த நன்றி சிறிதெனினும் ஞாலத்தின் மாணப் பெரிது', meaning: 'Timely help, however small, is greater than the world.' },
  108: { title: 'The Broken Robot', tamil: 'நன்றி மறப்பது நன்றன்று நன்றல்லது அன்றே மறப்பது நன்று', meaning: 'Remember kindness and release hurt.' },
  129: { title: 'The Crumpled Paper Heart', tamil: 'தீயினாற் சுட்டபுண் உள்ளாறும் ஆறாதே நாவினாற் சுட்ட வடு', meaning: 'A wound caused by words can remain after other wounds heal.' },
  391: { title: 'The Bridge That Maya Studied', tamil: 'கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக', meaning: 'Learn thoroughly, then live according to what you learned.' },
  396: { title: 'The Well of Questions', tamil: 'தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக் கற்றனைத் தூறும் அறிவு', meaning: 'Knowledge grows deeper as learning continues.' },
  619: { title: 'The Kite That Would Not Fly', tamil: 'தெய்வத்தான் ஆகா தெனினும் முயற்சிதன் மெய்வருத்தக் கூலி தரும்', meaning: 'Effort gives its own reward even when the goal is not reached.' },
  999: { title: 'The Playground in the Sunshine', tamil: 'நகல்வல்லர் அல்லார்க்கு மாயிரு ஞாலம் பகலும்பாற் பட்டன்று இருள்', meaning: 'Cheerful human connection fills the world with light.' }
};

const sceneNames = ['A colorful beginning', 'The challenge appears', 'A thoughtful choice', 'The change', 'The lesson shines'];
const sceneIcons = ['☀', '!', '✦', '♥', '★'];

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function makeScenes(story) {
  const sentences = story.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const buckets = Array.from({ length: 5 }, () => []);
  sentences.forEach((sentence, index) => buckets[Math.min(4, Math.floor(index * 5 / Math.max(1, sentences.length)))].push(sentence.trim()));
  const fallback = ['Meet our young hero in a bright, welcoming world.', 'A problem tests what the hero understands.', 'The hero pauses and chooses a wiser path.', 'That choice helps the people around them.', 'The Kural reveals the lesson to remember.'];
  return buckets.map((parts, index) => parts.join(' ') || fallback[index]);
}

function renderStoryboard() {
  const themeInput = document.querySelector('.wisdom-field input');
  const storyInput = document.querySelector('textarea');
  const match = themeInput.value.match(/(?:kural\s*)?(\d{1,4})/i);
  const number = match ? Number(match[1]) : null;
  const kural = kuralLibrary[number];
  const scenes = makeScenes(storyInput.value);
  const title = kural?.title || themeInput.value.trim() || 'A Little Lantern Story';
  document.querySelector('#storyboardTitle').textContent = title;
  const card = document.querySelector('#kuralCard');
  card.hidden = !kural;
  if (kural) {
    document.querySelector('#kuralNumber').textContent = `Thirukkural ${number}`;
    document.querySelector('#kuralTamil').textContent = kural.tamil;
    document.querySelector('#kuralMeaning').textContent = kural.meaning;
  }
  document.querySelector('#sceneGrid').innerHTML = scenes.map((narration, index) => `
    <article class="scene-card">
      <div class="scene-visual" aria-hidden="true">${sceneIcons[index]}</div>
      <div><h4>Scene ${index + 1}: ${sceneNames[index]}</h4><p>${escapeHtml(narration)}</p><small>Animation: gentle camera movement · expressive characters · colorful classroom style</small></div>
    </article>`).join('');
  output.hidden = false;
  output.dataset.script = `${title}\n\n${kural ? `Thirukkural ${number}\n${kural.tamil}\n${kural.meaning}\n\n` : ''}${scenes.map((scene, i) => `Scene ${i + 1}: ${scene}`).join('\n\n')}`;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openCreator(mode = 'personal') {
  setMode(mode);
  creator.showModal();
}

function setMode(mode) {
  document.querySelectorAll('[data-form-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.formMode === mode);
  });
  document.querySelectorAll('.personal-field').forEach((field) => field.classList.toggle('hidden', mode !== 'personal'));
  document.querySelectorAll('.wisdom-field').forEach((field) => field.classList.toggle('hidden', mode !== 'wisdom'));
}

document.querySelectorAll('[data-open-creator]').forEach((button) => button.addEventListener('click', () => openCreator()));
document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => openCreator(button.dataset.mode)));
document.querySelectorAll('[data-form-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.formMode)));
document.querySelector('[data-open-privacy]').addEventListener('click', () => privacy.showModal());
document.querySelector('[data-close-privacy]').addEventListener('click', () => privacy.close());

document.querySelector('#photoInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const preview = document.querySelector('#photoPreview');
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
    event.target.value = '';
    preview.hidden = true;
    status.textContent = 'Please choose a JPG, PNG or WebP image smaller than 10 MB.';
    return;
  }
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  status.textContent = 'Photo previewed locally. This prototype does not upload it.';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = '✓ Demo storyboard request created locally. No personal data was sent anywhere.';
});

form.addEventListener('submit', () => {
  renderStoryboard();
  status.textContent = 'Storyboard ready below. No personal data was sent anywhere.';
});

document.querySelector('#downloadScript').addEventListener('click', () => {
  const blob = new Blob([output.dataset.script || ''], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'little-lantern-storyboard.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});

[creator, privacy].forEach((dialog) => dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
}));

