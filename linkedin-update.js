/*
 * Run as a Chrome DevTools Snippet while logged in on your own LinkedIn profile.
 * This uses the visible profile editors, not an undocumented LinkedIn API.
 * LinkedIn changes its markup; a section is skipped if its editor cannot be identified.
 */
(async () => {
  'use strict';

  const PROFILE = 'aravindan-pathirasamy-b56708a7';
  const GITHUB = 'https://github.com/aravin012';
  const HEADLINE = 'Associate Technical Lead | Java & Spring Boot | React | Insurance Platform Modernization | AI-Assisted Engineering';
  const ABOUT_ADDITION = `I lead enterprise Java modernization and AI-assisted engineering work across insurance platforms. At Zinnia, I work on moving Spring MVC and JSP applications toward Spring Boot APIs and React. I also designed a governed multi-agent engineering framework for codebase modernization and in-place changes. It combines scoped specialist agents with evidence checks, independent review, build and test gates, and an auditable decision trail. My experience spans technical design, hands-on development, code review, and mentoring.`;
  const EXPERIENCE_ADDITION = `Designed and built a governed multi-agent engineering framework for legacy modernization and in-place bug fixes and features. Its controller enforces task scope, validates evidence and outputs, runs build/test gates, and maintains an audit trail.`;

  if (location.hostname !== 'www.linkedin.com' || !new RegExp(`^/in/${PROFILE}/?$`, 'i').test(location.pathname)) {
    throw new Error(`Open https://www.linkedin.com/in/${PROFILE}/ in the logged-in Chrome tab first.`);
  }
  if (window.__linkedinUpdateRunning) throw new Error('The LinkedIn update is already running in this tab.');
  window.__linkedinUpdateReport = [{ section: 'Startup', result: 'Snippet started on profile' }];
  console.warn('[LinkedIn updater] Started on your profile.');
  if (!confirm('Update your LinkedIn headline, append About and Zinnia experience text, and add your GitHub website? Existing descriptions will be preserved.')) {
    window.__linkedinUpdateReport[0].result = 'Cancelled at confirmation prompt';
    return;
  }
  window.__linkedinUpdateRunning = true;

  const report = [];
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const visible = el => el && el.getClientRects().length > 0;
  const label = el => (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '').trim();
  const controls = (root = document) => Array.from(root.querySelectorAll('button, a')).filter(visible);
  const modal = () => Array.from(document.querySelectorAll('[role="dialog"], .artdeco-modal')).filter(visible).at(-1);

  async function until(getter, description, timeout = 6000) {
    const end = Date.now() + timeout;
    do {
      const found = getter();
      if (found) return found;
      await sleep(150);
    } while (Date.now() < end);
    throw new Error(`Could not find ${description}; LinkedIn may have changed its editor.`);
  }

  function action(root, pattern) {
    return controls(root).find(el => pattern.test(label(el)));
  }

  function field(root, names, type = 'text') {
    const candidates = Array.from(root.querySelectorAll(type === 'text' ? 'input:not([type="hidden"]), textarea, [contenteditable="true"]' : 'input'))
      .filter(visible);
    for (const name of names) {
      const match = candidates.find(el => {
        const associated = el.id ? root.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
        return [associated?.innerText, el.getAttribute('aria-label'), el.getAttribute('placeholder'), el.name, el.id]
          .filter(Boolean).some(value => value.toLowerCase().includes(name.toLowerCase()));
      });
      if (match) return match;
    }
    return null;
  }

  function value(el) { return el.isContentEditable ? el.innerText.trim() : el.value.trim(); }
  function setValue(el, next) {
    el.focus();
    if (el.isContentEditable) {
      el.textContent = next;
    } else {
      const prototype = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(el, next);
    }
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: next }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
  }

  async function save(dialog) {
    const button = action(dialog, /^save$/i);
    if (!button || button.disabled) throw new Error('Save button missing or disabled; nothing was submitted.');
    button.click();
    await until(() => !visible(dialog), 'editor to close after saving', 9000);
    await sleep(450);
  }

  async function close(dialog) {
    const button = action(dialog, /^(dismiss|close|cancel)$/i);
    if (button) button.click();
    await sleep(250);
  }

  async function run(name, operation) {
    try {
      const result = await operation();
      report.push({ section: name, result });
      console.info(`[LinkedIn] ${name}: ${result}`);
    } catch (error) {
      report.push({ section: name, result: `SKIPPED — ${error.message}` });
      console.warn(`[LinkedIn] ${name}: ${error.message}`);
      const open = modal();
      if (open) await close(open);
    }
  }

  try {
    await run('Headline', async () => {
      const edit = action(document, /^edit intro$/i);
      if (!edit) throw new Error('Edit intro button not found.');
      edit.click();
      const dialog = await until(modal, 'intro editor');
      const input = field(dialog, ['headline']);
      if (!input) throw new Error('Headline field not found.');
      if (value(input) === HEADLINE) { await close(dialog); return 'already current'; }
      if (!confirm(`Replace your headline?\n\nCurrent: ${value(input)}\n\nNew: ${HEADLINE}`)) {
        await close(dialog); return 'left unchanged';
      }
      setValue(input, HEADLINE);
      await save(dialog);
      return 'saved';
    });

    await run('About', async () => {
      const section = document.querySelector('#about');
      const edit = action(section || document, /^edit about$/i) || action(document, /^edit about$/i);
      if (!edit) throw new Error('Edit about button not found.');
      edit.click();
      const dialog = await until(modal, 'About editor');
      const input = field(dialog, ['summary', 'about']) || Array.from(dialog.querySelectorAll('textarea, [contenteditable="true"]')).find(visible);
      if (!input) throw new Error('About text area not found.');
      const existing = value(input);
      if (existing.includes('governed multi-agent engineering framework')) { await close(dialog); return 'already includes framework'; }
      const next = [existing, ABOUT_ADDITION].filter(Boolean).join('\n\n');
      if (next.length > 2600) throw new Error('About text would exceed LinkedIn’s length limit; edit it manually.');
      setValue(input, next);
      await save(dialog);
      return 'appended and saved';
    });

    await run('Zinnia experience', async () => {
      const section = document.querySelector('#experience');
      if (!section) throw new Error('Experience section not found.');
      const entries = Array.from(section.querySelectorAll('li, article')).filter(el =>
        visible(el) && /\bZinnia\b/i.test(el.innerText) && /Software Engineer III|Technical Lead/i.test(el.innerText));
      const entry = entries.find(el => !Array.from(el.querySelectorAll('li, article')).some(child =>
        child !== el && /\bZinnia\b/i.test(child.innerText) && /Software Engineer III|Technical Lead/i.test(child.innerText))) || entries[0];
      if (!entry) throw new Error('Zinnia role not found.');
      const edit = action(entry, /^edit (position|experience|.*zinnia.*)$/i);
      if (!edit) throw new Error('Edit button for Zinnia role not found.');
      edit.click();
      const dialog = await until(modal, 'Zinnia experience editor');
      const input = field(dialog, ['description']) || Array.from(dialog.querySelectorAll('textarea, [contenteditable="true"]')).find(visible);
      if (!input) throw new Error('Experience description not found.');
      const existing = value(input);
      if (existing.includes('governed multi-agent engineering framework')) { await close(dialog); return 'already includes framework'; }
      const next = [existing, EXPERIENCE_ADDITION].filter(Boolean).join('\n\n');
      if (next.length > 2000) throw new Error('Experience text would exceed LinkedIn’s length limit; edit it manually.');
      setValue(input, next);
      await save(dialog);
      return 'appended and saved';
    });

    await run('GitHub website', async () => {
      const contact = action(document, /^contact info$/i);
      if (!contact) throw new Error('Contact info link not found.');
      contact.click();
      let dialog = await until(modal, 'contact information');
      if (dialog.innerText.includes('github.com/aravin012')) { await close(dialog); return 'already listed'; }
      const edit = action(dialog, /^edit contact info$/i) || action(document, /^edit contact info$/i);
      if (!edit) throw new Error('Edit contact info button not found.');
      edit.click();
      dialog = await until(() => {
        const current = modal();
        return current && (field(current, ['website', 'url']) || action(current, /^add website$/i)) ? current : null;
      }, 'contact editor');
      const add = action(dialog, /^add website$/i);
      if (add) { add.click(); await sleep(250); }
      const websiteInputs = Array.from(dialog.querySelectorAll('input[type="url"], input[type="text"]'))
        .filter(el => visible(el) && (/website|url/i.test([el.name, el.id, el.getAttribute('aria-label'), el.getAttribute('placeholder')].join(' '))));
      const empty = websiteInputs.find(el => !el.value.trim());
      if (!empty) throw new Error('An empty website URL field was not found; existing links were left untouched.');
      setValue(empty, GITHUB);
      await save(dialog);
      return 'saved';
    });
  } finally {
    window.__linkedinUpdateRunning = false;
    window.__linkedinUpdateReport = report;
    console.table(report);
    console.info('[LinkedIn updater] Finished. Run window.__linkedinUpdateReport in the Console to see section results.');
    alert('LinkedIn update finished. Check the console summary and refresh your profile to verify saved changes.');
  }
})();
