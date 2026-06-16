let securityQuestionsHandled = false;
let isSecurityQuestionsActive = false;

const SECURITY_QUESTION_ALIASES = Object.freeze({
  spouse: ['spouse', 'esinizle'],
  sibling: ['sibling', 'kardes'],
  hero: ['hero', 'kahraman'],
  job: ['first job', 'isiniz'],
  college: ['college', 'kolej'],
  street: ['grew', 'street', 'road', 'sokag', 'yolun', 'buyudugunuz'],
  food: ['food', 'yemek'],
  company: ['company', 'sirket'],
  school: ['school', 'high school', 'ilkokula'],
  mother: ['mother', 'maiden', 'annenizin'],
  pet: ['pet', 'hayvan'],
  car: ['car', 'araban'],
  born: ['born', 'town', 'city where you were born', 'dogdugunuz']
});

async function clickSecurityElement(element) {
  await VisaCgiUtility.clickWithJitter(element, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
}

function dispatchSecurityEvent(field, eventName) {
  field.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));
}

async function typeSecurityFieldValue(field, value) {
  const text = String(value || '');
  field.value = '';
  await VisaCgiUtility.focusWithJitter(field, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
  dispatchSecurityEvent(field, 'focus');
  for (const char of text) {
    await VisaCgiUtility.waitForJitter(50, 130);
    field.value += char;
    dispatchSecurityEvent(field, 'input');
  }
  dispatchSecurityEvent(field, 'change');
  await VisaCgiUtility.waitForJitter(120, 280);
  dispatchSecurityEvent(field, 'blur');
}

function normalizeSecurityQuestionText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSecurityQuestionKey(value) {
  const normalized = normalizeSecurityQuestionText(value);
  if (!normalized) {
    return '';
  }
  if (SECURITY_QUESTION_ALIASES[normalized]) {
    return normalized;
  }
  return Object.entries(SECURITY_QUESTION_ALIASES).find(([, aliases]) =>
    aliases.some(alias => normalized.includes(normalizeSecurityQuestionText(alias)))
  )?.[0] || '';
}

function isStoredQuestionMatch(storedQuestion, promptQuestion) {
  const stored = normalizeSecurityQuestionText(storedQuestion);
  const prompt = normalizeSecurityQuestionText(promptQuestion);
  if (!stored || !prompt) {
    return false;
  }
  if (stored === prompt) {
    return true;
  }
  if (stored.length > 12 && (prompt.includes(stored) || stored.includes(prompt))) {
    return true;
  }
  const storedKey = getSecurityQuestionKey(stored);
  const promptKey = getSecurityQuestionKey(prompt);
  return Boolean(storedKey && promptKey && storedKey === promptKey);
}

function findAnswerForSecurityQuestion(promptQuestion, savedAnswers) {
  for (let index = 1; index <= 3; index++) {
    const storedQuestion = savedAnswers[`question${index}`];
    const answer = savedAnswers[`answer${index}`];
    if (answer && isStoredQuestionMatch(storedQuestion, promptQuestion)) {
      return String(answer);
    }
  }
  return '';
}

function getSecurityQuestionLabel(questionElement, index) {
  const ariaLabel = questionElement?.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const text = questionElement?.textContent;
  return text || `Security Question ${index + 1}`;
}

function escapeSecurityHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

async function showSecurityQuestionsWarning(title, bodyHtml) {
  if (typeof Swal === 'undefined') {
    console.warn(title);
    return;
  }
  await Swal.fire({
    title,
    html: bodyHtml,
    icon: 'warning',
    confirmButtonText: 'OK',
    allowOutsideClick: false
  });
}

async function handleExternalAuthenticationFailed() {
  securityQuestionsHandled = true;
  await showSecurityQuestionsWarning(
    'CGI sign-in failed',
    `
      <p>The site rejected the login handoff after security verification.</p>
      <p>The extension will not auto-retry from this failed page. Wait briefly, then start sign-in again manually.</p>
    `
  );
}

async function answerSecurityQuestions(questions, inputs, observer) {
  securityQuestionsHandled = true;
  const savedAnswers = await chrome.storage.sync.get([
    'question1', 'answer1',
    'question2', 'answer2',
    'question3', 'answer3'
  ]);
  const missingQuestions = [];
  let filledCount = 0;

  for (let index = 0; index < questions.length; index++) {
    const input = inputs[index];
    if (!input) {
      continue;
    }
    const questionLabel = getSecurityQuestionLabel(questions[index], index);
    const answer = findAnswerForSecurityQuestion(questionLabel, savedAnswers);
    if (!answer) {
      missingQuestions.push(questionLabel);
      continue;
    }
    await typeSecurityFieldValue(input, answer);
    filledCount += 1;
  }

  if (filledCount < questions.length || missingQuestions.length) {
    observer.disconnect();
    const missingList = missingQuestions
      .map(question => `<li>${escapeSecurityHtml(question)}</li>`)
      .join('');
    await showSecurityQuestionsWarning(
      'Security answer missing',
      `
        <p>I found ${filledCount} of ${questions.length} required answers and did not submit the form.</p>
        <p>Update the selected CGI account or enter the missing answer manually:</p>
        <ul style="text-align:left; margin: 12px 0 0;">${missingList}</ul>
      `
    );
    return;
  }

  await VisaCgiUtility.waitForJitter(1400, 2600);
  const submitBtn = document.querySelector('button#continue');
  if (submitBtn && !submitBtn.disabled) {
    await clickSecurityElement(submitBtn);
  } else {
    console.warn('Submit button not found');
  }
  observer.disconnect();
}

async function tryAnswerVisibleSecurityQuestions(observer) {
  if (!isSecurityQuestionsActive || securityQuestionsHandled) {
    return;
  }
  const questions = Array.from(document.querySelectorAll('[id^="kbq"][aria-label]'));
  const inputs = Array.from(document.querySelectorAll('input[id^="kba"][id$="_response"]'));
  if (questions.length >= 2 && inputs.length >= 2) {
    await answerSecurityQuestions(questions, inputs, observer);
  }
}

async function initializeSecurityQuestions() {
  if (window.location.href.includes('/Account/Login/ExternalAuthenticationFailed')) {
    await handleExternalAuthenticationFailed();
    return;
  }

  const observer = new MutationObserver(async () => {
    await tryAnswerVisibleSecurityQuestions(observer);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label']
  });
  await tryAnswerVisibleSecurityQuestions(observer);
}

const securityQuestionsPort = chrome.runtime.connect({ name: 'securityQuestions' });
securityQuestionsPort.onMessage.addListener(async function (response) {
  if (response.action == 'fetch_info') {
    let $active = response.data.$active;
    isSecurityQuestionsActive = $active;
    if ($active) {
      await initializeSecurityQuestions();
    } else {
      securityQuestionsHandled = true;
    }
  } else if (response.action == 'activate') {
    let status = response.status;
    isSecurityQuestionsActive = status;
    if (status) {
      securityQuestionsHandled = false;
      await initializeSecurityQuestions();
    } else {
      securityQuestionsHandled = true;
    }
  }
});
securityQuestionsPort.postMessage({ action: 'fetch_info' });
