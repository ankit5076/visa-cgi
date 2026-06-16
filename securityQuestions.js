let securityQuestionsHandled = false;
let isSecurityQuestionsActive = false; 
function initializeSecurityQuestions() {
          if (window.location.href.includes('/Account/Login/ExternalAuthenticationFailed')) {
            const signInButton = document.querySelector('a.btn.btn-primary[title="Sign in"]');
            if (signInButton) {
                signInButton.click();
                return;
            } else {
                const maxWaitTime = 10000; 
                const startTime = Date.now();
                while (Date.now() - startTime < maxWaitTime) {
                    const button = document.querySelector('a.btn.btn-primary[title="Sign in"]');
                    if (button) {
                        button.click();
                        return;
                    }
                    new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            return;
        }
  const observer = new MutationObserver(async () => {
    if (!isSecurityQuestionsActive) {
      return;
    }
    const questions = Array.from(document.querySelectorAll('[id^="kbq"][aria-label]'));
    const inputs = Array.from(document.querySelectorAll('input[id^="kba"][id$="_response"]'));
    if ((questions.length >= 2 || inputs.length >= 2) && !securityQuestionsHandled) {
      securityQuestionsHandled = true;
      if (!isSecurityQuestionsActive) {
        securityQuestionsHandled = false; 
        return;
      }
      const answers = await chrome.storage.sync.get([
        'question1', 'answer1',
        'question2', 'answer2',
        'question3', 'answer3'
      ]);
      for (let i = 0; i < questions.length; i++) {
        const questionText = questions[i].getAttribute('aria-label').toLowerCase();
        const input = inputs[i];
        if (!input) {
          continue;
        }
        const answers = await chrome.storage.sync.get([
          'question1', 'answer1',
          'question2', 'answer2',
          'question3', 'answer3'
        ]);
        let answer = '';
        for (let j = 1; j <= 3; j++) {
          const questionType = answers[`question${j}`];       
          const answerText = answers[`answer${j}`];
          if (
            questionType === 'spouse' &&
            (questionText.includes('spouse') || questionText.includes('eşinizle'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'sibling' &&
            (questionText.includes('sibling') || questionText.includes('kardeşinizin'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'hero' &&
            (questionText.includes('hero') || questionText.includes('kahramanınız'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'job' &&
            (questionText.includes('first job') || questionText.includes('işiniz'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'college' &&
            (questionText.includes('college') || questionText.includes('kolejin'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'street' &&
            (questionText.includes('grew') || questionText.includes('street') || questionText.includes('sokağın') || questionText.includes('yolun') || questionText.includes('büyüdüğünüz'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'food' &&
            (questionText.includes('food') || questionText.includes('yemek'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'company' &&
            (questionText.includes('company') || questionText.includes('şirket'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'school' &&
            (questionText.includes('school') || questionText.includes('ilkokula'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'mother' &&
            (questionText.includes('mother') || questionText.includes('annenizin'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'pet' &&
            (questionText.includes('pet') || questionText.includes('hayvanınız'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'car' &&
            (questionText.includes('car') || questionText.includes('arabanız'))
          ) {
            answer = answerText;
          } else if (
            questionType === 'born' &&
            (questionText.includes('born') || questionText.includes('doğduğunuz') )
          ) {
            answer = answerText;
          }
        }
        if (answer) {
          input.value = answer;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
        }
      }
      setTimeout(() => {
        const submitBtn = document.querySelector('button#continue');
        if (submitBtn) {
          submitBtn.click();
        } else {
          console.warn('Submit button not found');
        }
      }, 1000);
      observer.disconnect();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label']
  });
}
const securityQuestionsPort = chrome.runtime.connect({ name: "securityQuestions" });
securityQuestionsPort.onMessage.addListener(async function (response) {
  if (response.action == "fetch_info") {
    let $active = response.data.$active;
    isSecurityQuestionsActive = $active;
    if ($active) {
      initializeSecurityQuestions();
    } else {
      securityQuestionsHandled = true; 
    }
  } else if (response.action == "activate") {
    let status = response.status;
    isSecurityQuestionsActive = status;
    if (status) {
      securityQuestionsHandled = false; 
      initializeSecurityQuestions();
    } else {
      securityQuestionsHandled = true; 
    }
  }
});
securityQuestionsPort.postMessage({ action: "fetch_info" });
