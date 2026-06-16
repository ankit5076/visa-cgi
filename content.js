let isCaptchaSolved = false;
let isAutomationActive = false;
let isOnboardingInProgress = false;
async function dispatchLoginFieldEvent(field, eventName) {
  await VisaCgiUtility.dispatchEventWithJitter(field, eventName, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
}
async function clickLoginElement(element) {
  await VisaCgiUtility.clickWithJitter(element, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
}
function hasUnsolvedLoginCaptcha() {
  const captchaImage = document.getElementById('captchaImage');
  const captchaInput = document.getElementById('extension_atlasCaptchaResponse');
  return Boolean(captchaImage && (!captchaInput || !captchaInput.value));
}
async function clickLoginContinueButton() {
  if (hasUnsolvedLoginCaptcha()) {
    return;
  }
  const continueButton = document.getElementById('continue');
  if (continueButton && !continueButton.disabled) {
    await clickLoginElement(continueButton);
  }
}
async function typeLoginFieldValue(field, value) {
  const text = value || '';
  field.value = '';
  await VisaCgiUtility.focusWithJitter(field, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
  await dispatchLoginFieldEvent(field, 'focus');
  for (const char of text) {
    await VisaCgiUtility.waitForJitter(VisaCgiUtility.JITTER_RANGES.CHARACTER);
    field.value += char;
    await dispatchLoginFieldEvent(field, 'input');
  }
  await dispatchLoginFieldEvent(field, 'change');
  await dispatchLoginFieldEvent(field, 'blur');
}
let cgiAccountPickerPromise = null;
let cgiAccountPickerShownForPage = false;

function isAtlasAuthLoginPage() {
  return window.location.hostname === 'atlasauth.b2clogin.com';
}

function getLoginFields() {
  return {
    usernameField: document.getElementById('signInName'),
    passwordField: document.getElementById('password')
  };
}

async function waitForLoginFields(timeoutMs = 10000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const { usernameField, passwordField } = getLoginFields();
    if (usernameField && passwordField) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return false;
}

async function waitForSwal(timeoutMs = 10000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (typeof Swal !== 'undefined') {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
}

function fetchCgiVisaAccountsFromTracker() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'fetchCgiVisaAccounts' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response || response.ok !== true) {
        reject(new Error(response?.error || 'Unable to fetch CGI accounts'));
        return;
      }
      resolve(Array.isArray(response.accounts) ? response.accounts : []);
    });
  });
}

