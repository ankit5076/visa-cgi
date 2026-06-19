document.addEventListener('DOMContentLoaded', async () => {
  const DEFAULT_FREQUENCY_START = 30;
  const DEFAULT_FREQUENCY_END = 60;
  const DEFAULT_AUTO_RELOAD_MINUTES = 15;
  const MAX_FREQUENCY_VALUE = 3600;
  const MAX_AUTO_RELOAD_MINUTES = 1440;

  function clampNumber(value, min, max, fallback) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
  }

  function normalizeFrequencyRange(startValue, endValue) {
    const start = clampNumber(startValue, 1, MAX_FREQUENCY_VALUE, DEFAULT_FREQUENCY_START);
    const end = clampNumber(endValue, 1, MAX_FREQUENCY_VALUE, Math.min(start * 2, MAX_FREQUENCY_VALUE));
    return {
      start,
      end: Math.max(start, end)
    };
  }

  function normalizeFrequencyType(value) {
    return ["seconds", "minutes", "hours"].includes(value) ? value : "seconds";
  }

  function getFrequencyFormValues() {
    return normalizeFrequencyRange(
      document.getElementById("frequencyStart").value,
      document.getElementById("frequencyEnd").value
    );
  }

  function applyFrequencyFormValues(range) {
    document.getElementById("frequencyStart").value = range.start;
    document.getElementById("frequencyEnd").value = range.end;
  }

  function getAutoReloadMinutes() {
    return clampNumber(
      document.getElementById("autoReloadMinutes").value,
      1,
      MAX_AUTO_RELOAD_MINUTES,
      DEFAULT_AUTO_RELOAD_MINUTES
    );
  }

  function saveFrequencySettings(callback) {
    const range = getFrequencyFormValues();
    applyFrequencyFormValues(range);
    const frequencyType = normalizeFrequencyType(document.getElementById("frequencyType").value);
    chrome.storage.local.set({
      __fq: range.start,
      __fqStart: range.start,
      __fqEnd: range.end,
      __fqType: frequencyType
    }, callback);
  }

  function saveAutoReloadSettings(callback) {
    const minutes = getAutoReloadMinutes();
    document.getElementById("autoReloadMinutes").value = minutes;
    chrome.storage.local.set({
      __autoReloadEnabled: document.getElementById("autoReloadEnabled").checked,
      __autoReloadMinutes: minutes
    }, callback);
  }

  const versionElement = document.getElementById('version');
  if (versionElement) {
    const manifest = chrome.runtime.getManifest();
    versionElement.textContent = `v${manifest.version}`;
  }
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
    chrome.storage.local.get([
      '__fq',
      '__fqStart',
      '__fqEnd',
      '__fqType',
      '__autoReloadEnabled',
      '__autoReloadMinutes'
    ], function(items) {
      const legacyFrequency = clampNumber(items.__fq, 1, MAX_FREQUENCY_VALUE, DEFAULT_FREQUENCY_START);
      const migratedRange = normalizeFrequencyRange(
        items.__fqStart ?? legacyFrequency,
        items.__fqEnd ?? Math.min(legacyFrequency * 2, MAX_FREQUENCY_VALUE)
      );
      applyFrequencyFormValues(migratedRange);
      let frequencyTypeSelect = document.getElementById("frequencyType");
      let frequencyType = normalizeFrequencyType(items.__fqType);
      for (let i = 0; i < frequencyTypeSelect.options.length; i++) {
        if (frequencyTypeSelect.options[i].value === frequencyType) {
          frequencyTypeSelect.selectedIndex = i;
          break;
        }
      }
      document.getElementById("autoReloadEnabled").checked = items.__autoReloadEnabled !== false;
      document.getElementById("autoReloadMinutes").value = clampNumber(
        items.__autoReloadMinutes,
        1,
        MAX_AUTO_RELOAD_MINUTES,
        DEFAULT_AUTO_RELOAD_MINUTES
      );
      chrome.storage.local.set({
        __fq: migratedRange.start,
        __fqStart: migratedRange.start,
        __fqEnd: migratedRange.end,
        __fqType: frequencyType,
        __autoReloadEnabled: items.__autoReloadEnabled !== false,
        __autoReloadMinutes: clampNumber(items.__autoReloadMinutes, 1, MAX_AUTO_RELOAD_MINUTES, DEFAULT_AUTO_RELOAD_MINUTES)
      });
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
      saveFrequencySettings(() => {
        saveAutoReloadSettings(() => {
          showNotification('Saved');
        });
      });
      //window.close();
    });
  });
  document.getElementById("frequencyStart").addEventListener("change", function() {
    saveFrequencySettings();
  });
  document.getElementById("frequencyEnd").addEventListener("change", function() {
    saveFrequencySettings();
  });
  document.getElementById("frequencyType").addEventListener("change", function() {
    saveFrequencySettings();
  });
  document.getElementById("autoReloadEnabled").addEventListener("change", function() {
    saveAutoReloadSettings();
  });
  document.getElementById("autoReloadMinutes").addEventListener("change", function() {
    saveAutoReloadSettings();
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
