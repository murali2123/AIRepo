const creator = document.querySelector('#creatorDialog');
const privacy = document.querySelector('#privacyDialog');
const form = document.querySelector('#creatorForm');
const status = document.querySelector('#formStatus');
const output = document.querySelector('#storyboardOutput');
const { sceneNames, sceneIcons, escapeHtml, buildStoryboard } = StoryboardCore;

function renderStoryboard() {
  const storyboard = buildStoryboard({
    theme: document.querySelector('.wisdom-field input').value,
    story: document.querySelector('textarea').value
  });
  document.querySelector('#storyboardTitle').textContent = storyboard.title;
  const card = document.querySelector('#kuralCard');
  card.hidden = !storyboard.kural;
  if (storyboard.kural) {
    document.querySelector('#kuralNumber').textContent = `Thirukkural ${storyboard.number}`;
    document.querySelector('#kuralTamil').textContent = storyboard.kural.tamil;
    document.querySelector('#kuralMeaning').textContent = storyboard.kural.meaning;
  }
  document.querySelector('#sceneGrid').innerHTML = storyboard.scenes.map((narration, index) => `
    <article class="scene-card">
      <div class="scene-visual" aria-hidden="true">${sceneIcons[index]}</div>
      <div><h4>Scene ${index + 1}: ${sceneNames[index]}</h4><p>${escapeHtml(narration)}</p><small>Animation: gentle camera movement · expressive characters · colorful classroom style</small></div>
    </article>`).join('');
  output.hidden = false;
  output.dataset.script = storyboard.script;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openCreator(mode = 'personal') {
  setMode(mode);
  creator.showModal();
}

function setMode(mode) {
  document.querySelectorAll('[data-form-mode]').forEach((button) => button.classList.toggle('active', button.dataset.formMode === mode));
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