function normalizeCgiAccount(account) {
  return {
    id: account?.id,
    name: String(account?.name || '').trim(),
    username: String(account?.username || '').trim(),
    password: String(account?.password || ''),
    question1: String(account?.question1 || '').trim(),
    answer1: String(account?.answer1 || ''),
    question2: String(account?.question2 || '').trim(),
    answer2: String(account?.answer2 || ''),
    question3: String(account?.question3 || '').trim(),
    answer3: String(account?.answer3 || '')
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function buildCgiAccountChoiceValue(account, index) {
  if (account.id !== undefined && account.id !== null && account.id !== '') {
    return `id:${account.id}`;
  }
  return `account:${index}`;
}

function buildCgiAccountPickerHtml(accountChoices, selectedValue) {
  const accountCountLabel = accountChoices.length === 1
    ? '1 saved tracker account'
    : `${accountChoices.length} saved tracker accounts`;
  const shouldShowSearch = accountChoices.length > 3;
  const cardsHtml = accountChoices.map(({ account, value }, index) => {
    const questionCount = [
      account.question1 && account.answer1,
      account.question2 && account.answer2,
      account.question3 && account.answer3
    ].filter(Boolean).length;
    const isSelected = value === selectedValue;
    const displayName = account.name || account.username;
    const trackerLabel = account.id ? `Tracker ID #${account.id}` : `Account ${index + 1}`;
    const metaParts = account.name
      ? [`Username: ${account.username}`, trackerLabel, `${questionCount}/3 security answers`]
      : [trackerLabel, `${questionCount}/3 security answers`];
    const metaLabel = metaParts.join(' | ');
    return `
      <button
        type="button"
        class="cgi-account-card${isSelected ? ' is-selected' : ''}"
        data-cgi-account-value="${escapeHtml(value)}"
        data-cgi-search="${escapeHtml(`${account.name || ''} ${account.username} ${account.id || ''}`.toLowerCase())}"
        aria-pressed="${isSelected ? 'true' : 'false'}"
      >
        <span class="cgi-account-radio" aria-hidden="true"></span>
        <span class="cgi-account-copy">
          <span class="cgi-account-username">${escapeHtml(displayName)}</span>
          <span class="cgi-account-meta">${escapeHtml(metaLabel)}</span>
        </span>
      </button>
    `;
  }).join('');

  return `
    <style>
      .cgi-account-swal {
        border-radius: 12px;
      }
      .cgi-account-swal .swal2-title {
        font-size: 30px;
        line-height: 1.15;
        padding: 0 12px;
      }
      .cgi-account-swal .swal2-html-container {
        margin: 14px 28px 0;
        overflow: visible;
      }
      .cgi-account-picker {
        color: #111827;
        font-family: inherit;
        text-align: left;
      }
      .cgi-account-summary {
        align-items: center;
        color: #4b5563;
        display: flex;
        font-size: 15px;
        gap: 12px;
        justify-content: space-between;
        margin: 0 0 12px;
      }
      .cgi-account-count {
        background: #eef2ff;
        border: 1px solid #c7d2fe;
        border-radius: 999px;
        color: #3730a3;
        font-size: 13px;
        font-weight: 700;
        padding: 6px 10px;
        white-space: nowrap;
      }
      .cgi-account-search {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        box-sizing: border-box;
        color: #111827;
        font: inherit;
        height: 44px;
        margin: 0 0 12px;
        outline: none;
        padding: 0 12px;
        width: 100%;
      }
      .cgi-account-search:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
      }
      .cgi-account-list {
        display: grid;
        gap: 8px;
        max-height: 288px;
        overflow-y: auto;
        padding: 2px;
      }
      .cgi-account-card {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        color: #111827;
        cursor: pointer;
        display: grid;
        font: inherit;
        gap: 12px;
        grid-template-columns: 20px minmax(0, 1fr);
        min-height: 64px;
        padding: 12px;
        text-align: left;
        transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;
        width: 100%;
      }
      .cgi-account-card:hover,
      .cgi-account-card:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        outline: none;
      }
      .cgi-account-card.is-selected {
        background: #eff6ff;
        border-color: #2563eb;
      }
      .cgi-account-radio {
        align-items: center;
        border: 2px solid #94a3b8;
        border-radius: 999px;
        display: flex;
        height: 18px;
        justify-content: center;
        width: 18px;
      }
      .cgi-account-card.is-selected .cgi-account-radio {
        border-color: #2563eb;
      }
      .cgi-account-card.is-selected .cgi-account-radio::after {
        background: #2563eb;
        border-radius: 999px;
        content: "";
        display: block;
        height: 8px;
        width: 8px;
      }
      .cgi-account-copy {
        display: grid;
        gap: 4px;
        min-width: 0;
      }
      .cgi-account-username {
        color: #111827;
        display: block;
        font-size: 17px;
        font-weight: 800;
        overflow-wrap: anywhere;
      }
      .cgi-account-meta {
        color: #64748b;
        display: block;
        font-size: 13px;
        overflow-wrap: anywhere;
      }
      .cgi-account-empty {
        border: 1px dashed #cbd5e1;
        border-radius: 8px;
        color: #64748b;
        display: none;
        font-size: 14px;
        padding: 14px;
        text-align: center;
      }
      @media (max-width: 520px) {
        .cgi-account-swal .swal2-html-container {
          margin-left: 14px;
          margin-right: 14px;
        }
        .cgi-account-summary {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }
        .cgi-account-card {
          padding: 10px;
        }
        .cgi-account-username {
          font-size: 15px;
        }
      }
    </style>
    <div class="cgi-account-picker">
      <input type="hidden" data-cgi-selected-value value="${escapeHtml(selectedValue)}">
      <div class="cgi-account-summary">
        <span>Pick the login to load into this page.</span>
        <span class="cgi-account-count">${escapeHtml(accountCountLabel)}</span>
      </div>
      ${shouldShowSearch ? '<input class="cgi-account-search" data-cgi-account-search type="search" placeholder="Search by name, username, or tracker ID" autocomplete="off">' : ''}
      <div class="cgi-account-list" data-cgi-account-list>
        ${cardsHtml}
      </div>
      <div class="cgi-account-empty" data-cgi-account-empty>No matching account found.</div>
    </div>
  `;
}

function bindCgiAccountPickerEvents(popup) {
  const selectedInput = popup.querySelector('[data-cgi-selected-value]');
  const cards = Array.from(popup.querySelectorAll('[data-cgi-account-value]'));
  const searchInput = popup.querySelector('[data-cgi-account-search]');
  const emptyState = popup.querySelector('[data-cgi-account-empty]');
  const selectCard = (card) => {
    if (!card || !selectedInput) {
      return;
    }
    selectedInput.value = card.dataset.cgiAccountValue || '';
    cards.forEach((accountCard) => {
      const isSelected = accountCard === card;
      accountCard.classList.toggle('is-selected', isSelected);
      accountCard.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => selectCard(card));
    card.addEventListener('dblclick', () => {
      selectCard(card);
      Swal.clickConfirm();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const searchValue = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = !searchValue || (card.dataset.cgiSearch || '').includes(searchValue);
        card.style.display = matches ? '' : 'none';
        if (matches) {
          visibleCount += 1;
        }
      });
      if (emptyState) {
        emptyState.style.display = visibleCount ? 'none' : 'block';
      }
    });
  }
}

async function hydrateCgiAccount(account) {
  const normalized = normalizeCgiAccount(account);
  await chrome.storage.sync.set({
    username: normalized.username,
    password: normalized.password,
    question1: normalized.question1,
    answer1: normalized.answer1,
    question2: normalized.question2,
    answer2: normalized.answer2,
    question3: normalized.question3,
    answer3: normalized.answer3
  });
  await chrome.storage.local.set({
    __cgiSelectedTrackerAccountId: normalized.id || null,
    __cgiSelectedTrackerAccountName: normalized.name,
    __cgiSelectedTrackerAccountUsername: normalized.username,
    __cgiSelectedTrackerAccountAt: new Date().toISOString()
  });
  return normalized;
}

async function showCgiAccountPickerIfNeeded() {
  if (!isAtlasAuthLoginPage() || cgiAccountPickerShownForPage) {
    return null;
  }
  if (cgiAccountPickerPromise) {
    return cgiAccountPickerPromise;
  }
  cgiAccountPickerPromise = (async () => {
    const hasLoginFields = await waitForLoginFields();
    if (!hasLoginFields) {
      return null;
    }
    const swalReady = await waitForSwal();
    if (!swalReady) {
      return null;
    }
    cgiAccountPickerShownForPage = true;
    const wasOnboardingInProgress = isOnboardingInProgress;
    isOnboardingInProgress = true;
    try {
      Swal.fire({
        title: 'Loading CGI accounts',
        text: 'Fetching saved tracker accounts...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading()
      });
      const accounts = (await fetchCgiVisaAccountsFromTracker()).map(normalizeCgiAccount)
        .filter(account => account.username && account.password);
      if (!accounts.length) {
        await Swal.fire({
          title: 'No CGI accounts',
          text: 'Add CGI accounts in Tracker UI before selecting one here.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
        return null;
      }
      const accountChoices = accounts.map((account, index) => ({
        account,
        value: buildCgiAccountChoiceValue(account, index)
      }));
      const accountByValue = new Map(accountChoices.map(({ account, value }) => [value, account]));
      const previousSelection = await chrome.storage.local.get([
        '__cgiSelectedTrackerAccountId',
        '__cgiSelectedTrackerAccountName',
        '__cgiSelectedTrackerAccountUsername'
      ]);
      const selectedChoice = accountChoices.find(({ account }) =>
        previousSelection.__cgiSelectedTrackerAccountId &&
        String(account.id) === String(previousSelection.__cgiSelectedTrackerAccountId)
      ) || accountChoices.find(({ account }) =>
        previousSelection.__cgiSelectedTrackerAccountUsername &&
        account.username === previousSelection.__cgiSelectedTrackerAccountUsername
      ) || accountChoices[0];
      const selectedValue = selectedChoice.value;
      const result = await Swal.fire({
        title: 'Choose CGI account',
        html: buildCgiAccountPickerHtml(accountChoices, selectedValue),
        width: 560,
        showCancelButton: true,
        confirmButtonText: 'Load account',
        cancelButtonText: 'Skip for now',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        customClass: {
          popup: 'cgi-account-swal'
        },
        focusConfirm: false,
        allowOutsideClick: false,
        didOpen: (popup) => {
          bindCgiAccountPickerEvents(popup);
        },
        preConfirm: () => {
          const selectedInput = Swal.getPopup().querySelector('[data-cgi-selected-value]');
          const value = String(selectedInput?.value || '');
          if (!value || !accountByValue.has(value)) {
            Swal.showValidationMessage('Choose an account to load');
            return false;
          }
          return value;
        }
      });
      if (!result.isConfirmed) {
        return null;
      }
      const selectedAccount = accountByValue.get(String(result.value));
      const hydrated = await hydrateCgiAccount(selectedAccount);
      await Swal.fire({
        title: 'Account loaded',
        text: `${hydrated.name || hydrated.username} is now saved in the extension.`,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });
      return hydrated;
    } catch (error) {
      await Swal.fire({
        title: 'Unable to load CGI accounts',
        text: error.message || String(error),
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return null;
    } finally {
      isOnboardingInProgress = wasOnboardingInProgress;
      cgiAccountPickerPromise = null;
    }
  })();
  return cgiAccountPickerPromise;
}
async function checkInitialActivationStatus() {
  try {
    const { __ap } = await chrome.storage.local.get(['__ap']);
    isAutomationActive = __ap || false;
    await showCgiAccountPickerIfNeeded();
    if (isAutomationActive) {
      runOnboardingSequence();
    }
  } catch (error) {
  }
}
async function checkCaptchaApiKeyConfig() {
  const { captchaApiKeyPreference, apiKey } = await chrome.storage.sync.get([
    'captchaApiKeyPreference',
    'apiKey'
  ]);
  if (captchaApiKeyPreference || apiKey) {
    return;
  }
  return new Promise((resolve) => {
    Swal.fire({
      title: 'CAPTCHA Solving Setup',
      html: `
        <p>This extension can automatically solve CAPTCHAs during form filling, but requires a 2Captcha API key.</p>
        <p>Would you like to:</p>
        <div class="swal2-input-container">
          <input type="text" id="captchaApiKey" class="swal2-input" placeholder="Enter your 2Captcha API key">
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Save API Key',
      denyButtonText: 'Skip Auto-Solving',
      cancelButtonText: 'Ask me later',
      allowOutsideClick: false,
      preConfirm: () => {
        const apiKey = document.getElementById('captchaApiKey').value.trim();
        if (!apiKey) {
          Swal.showValidationMessage('Please enter an API key or choose another option');
          return false;
        }
        return apiKey;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newApiKey = result.value;
        await chrome.storage.sync.set({
          apiKey: newApiKey,
          captchaApiKeyPreference: 'use'
        });
        resolve('use');
      } else if (result.isDenied) {
        await chrome.storage.sync.set({ captchaApiKeyPreference: 'skip' });
        resolve('skip');
      } else {
        resolve('later');
      }
    });
  });
}
function enableAutomationFeatures() {
  isAutomationActive = true;
  startFormDetectionWithRetries();
}
async function startFormDetectionWithRetries() {
  const maxAttempts = 10;
  const retryDelay = 1000;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (!isAutomationActive) {
      return;
    }
    try {
      const usernameField = document.getElementById('signInName');
      const passwordField = document.getElementById('password');
      if (usernameField && passwordField) {
        setTimeout(() => {
          fillForm();
        }, 1000);
        return;
      } else {
        const loginIndicators = [
          document.querySelector('input[type="email"]'),
          document.querySelector('input[type="text"][name*="email"]'),
          document.querySelector('input[type="text"][name*="user"]'),
          document.querySelector('input[type="password"]'),
          document.querySelector('#signInName'),
          document.querySelector('#password'),
          document.querySelector('[data-testid*="login"]'),
          document.querySelector('[class*="login"]'),
          document.querySelector('[id*="login"]')
        ];
        const foundIndicators = loginIndicators.filter(el => el !== null);
        if (foundIndicators.length > 0) {
        } else {
        }
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    } catch (error) {
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
}
function disableAutomationFeatures() {
  isAutomationActive = false;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activate") {
    isAutomationActive = message.status;
    if (isAutomationActive) {
      runOnboardingSequence();
    } else {
      isOnboardingInProgress = false;
      disableAutomationFeatures();
    }
  }
  return true;
});
/**
 * Runs the complete onboarding sequence in the correct order:
 * 1. Get consent (mandatory)
 * 2. Set up CAPTCHA API key
 * 3. Enable automation features
 */
async function runOnboardingSequence() {
  try {
    isOnboardingInProgress = true;
    const { __uc } = await chrome.storage.local.get(['__uc']);
    const usageConsent = __uc === true;
    if (!usageConsent) {
      if (typeof Swal === 'undefined') {
        isOnboardingInProgress = false;
        return;
      }
      await Swal.fire({
        title: "Terms & Conditions",
        html: "<p>By using this extension, you acknowledge and agree that the developer is not responsible for any rescheduling that may occur due to glitches, site changes, or other unforeseen circumstances. Users are solely responsible for any actions taken by the extension, and should be aware of this risk before using it.</p><p>This extension will not auto reschedule your appointment unless the auto book feature is enabled or you manually click on the notification when an earlier date is found.</p>",
        icon: "warning",
        confirmButtonText: "Yes, I Give My Consent",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
      });
      await Swal.fire({
        title: "Instructions",
        html: "<p>Please enter your <strong>username</strong> and <strong>password</strong> to continue using the extension.</p><p>In the next popup, you will be asked to enter your <strong>API key</strong> to enable automatic captcha solving.</p>",
        icon: "warning",
        confirmButtonText: "Let's go!",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
      });
      await chrome.storage.local.set({ "__uc": true });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
    }
    const captchaPreference = await checkCaptchaApiKeyConfig();
    isOnboardingInProgress = false;
    enableAutomationFeatures();
  } catch (error) {
    isOnboardingInProgress = false;
  }
}
async function fillForm() {
  if (!isAutomationActive || isOnboardingInProgress) {
    return;
  }
  const {
    username, password, apiKey,
    walouname, walouon, walouspouse,
    captchaApiKeyPreference
  } = await chrome.storage.sync.get([
    'username', 'password', 'apiKey',
    'walouname', 'walouon', 'walouspouse',
    'captchaApiKeyPreference'
  ]);
  const fillCredentialsRobustly = async () => {
    const maxAttempts = 10;
    const retryDelay = 1000;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const usernameField = document.getElementById('signInName');
        const passwordField = document.getElementById('password');
        if (!usernameField || !passwordField) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        if (usernameField.disabled || passwordField.disabled) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        await typeLoginFieldValue(usernameField, username);
        await typeLoginFieldValue(passwordField, password);
        const usernameSet = usernameField.value === (username || '');
        const passwordSet = passwordField.value === (password || '');
        if (usernameSet && passwordSet) {
          await clickLoginContinueButton();
          return;
        } else {
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      } catch (error) {
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
    const finalUsernameField = document.getElementById('signInName');
    const finalPasswordField = document.getElementById('password');
    if (finalUsernameField && finalPasswordField) {
      const finalUsernameSet = finalUsernameField.value === (username || '');
      const finalPasswordSet = finalPasswordField.value === (password || '');
      if (finalUsernameSet && finalPasswordSet) {
      } else {
      }
    } else {
    }
  };
  setTimeout(fillCredentialsRobustly, 1000);
  const setupContinueButtonMonitoring = () => {
    const continueButton = document.getElementById('continue');
    if (continueButton && !continueButton.hasAttribute('data-error-monitoring-added')) {
      continueButton.setAttribute('data-error-monitoring-added', 'true');
      continueButton.addEventListener('click', () => {
        const startErrorMonitoring = () => {
          let errorCheckAttempts = 0;
          const maxErrorCheckAttempts = 30;
          const monitorForError = async () => {
            if (!isAutomationActive || isOnboardingInProgress) {
              return;
            }
            errorCheckAttempts++;
            const errorDiv = document.getElementById('claimVerificationServerError');
            if (errorDiv && errorDiv.style.display === 'block') {
              const captchaInput = document.getElementById('extension_atlasCaptchaResponse');
              if (captchaInput) {
                captchaInput.value = '';
              }
              const refreshButton = document.getElementById('captchaImageRefreshImage');
              if (refreshButton) {
                await clickLoginElement(refreshButton);
                isCaptchaSolved = false;
                setTimeout(() => {
                  checkForCaptcha();
                }, 3000);
              } else {
                location.reload();
              }
              return;
            }
            if (!document.getElementById('extension_atlasCaptchaResponse')) {
              return;
            }
            if (errorCheckAttempts < maxErrorCheckAttempts) {
              setTimeout(monitorForError, 1000);
            } else {
            }
          };
          setTimeout(monitorForError, 2000);
        };
        startErrorMonitoring();
      });
    }
  };
  setTimeout(setupContinueButtonMonitoring, 2000);
  if (!isCaptchaSolved) {
    let retries = 5;
    const startCaptchaCheckingWithRetries = async () => {
      const captchaImg = document.getElementById('captchaImage');
      if (captchaImg) {
        checkForCaptcha();
      } else if (retries-- > 0) {
        setTimeout(startCaptchaCheckingWithRetries, 5000);
      } else {
      }
    };
    startCaptchaCheckingWithRetries();
  }
}
async function imageToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}
const checkForCaptcha = async () => {
  if (!isAutomationActive || isOnboardingInProgress) {
    return;
  }
  const captchaImg = document.getElementById('captchaImage');
  if (captchaImg) {
    try {
      isCaptchaSolved = true;
      const imageBase64 = await imageToBase64(captchaImg.src);
      const { apiKey, captchaApiKeyPreference } = await chrome.storage.sync.get([
        'apiKey', 'captchaApiKeyPreference'
      ]);
      if (apiKey) {
        if (captchaApiKeyPreference === 'skip') {
          await chrome.storage.sync.set({ captchaApiKeyPreference: 'use' });
        }
      } else {
        if (captchaApiKeyPreference === 'skip') {
          return;
        }
        const preference = await checkCaptchaApiKeyConfig();
        if (preference === 'skip' || preference === 'later') {
          return;
        }
      }
      const solveCaptchaPromise = () => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("CAPTCHA solving timed out after 60 seconds"));
          }, 60000);
          chrome.runtime.sendMessage(
            { action: 'solveCaptcha', imageBase64, apiKey: apiKey },
            (response) => {
              clearTimeout(timeoutId);
              if (chrome.runtime.lastError) {
                reject(new Error(`Chrome runtime error: ${chrome.runtime.lastError.message}`));
                return;
              }
              if (!response) {
                reject(new Error('Received undefined response from background script'));
                return;
              }
              if (response.error) {
                reject(new Error(response.error));
                return;
              }
              if (!response.solution) {
                reject(new Error('No solution received'));
                return;
              }
              resolve(response.solution);
            }
          );
        });
      };
      let captchaSolveAttempts = 0;
      const maxCaptchaSolveAttempts = 3;
      const trySolveCaptcha = async () => {
        try {
          captchaSolveAttempts++;
          const solution = await solveCaptchaPromise();
          const captchaInput = document.getElementById('extension_atlasCaptchaResponse');
          if (captchaInput) {
            captchaInput.value = solution;
            setTimeout(async () => {
              const continueButton = document.getElementById('continue');
              if (continueButton) {
                await clickLoginElement(continueButton);
              }
            }, 1000);
          } else {
            isCaptchaSolved = false;
          }
        } catch (error) {
          isCaptchaSolved = false;
          if (captchaSolveAttempts < maxCaptchaSolveAttempts) {
            setTimeout(trySolveCaptcha, 2000);
          } else {
            setTimeout(checkForCaptcha, 5000);
          }
        }
      };
      trySolveCaptcha();
    } catch (error) {
      isCaptchaSolved = false;
      setTimeout(checkForCaptcha, 5000);
    }
  } else {
  }
};
checkInitialActivationStatus();
