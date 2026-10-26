(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StoryboardCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const kuralLibrary = Object.freeze({
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
  });
  const sceneNames = Object.freeze(['A colorful beginning', 'The challenge appears', 'A thoughtful choice', 'The change', 'The lesson shines']);
  const sceneIcons = Object.freeze(['☀', '!', '✦', '♥', '★']);
  const fallbackScenes = Object.freeze(['Meet our young hero in a bright, welcoming world.', 'A problem tests what the hero understands.', 'The hero pauses and chooses a wiser path.', 'That choice helps the people around them.', 'The Kural reveals the lesson to remember.']);

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }
  function extractKuralNumber(value) {
    const match = String(value || '').match(/(?:kural\s*)?(\d{1,4})/i);
    if (!match) return null;
    const number = Number(match[1]);
    return number >= 1 && number <= 1330 ? number : null;
  }
  function makeScenes(story) {
    const sentences = String(story || '').replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const buckets = Array.from({ length: 5 }, () => []);
    sentences.forEach((sentence, index) => buckets[Math.min(4, Math.floor(index * 5 / Math.max(1, sentences.length)))].push(sentence.trim()));
    return buckets.map((parts, index) => parts.join(' ') || fallbackScenes[index]);
  }
  function buildStoryboard({ theme = '', story = '' } = {}) {
    const number = extractKuralNumber(theme);
    const kural = kuralLibrary[number] || null;
    const title = kural ? kural.title : String(theme).trim() || 'A Little Lantern Story';
    const scenes = makeScenes(story);
    const kuralText = kural ? `Thirukkural ${number}\n${kural.tamil}\n${kural.meaning}\n\n` : '';
    return { number, kural, title, scenes, script: `${title}\n\n${kuralText}${scenes.map((scene, index) => `Scene ${index + 1}: ${scene}`).join('\n\n')}` };
  }
  return { kuralLibrary, sceneNames, sceneIcons, escapeHtml, extractKuralNumber, makeScenes, buildStoryboard };
});
