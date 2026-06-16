importScripts('utility.js');

const TRACKER_API_BASE_URL = 'https://getslotnow.com/administrator-api/api/us-visa';
const TRACKER_AUTH_API_BASE_URL = 'https://getslotnow.com/administrator-api/api/auth';
const TRACKER_AUTH_HEADER = 'X-Tracker-Admin-Session';
const TRACKER_AUTH_CREDENTIALS = Object.freeze({
  username: 'ankit5076',
  password: 'Automate!5076',
});
const TRACKER_REQUEST_TIMEOUT_MS = 15000;

let trackerAuthSessionToken = null;
let trackerAuthLoginPromise = null;

async function fetchWithTimeout(url, options = {}) {
  const { timeoutMs = TRACKER_REQUEST_TIMEOUT_MS, signal: callerSignal, ...fetchOptions } = options;
  let controller = null;
  let timeoutId = null;
  let signal = callerSignal;
  if (timeoutMs && !signal) {
    controller = new AbortController();
    signal = controller.signal;
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  }
  try {
    return await fetch(url, { ...fetchOptions, signal });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function clearTrackerAuthSession() {
  trackerAuthSessionToken = null;
  trackerAuthLoginPromise = null;
}

async function loginTrackerAdmin() {
  if (trackerAuthLoginPromise) {
    return trackerAuthLoginPromise;
  }
  trackerAuthLoginPromise = fetchWithTimeout(`${TRACKER_AUTH_API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TRACKER_AUTH_CREDENTIALS),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Tracker auth API returned ${response.status}`);
    }
    const payload = await response.json();
    const sessionToken = String(payload?.session_token || '').trim();
    if (!sessionToken) {
      throw new Error('Tracker auth API did not return a session token');
    }
    trackerAuthSessionToken = sessionToken;
    return sessionToken;
  }).finally(() => {
    trackerAuthLoginPromise = null;
  });
  return trackerAuthLoginPromise;
}

async function getTrackerAuthSessionToken() {
  if (trackerAuthSessionToken) {
    return trackerAuthSessionToken;
  }
  return loginTrackerAdmin();
}

async function fetchTrackerWithAuth(path, options = {}, retryOnUnauthorized = true) {
  const sessionToken = await getTrackerAuthSessionToken();
  const response = await fetchWithTimeout(`${TRACKER_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      [TRACKER_AUTH_HEADER]: sessionToken,
    },
  });
  if (response.status !== 401 || !retryOnUnauthorized) {
    return response;
  }
  clearTrackerAuthSession();
  const retrySessionToken = await getTrackerAuthSessionToken();
  return fetchWithTimeout(`${TRACKER_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      [TRACKER_AUTH_HEADER]: retrySessionToken,
    },
  });
}

function normalizeCgiAccountForContent(account) {
  return {
    id: account?.id,
    name: account?.name || '',
    username: account?.username || '',
    password: account?.password || '',
    question1: account?.question1 || '',
    answer1: account?.answer1 || '',
    question2: account?.question2 || '',
    answer2: account?.answer2 || '',
    question3: account?.question3 || '',
    answer3: account?.answer3 || '',
    updated_at: account?.updated_at || account?.updatedAt || '',
  };
}

async function fetchCgiVisaAccounts() {
  const response = await fetchTrackerWithAuth('/cgi/accounts', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Tracker CGI accounts API returned ${response.status}`);
  }
  const accounts = await response.json();
  if (!Array.isArray(accounts)) {
    throw new Error('Tracker CGI accounts API returned an invalid response');
  }
  return accounts.map(normalizeCgiAccountForContent);
}

chrome.runtime.onConnect.addListener(function (port) {
  connectedPorts.push(port);
  port.onDisconnect.addListener(function () {
    const index = connectedPorts.indexOf(port);
    if (index !== -1) {
      connectedPorts.splice(index, 1);
    }
  });
  port.onMessage.addListener(async function (def) {
    let response = new Object();
    response.action = def.action;
    if (def.action == "fetch_info") {
      let { __ap } = await chrome.storage.local.get("__ap");
      response.data = {
        $active: __ap || false
      };
    }
    port.postMessage(response);
  });
});
const connectedPorts = [];
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "https://www.usvisascheduling.com/en-US/"
    });
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'activate') {
    chrome.storage.local.set({ __ap: request.status }).then(() => {
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          chrome.tabs.sendMessage(tab.id, {
            action: "activate",
            status: request.status
          }).catch(err => {
          });
        });
      });
      connectedPorts.forEach(port => {
        try {
          port.postMessage({
            action: "activate",
            status: request.status
          });
        } catch (error) {
        }
      });
      sendResponse({ success: true });
    });
    return true;
  }
  if (request.action === 'fetchCgiVisaAccounts') {
    fetchCgiVisaAccounts()
      .then(accounts => {
        sendResponse({ ok: true, accounts });
      })
      .catch(error => {
        sendResponse({ ok: false, error: error.message || String(error) });
      });
    return true;
  }
  if (request.action === 'solveCaptcha') {
    if (!request.imageBase64) {
      sendResponse({ error: 'Missing CAPTCHA image data' });
      return true;
    }
    if (!request.apiKey) {
      sendResponse({ error: 'Missing API key' });
      return true;
    }
    solveCaptcha(request.imageBase64, request.apiKey)
      .then(solution => {
        sendResponse({ solution });
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
      });
    return true;
  }
  if (request.type === "log") {
    logInfo(request.message);
    return false;
  }
  return false;
});
function logInfo(message) {
  const timestamp = new Date().toLocaleString();
  const logMessage = `${timestamp}: ${message}`;
  chrome.storage.local.get({ logs: '' }, function (data) {
    const updatedLogs = data.logs + logMessage + "\n";
    chrome.storage.local.set({ logs: updatedLogs }, () => {
    });
  });
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadLogs") {
    downloadLogs();
  }
});
function downloadLogs() {
  chrome.storage.local.get('logs', function (data) {
    if (!data.logs) {
      return;
    }
    const blob = new Blob([data.logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    chrome.downloads.download({
      url: url,
      filename: `visa_dates_log_${timestamp}.txt`,
      saveAs: true
    }, () => {
      URL.revokeObjectURL(url);
    });
  });
}
async function solveCaptcha(imageBase64, apiKey) {
  try {
    if (!imageBase64) {
      return Promise.reject('Missing CAPTCHA image data');
    }
    if (!apiKey) {
      return Promise.reject('Missing 2captcha API key');
    }
    const submitRes = await VisaCgiUtility.fetchWithJitter(`https://2captcha.com/in.php?key=${apiKey}&method=base64&body=${encodeURIComponent(imageBase64)}`);
    const submitText = await submitRes.text();
    if (!submitText.startsWith('OK|')) {
      return Promise.reject(`2captcha submission failed: ${submitText}`);
    }
    const captchaId = submitText.split('|')[1];
    let attempts = 0;
    const maxAttempts = 12;
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          attempts++;
          const res = await VisaCgiUtility.fetchWithJitter(`https://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`);
          const text = await res.text();
          if (text.includes('OK|')) {
            clearInterval(interval);
            const solution = text.split('|')[1];
            resolve(solution);
          } else if (text === 'CAPCHA_NOT_READY') {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              reject('CAPTCHA solving timed out');
            }
          } else {
            clearInterval(interval);
            reject(`CAPTCHA solve failed: ${text}`);
          }
        } catch (error) {
          clearInterval(interval);
          reject(`Error checking CAPTCHA solution: ${error.message}`);
        }
      }, 5000);
    });
  } catch (error) {
    return Promise.reject(`Error in solveCaptcha: ${error.message}`);
  }
}
