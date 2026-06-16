(function (global) {
  if (global.VisaCgiUtility) {
    return;
  }

  var JITTER_RANGES = Object.freeze({
    CHARACTER: Object.freeze({ minMs: 0, maxMs: 500 }),
    DOM_EVENT: Object.freeze({ minMs: 200, maxMs: 800 }),
    API: Object.freeze({ minMs: 2000, maxMs: 5000 })
  });

  function normalizeRange(rangeOrMinMs, maxMs) {
    if (typeof rangeOrMinMs === 'number') {
      return { minMs: rangeOrMinMs, maxMs: maxMs };
    }
    return rangeOrMinMs || JITTER_RANGES.DOM_EVENT;
  }

  function randomDelayMs(minMs, maxMs) {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitForJitter(rangeOrMinMs, maxMs) {
    var range = normalizeRange(rangeOrMinMs, maxMs);
    await sleep(randomDelayMs(range.minMs, range.maxMs));
  }

  async function focusWithJitter(element, range) {
    await waitForJitter(range || JITTER_RANGES.DOM_EVENT);
    element.focus();
  }

  async function clickWithJitter(element, range) {
    await waitForJitter(range || JITTER_RANGES.DOM_EVENT);
    element.click();
  }

  async function dispatchEventWithJitter(element, eventOrName, range) {
    await waitForJitter(range || JITTER_RANGES.DOM_EVENT);
    var event = typeof eventOrName === 'string'
      ? new Event(eventOrName, { bubbles: true, cancelable: true })
      : eventOrName;
    element.dispatchEvent(event);
  }

  async function fetchWithJitter(url, options, range) {
    await waitForJitter(range || JITTER_RANGES.API);
    return fetch(url, options);
  }

  global.VisaCgiUtility = Object.freeze({
    JITTER_RANGES: JITTER_RANGES,
    randomDelayMs: randomDelayMs,
    sleep: sleep,
    waitForJitter: waitForJitter,
    focusWithJitter: focusWithJitter,
    clickWithJitter: clickWithJitter,
    dispatchEventWithJitter: dispatchEventWithJitter,
    fetchWithJitter: fetchWithJitter
  });
})(globalThis);
