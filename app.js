const creator = document.querySelector('#creatorDialog');
const privacy = document.querySelector('#privacyDialog');
const form = document.querySelector('#creatorForm');
const status = document.querySelector('#formStatus');

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

[creator, privacy].forEach((dialog) => dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
}));

