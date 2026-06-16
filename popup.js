document.addEventListener('DOMContentLoaded', async () => {
  const versionElement = document.getElementById('version');
  if (versionElement) {
    const manifest = chrome.runtime.getManifest();
    versionElement.textContent = `v${manifest.version}`;
  }
  function refreshCredits() {
    chrome.storage.local.get(['user_credits', 'is_pro_user'], function(items) {
      const creditsElement = document.getElementById('credits');
      const creditsTextElement = document.querySelector('.credits-left p');
      if (creditsElement) {
        const isPro = items.is_pro_user;
        if (isPro) {
          creditsElement.textContent = 'Unlimited';
          if (creditsTextElement) {
            creditsTextElement.textContent = 'Credits';
          }
        } else {
          const userCredits = items.user_credits !== undefined ? items.user_credits : 0;
          creditsElement.textContent = userCredits;
          if (creditsTextElement) {
            creditsTextElement.textContent = 'Free Credits';
          }
        }
      }
    });
  }
  refreshCredits();
  function displayUserEmail() {
    chrome.storage.local.get(['email'], function(items) {
      const emailDisplay = document.getElementById('user-email-display');
      const emailText = document.getElementById('user-email-text');
      if (emailDisplay && emailText && items.email) {
        emailText.textContent = items.email;
        emailDisplay.style.display = 'block';
      } else if (emailDisplay && !items.email) {
        emailDisplay.style.display = 'none';
      }
    });
  }
  displayUserEmail();
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && (changes.user_credits || changes.is_pro_user)) {
      refreshCredits();
    }
    if (namespace === 'local' && changes.email) {
      displayUserEmail();
    }
  });
  chrome.storage.local.get(['__ap', '__ab'], function(items) {
    const activateToggle = document.getElementById('activate');
    const autobookToggle = document.getElementById('autobook');
    if (activateToggle) {
      activateToggle.checked = items.__ap || false;
      activateToggle.addEventListener('change', function() {
        chrome.storage.local.set({ __ap: this.checked });
        chrome.runtime.sendMessage({ 
          action: 'activate', 
          status: this.checked 
        });
      });
    } else {
      console.warn('Activate toggle element not found');
    }
    if (autobookToggle) {
      autobookToggle.checked = items.__ab || false;
      autobookToggle.addEventListener('change', function() {
        chrome.storage.local.set({ __ab: this.checked });
      });
    } else {
      console.warn('Autobook toggle element not found');
    }
  });
  chrome.storage.sync.get([
    'username', 'password', 'apiKey', 'pushoverUserKey',
    'question1', 'answer1',
    'question2', 'answer2',
    'question3', 'answer3',
    'startDate', 'endDate',
    'selectedOfcCities',
    'selectedConsularCities'
  ], (data) => {
    document.getElementById('username').value = data.username || '';
    document.getElementById('password').value = data.password || '';
    document.getElementById('apiKey').value = data.apiKey || '';
    document.getElementById('pushoverUserKey').value = data.pushoverUserKey || '';
    if (data.startDate) document.getElementById('startDate').value = data.startDate;
    if (data.endDate) document.getElementById('endDate').value = data.endDate;
    if (data.question1) document.getElementById('question1').value = data.question1;
    if (data.question2) document.getElementById('question2').value = data.question2;
    if (data.question3) document.getElementById('question3').value = data.question3;
    document.getElementById('answer1').value = data.answer1 || '';
    document.getElementById('answer2').value = data.answer2 || '';
    document.getElementById('answer3').value = data.answer3 || '';
    chrome.storage.local.get(['__fq', '__fqType'], function(items) {
      document.getElementById("frequencyValue").value = items.__fq || 30;
      let frequencyTypeSelect = document.getElementById("frequencyType");
      let frequencyType = items.__fqType || "seconds";
      for (let i = 0; i < frequencyTypeSelect.options.length; i++) {
        if (frequencyTypeSelect.options[i].value === frequencyType) {
          frequencyTypeSelect.selectedIndex = i;
          break;
        }
      }
    });
  });
  await setupCityGrids();
  document.querySelectorAll('.security-question').forEach(select => {
    select.addEventListener('change', () => {
      const selects = document.querySelectorAll('.security-question');
      const selectedValues = Array.from(selects).map(s => s.value).filter(v => v);
      const hasDuplicates = selectedValues.length !== new Set(selectedValues).size;
      if (hasDuplicates) {
        alert('Please select different questions for each slot');
        select.value = '';
      }
    });
  });
  document.getElementById('downloadLogs').addEventListener('click', () => {
    chrome.storage.local.get('logs', function(data) {
      if (!data.logs) {
        alert('No logs available to download.');
        return;
      }
      const blob = new Blob([data.logs], {type: 'text/plain'});
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
  });
  document.getElementById('endDate').addEventListener('change', () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('End date must be after start date');
      document.getElementById('endDate').value = '';
    }
  });
  function showNotification(message = 'Saved', duration = 2000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  }
  document.getElementById('save').addEventListener('click', () => {
    const credentials = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      apiKey: document.getElementById('apiKey').value,
      pushoverUserKey: document.getElementById('pushoverUserKey').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      question1: document.getElementById('question1').value,
      answer1: document.getElementById('answer1').value,
      question2: document.getElementById('question2').value,
      answer2: document.getElementById('answer2').value,
      question3: document.getElementById('question3').value,
      answer3: document.getElementById('answer3').value
    };
    if (credentials.startDate && credentials.endDate) {
      if (new Date(credentials.startDate) > new Date(credentials.endDate)) {
        alert('End date must be after start date');
        return;
      }
    }
    const selectedQuestions = [
      credentials.question1,
      credentials.question2,
      credentials.question3
    ].filter(q => q);
    if (selectedQuestions.length !== new Set(selectedQuestions).size) {
      alert('Please select different questions for each slot');
      return;
    }
    if (credentials.apiKey) {
      credentials.captchaApiKeyPreference = 'use';
    }
    chrome.storage.sync.set(credentials, () => {
      const frequencyValue = parseInt(document.getElementById("frequencyValue").value) || 30;
      const frequencyType = document.getElementById("frequencyType").value || "seconds";
      chrome.storage.local.set({ 
        __fq: frequencyValue,
        __fqType: frequencyType
      }, () => {
        showNotification('Saved');
      });
      //window.close();
    });
  });
  document.getElementById("contact_us").addEventListener("click", function() {
    chrome.tabs.create({ url: "https://www.alertmeasap.com/contact" });
});
  await loadProfileList();
  document.getElementById('save-profile').addEventListener('click', saveCurrentProfile);
  document.getElementById('profile-select').addEventListener('change', (e) => {
    if (e.target.value) {
      loadProfile(e.target.value);
    }
  });
  document.getElementById('delete-profile').addEventListener('click', async () => {
    const select = document.getElementById('profile-select');
    if (select.value) {
      if (confirm(`Are you sure you want to delete profile "${select.value}"?`)) {
        await deleteProfile(select.value);
        select.value = '';
      }
    } else {
      alert('Please select a profile to delete');
    }
  });
  document.getElementById('download-profiles').addEventListener('click', downloadProfiles);
  document.getElementById('upload-profiles').addEventListener('click', () => {
    document.getElementById('profile-upload').click();
  });
  document.getElementById('profile-upload').addEventListener('change', uploadProfiles);
  document.getElementById("frequencyValue").addEventListener("change", function() {
    const value = parseInt(this.value) || 30;
    if (value < 1) this.value = 1;
    if (value > 3600) this.value = 3600;
    chrome.storage.local.set({ __fq: parseInt(this.value) });
  });
  document.getElementById("frequencyType").addEventListener("change", function() {
    chrome.storage.local.set({ __fqType: this.value });
  });
});
async function setupCityGrids() {
  const ofcGrid = document.getElementById('ofc-cities-grid');
  const consularGrid = document.getElementById('consular-cities-grid');
  const ofcSection = document.getElementById('ofc-city-section');
  const consularSection = document.getElementById('consular-city-section');
  if (!ofcGrid || !consularGrid || !ofcSection || !consularSection) {
    return;
  }
  const { 
    selectedOfcCities = {}, 
    selectedConsularCities = {},
    allCities = {} 
  } = await chrome.storage.sync.get(['selectedOfcCities', 'selectedConsularCities', 'allCities']);
  const ofcCities = {
    '3f6bf614-b0db-ec11-a7b4-001dd80234f6': 'CHENNAI VAC',
    '436bf614-b0db-ec11-a7b4-001dd80234f6': 'HYDERABAD VAC',
    '466bf614-b0db-ec11-a7b4-001dd80234f6': 'KOLKATA VAC',
    '486bf614-b0db-ec11-a7b4-001dd80234f6': 'MUMBAI VAC',
    '4a6bf614-b0db-ec11-a7b4-001dd80234f6': 'NEW DELHI VAC'
  };
  const consularCities = {
    'c86af614-b0db-ec11-a7b4-001dd80234f6': 'CHENNAI',
    'ae6af614-b0db-ec11-a7b4-001dd80234f6': 'HYDERABAD',
    '816af614-b0db-ec11-a7b4-001dd80234f6': 'KOLKATA',
    '716af614-b0db-ec11-a7b4-001dd80234f6': 'MUMBAI',
    'e66af614-b0db-ec11-a7b4-001dd80234f6': 'NEW DELHI'
  };
  const hasMultipleCitiesFromPage = Object.keys(allCities).length > 1;
  const hasSelectedCities = Object.keys(selectedOfcCities).length > 0 || Object.keys(selectedConsularCities).length > 0;
  const needsCitySelection = hasMultipleCitiesFromPage || hasSelectedCities;
  if (!needsCitySelection) {
    ofcSection.style.display = 'none';
    consularSection.style.display = 'none';
    return;
  }
  ofcGrid.innerHTML = '';
  consularGrid.innerHTML = '';
  ofcSection.style.display = 'block';
  Object.entries(ofcCities).forEach(([id, name]) => {
    const isSelected = selectedOfcCities[id];
    const cityButton = createCityButton(id, name, isSelected, 'ofc');
    ofcGrid.appendChild(cityButton);
  });
  consularSection.style.display = 'block';
  Object.entries(consularCities).forEach(([id, name]) => {
    const isSelected = selectedConsularCities[id];
    const cityButton = createCityButton(id, name, isSelected, 'consular');
    consularGrid.appendChild(cityButton);
  });
}
function createCityButton(id, name, isSelected, type) {
  const cityButton = document.createElement('div');
  cityButton.className = `city-button ${isSelected ? 'selected' : ''}`;
  cityButton.textContent = name.replace(' VAC', '');
  cityButton.dataset.id = id;
  cityButton.dataset.type = type;
  cityButton.addEventListener('click', async () => {
    const storageKey = type === 'ofc' ? 'selectedOfcCities' : 'selectedConsularCities';
    const { [storageKey]: selectedCities = {} } = await chrome.storage.sync.get(storageKey);
    if (selectedCities[id]) {
      delete selectedCities[id];
      cityButton.classList.remove('selected');
    } else {
      selectedCities[id] = name;
      cityButton.classList.add('selected');
    }
    await chrome.storage.sync.set({ [storageKey]: selectedCities });
  });
  return cityButton;
}
const PROFILE_STORAGE_KEY = 'testing_profiles';
async function saveCurrentProfile() {
  const username = document.getElementById('username').value;
  if (!username) {
    alert('Please enter a username first');
    return;
  }
  const profile = {
    username: username,
    password: document.getElementById('password').value,
    apiKey: document.getElementById('apiKey').value,
    pushoverUserKey: document.getElementById('pushoverUserKey').value,
    question1: document.getElementById('question1').value,
    answer1: document.getElementById('answer1').value,
    question2: document.getElementById('question2').value,
    answer2: document.getElementById('answer2').value,
    question3: document.getElementById('question3').value,
    answer3: document.getElementById('answer3').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    selectedOfcCities: {},
    selectedConsularCities: {}
  };
  if (profile.apiKey) {
    profile.captchaApiKeyPreference = 'use';
  }
  const { [PROFILE_STORAGE_KEY]: existingProfiles = {}, [PROFILE_STORAGE_KEY + '_order']: profileOrder = [] } = await chrome.storage.local.get([PROFILE_STORAGE_KEY, PROFILE_STORAGE_KEY + '_order']);
  existingProfiles[username] = profile;
  if (!profileOrder.includes(username)) {
    profileOrder.push(username);
  }
  await chrome.storage.local.set({ 
    [PROFILE_STORAGE_KEY]: existingProfiles,
    [PROFILE_STORAGE_KEY + '_order']: profileOrder
  });
  await loadProfileList();
  alert('Profile saved!');
}
async function loadProfileList() {
  const select = document.getElementById('profile-select');
  const { [PROFILE_STORAGE_KEY]: profiles = {}, [PROFILE_STORAGE_KEY + '_order']: profileOrder = [] } = await chrome.storage.local.get([PROFILE_STORAGE_KEY, PROFILE_STORAGE_KEY + '_order']);
  while (select.options.length > 1) {
    select.remove(1);
  }
  if (profileOrder.length > 0) {
    profileOrder.forEach(username => {
      if (profiles[username]) {
        const option = new Option(username, username);
        select.add(option);
      }
    });
    Object.keys(profiles).forEach(username => {
      if (!profileOrder.includes(username)) {
        const option = new Option(username, username);
        select.add(option);
      }
    });
  } else {
    Object.keys(profiles).forEach(username => {
      const option = new Option(username, username);
      select.add(option);
    });
  }
}
async function loadProfile(username) {
  const { [PROFILE_STORAGE_KEY]: profiles = {} } = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
  const profile = profiles[username];
  if (profile) {
    document.getElementById('username').value = profile.username;
    document.getElementById('password').value = profile.password;
    document.getElementById('apiKey').value = profile.apiKey;
    document.getElementById('pushoverUserKey').value = profile.pushoverUserKey || '';
    document.getElementById('question1').value = profile.question1;
    document.getElementById('answer1').value = profile.answer1;
    document.getElementById('question2').value = profile.question2;
    document.getElementById('answer2').value = profile.answer2;
    document.getElementById('question3').value = profile.question3;
    document.getElementById('answer3').value = profile.answer3;
    document.getElementById('startDate').value = profile.startDate;
    document.getElementById('endDate').value = profile.endDate;
    await setupCityGrids();
    const credentials = {
      username: profile.username,
      password: profile.password,
      apiKey: profile.apiKey,
      question1: profile.question1,
      answer1: profile.answer1,
      question2: profile.question2,
      answer2: profile.answer2,
      question3: profile.question3,
      answer3: profile.answer3,
      startDate: profile.startDate,
      endDate: profile.endDate
    };
    if (profile.apiKey) {
      credentials.captchaApiKeyPreference = 'use';
    }
    await chrome.storage.sync.set(credentials);
  }
}
async function deleteProfile(username) {
  const { [PROFILE_STORAGE_KEY]: profiles = {}, [PROFILE_STORAGE_KEY + '_order']: profileOrder = [] } = await chrome.storage.local.get([PROFILE_STORAGE_KEY, PROFILE_STORAGE_KEY + '_order']);
  if (profiles[username]) {
    delete profiles[username];
    const updatedOrder = profileOrder.filter(name => name !== username);
    await chrome.storage.local.set({ 
      [PROFILE_STORAGE_KEY]: profiles,
      [PROFILE_STORAGE_KEY + '_order']: updatedOrder
    });
    await loadProfileList();
    alert('Profile deleted!');
  }
}
async function downloadProfiles() {
  const statusEl = document.getElementById('profile-status');
  const { [PROFILE_STORAGE_KEY]: profiles = {}, [PROFILE_STORAGE_KEY + '_order']: profileOrder = [] } = await chrome.storage.local.get([PROFILE_STORAGE_KEY, PROFILE_STORAGE_KEY + '_order']);
  if (Object.keys(profiles).length === 0) {
    statusEl.textContent = 'No profiles available to download.';
    statusEl.style.color = '#f44336'; 
    setTimeout(() => { statusEl.textContent = ''; }, 3000); 
    return;
  }
  statusEl.textContent = 'Preparing profiles for download...';
  statusEl.style.color = '#2196F3'; 
  const orderedProfiles = {};
  if (profileOrder.length > 0) {
    profileOrder.forEach(username => {
      if (profiles[username]) {
        orderedProfiles[username] = profiles[username];
      }
    });
    Object.keys(profiles).forEach(username => {
      if (!profileOrder.includes(username)) {
        orderedProfiles[username] = profiles[username];
      }
    });
  } else {
    Object.assign(orderedProfiles, profiles);
  }
  const profilesJSON = JSON.stringify(orderedProfiles, null, 2);
  const blob = new Blob([profilesJSON], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  chrome.downloads.download({
    url: url,
    filename: `profiles_backup_${timestamp}.json`,
    saveAs: true
  }, () => {
    URL.revokeObjectURL(url);
    statusEl.textContent = 'Profiles downloaded successfully!';
    statusEl.style.color = '#4CAF50'; 
    setTimeout(() => { statusEl.textContent = ''; }, 3000); 
  });
}
async function uploadProfiles(event) {
  const file = event.target.files[0];
  const statusEl = document.getElementById('profile-status');
  if (!file) return;
  statusEl.textContent = 'Reading file...';
  statusEl.style.color = '#2196F3'; 
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      statusEl.textContent = 'Validating file format...';
      const uploadedData = JSON.parse(e.target.result);
      const validationResult = validateProfilesFormat(uploadedData);
      if (!validationResult.valid) {
        statusEl.textContent = `Error: ${validationResult.error}`;
        statusEl.style.color = '#f44336'; 
        setTimeout(() => { statusEl.textContent = ''; }, 5000); 
        return;
      }
      if (!confirm('This will replace ALL existing profiles with the uploaded profiles. Your current profiles will be lost. Continue?')) {
        statusEl.textContent = 'Import cancelled.';
        setTimeout(() => { statusEl.textContent = ''; }, 3000); 
        return;
      }
      statusEl.textContent = 'Importing profiles...';
      const updatedProfiles = uploadedData;
      const profileOrder = Object.keys(uploadedData);
      await chrome.storage.local.set({ 
        [PROFILE_STORAGE_KEY]: updatedProfiles,
        [PROFILE_STORAGE_KEY + '_order']: profileOrder
      });
      await loadProfileList();
      statusEl.textContent = `Successfully imported ${Object.keys(uploadedData).length} profiles!`;
      statusEl.style.color = '#4CAF50'; 
      setTimeout(() => { statusEl.textContent = ''; }, 3000); 
    } catch (error) {
      statusEl.textContent = `Error: ${error.message}`;
      statusEl.style.color = '#f44336'; 
      setTimeout(() => { statusEl.textContent = ''; }, 5000); 
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}
function validateProfilesFormat(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { valid: false, error: 'Uploaded file must contain a JSON object.' };
  }
  if (Object.keys(data).length === 0) {
    return { valid: false, error: 'The file contains an empty object with no profiles.' };
  }
  const expectedFields = {
    username: 'string',
    password: 'string',
    apiKey: 'string',
    question1: 'string',
    answer1: 'string',
    question2: 'string',
    answer2: 'string',
    question3: 'string',
    answer3: 'string',
    startDate: 'string',
    endDate: 'string'
  };
  const requiredFields = ['username'];
  for (const username in data) {
    const profile = data[username];
    if (typeof profile !== 'object' || profile === null || Array.isArray(profile)) {
      return { 
        valid: false, 
        error: `Profile "${username}" is not a valid object.` 
      };
    }
    for (const field of requiredFields) {
      if (!profile.hasOwnProperty(field)) {
        return { 
          valid: false, 
          error: `Profile "${username}" is missing the required field "${field}".` 
        };
      }
    }
    if (profile.username !== username) {
      return { 
        valid: false, 
        error: `Profile "${username}" has a username field ("${profile.username}") that doesn't match its key.` 
      };
    }
    for (const [field, expectedType] of Object.entries(expectedFields)) {
      if (profile.hasOwnProperty(field) && profile[field] !== null && profile[field] !== undefined) {
        const actualType = typeof profile[field];
        if (actualType !== expectedType) {
          return { 
            valid: false, 
            error: `Profile "${username}" has field "${field}" with wrong type. Expected ${expectedType}, got ${actualType}.` 
          };
        }
      }
    }
    if (profile.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(profile.startDate)) {
      return { 
        valid: false, 
        error: `Profile "${username}" has an invalid start date format. Expected YYYY-MM-DD.` 
      };
    }
    if (profile.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(profile.endDate)) {
      return { 
        valid: false, 
        error: `Profile "${username}" has an invalid end date format. Expected YYYY-MM-DD.` 
      };
    }
    if (profile.startDate && profile.endDate) {
      if (new Date(profile.startDate) > new Date(profile.endDate)) {
        return { 
          valid: false, 
          error: `Profile "${username}" has an end date that is before the start date.` 
        };
      }
    }
  }
  return { valid: true };
}
