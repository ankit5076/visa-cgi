document.addEventListener('DOMContentLoaded', async () => {
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
