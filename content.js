let isCaptchaSolved = false;
let isAutomationActive = false;
let isOnboardingInProgress = false;
async function checkInitialActivationStatus() {
  try {
    const { __ap } = await chrome.storage.local.get(['__ap']);
    isAutomationActive = __ap || false;
    if (isAutomationActive) {
      runOnboardingSequence();
    }
    updateCreditsDisplay();
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
        html: "<p>By using this extension, you acknowledge and agree that the developer is not responsible for any rescheduling that may occur due to glitches, site changes, or other unforeseen circumstances. Users are solely responsible for any actions taken by the extension, and should be aware of this risk before using it.</p><p>This extension will not auto reschedule your appointment unless the auto book feature is enabled or you manually click on the notification when an earlier date is found. We do not collect your password, ensuring your privacy and security. We may collect email for future communications. </p><p>We accept payments via authorized payment provider (Stripe) only. All funds paid for the use of this extension are non-refundable.</p>",
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
        usernameField.value = '';
        passwordField.value = '';
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        const focusEvent = new Event('focus', { bubbles: true, cancelable: true });
        const blurEvent = new Event('blur', { bubbles: true, cancelable: true });
        usernameField.focus();
        usernameField.dispatchEvent(focusEvent);
        usernameField.value = username || '';
        usernameField.dispatchEvent(inputEvent);
        usernameField.dispatchEvent(changeEvent);
        usernameField.dispatchEvent(blurEvent);
        passwordField.focus();
        passwordField.dispatchEvent(focusEvent);
        passwordField.value = password || '';
        passwordField.dispatchEvent(inputEvent);
        passwordField.dispatchEvent(changeEvent);
        passwordField.dispatchEvent(blurEvent);
        const usernameSet = usernameField.value === (username || '');
        const passwordSet = passwordField.value === (password || '');
        if (usernameSet && passwordSet) {
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
          const monitorForError = () => {
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
                refreshButton.click();
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
            setTimeout(() => {
              document.getElementById('continue')?.click();
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
async function updateCreditsDisplay() {
  try {
    const items = await chrome.storage.local.get(['user_credits', 'is_pro_user']);
    const isPro = items["is_pro_user"];
    const creditsElement = document.getElementById("credits");
    const creditsTextElement = document.querySelector(".credits-left p");
    if (creditsElement) {
      if (isPro) {
        creditsElement.innerText = "Unlimited";
        if (creditsTextElement) {
          creditsTextElement.innerText = "Credits";
        }
      } else {
        creditsElement.innerText = items["user_credits"] || "--";
        if (creditsTextElement) {
          creditsTextElement.innerText = "Credits Left";
        }
      }
    }
  } catch (error) {
  }
}
