const INDIA_TOPIC_ID = 2;
const PAKISTAN_TOPIC_ID = 4;
const BANGLADESH_TOPIC_ID = 17;
const ALGERIA_TOPIC_ID = 17717;
const UAE_TOPIC_ID = 33480;
const TURKEY_TOPIC_ID = 34849;
const POST_LOCATIONS_BY_ID = {
  "3f6bf614-b0db-ec11-a7b4-001dd80234f6": {
    location: "CHENNAI VAC",
    topicId: INDIA_TOPIC_ID
  },
  "436bf614-b0db-ec11-a7b4-001dd80234f6": {
    location: "HYDERABAD VAC",
    topicId: INDIA_TOPIC_ID
  },
  "466bf614-b0db-ec11-a7b4-001dd80234f6": {
    location: "KOLKATA VAC",
    topicId: INDIA_TOPIC_ID
  },
  "486bf614-b0db-ec11-a7b4-001dd80234f6": {
    location: "MUMBAI VAC",
    topicId: INDIA_TOPIC_ID
  },
  "4a6bf614-b0db-ec11-a7b4-001dd80234f6": {
    location: "NEW DELHI VAC",
    topicId: INDIA_TOPIC_ID
  },
  "c86af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "CHENNAI",
    topicId: INDIA_TOPIC_ID
  },
  "ae6af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "HYDERABAD",
    topicId: INDIA_TOPIC_ID
  },
  "816af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "KOLKATA",
    topicId: INDIA_TOPIC_ID
  },
  "716af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "MUMBAI",
    topicId: INDIA_TOPIC_ID
  },
  "e66af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "NEW DELHI",
    topicId: INDIA_TOPIC_ID
  },
  "b06af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "ISLAMABAD",
    topicId: PAKISTAN_TOPIC_ID
  },
  "be6af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "KARACHI",
    topicId: PAKISTAN_TOPIC_ID
  },
  "906af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "DHAKA",
    topicId: BANGLADESH_TOPIC_ID
  },
  "566af614-b0db-ec11-a7b4-001dd80234f6": {
    location: "ALGERIA",
    topicId: ALGERIA_TOPIC_ID
  },
  "962fd063-ccb5-ef11-b8e9-001dd80637a9": {
    location: "DUBAI",
    topicId: UAE_TOPIC_ID
  },
  "5eb31865-cbb5-ef11-b8e9-001dd80637a9": {
    location: "Ankara",
    topicId: TURKEY_TOPIC_ID
  },
  "84cf7716-ccb5-ef11-b8e9-001dd80637a9": {
    location: "Istanbul",
    topicId: TURKEY_TOPIC_ID
  }
};
function getLocationNameForPostId(a) {
  const b = POST_LOCATIONS_BY_ID[a];
  if (b) {
    return b.location;
  } else {
    return "undefined";
  }
}
let isSelectingPreferredDate = false;
let hasProcessedSchedulingContext = false;
let isPollingStartInProgress = false;
let currentCityIndex = 0;
let isDatePollingActive = false;
let preferredDate = null;
let preferredDateId = null;
let isSchedulerActive = false;
let isCookieMonitorInstalled = false;
let pollingRunId = 0;
let isSettingsRefreshInProgress = false;
let isBookingInProgress = false;
let ofcTimerIntervalId = null;
let ofcTimerDisplayElement = null;
const OFC_TIMER_DURATION_MS = 2700000;
let trackedTimeouts = new Set();
let trackedIntervals = new Set();
let activeObservers = new Set();
async function schedulingJitteredApiFetch(a, b) {
  return VisaCgiUtility.fetchWithJitter(a, b, VisaCgiUtility.JITTER_RANGES.API);
}
async function schedulingClickElement(a) {
  await VisaCgiUtility.clickWithJitter(a, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
}
async function schedulingDispatchEvent(a, b) {
  await VisaCgiUtility.dispatchEventWithJitter(a, b, VisaCgiUtility.JITTER_RANGES.DOM_EVENT);
}
function scheduleTrackedTimeout(a, b) {
  const c = setTimeout(() => {
    trackedTimeouts.delete(c);
    a();
  }, b);
  trackedTimeouts.add(c);
  return c;
}
function scheduleTrackedInterval(a, b) {
  const c = setInterval(a, b);
  trackedIntervals.add(c);
  return c;
}
function cleanupSchedulerState() {
  trackedTimeouts.forEach(a => clearTimeout(a));
  trackedTimeouts.clear();
  trackedIntervals.forEach(a => clearInterval(a));
  trackedIntervals.clear();
  activeObservers.forEach(a => {
    try {
      a.disconnect();
    } catch (b) {
      console.warn("Error disconnecting observer:", b);
    }
  });
  activeObservers.clear();
  if (ofcTimerIntervalId) {
    clearInterval(ofcTimerIntervalId);
    ofcTimerIntervalId = null;
  }
  if (ofcTimerDisplayElement) {
    ofcTimerDisplayElement.remove();
    ofcTimerDisplayElement = null;
  }
  isDatePollingActive = false;
  isPollingStartInProgress = false;
  hasProcessedSchedulingContext = false;
  isSettingsRefreshInProgress = false;
  pollingRunId++;
}
window.addEventListener("beforeunload", cleanupSchedulerState);
window.addEventListener("unload", cleanupSchedulerState);
async function startOfcTimer() {
  const a = Date.now();
  try {
    await chrome.storage.local.set({
      ofcTimerStartTime: a,
      ofcTimerActive: true
    });
  } catch (b) {
    return;
  }
  renderOfcTimerDisplay();
  if (ofcTimerIntervalId) {
    clearInterval(ofcTimerIntervalId);
  }
  ofcTimerIntervalId = setInterval(async () => {
    await updateOfcTimerDisplay();
  }, 1000);
}
async function stopOfcTimer() {
  if (ofcTimerIntervalId) {
    clearInterval(ofcTimerIntervalId);
    ofcTimerIntervalId = null;
  }
  if (ofcTimerDisplayElement) {
    ofcTimerDisplayElement.remove();
    ofcTimerDisplayElement = null;
  }
  await chrome.storage.local.remove(["ofcTimerStartTime", "ofcTimerActive"]);
}
async function getOfcTimerState() {
  try {
    const {
      ofcTimerStartTime: a,
      ofcTimerActive: b
    } = await chrome.storage.local.get(["ofcTimerStartTime", "ofcTimerActive"]);
    if (!b || !a) {
      return {
        active: false
      };
    }
    const c = Date.now();
    const d = c - a;
    const e = OFC_TIMER_DURATION_MS - d;
    if (e <= 0) {
      await stopOfcTimer();
      await showSchedulerToast("\n                <span style=\"color: orange\">⏰ OFC Timer Expired</span><br>\n                <span style=\"color: white\">30 minutes have passed without finding a consular date</span><br>\n                <span style=\"color: yellow;\">Redirecting to home page to restart...</span>\n            ", 5000);
      setTimeout(() => {
        window.location.href = "https://www.usvisascheduling.com/en-US/";
      }, 3000);
      return {
        active: false,
        expired: true
      };
    }
    return {
      active: true,
      remainingTime: e,
      startTime: a
    };
  } catch (f) {
    return {
      active: false
    };
  }
}
function renderOfcTimerDisplay() {
  if (ofcTimerDisplayElement) {
    ofcTimerDisplayElement.remove();
  }
  ofcTimerDisplayElement = document.createElement("div");
  ofcTimerDisplayElement.id = "ofc-timer-display";
  ofcTimerDisplayElement.style.cssText = "\n        position: fixed;\n        bottom: 20px;\n        right: 20px;\n        background: linear-gradient(135deg, #FF6B35, #F7931E);\n        color: white;\n        padding: 12px 16px;\n        border-radius: 8px;\n        font-family: 'Arial', sans-serif;\n        font-size: 14px;\n        font-weight: bold;\n        box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n        z-index: 10000;\n        border: 2px solid #FFF;\n        text-align: center;\n        min-width: 180px;\n        animation: pulse 2s infinite;\n    ";
  const a = document.createElement("style");
  a.textContent = "\n        @keyframes pulse {\n            0% { transform: scale(1); }\n            50% { transform: scale(1.05); }\n            100% { transform: scale(1); }\n        }\n    ";
  document.head.appendChild(a);
  ofcTimerDisplayElement.innerHTML = "\n        <div style=\"margin-bottom: 4px;\">🕐 OFC Timer</div>\n        <div id=\"timer-countdown\" style=\"font-size: 16px;\">30:00</div>\n        <div style=\"font-size: 11px; margin-top: 2px;\">Searching for consular dates...</div>\n    ";
  document.body.appendChild(ofcTimerDisplayElement);
}
async function updateOfcTimerDisplay() {
  const a = await getOfcTimerState();
  if (!a.active || a.expired) {
    return;
  }
  if (ofcTimerDisplayElement) {
    const b = Math.floor(a.remainingTime / 60000);
    const c = Math.floor(a.remainingTime % 60000 / 1000);
    const d = ofcTimerDisplayElement.querySelector("#timer-countdown");
    if (d) {
      d.textContent = b.toString().padStart(2, "0") + ":" + c.toString().padStart(2, "0");
      if (a.remainingTime < 300000) {
        ofcTimerDisplayElement.style.background = "linear-gradient(135deg, #FF4444, #CC0000)";
      } else if (a.remainingTime < 600000) {
        ofcTimerDisplayElement.style.background = "linear-gradient(135deg, #FF8C00, #FF6B35)";
      }
    }
  }
}
async function restoreOfcTimerDisplayIfNeeded() {
  const a = await getOfcTimerState();
  if (a.active && !a.expired) {
    const b = window.location.pathname.includes("/schedule") && !window.location.pathname.includes("/ofc-schedule");
    if (b && isSchedulerActive) {
      renderOfcTimerDisplay();
      if (ofcTimerIntervalId) {
        clearInterval(ofcTimerIntervalId);
      }
      ofcTimerIntervalId = setInterval(async () => {
        await updateOfcTimerDisplay();
      }, 1000);
    }
  }
}
async function resumePendingDateSelectionIfNeeded() {
  if (isSelectingPreferredDate) {
    return true;
  }
  if (window.location.href.includes("/appointment-confirmation/")) {
    await chrome.storage.local.set({
      dateSelectionInProgress: false,
      preferredDateString: null,
      preferredDateId: null
    });
    return true;
  }
  const {
    dateSelectionInProgress: a,
    preferredDateString: b,
    preferredDateId: c
  } = await chrome.storage.local.get(["dateSelectionInProgress", "preferredDateString", "preferredDateId"]);
  if (a === true) {
    let d = preferredDate;
    let e = preferredDateId;
    if (!d && b) {
      d = new Date(b);
    }
    if (!e && c) {
      e = c;
    }
    if (d) {
      const f = await selectCalendarDate(d);
      if (f) {
        const g = window.location.pathname.includes("/ofc-schedule");
        const h = await selectTimeSlot(g);
        if (h) {} else {}
      }
      await chrome.storage.local.set({
        dateSelectionInProgress: false,
        preferredDateString: null,
        preferredDateId: null
      });
    } else {
      await chrome.storage.local.set({
        dateSelectionInProgress: false,
        preferredDateString: null,
        preferredDateId: null
      });
    }
    return true;
  }
  return false;
}
if (!document.querySelector("#extension-styles")) {
  const extensionStyles = document.createElement("style");
  extensionStyles.id = "extension-styles";
  extensionStyles.textContent = "\n        .swal2-modal :is(h2, p){color: initial; margin: 0;line-height: 1.25;}\n        .swal2-modal p+p{margin-top: 1rem;}\n        #consulate_date_time,#asc_date_time{display:block!important;}\n        .swal2-select{width:auto!important;}\n        .swal2-timer-progress-bar{background:rgba(255,255,255,0.6)!important;}\n        .swal2-toast.swal2-show{background:rgba(0,0,0,0.75)!important;}\n    ";
  document.head.appendChild(extensionStyles);
}
async function loadSchedulerActiveState() {
  if (await resumePendingDateSelectionIfNeeded()) {
    return;
  }
  try {
    const {
      __ap: a
    } = await chrome.storage.local.get("__ap");
    isSchedulerActive = a || false;
  } catch (b) {
    isSchedulerActive = false;
  }
}
if (!window.schedulingPageInitialized) {
  window.schedulingPageInitialized = true;
  document.addEventListener("DOMContentLoaded", async () => {
    await loadSchedulerActiveState();
    if (window.location.href.match(/usvisascheduling\.com\/en-US\/?$/)) {
      setTimeout(async () => {
        await cacheAuthenticatedUserEmail();
        await captureCurrentAppointment();
      }, 2000);
    }
    setTimeout(async () => {
      await restoreOfcTimerDisplayIfNeeded();
    }, 1000);
  });
  window.addEventListener("load", () => {
    if (window.location.href.match(/usvisascheduling\.com\/en-US\/?$/)) {
      setTimeout(async () => {
        await cacheAuthenticatedUserEmail();
        await captureCurrentAppointment();
      }, 3000);
    }
    setTimeout(async () => {
      await restoreOfcTimerDisplayIfNeeded();
    }, 2000);
  });
}
async function runSchedulerPageAutomation() {
  const a = await resumePendingDateSelectionIfNeeded();
  if (window.location.href.includes("/appointment-confirmation/")) {
    await chrome.storage.local.set({
      dateSelectionInProgress: false,
      preferredDateString: null,
      preferredDateId: null
    });
    const b = await readAppointmentConfirmationDetails();
    const {
      bookingInProgress: c
    } = await chrome.storage.local.get("bookingInProgress");
    if (c) {
      await chrome.storage.local.remove("bookingInProgress");
      try {
        const {
          pushoverUserKey: d
        } = await chrome.storage.sync.get("pushoverUserKey");
        if (d && d.trim() !== "") {
          let e = "unknown@example.com";
          let f = "unknown";
          let g = "UNKNOWN";
          try {
            const k = [...document.querySelectorAll("script")].map(l => l.innerText || l.textContent).join("\n").match(/setAuthenticatedUserContext\(['"]([^'"]+)['"]\)/)?.[1];
            if (k) {
              e = k;
            }
          } catch (l) {}
          try {
            const {
              username: m
            } = await chrome.storage.sync.get("username");
            if (m) {
              f = m;
            }
          } catch (n) {}
          try {
            if (b?.consularAppointmentDetails?.[0]?.cityPostalCode) {
              const o = b.consularAppointmentDetails[0].cityPostalCode.replace(",", "").trim();
              g = o;
            }
            if (g === "UNKNOWN") {
              const {
                preferredLocation: p
              } = await chrome.storage.local.get("preferredLocation");
              if (p && p.postId) {
                const q = POST_LOCATIONS_BY_ID[p.postId];
                if (q) {
                  g = q.location;
                }
              }
            }
            if (g === "UNKNOWN") {
              const r = document.getElementById("post_select");
              if (r && r.selectedIndex >= 0) {
                const s = r.options[r.selectedIndex];
                if (s && s.value) {
                  const t = POST_LOCATIONS_BY_ID[s.value];
                  if (t) {
                    g = t.location;
                  } else {
                    g = s.text || "UNKNOWN";
                  }
                }
              }
            }
            if (g === "UNKNOWN") {}
          } catch (u) {
            g = "UNKNOWN";
          }
          const h = f !== "unknown" ? f + "_" + e : e;
          let i = null;
          let j = false;
          try {
            if (b?.consularAppointmentDetails?.[0]?.appointmentDate) {
              const v = b.consularAppointmentDetails[0].appointmentDate;
              const w = new Date(v);
              if (!isNaN(w.getTime())) {
                i = w.toISOString().split("T")[0];
                j = true;
              } else {}
            } else {}
          } catch (x) {}
          if (!j) {
            await logSchedulerMessage("Skipping notifications - no valid appointment date found on confirmation page");
            return;
          }
          if (g === "UNKNOWN") {
            console.warn("⚠️ Sending notifications with UNKNOWN city - consider improving city detection");
            await logSchedulerMessage("Warning: Sending notifications with UNKNOWN city");
          }
          await sendPushoverNotification(d, b, h, g, i);
        }
      } catch (G) {
        await logSchedulerMessage("Error sending Pushover notification: " + G.message);
      }
    } else {}
    await logSchedulerMessage("Stopping all bot operations - appointment confirmed on page load");
    isDatePollingActive = false;
    isBookingInProgress = false;
    cleanupSchedulerState();
    return;
  }
  if (a) {
    return;
  }
  try {
    if (!isSchedulerActive) {
      return;
    }
    cleanupSchedulerState();
    if (window.location.href.includes("usvisascheduling.com/") && !window.location.href.includes("/en-US/") && !window.location.href.includes("/signin-aad-b2c_1")) {
      redirectionHandled = true;
      const I = window.location.href.replace(/\/[a-z]{2}-[A-Z]{2}\//, "/en-US/");
      window.location.replace(I);
      return;
    }
    if (window.location.href.match(/usvisascheduling\.com\/en-US\/?$/)) {
      redirectionHandled = true;
      await cacheAuthenticatedUserEmail();
      await captureCurrentAppointment();
      try {
        const K = [...document.querySelectorAll("script")].map(M => M.innerText || M.textContent).join("\n").match(/setAuthenticatedUserContext\(['"]([^'"]+)['"]\)/)?.[1];
        if (K) {
          await chrome.storage.local.set({
            email: K
          });
        } else {}
      } catch (Q) {
        return;
      }
      const J = Swal.fire({
        title: "Please Wait",
        html: "<p>Looking for navigation links, we'll redirect you shortly...</p>",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      waitForElement("a#reschedule_appointment").then(R => {
        const S = R.getAttribute("href");
        const T = window.location.origin + (S.startsWith("/") ? "" : "/") + S;
        J.close();
        window.location.replace(T);
      }).catch(R => {
        waitForElement("a#continue_application").then(S => {
          const T = S.getAttribute("href");
          const U = window.location.origin + "/en-US" + T.replace(/^\/en-US(?=\/|$)/, "");
          J.close();
          window.location.replace(U);
        }).catch(S => {
          J.close();
          window.location.replace(window.location.href.replace(/\/?$/, "/schedule/"));
        });
      });
      return;
    }
    if (window.location.href.includes("/ofc-schedule")) {
      const R = createCookieMonitor();
      const S = new MutationObserver(async (T, U) => {
        try {
          const V = document.getElementById("post_select");
          if (V && V.options && typeof V.options === "object" && "length" in V.options && V.options.length > 1) {
            U.disconnect();
            activeObservers.delete(U);
            const W = await configureCitySelections();
            if (W) {
              const X = await extractSchedulingContext();
              if (X) {
                X.contactId = X.contactId.replace(/['"+ ]/g, "");
                await startPollingForContext(X, R);
              } else {}
            } else {}
          } else if (document.readyState === "complete" || T.some(Y => Y.target.id === "main-content")) {
            U.disconnect();
            activeObservers.delete(U);
            const Y = await configureCitySelections();
            if (Y) {
              const Z = await extractSchedulingContext();
              if (Z) {
                Z.contactId = Z.contactId.replace(/['"+ ]/g, "");
                await startPollingForContext(Z, R);
              } else {}
            } else {}
          }
        } catch (a0) {
          U.disconnect();
          activeObservers.delete(U);
        }
      });
      activeObservers.add(S);
      S.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["id", "class"]
      });
      return;
    }
    if (!window.location.href.includes("usvisascheduling.com/en-US")) {
      return;
    }
    const H = new MutationObserver(async (T, U) => {
      try {
        if (await resumePendingDateSelectionIfNeeded()) {
          U.disconnect();
          activeObservers.delete(U);
          return;
        }
        if (hasProcessedSchedulingContext) {
          return;
        }
        const V = await extractSchedulingContext();
        if (V) {
          hasProcessedSchedulingContext = true;
          await chrome.storage.local.set(V);
          const W = createCookieMonitor();
          try {
            await startPollingForContext(V, W);
          } catch (X) {}
          U.disconnect();
          activeObservers.delete(U);
        }
      } catch (Y) {
        U.disconnect();
        activeObservers.delete(U);
      }
    });
    activeObservers.add(H);
    H.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  } catch (T) {}
}
async function extractSchedulingContext() {
  try {
    const {
      dateSelectionInProgress: a
    } = await chrome.storage.local.get("dateSelectionInProgress");
    if (a) {
      return null;
    }
  } catch (b) {}
  try {
    const c = document.documentElement.innerHTML;
    const d = [/[?&]appd=([^&"]+)/, /contactId["']?\s*:\s*["']([^"']+)/i, /appd["']?\s*:\s*["']([^"']+)/i];
    const e = [/[?&]primaryId=([^&"]+)/, /primaryId["']?\s*:\s*["']([^"']+)/i, /jsdata\['primaryId'\]\s*=\s*"([^"]+)"/i, /applications["']?\s*:\s*\[["']([^"']+)/i];
    const f = [/[?&]postId=([^&"]+)/, /postId["']?\s*:\s*["']([^"']+)/i, /jsdata\['postId'\]\s*=\s*"([^"]+)"/i, /\['postId'\]\s*=\s*"([^"]+)"/];
    let g;
    let h;
    let i;
    for (const m of d) {
      const n = c.match(m);
      if (n) {
        g = n[1].replace(/['"\s+]/g, "");
        break;
      }
    }
    for (const o of e) {
      const p = c.match(o);
      if (p) {
        h = p[1];
        break;
      }
    }
    for (const q of f) {
      const r = c.match(q);
      if (r) {
        i = r[1];
        break;
      }
    }
    if (!i || !h) {
      const s = document.getElementsByTagName("script");
      for (const t of s) {
        const u = t.textContent || "";
        if (u.includes("jsdata")) {
          const v = u.match(/jsdata\['postId'\]\s*=\s*"([^"]+)"/);
          if (v && !i) {
            i = v[1];
          }
          const w = u.match(/jsdata\['primaryId'\]\s*=\s*"([^"]+)"/);
          if (w && !h) {
            h = w[1];
          }
        }
      }
    }
    if (!i) {
      const x = document.getElementById("post_select");
      if (x) {
        const y = Array.from(x.options).find(z => z.value !== "");
        if (y) {
          i = y.value;
        }
      }
    }
    const j = document.querySelectorAll("[data-appd], [data-primary-id], [data-post-id], input[type=\"hidden\"]");
    j.forEach(z => {});
    if (g) {
      g = g.replace(/['"\s+]/g, "");
    }
    if (h) {
      h = h.replace(/['"\s+]/g, "");
    }
    if (i) {
      i = i.replace(/['"\s+]/g, "");
    }
    const k = {
      contactId: g,
      primaryId: h,
      postId: i
    };
    if (window.location.href.includes("/ofc-schedule")) {
      if (!g || !h) {
        console.warn("Missing required values for OFC:", {
          contactId: g,
          primaryId: h
        });
        return null;
      }
      return {
        contactId: g,
        primaryId: h
      };
    }
    const l = Object.entries(k).filter(([z, A]) => !A).map(([z]) => z);
    if (l.length > 0) {
      console.warn("Missing required values:", l);
      return null;
    }
    return k;
  } catch (z) {
    return null;
  }
}
function createCookieMonitor() {
  const a = {
    storedCookies: {},
    start: function () {
      this.captureCookies(document.cookie);
      if (!isCookieMonitorInstalled) {
        try {
          Object.defineProperty(document, "cookie", {
            set: c => {
              const [d, e] = c.split("=");
              this.storedCookies[d] = e.split(";")[0];
              return c;
            },
            get: () => Object.entries(this.storedCookies).map(([c, d]) => c + "=" + d).join("; ")
          });
          isCookieMonitorInstalled = true;
        } catch (c) {
          console.warn("Cookie monitor already initialized, continuing with existing implementation:", c);
          isCookieMonitorInstalled = true;
        }
      }
      const b = window.fetch;
      window.fetch = async (...d) => {
        const e = await b(...d);
        this.checkResponseCookies(e);
        return e;
      };
    },
    captureCookies: function (b) {
      b.split(";").forEach(c => {
        const [d, e] = c.trim().split("=");
        this.storedCookies[d] = e;
      });
    },
    checkResponseCookies: function (b) {
      const c = b.headers.get("set-cookie");
      if (c) {
        c.split(/,\s*/).forEach(d => {
          const [e, f] = d.split("=");
          this.storedCookies[e] = f.split(";")[0];
        });
      }
    },
    getCookieHeader: function () {
      return Object.entries(this.storedCookies).map(([b, c]) => b + "=" + c).join("; ");
    }
  };
  a.start();
  return a;
}
const apiResponseCache = new Map();
const API_RESPONSE_CACHE_TTL_MS = 10000;
function cachedApiFetch(a, b, c) {
  const d = Date.now();
  if (apiResponseCache.has(c)) {
    const e = apiResponseCache.get(c);
    if (d - e.timestamp < API_RESPONSE_CACHE_TTL_MS) {
      return Promise.resolve(e.response.clone());
    }
  }
  return schedulingJitteredApiFetch(a, b).then(f => {
    if (f.ok) {
      const g = f.clone();
      apiResponseCache.set(c, {
        response: g,
        timestamp: d
      });
      if (apiResponseCache.size > 20) {
        const h = apiResponseCache.keys().next().value;
        apiResponseCache.delete(h);
      }
    }
    return f;
  });
}
chrome.storage.onChanged.addListener(async (a, b) => {
  if (b === "sync") {
    cachedUserSettings = null;
    cachedUserSettingsAt = 0;
    if (a.selectedOfcCities || a.selectedConsularCities || a.startDate || a.endDate) {
      if (isSettingsRefreshInProgress) {
        return;
      }
      const c = await getCachedUserSettings();
      if (c.hasRequiredData && c.hasRequiredData()) {
        if (isDatePollingActive) {
          isDatePollingActive = false;
          pollingRunId++;
          await new Promise(f => setTimeout(f, 1000));
        }
        while (isPollingStartInProgress) {
          await new Promise(f => setTimeout(f, 100));
        }
        const d = await getStoredSchedulingContext();
        if (!d) {
          return;
        }
        const e = createCookieMonitor();
        await startPollingForContext(d, e);
      } else {}
    }
  }
});
let cachedUserSettings = null;
let cachedUserSettingsAt = 0;
const USER_SETTINGS_CACHE_TTL_MS = 30000;
async function getCachedUserSettings() {
  const a = Date.now();
  if (cachedUserSettings && a - cachedUserSettingsAt < USER_SETTINGS_CACHE_TTL_MS) {
    return cachedUserSettings;
  }
  try {
    cachedUserSettings = await loadUserSchedulingSettings();
    cachedUserSettingsAt = a;
    return cachedUserSettings;
  } catch (b) {
    return cachedUserSettings || {};
  }
}
async function startDatePolling(a, b) {
  const c = await resumePendingDateSelectionIfNeeded();
  if (c) {
    return;
  }
  const d = await getOfcTimerState();
  if (d.active && window.location.pathname.includes("/ofc-schedule")) {
    return;
  }
  if (d.active && window.location.pathname.includes("/schedule") && !window.location.pathname.includes("/ofc-schedule")) {}
  if (isDatePollingActive) {
    return;
  }
  if (!isSchedulerActive) {
    return;
  }
  isDatePollingActive = true;
  const e = ++pollingRunId;
  try {
    if (!a || !a.primaryId || !a.contactId) {
      return;
    }
    const f = await getCachedUserSettings();
    if (a.primaryId && a.contactId) {
      if (!c) {
        await Swal.fire({
          title: "Please Wait",
          html: "<p>Will start fetching dates shortly...</p>",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      } else {}
      try {
        const n = await fetchAppointmentDetails(a.primaryId, a.contactId, b);
      } catch (o) {}
    }
    let g = [];
    const h = p => new Promise(q => setTimeout(q, p));
    await h(2000);
    const j = document.getElementById("post_select");
    const k = j && j.options && Array.from(j.options).filter(p => p.value).length > 1;
    const l = window.location.pathname;
    if (l.includes("/schedule") && !l.includes("/ofc-schedule") && !k) {
      if (a && a.postId) {
        let p = getLocationNameForPostId(a.postId);
        if (p === "undefined" && j) {
          const q = Array.from(j.options).find(r => r.value === a.postId);
          if (q) {
            p = q.text.trim();
          }
        }
        g.push([a.postId, p]);
      } else {
        const r = document.documentElement.innerHTML;
        const s = [/[?&]postId=([^&"]+)/, /postId["']?\s*:\s*["']([^"']+)/i, /jsdata\['postId'\]\s*=\s*"([^"]+)"/i, /\['postId'\]\s*=\s*"([^"]+)"/];
        let t = null;
        for (const u of s) {
          const v = r.match(u);
          if (v) {
            t = v[1].replace(/['"\s+]/g, "");
            break;
          }
        }
        if (t) {
          const w = j && j.options && j.options.length === 1 ? j.options[0].text.trim() : "Unknown City";
          g.push([t, w]);
        } else {}
      }
    } else {
      try {
        const {
          selectedOfcCities = {},
          selectedConsularCities = {}
        } = await chrome.storage.sync.get(["selectedOfcCities", "selectedConsularCities"]);
        let x = {};
        const y = window.location.pathname;
        if (y.includes("/ofc-schedule")) {
          x = selectedOfcCities;
        } else if (y.includes("/schedule")) {
          x = selectedConsularCities;
        } else {
          x = {
            ...selectedOfcCities,
            ...selectedConsularCities
          };
        }
        if (Object.keys(x).length > 0) {
          Object.entries(x).forEach(([z, A]) => {
            g.push([z, A]);
          });
        } else {}
      } catch (z) {}
    }
    if (g.length === 0) {
      const A = document.getElementById("post_select");
      if (A && A.options && typeof A.options === "object" && "length" in A.options && A.options.length > 0) {
        for (let D = 0; D < A.options.length; D++) {
          const E = A.options[D];
          if (E && E.value) {
            g.push([E.value, E.text ? E.text.trim() : "Unknown"]);
          }
        }
        const B = window.location.pathname;
        let C = {};
        if (B.includes("/ofc-schedule")) {
          const F = {};
          g.forEach(([G, H]) => {
            F[G] = H;
          });
          C.selectedOfcCities = F;
        } else if (B.includes("/schedule")) {
          const G = {};
          g.forEach(([H, I]) => {
            G[H] = I;
          });
          C.selectedConsularCities = G;
        } else {
          const H = {};
          g.forEach(([I, J]) => {
            H[I] = J;
          });
          C.selectedOfcCities = H;
          C.selectedConsularCities = H;
        }
        await chrome.storage.sync.set(C);
      } else if (a.postId) {
        const I = document.querySelector("#post_select option[value=\"" + a.postId + "\"]")?.textContent || "Unknown";
        g.push([a.postId, I]);
      } else {
        isDatePollingActive = false;
        return;
      }
    }
    if (g.length === 0) {
      if (e === pollingRunId) {
        isDatePollingActive = false;
      }
      return;
    }
    currentCityIndex = 0;
    async function m() {
      if (e !== pollingRunId) {
        return;
      }
      if (!isSchedulerActive) {
        if (e === pollingRunId) {
          isDatePollingActive = false;
        }
        return;
      }
      if (!isDatePollingActive) {
        return;
      }
      const M = Date.now();
      try {
        if (!g || g.length === 0) {
          if (e === pollingRunId) {
            isDatePollingActive = false;
          }
          return;
        }
        const [Q, R] = g[currentCityIndex];
        const S = {
          ...a,
          postId: Q,
          cityName: R
        };
        const T = window.location.pathname;
        if (T.includes("/ofc-schedule")) {
          checkOfcScheduleDays(S, b).catch(X => {});
        } else {
          checkConsularScheduleDays(S, b).catch(X => {});
        }
        currentCityIndex = (currentCityIndex + 1) % g.length;
        const U = await getPollingFrequencyMs();
        const V = Date.now() - M;
        const W = Math.max(U - V, 1000);
        scheduleTrackedTimeout(m, W);
      } catch (X) {
        if (isSchedulerActive && isDatePollingActive && e === pollingRunId) {
          const Y = await getPollingFrequencyMs();
          scheduleTrackedTimeout(m, Y);
        }
      }
    }
    m();
  } catch (J) {
    if (e === pollingRunId) {
      isDatePollingActive = false;
    }
  }
}
async function checkConsularScheduleDays(a, b) {
  try {
    const c = await getOfcTimerState();
    if (c.expired) {
      return;
    }
    const d = await getCachedUserSettings();
    if (!d.startDate || !d.endDate) {
      await Swal.fire({
        title: "Date Range Required",
        html: "\n                    <p>Please add <strong>Start Date</strong> and <strong>End Date</strong> in the extension popup to continue using the bot.</p>\n                    <p>The bot needs a date range to search for available appointments.</p>\n                ",
        icon: "warning",
        confirmButtonText: "OK, I'll Set the Dates",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      await logSchedulerMessage("Date range not set for date check");
      return;
    }
    const e = window.location.href.includes("reschedule=true");
    let f = [a.primaryId];
    try {
      const n = await chrome.storage.local.get(["applications"]);
      if (n.applications && Array.isArray(n.applications) && n.applications.length > 0) {
        f = n.applications;
      } else {}
    } catch (o) {}
    const g = new URLSearchParams();
    g.append("parameters", JSON.stringify({
      primaryId: a.primaryId,
      applications: f,
      scheduleDayId: "",
      scheduleEntryId: "",
      postId: a.postId,
      isReschedule: e ? "true" : "false"
    }));
    const h = Date.now();
    const j = "https://www.usvisascheduling.com/en-US/custom-actions/?route=/api/v1/schedule-group/get-family-consular-schedule-days&appd=" + a.contactId + "&cacheString=" + h;
    const k = await schedulingJitteredApiFetch(j, {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        cookie: b.getCookieHeader()
      },
      body: g
    });
    if (!k.ok) {
      throw new Error("HTTP error! status: " + k.status);
    }
    const l = await k.json();
    const m = {
      ...l
    };
    m.Token &&= "[Token length: " + m.Token.length + " chars]";
    if (l.ScheduleDays && l.ScheduleDays.length > 0) {
      const p = l.ScheduleDays.sort((r, s) => new Date(r.Date) - new Date(s.Date));
      if (p.length > 0) {
        const r = p[0].Date;
        let s;
        if (r.includes("T")) {
          const [B] = r.split("T");
          const [C, D, E] = B.split("-").map(Number);
          s = new Date(C, D - 1, E);
        } else {
          const [F, G, H] = r.split("-").map(Number);
          s = new Date(F, G - 1, H);
        }
        const t = s.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const u = await getCachedUserSettings();
        const v = u.startDate.split("-").map(Number);
        const w = u.endDate.split("-").map(Number);
        const x = new Date(v[0], v[1] - 1, v[2]);
        const y = new Date(w[0], w[1] - 1, w[2]);
        const z = s >= x && s <= y;
        const A = p.filter(I => {
          const J = I.Date;
          let K;
          if (J.includes("T")) {
            const [L] = J.split("T");
            const [M, N, O] = L.split("-").map(Number);
            K = new Date(M, N - 1, O);
          } else {
            const [P, Q, R] = J.split("-").map(Number);
            K = new Date(P, Q - 1, R);
          }
          return K >= x && K <= y;
        });
        if (A.length > 0) {
          const I = A.slice(0, 5).map(K => {
            const L = K.Date;
            let M;
            if (L.includes("T")) {
              const [N] = L.split("T");
              const [O, P, Q] = N.split("-").map(Number);
              M = new Date(O, P - 1, Q);
            } else {
              const [R, S, T] = L.split("-").map(Number);
              M = new Date(R, S - 1, T);
            }
            return M.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
          }).join(", ");
          const J = z ? "EARLIEST IN RANGE" : "EARLIEST OUT OF RANGE";
          await logSchedulerMessage(" - City: " + a.cityName + " - Earliest available date: " + t + " (" + J + ") - First 5 dates within range: " + I + " (" + A.length + " dates within range, " + p.length + " total dates available)");
        } else {
          await logSchedulerMessage(" - City: " + a.cityName + " - Earliest available date: " + t + " (" + p.length + " dates available, NONE within preferred range)");
        }
      }
      let q = false;
      for (const K of p) {
        const L = K.Date;
        let M;
        if (L.includes("T")) {
          const [U] = L.split("T");
          const [V, W, X] = U.split("-").map(Number);
          M = new Date(V, W - 1, X);
        } else {
          const [Y, Z, a0] = L.split("-").map(Number);
          M = new Date(Y, Z - 1, a0);
        }
        const N = K.ID;
        const O = M.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const P = d.startDate.split("-").map(Number);
        const Q = d.endDate.split("-").map(Number);
        const R = new Date(P[0], P[1] - 1, P[2]);
        const S = new Date(Q[0], Q[1] - 1, Q[2]);
        const T = M >= R && M <= S;
        if (T) {
          q = true;
          await chrome.storage.local.set({
            dateSelectionInProgress: true
          });
          preferredDate = M;
          preferredDateId = N;
          await chrome.storage.local.set({
            preferredDateString: M.toISOString(),
            preferredDateId: N
          });
          await chrome.storage.local.set({
            preferredLocation: {
              postId: a.postId,
              cityName: a.cityName || "Unknown"
            }
          });
          isDatePollingActive = false;
          const a1 = document.getElementById("post_select");
          let a2 = false;
          if (a1) {
            if (a1.tagName === "SELECT" && a1.options.length > 1) {
              a2 = true;
            }
          }
          if (!a2) {
            window.location.reload();
          } else {
            isSelectingPreferredDate = true;
            for (let a4 = 0; a4 < a1.options.length; a4++) {
              if (a1.options[a4].value === a.postId) {
                a1.selectedIndex = a4;
                const a5 = new Event("change", {
                  bubbles: true
                });
                await schedulingDispatchEvent(a1, a5);
                await new Promise(a6 => setTimeout(a6, 1000));
                break;
              }
            }
            const a3 = await selectCalendarDate(M);
            if (a3) {
              await selectTimeSlot(false);
            } else {
              isSelectingPreferredDate = false;
            }
          }
          return;
        }
      }
      if (!q) {
        const a6 = p[0].Date;
        let a7;
        if (a6.includes("T")) {
          const [a9] = a6.split("T");
          const [aa, ab, ac] = a9.split("-").map(Number);
          a7 = new Date(aa, ab - 1, ac);
        } else {
          const [ad, ae, af] = a6.split("-").map(Number);
          a7 = new Date(ad, ae - 1, af);
        }
        const a8 = a7.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        await showSchedulerToast("\n          <span style=\"color: white\">Checking for available dates</span><br>\n          <span style=\"color: lightgreen;\">Location: " + (a.cityName || "Unknown") + "</span><br>\n          <span style=\"color: lightgreen;\">Earliest availability: " + a8 + "</span><br>\n          <span style=\"color: yellow;\">Preferred range: " + formatDateRange(d.startDate, d.endDate) + "</span><br>\n          <span style=\"color: white\">No dates found within preferred range</span><br>\n          <span style=\"color: yellow;\">Checked @ " + new Date().toLocaleString() + "</span>\n        ");
      }
    } else {
      await logSchedulerMessage(" - Location: " + (a.cityName || "Unknown") + " - No available dates found");
      await showSchedulerToast("\n        <span style=\"color: white\">No available dates found</span><br>\n        <span style=\"color: lightgreen;\">Location: " + (a.cityName || "Unknown") + "</span><br>\n        <span style=\"color: yellow;\">Preferred range: " + formatDateRange(d.startDate, d.endDate) + "</span><br>\n        <span style=\"color: yellow;\">Checked @ " + new Date().toLocaleString() + "</span>\n      ");
    }
  } catch (ag) {
    await logSchedulerMessage(" - Location: " + (a.cityName || "Unknown") + " - Error: " + ag.message);
    if (ag.message && (ag.message.includes("429") || ag.message.includes("rate limit") || ag.message.includes("too many requests"))) {
      await Swal.fire({
        title: "🚦 Consulate sent Error 429",
        html: "\n                    <div style=\"text-align: center; padding: 20px;\">\n                        <h3 style=\"color: #ff6b35; margin-bottom: 20px;\">⚠️ Server Rate Limit Detected</h3>\n                        <p style=\"margin-bottom: 15px;\">The server is receiving too many requests and has temporarily blocked further requests.</p>\n                        <p style=\"margin-bottom: 15px;\"><strong>Please turn off the bot for a few hours</strong> to allow the rate limit to reset.</p>\n                        <p style=\"color: #666; font-size: 14px; margin-bottom: 20px;\">This helps prevent your account from being temporarily suspended.</p>\n                        <div style=\"background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;\">\n                            <p style=\"margin: 0; color: #495057;\"><strong>💡 Recommended Action:</strong></p>\n                            <p style=\"margin: 5px 0 0 0; color: #495057;\">Wait 2-4 hours before reactivating the bot</p>\n                        </div>\n                    </div>\n                ",
        icon: "warning",
        confirmButtonText: "I'll Turn Off the Bot",
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: "swal-wide"
        }
      });
      isDatePollingActive = false;
      cleanupSchedulerState();
      return;
    }
    const ah = await getCachedUserSettings();
    if (!ah.startDate || !ah.endDate) {
      await Swal.fire({
        title: "Date Range Required",
        html: "\n                    <p>Please add <strong>Start Date</strong> and <strong>End Date</strong> in the extension popup to continue using the bot.</p>\n                    <p>The bot needs a date range to search for available appointments.</p>\n                ",
        icon: "warning",
        confirmButtonText: "OK, I'll Set the Dates",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    } else {
      await showSchedulerToast("\n                <span style=\"color: red\">Error checking dates: " + ag.message + "</span><br>\n                <span style=\"color: lightgreen;\">Location: " + (a.cityName || "Unknown") + "</span><br>\n                <span style=\"color: yellow;\">Preferred range: " + formatDateRange(ah.startDate, ah.endDate) + "</span><br>\n                <span style=\"color: yellow;\">Checked @ " + new Date().toLocaleString() + "</span>\n            ");
    }
    setTimeout(() => {
      window.location.href = "https://www.usvisascheduling.com/en-US/";
    }, 3000);
  }
}
document.addEventListener("DOMContentLoaded", async () => {});
async function fetchConsularTimeSlots(a, b, c) {
  const d = await getCachedUserSettings();
  try {
    if (!b) {
      return null;
    }
    let e = [a.primaryId];
    try {
      const k = await chrome.storage.local.get(["applications"]);
      if (k.applications && Array.isArray(k.applications) && k.applications.length > 0) {
        e = k.applications;
      } else {}
    } catch (l) {}
    const f = new URLSearchParams();
    f.append("parameters", JSON.stringify({
      primaryId: a.primaryId,
      applications: e,
      scheduleDayId: b,
      scheduleEntryId: "",
      postId: a.postId,
      isReschedule: window.location.href.includes("reschedule=true") ? "true" : "false"
    }));
    const g = Date.now();
    const h = "https://www.usvisascheduling.com/en-US/custom-actions/?route=/api/v1/schedule-group/get-family-consular-schedule-entries&appd=" + a.contactId + "&cacheString=" + g;
    const i = await schedulingJitteredApiFetch(h, {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        cookie: c.getCookieHeader()
      },
      body: f.toString(),
      credentials: "include"
    });
    if (!i.ok) {
      throw new Error("HTTP error! status: " + i.status);
    }
    const j = await i.json();
    return j.ScheduleEntries;
  } catch (m) {
    await logSchedulerMessage("Error fetching time slots: " + m.message);
    return null;
  }
}
async function getPollingFrequencyMs() {
  try {
    const a = await new Promise(b => {
      chrome.storage.local.get(["__fq", "__fqType"], c => {
        let d = c.__fq || 30;
        let e = c.__fqType || "seconds";
        let f = 30000;
        if (d) {
          if (e === "seconds") {
            f = d * 1000;
          } else if (e === "minutes") {
            f = d * 60 * 1000;
          } else if (e === "hours") {
            f = d * 60 * 60 * 1000;
          }
        }
        b(f);
      });
    });
    return a;
  } catch (b) {
    return 30000;
  }
}
async function getCurrentAppointment() {
  try {
    const {
      currentAppointment: a
    } = await chrome.storage.local.get("currentAppointment");
    return a || null;
  } catch (b) {
    return null;
  }
}
const showSchedulerToast = async a => {
  const b = await getPollingFrequencyMs();
  const c = await getCurrentAppointment();
  let d = a;
  if (c && c.dateString) {
    d += "<br><span style=\"color: #FFD700;\">Current Appointment: " + c.dateString + "</span>";
  }
  Swal.fire({
    toast: true,
    position: "bottom-start",
    timer: b,
    showConfirmButton: false,
    timerProgressBar: true,
    html: d
  });
};
function formatDateRange(a, b) {
  const c = a.split("-").map(Number);
  const d = b.split("-").map(Number);
  const e = new Date(c[0], c[1] - 1, c[2]);
  const f = new Date(d[0], d[1] - 1, d[2]);
  return e.toLocaleDateString() + " - " + f.toLocaleDateString();
}
async function captureCurrentAppointment() {
  try {
    const a = document.querySelectorAll(".text-bold");
    for (const b of a) {
      if (b.textContent.includes("Appointment Confirmation")) {
        const c = document.getElementById("appointment-card");
        if (c && c.textContent && !c.textContent.includes("No Appointment Scheduled")) {
          const e = c.textContent.trim();
          const f = e.match(/(Consular|OFC):\s*(.+)/);
          if (f) {
            const g = f[1];
            const h = f[2];
            await chrome.storage.local.set({
              currentAppointment: {
                type: g,
                dateString: h,
                extractedAt: new Date().toISOString()
              }
            });
            return;
          }
        }
        const d = b.closest(".border-base-lightest");
        if (d) {
          const i = d.querySelector("script");
          if (i && i.textContent) {
            const j = i.textContent;
            const k = j.match(/moment\('([^']+)'\)\.format\('([^']+)'\)/);
            if (k) {
              const l = k[1];
              const m = k[2];
              const n = j.match(/'(\d+)'\s*==\s*'1'\s*\?\s*'Consular'\s*:\s*'OFC'/);
              const o = n && n[1] === "1" ? "Consular" : "OFC";
              await chrome.storage.local.set({
                currentAppointment: {
                  type: o,
                  dateString: o + ": " + l,
                  rawDate: l,
                  format: m,
                  extractedAt: new Date().toISOString()
                }
              });
              return;
            }
          }
        }
      }
    }
    await chrome.storage.local.remove("currentAppointment");
  } catch (p) {}
}
const MAX_LOG_LENGTH = 100000;
async function logSchedulerMessage(a) {
  const b = new Date().toLocaleString();
  const c = b + ": " + a + "\n";
  try {
    const {
      logs = ""
    } = await chrome.storage.local.get({
      logs: ""
    });
    let d = logs + c;
    if (d.length > MAX_LOG_LENGTH) {
      const e = d.split("\n");
      const f = Math.floor(e.length * 0.5);
      d = e.slice(-f).join("\n");
    }
    await chrome.storage.local.set({
      logs: d
    });
  } catch (g) {
    console.warn("Failed to save log:", g);
  }
}
async function selectCalendarDate(a) {
  const b = await getCachedUserSettings();
  try {
    const c = new Date(a);
    const d = c.getMonth();
    const e = c.getFullYear();
    const f = c.getDate();
    const g = 30000;
    const h = Date.now();
    const i = Swal.fire({
      toast: true,
      position: "bottom-start",
      timer: g + 1000,
      showConfirmButton: false,
      timerProgressBar: true,
      html: "\n                <span style=\"color: white\">📅 Selecting Date in Calendar...</span><br>\n                <span style=\"color: lightgreen;\">Target Date: " + (d + 1) + "/" + f + "/" + e + "</span><br>\n                <span style=\"color: yellow;\">It is loading calendar...</span>\n            "
    });
    let j;
    let k;
    while (Date.now() - h < g) {
      j = document.querySelector(".ui-datepicker-month");
      k = document.querySelector(".ui-datepicker-year");
      if (j && k) {
        i.close();
        break;
      }
      if ((Date.now() - h) % 5000 < 200) {}
      await new Promise(n => setTimeout(n, 200));
    }
    i.close();
    if (!j || !k) {
      throw new Error("Calendar selectors not found after waiting " + g / 1000 + " seconds");
    }
    k.value = e.toString();
    await schedulingDispatchEvent(k, new Event("change", {
      bubbles: true
    }));
    j.value = d.toString();
    await schedulingDispatchEvent(j, new Event("change", {
      bubbles: true
    }));
    await new Promise(n => setTimeout(n, 300));
    const l = Date.now();
    let m = null;
    while (Date.now() - l < g) {
      const n = ["td.greenday[data-month=\"" + d + "\"][data-year=\"" + e + "\"] a[data-date=\"" + f + "\"]", "td[data-month=\"" + d + "\"][data-year=\"" + e + "\"] a[data-date=\"" + f + "\"]", "td.greenday a[data-date=\"" + f + "\"]"];
      for (const o of n) {
        m = document.querySelector(o);
        if (m) {
          break;
        }
      }
      if (m) {
        break;
      }
      if ((Date.now() - l) % 5000 < 200) {}
      await new Promise(p => setTimeout(p, 200));
    }
    if (!m) {
      throw new Error("Date cell not found for " + (d + 1) + "/" + f + "/" + e + " after waiting " + g / 1000 + " seconds");
    }
    await schedulingClickElement(m);
    return true;
  } catch (p) {
    await logSchedulerMessage("Error selecting date: " + p.message);
    await chrome.storage.local.set({
      dateSelectionInProgress: false,
      preferredDateString: null,
      preferredDateId: null
    });
    await showSchedulerToast("\n            <span style=\"color: red\">❌ Date Selection Failed</span><br>\n            <span style=\"color: white\">Error: " + p.message + "</span><br>\n            <span style=\"color: yellow;\">Redirecting to home page...</span>\n        ", 5000);
    setTimeout(() => {
      window.location.href = "https://www.usvisascheduling.com/en-US/";
    }, 2000);
    return false;
  }
}
async function waitForCalendarReady() {
  const a = [".atlas_validationalert.alert.alert-danger", ".alert.alert-danger", ".error-message", ".validation-error", ".alert-danger"];
  for (const b of a) {
    const c = document.querySelector(b);
    if (c && c.textContent.trim()) {
      const d = c.textContent.trim();
      await logSchedulerMessage("Booking Error Detected: " + d + " (Selector: " + b + ")");
      const e = ["no longer available", "selected appointment time is no longer available", "please select another appointment time", "already booked", "network error", "server error", "booking failed", "try again", "invalid request", "session expired", "error occurred", "lütfen başka bir randevu saati seçin", "Seçilen randevu saati artık müsait değil", "Sistem çok fazla talep isliyor. Lütfen tekrar deneyin"];
      const f = e.some(g => d.toLowerCase().includes(g.toLowerCase()));
      if (f) {
        return {
          found: true,
          message: d,
          element: c
        };
      }
    }
  }
  return {
    found: false,
    message: null,
    element: null
  };
}
function waitForCondition(a, b, c = 30) {
  return new Promise(d => {
    const e = Date.now();
    const f = c * 1000;
    let g = 0;
    const h = setInterval(async () => {
      g++;
      const i = Date.now() - e;
      const j = await waitForCalendarReady();
      if (j.found) {
        clearInterval(h);
        a(j);
        d({
          errorFound: true,
          pollCount: g,
          elapsedTime: i
        });
        return;
      }
      if (i >= f) {
        clearInterval(h);
        b();
        d({
          errorFound: false,
          pollCount: g,
          elapsedTime: i
        });
        return;
      }
    }, 1000);
  });
}
async function selectTimeSlot(a = false) {
  try {
    const b = Swal.fire({
      toast: true,
      position: "bottom-start",
      timer: 8000,
      showConfirmButton: false,
      timerProgressBar: true,
      html: "\n                <span style=\"color: white\">⏰ Looking for Time Slots...</span><br>\n                <span style=\"color: lightgreen;\">Searching for available appointments</span><br>\n            "
    });
    let c = 0;
    const d = 15;
    let e = [];
    while (e.length === 0 && c < d) {
      e = document.querySelectorAll("#time_select input[type=\"radio\"]");
      if (e.length === 0) {
        await new Promise(m => setTimeout(m, 500));
        c++;
      }
    }
    b.close();
    if (!e.length) {
      throw new Error("No time slots found after multiple attempts");
    }
    const f = Math.floor(Math.random() * e.length);
    const g = e[f];
    const h = g.closest("tr");
    const i = h.querySelector("td:nth-child(2)")?.textContent.trim() || "Unknown time";
    const j = g.getAttribute("data-slots") || "Unknown slots";
    await schedulingClickElement(g);
    const {
      __ab: k
    } = await chrome.storage.local.get("__ab");
    const l = k === true;
    if (l) {
      await showSchedulerToast("\n                <span style=\"color: white\">AutoBook Enabled!</span><br>\n                <span style=\"color: lightgreen;\">Selected Time: " + i + "</span><br>\n                <span style=\"color: white;\">Slots: " + j + "</span><br>\n                <span style=\"color: yellow;\">Proceeding with automatic booking...</span>\n            ", 3000);
      const m = document.getElementById("submitbtn");
      if (m) {
        if (m.disabled) {
          m.disabled = false;
          m.style.opacity = "1";
        }
        await schedulingClickElement(m);
        setTimeout(() => {
          try {
            const n = document.getElementById("time_select");
            if (n) {
              const o = n.querySelectorAll("tbody tr");
              const p = [];
              o.forEach((q, r) => {
                const s = q.querySelector("td:nth-child(2) div");
                const t = q.querySelector("td:nth-child(3) div");
                const u = q.querySelector("input[type=\"radio\"]");
                if (s && t) {
                  const v = s.textContent.trim();
                  const w = t.textContent.trim();
                  const x = u ? u.id : "N/A";
                  const y = u ? u.getAttribute("data-slots") : "N/A";
                  p.push(v + " (" + w + " slots, ID: " + x + ")");
                }
              });
              if (p.length > 0) {
                logSchedulerMessage("Available Time Slots for Selected Date: " + p.join(", "));
              } else {}
            } else {}
          } catch (q) {}
        }, 100);
        if (a) {
          await startOfcTimer();
          const n = await new Promise(o => {
            let p = false;
            waitForCondition(async q => {
              await logSchedulerMessage("Booking submission failed: " + q.message + " - Time: " + i + " - Error found, next step will refresh the page");
              await stopOfcTimer();
              await showSchedulerToast("\n                                    <span style=\"color: red\">❌ OFC Booking Failed</span><br>\n                                    <span style=\"color: white\">" + q.message + "</span><br>\n                                    <span style=\"color: yellow;\">Refreshing page to retry...</span>\n                                ", 4000);
              await chrome.storage.local.set({
                dateSelectionInProgress: false,
                preferredDateString: null,
                preferredDateId: null
              });
              isDatePollingActive = false;
              cleanupSchedulerState();
              p = true;
              o(false);
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }, () => {
              if (!p) {
                o(true);
              }
            }, 30);
          });
          if (n) {
            await showSchedulerToast("\n                            <span style=\"color: white\">OFC Booking submitted!</span><br>\n                            <span style=\"color: lightgreen;\">Time: " + i + "</span><br>\n                            <span style=\"color: orange;\">30-minute timer started for consular search</span><br>\n                            <span style=\"color: yellow;\">Website will redirect to consular page</span>\n                        ", 5000);
            return true;
          } else {
            return false;
          }
        } else {
          waitForCondition(async o => {
            await logSchedulerMessage("Booking submission failed: " + o.message + " - Time: " + i + " - Error found, next step will refresh the page");
            await showSchedulerToast("\n                                <span style=\"color: red\">❌ Booking Failed</span><br>\n                                <span style=\"color: white\">" + o.message + "</span><br>\n                                <span style=\"color: yellow;\">Refreshing page to retry...</span>\n                            ", 4000);
            await chrome.storage.local.set({
              dateSelectionInProgress: false,
              preferredDateString: null,
              preferredDateId: null
            });
            isDatePollingActive = false;
            cleanupSchedulerState();
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }, () => {}, 30);
          await logSchedulerMessage("Consular booking submitted, starting appointment confirmation monitoring...");
          if (!a) {
            const o = await getOfcTimerState();
            if (o.active) {
              await stopOfcTimer();
            }
          }
          isBookingInProgress = true;
          await logSchedulerMessage("Appointment confirmation monitoring activated");
          await chrome.storage.local.set({
            bookingInProgress: true
          });
          await loadApplicationsFromPage();
        }
      } else {
        await showSchedulerToast("\n                    <span style=\"color: red\">Error: Submit button not found</span><br>\n                    <span style=\"color: yellow;\">Please submit manually</span>\n                ", 5000);
      }
    } else {
      try {
        const q = document.getElementById("time_select");
        if (q) {
          const r = q.querySelectorAll("tbody tr");
          const s = [];
          r.forEach((t, u) => {
            const v = t.querySelector("td:nth-child(2) div");
            const w = t.querySelector("td:nth-child(3) div");
            const x = t.querySelector("input[type=\"radio\"]");
            if (v && w) {
              const y = v.textContent.trim();
              const z = w.textContent.trim();
              const A = x ? x.id : "N/A";
              const B = x ? x.getAttribute("data-slots") : "N/A";
              s.push(y + " (" + z + " slots, ID: " + A + ")");
            }
          });
          if (s.length > 0) {
            await logSchedulerMessage("Available Time Slots for Selected Date (Before Manual Confirmation): " + s.join(", "));
          } else {}
        } else {}
      } catch (t) {}
      const p = await Swal.fire({
        title: "🎉 Perfect Time Slot Found!",
        html: "\n                    <div style=\"text-align: center; padding: 10px;\">\n                        <p style=\"color: #4CAF50; font-size: 18px; font-weight: bold; margin-bottom: 15px;\">\n                            ✅ Available Appointment Found!\n                        </p>\n                        <p style=\"color: #333; margin-bottom: 10px;\">\n                            <strong>📅 Selected Time:</strong> " + i + "\n                        </p>\n                        <p style=\"color: #333; margin-bottom: 15px;\">\n                            <strong>📊 Available Slots:</strong> " + j + "\n                        </p>\n                        <p style=\"color: #666; font-size: 14px; margin-bottom: 20px;\">\n                            Would you like to proceed with booking this appointment?\n                        </p>\n                        <p style=\"color: #FF9800; font-size: 12px;\">\n                            <em>💡 Tip: Enable \"AutoBook\" in the extension popup to automatically book future appointments</em>\n                        </p>\n                    </div>\n                ",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "📝 Book This Appointment",
        cancelButtonText: "❌ Cancel",
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#f44336",
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: true
      });
      if (p.isConfirmed) {
        const u = document.getElementById("submitbtn");
        if (u) {
          if (u.disabled) {
            u.disabled = false;
            u.style.opacity = "1";
          }
          await schedulingClickElement(u);
          if (a) {
            await startOfcTimer();
            const v = await new Promise(w => {
              let x = false;
              waitForCondition(async y => {
                await logSchedulerMessage("Booking submission failed: " + y.message + " - Time: " + i + " - Error found, next step will refresh the page");
                await stopOfcTimer();
                await showSchedulerToast("\n                                        <span style=\"color: red\">❌ OFC Booking Failed</span><br>\n                                        <span style=\"color: white\">" + y.message + "</span><br>\n                                        <span style=\"color: yellow;\">Refreshing page to retry...</span>\n                                    ", 4000);
                await chrome.storage.local.set({
                  dateSelectionInProgress: false,
                  preferredDateString: null,
                  preferredDateId: null
                });
                isDatePollingActive = false;
                cleanupSchedulerState();
                x = true;
                w(false);
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }, () => {
                if (!x) {
                  w(true);
                }
              }, 30);
            });
            if (v) {
              await showSchedulerToast("\n                                <span style=\"color: white\">🎉 OFC Booking submitted!</span><br>\n                                <span style=\"color: lightgreen;\">Time: " + i + "</span><br>\n                                <span style=\"color: orange;\">30-minute timer started for consular search</span><br>\n                                <span style=\"color: yellow;\">Website will redirect to consular page</span>\n                            ", 5000);
              return true;
            } else {
              return false;
            }
          } else {
            waitForCondition(async w => {
              await logSchedulerMessage("Booking submission failed: " + w.message + " - Time: " + i + " - Error found, next step will refresh the page");
              await showSchedulerToast("\n                                    <span style=\"color: red\">❌ Booking Failed</span><br>\n                                    <span style=\"color: white\">" + w.message + "</span><br>\n                                    <span style=\"color: yellow;\">Refreshing page to retry...</span>\n                                ", 4000);
              await chrome.storage.local.set({
                dateSelectionInProgress: false,
                preferredDateString: null,
                preferredDateId: null
              });
              isDatePollingActive = false;
              cleanupSchedulerState();
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }, () => {}, 30);
            if (!a) {
              const w = await getOfcTimerState();
              if (w.active) {
                await stopOfcTimer();
              }
            }
            isDatePollingActive = false;
            cleanupSchedulerState();
          }
        } else {
          await showSchedulerToast("\n                        <span style=\"color: red\">Error: Submit button not found</span><br>\n                        <span style=\"color: yellow;\">Please submit manually</span>\n                    ", 5000);
        }
      } else {
        await chrome.storage.local.set({
          dateSelectionInProgress: false,
          preferredDateString: null,
          preferredDateId: null
        });
        await showSchedulerToast("\n                    <span style=\"color: orange\">⚠️ Booking cancelled</span><br>\n                    <span style=\"color: white\">The system will continue monitoring for appointments</span>\n                ", 4000);
        return false;
      }
    }
    return true;
  } catch (x) {
    await logSchedulerMessage("Error selecting time slot: " + x.message);
    await chrome.storage.local.set({
      dateSelectionInProgress: false,
      preferredDateString: null,
      preferredDateId: null
    });
    await showSchedulerToast("\n            <span style=\"color: red\">❌ Time Slot Selection Failed</span><br>\n            <span style=\"color: white\">Error: " + x.message + "</span><br>\n            <span style=\"color: yellow;\">Redirecting to home page...</span>\n        ", 5000);
    setTimeout(() => {
      window.location.href = "https://www.usvisascheduling.com/en-US/";
    }, 2000);
    return false;
  }
}
async function waitForElement(a, b = 3000) {
  return new Promise((c, d) => {
    if (document.querySelector(a)) {
      return c(document.querySelector(a));
    }
    const e = new MutationObserver(() => {
      if (document.querySelector(a)) {
        e.disconnect();
        c(document.querySelector(a));
      }
    });
    e.observe(document.body, {
      childList: true,
      subtree: true
    });
    setTimeout(() => {
      e.disconnect();
      d(new Error("Timeout waiting for element: " + a));
    }, b);
  });
}
async function configureCitySelections() {
  const a = window.location.pathname;
  const b = {
    "/ofc-schedule": {
      "3f6bf614-b0db-ec11-a7b4-001dd80234f6": "CHENNAI VAC",
      "436bf614-b0db-ec11-a7b4-001dd80234f6": "HYDERABAD VAC",
      "466bf614-b0db-ec11-a7b4-001dd80234f6": "KOLKATA VAC",
      "486bf614-b0db-ec11-a7b4-001dd80234f6": "MUMBAI VAC",
      "4a6bf614-b0db-ec11-a7b4-001dd80234f6": "NEW DELHI VAC"
    },
    "/schedule": {
      "c86af614-b0db-ec11-a7b4-001dd80234f6": "CHENNAI",
      "ae6af614-b0db-ec11-a7b4-001dd80234f6": "HYDERABAD",
      "816af614-b0db-ec11-a7b4-001dd80234f6": "KOLKATA",
      "716af614-b0db-ec11-a7b4-001dd80234f6": "MUMBAI",
      "e66af614-b0db-ec11-a7b4-001dd80234f6": "NEW DELHI"
    }
  };
  function c(i) {
    const j = {};
    const k = {
      "CHENNAI VAC": {
        id: "c86af614-b0db-ec11-a7b4-001dd80234f6",
        name: "CHENNAI"
      },
      "HYDERABAD VAC": {
        id: "ae6af614-b0db-ec11-a7b4-001dd80234f6",
        name: "HYDERABAD"
      },
      "KOLKATA VAC": {
        id: "816af614-b0db-ec11-a7b4-001dd80234f6",
        name: "KOLKATA"
      },
      "MUMBAI VAC": {
        id: "716af614-b0db-ec11-a7b4-001dd80234f6",
        name: "MUMBAI"
      },
      "NEW DELHI VAC": {
        id: "e66af614-b0db-ec11-a7b4-001dd80234f6",
        name: "NEW DELHI"
      }
    };
    Object.values(i).forEach(l => {
      if (k[l]) {
        const m = k[l];
        j[m.id] = m.name;
      }
    });
    return j;
  }
  let d = {};
  if (a.includes("/ofc-schedule")) {
    d = b["/ofc-schedule"];
  } else if (a.includes("/schedule")) {
    d = b["/schedule"];
  } else {
    let i = 0;
    let j;
    while (i < 10) {
      j = document.getElementById("post_select");
      if (j && j.options && typeof j.options === "object" && "length" in j.options && j.options.length > 1) {
        break;
      }
      await new Promise(k => setTimeout(k, 1000));
      i++;
    }
    if (!j || !j.options || typeof j.options !== "object" || !("length" in j.options) || j.options.length <= 1) {
      const k = {};
      const l = new URLSearchParams(window.location.search);
      const m = l.get("postId");
      if (m) {
        const o = document.querySelector("h1, h2, .location-name, .city-name")?.textContent || "Unknown City";
        k[m] = o;
      } else if (j && j.options && j.options.length === 1 && j.options[0].value) {
        const p = j.options[0];
        k[p.value] = p.text.trim();
      } else if (pageData.postId) {
        const q = document.querySelector("#post_select option[value=\"" + pageData.postId + "\"]")?.textContent || "Unknown";
        locationsArray.push([pageData.postId, q]);
      } else {
        isDatePollingActive = false;
        return;
      }
      let n = {
        allCities: k
      };
      if (a.includes("/ofc-schedule")) {
        n.selectedOfcCities = k;
      } else if (a.includes("/schedule")) {
        n.selectedConsularCities = k;
      } else {
        n.selectedOfcCities = k;
        n.selectedConsularCities = k;
      }
      await chrome.storage.sync.set(n);
      return k;
    }
    Array.from(j.options).forEach(r => {
      if (r.value && r.text) {
        d[r.value] = r.text.trim();
      }
    });
  }
  await chrome.storage.sync.set({
    allCities: d
  });
  let f = {};
  let g = "";
  let h = "";
  if (a.includes("/ofc-schedule")) {
    const {
      selectedOfcCities = {}
    } = await chrome.storage.sync.get("selectedOfcCities");
    f = selectedOfcCities;
    g = "selectedOfcCities";
    h = "OFC";
  } else if (a.includes("/schedule")) {
    const {
      selectedConsularCities = {}
    } = await chrome.storage.sync.get("selectedConsularCities");
    f = selectedConsularCities;
    g = "selectedConsularCities";
    h = "Consular";
  } else {
    const {
      selectedOfcCities = {},
      selectedConsularCities = {}
    } = await chrome.storage.sync.get(["selectedOfcCities", "selectedConsularCities"]);
    f = {
      ...selectedOfcCities,
      ...selectedConsularCities
    };
    g = "selectedCities";
    h = "Unknown";
  }
  if (Object.keys(f).length === 0) {
    isSettingsRefreshInProgress = true;
    const r = await Swal.fire({
      title: "Select " + h + " Cities",
      html: "\n                <div style=\"text-align: left; max-height: 300px; overflow-y: auto;\">\n                    <p>Please select the cities you want to monitor for " + h + " appointments:</p>\n                    " + Object.entries(d).map(([s, t]) => "\n                        <div class=\"form-check\" style=\"margin: 10px 0;\">\n                            <input class=\"form-check-input\" type=\"checkbox\" value=\"" + s + "\" \n                                   id=\"city_" + s + "\">\n                            <label class=\"form-check-label\" for=\"city_" + s + "\">\n                                " + t.replace(" VAC", "") + "\n                            </label>\n                        </div>\n                    ").join("") + "\n                </div>\n            ",
      confirmButtonText: "Save Selection",
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm: () => {
        const s = {};
        Object.keys(d).forEach(t => {
          const u = document.getElementById("city_" + t);
          if (u && u.checked) {
            s[t] = d[t];
          }
        });
        if (Object.keys(s).length === 0) {
          Swal.showValidationMessage("Please select at least one city");
          return false;
        }
        return s;
      }
    });
    if (r.isConfirmed && r.value) {
      await chrome.storage.sync.set({
        [g]: r.value
      });
      if (h === "OFC") {
        isDatePollingActive = false;
        pollingRunId++;
        const s = c(r.value);
        const {
          selectedConsularCities = {}
        } = await chrome.storage.sync.get("selectedConsularCities");
        const t = b["/schedule"];
        let u = "Select Consular Cities";
        let v = "";
        if (Object.keys(selectedConsularCities).length > 0) {
          u = "Update Consular Cities";
          v = "<p style=\"color: #FF9800; font-size: 13px; margin-bottom: 15px;\">\n                        <strong>Current Consular cities:</strong> " + Object.values(selectedConsularCities).join(", ") + "\n                    </p>";
        }
        try {
          Swal.close();
        } catch (x) {}
        await new Promise(y => setTimeout(y, 500));
        const w = await Swal.fire({
          title: u,
          html: "\n                        <div style=\"text-align: left; max-height: 300px; overflow-y: auto;\">\n                            <p>Please select the <strong>Consular cities</strong> you want to monitor:</p>\n                            <p style=\"color: #666; font-size: 14px; margin-bottom: 15px;\">\n                                <em>💡 Tip: You can select different cities for Consular appointments than your OFC selection</em>\n                            </p>\n                            <p style=\"color: #4CAF50; font-size: 13px; margin-bottom: 15px;\">\n                                <strong>Your OFC selection:</strong> " + Object.values(r.value).map(y => y.replace(" VAC", "")).join(", ") + "\n                            </p>\n                            " + v + "\n                            " + Object.entries(t).map(([y, z]) => {
            const A = selectedConsularCities[y];
            const B = Object.values(s).includes(z);
            const C = A || B && Object.keys(selectedConsularCities).length === 0;
            return "\n                                    <div class=\"form-check\" style=\"margin: 10px 0;\">\n                                        <input class=\"form-check-input\" type=\"checkbox\" value=\"" + y + "\" \n                                               id=\"consular_city_" + y + "\" " + (C ? "checked" : "") + ">\n                                        <label class=\"form-check-label\" for=\"consular_city_" + y + "\" \n                                               style=\"" + (B ? "font-weight: bold; color: #4CAF50;" : "") + "\">\n                                            " + z + " " + (B ? "(matches your OFC selection)" : "") + "\n                                        </label>\n                                    </div>\n                                ";
          }).join("") + "\n                        </div>\n                    ",
          confirmButtonText: "Save Consular Cities",
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          preConfirm: () => {
            const y = {};
            Object.keys(t).forEach(z => {
              const A = document.getElementById("consular_city_" + z);
              if (A && A.checked) {
                y[z] = t[z];
              }
            });
            if (Object.keys(y).length === 0) {
              Swal.showValidationMessage("Please select at least one consular city");
              return false;
            }
            return y;
          }
        });
        if (w.isConfirmed && w.value) {
          await chrome.storage.sync.set({
            selectedConsularCities: w.value
          });
          await Swal.fire({
            title: "Setup Complete!",
            html: "\n                            <div style=\"text-align: left;\">\n                                <p>✅ <strong>OFC Cities:</strong> " + Object.values(r.value).join(", ") + "</p>\n                                <p>✅ <strong>Consular Cities:</strong> " + Object.values(w.value).join(", ") + "</p>\n                                <p style=\"color: #4CAF50; margin-top: 15px;\">\n                                    <strong>Both appointment types are now configured for monitoring!</strong>\n                                </p>\n                                <p style=\"color: #2196F3; margin-top: 10px;\">\n                                    The system will now start checking for available dates...\n                                </p>\n                            </div>\n                        ",
            icon: "success",
            confirmButtonText: "Start Monitoring!",
            timer: 8000,
            allowOutsideClick: false
          });
          isSettingsRefreshInProgress = false;
        } else {
          await Swal.fire({
            title: "Incomplete Setup",
            html: "\n                            <p>⚠️ <strong>OFC cities selected but Consular cities not configured.</strong></p>\n                            <p>You can complete the setup later by visiting the Consular appointment page.</p>\n                            <p>Only OFC monitoring will be active for now.</p>\n                        ",
            icon: "warning",
            confirmButtonText: "Continue with OFC Only",
            timer: 6000
          });
          isSettingsRefreshInProgress = false;
        }
      } else if (h === "Consular") {
        await Swal.fire({
          title: "Consular Cities Selected!",
          html: "\n                        <p>You have selected cities for <strong>Consular appointments</strong>.</p>\n                        <p>Make sure you have also selected cities for <strong>OFC appointments</strong>.</p>\n                        <p>Both selections are required for complete monitoring.</p>\n                        <p style=\"color: #2196F3; margin-top: 10px;\">\n                            The system will now start checking for available dates...\n                        </p>\n                    ",
          icon: "success",
          confirmButtonText: "Start Monitoring!",
          timer: 6000,
          allowOutsideClick: false
        });
        isSettingsRefreshInProgress = false;
      }
      return r.value;
    } else {
      isSettingsRefreshInProgress = false;
    }
  }
  return f;
}
async function startPollingForContext(a, b) {
  const c = await resumePendingDateSelectionIfNeeded();
  if (c) {
    return;
  }
  if (!isSchedulerActive) {
    return;
  }
  if (isPollingStartInProgress) {
    return;
  }
  try {
    isPollingStartInProgress = true;
    await startDatePolling(a, b);
  } catch (d) {
    if (isSchedulerActive) {
      const e = await getPollingFrequencyMs();
      setTimeout(() => startPollingForContext(a, b), e);
    }
  } finally {
    isPollingStartInProgress = false;
  }
}
async function checkOfcScheduleDays(a, b) {
  if (!isSchedulerActive) {
    return;
  }
  try {
    const c = await getCachedUserSettings();
    if (!c.startDate || !c.endDate) {
      await Swal.fire({
        title: "Date Range Required",
        html: "\n                    <p>Please add <strong>Start Date</strong> and <strong>End Date</strong> in the extension popup to continue using the bot.</p>\n                    <p>The bot needs a date range to search for available appointments.</p>\n                ",
        icon: "warning",
        confirmButtonText: "OK, I'll Set the Dates",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }
    let d = [a.primaryId];
    try {
      const m = await chrome.storage.local.get(["applications"]);
      if (m.applications && Array.isArray(m.applications) && m.applications.length > 0) {
        d = m.applications;
      } else {}
    } catch (n) {}
    const f = new URLSearchParams();
    f.append("parameters", JSON.stringify({
      primaryId: a.primaryId,
      applications: d,
      scheduleDayId: "",
      scheduleEntryId: "",
      postId: a.postId,
      isReschedule: window.location.href.includes("reschedule=true") ? "true" : "false"
    }));
    const g = Date.now();
    const h = "https://www.usvisascheduling.com/en-US/custom-actions/?route=/api/v1/schedule-group/get-family-ofc-schedule-days&appd=" + a.contactId + "&cacheString=" + g;
    const j = await schedulingJitteredApiFetch(h, {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        cookie: b.getCookieHeader()
      },
      body: f.toString(),
      credentials: "include"
    });
    if (!j.ok) {
      throw new Error("HTTP error! status: " + j.status);
    }
    let k;
    try {
      const o = await j.text();
      k = JSON.parse(o);
    } catch (p) {
      await logSchedulerMessage("JSON parse error occurred: " + p.message + ". Refreshing the page.");
      await showSchedulerToast("\n                <span style=\"color: orange\">Invalid response detected</span><br>\n                <span style=\"color: white\">Refreshing the page to recover...</span>\n            ", 3000);
      setTimeout(() => {
        window.location.reload();
      }, 3500);
      throw new Error("Invalid JSON response: " + p.message);
    }
    const l = {
      ...k
    };
    l.Token &&= "[Token length: " + l.Token.length + " chars]";
    if (k.ScheduleDays && k.ScheduleDays.length > 0) {
      const q = k.ScheduleDays.sort((s, t) => new Date(s.Date) - new Date(t.Date));
      if (q.length > 0) {
        const s = q[0].Date;
        let t;
        if (s.includes("T")) {
          const [B] = s.split("T");
          const [C, D, E] = B.split("-").map(Number);
          t = new Date(C, D - 1, E);
        } else {
          const [F, G, H] = s.split("-").map(Number);
          t = new Date(F, G - 1, H);
        }
        const u = t.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const v = c.startDate.split("-").map(Number);
        const w = c.endDate.split("-").map(Number);
        const x = new Date(v[0], v[1] - 1, v[2]);
        const y = new Date(w[0], w[1] - 1, w[2]);
        const z = t >= x && t <= y;
        const A = q.filter(I => {
          const J = I.Date;
          let K;
          if (J.includes("T")) {
            const [L] = J.split("T");
            const [M, N, O] = L.split("-").map(Number);
            K = new Date(M, N - 1, O);
          } else {
            const [P, Q, R] = J.split("-").map(Number);
            K = new Date(P, Q - 1, R);
          }
          return K >= x && K <= y;
        });
        if (A.length > 0) {
          const I = A.slice(0, 5).map(K => {
            const L = K.Date;
            let M;
            if (L.includes("T")) {
              const [N] = L.split("T");
              const [O, P, Q] = N.split("-").map(Number);
              M = new Date(O, P - 1, Q);
            } else {
              const [R, S, T] = L.split("-").map(Number);
              M = new Date(R, S - 1, T);
            }
            return M.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
          }).join(", ");
          const J = z ? "EARLIEST IN RANGE" : "EARLIEST OUT OF RANGE";
          await logSchedulerMessage("OFC  - City: " + a.cityName + " - Earliest available date: " + u + " (" + J + ") - First 5 dates within range: " + I + " (" + A.length + " dates within range, " + q.length + " total dates available)");
        } else {
          await logSchedulerMessage("OFC  - City: " + a.cityName + " - Earliest available date: " + u + " (" + q.length + " dates available, NONE within preferred range)");
        }
      }
      let r = false;
      for (const K of q) {
        const L = K.Date;
        let M;
        if (L.includes("T")) {
          const [U] = L.split("T");
          const [V, W, X] = U.split("-").map(Number);
          M = new Date(V, W - 1, X);
        } else {
          const [Y, Z, a0] = L.split("-").map(Number);
          M = new Date(Y, Z - 1, a0);
        }
        const N = K.ID;
        const O = M.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const P = c.startDate.split("-").map(Number);
        const Q = c.endDate.split("-").map(Number);
        const R = new Date(P[0], P[1] - 1, P[2]);
        const S = new Date(Q[0], Q[1] - 1, Q[2]);
        const T = M >= R && M <= S;
        if (T) {
          r = true;
          isDatePollingActive = false;
          const a1 = document.getElementById("post_select");
          if (a1) {
            for (let a8 = 0; a8 < a1.options.length; a8++) {
              if (a1.options[a8].value === a.postId) {
                a1.selectedIndex = a8;
                const a9 = new Event("change", {
                  bubbles: true
                });
                await schedulingDispatchEvent(a1, a9);
                break;
              }
            }
          } else {}
          let a2 = false;
          let a3 = 0;
          const a4 = 10;
          while (!a2 && a3 < a4) {
            await new Promise(ac => setTimeout(ac, 500));
            const aa = document.querySelector(".ui-datepicker-month");
            const ab = document.querySelector(".ui-datepicker-year");
            if (aa && ab) {
              a2 = true;
            } else {
              a3++;
            }
          }
          if (!a2) {
            await logSchedulerMessage("Failed to load calendar for city: " + a.cityName);
            return;
          }
          const a5 = await selectCalendarDate(M);
          const a6 = window.location.pathname.includes("/ofc-schedule");
          const a7 = await selectTimeSlot(a6);
          if (a6 && a7) {
            await startOfcTimer();
            await showSchedulerToast("\n                            <span style=\"color: green\">✅ OFC Appointment Booked!</span><br>\n                            <span style=\"color: white\">30-minute timer started for consular search</span><br>\n                            <span style=\"color: yellow;\">Website will redirect to consular page automatically</span>\n                        ", 6000);
          }
          break;
        }
      }
      if (!r) {
        const ac = q[0].Date;
        let ad;
        if (ac.includes("T")) {
          const [af] = ac.split("T");
          const [ag, ah, ai] = af.split("-").map(Number);
          ad = new Date(ag, ah - 1, ai);
        } else {
          const [aj, ak, al] = ac.split("-").map(Number);
          ad = new Date(aj, ak - 1, al);
        }
        const ae = ad.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        await showSchedulerToast("\n          <span style=\"color: white\">Checking OFC dates</span><br>\n          <span style=\"color: lightgreen;\">City: " + a.cityName + "</span><br>\n          <span style=\"color: lightgreen;\">Earliest availability: " + ae + "</span><br>\n          <span style=\"color: yellow;\">Preferred range: " + formatDateRange(c.startDate, c.endDate) + "</span><br>\n          <span style=\"color: white\">No dates found within preferred range</span><br>\n          <span style=\"color: yellow;\">Checked @ " + new Date().toLocaleString() + "</span>\n        ");
      }
    } else {
      await logSchedulerMessage("OFC  - City: " + a.cityName + " - No available dates found");
      await showSchedulerToast("\n                <span style=\"color: white\">No OFC dates available</span><br>\n                <span style=\"color: lightgreen;\">City: " + a.cityName + "</span><br>\n                <span style=\"color: yellow;\">Preferred range: " + formatDateRange(c.startDate, c.endDate) + "</span><br>\n                <span style=\"color: yellow;\">Checked @ " + new Date().toLocaleString() + "</span>\n            ");
    }
  } catch (am) {
    await logSchedulerMessage("OFC  - City: " + (a.cityName || "Unknown") + " - Error: " + am.message);
    if (am.message && (am.message.includes("429") || am.message.includes("rate limit") || am.message.includes("too many requests"))) {
      await Swal.fire({
        title: "🚦 Consulate sent Error 429",
        html: "\n                    <div style=\"text-align: center; padding: 20px;\">\n                        <h3 style=\"color: #ff6b35; margin-bottom: 20px;\">⚠️ Server Rate Limit Detected</h3>\n                        <p style=\"margin-bottom: 15px;\">The server is receiving too many requests and has temporarily blocked further requests.</p>\n                        <p style=\"margin-bottom: 15px;\"><strong>Please turn off the bot for a few hours</strong> to allow the rate limit to reset.</p>\n                        <p style=\"color: #666; font-size: 14px; margin-bottom: 20px;\">This helps prevent your account from being temporarily suspended.</p>\n                        <div style=\"background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;\">\n                            <p style=\"margin: 0; color: #495057;\"><strong>💡 Recommended Action:</strong></p>\n                            <p style=\"margin: 5px 0 0 0; color: #495057;\">Wait 2-4 hours before reactivating the bot</p>\n                        </div>\n                    </div>\n                ",
        icon: "warning",
        confirmButtonText: "I'll Turn Off the Bot",
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: "swal-wide"
        }
      });
      isDatePollingActive = false;
      cleanupSchedulerState();
      return;
    }
    let an = "Unknown";
    try {
      if (storageData && storageData.startDate && storageData.endDate) {
        an = formatDateRange(storageData.startDate, storageData.endDate);
      }
    } catch (ao) {}
    await showSchedulerToast("\n            <span style=\"color: red\">Error checking OFC dates: " + am.message + "</span><br>\n            <span style=\"color: lightgreen;\">City: " + (a.cityName || "Unknown") + "</span><br>\n            <span style=\"color: yellow;\">Preferred range: " + an + "</span><br>\n            <span style=\"color: yellow;\">Checked @ " + new Date().toLocaleString() + "</span>\n        ");
    setTimeout(() => {
      window.location.href = "https://www.usvisascheduling.com/en-US/";
    }, 3000);
  }
}
async function loadUserSchedulingSettings() {
  try {
    const {
      profiles = {},
      currentProfile = "default",
      selectedOfcCities = {},
      selectedConsularCities = {},
      allCities = {},
      startDate: a,
      endDate: b
    } = await chrome.storage.sync.get(["profiles", "currentProfile", "selectedOfcCities", "selectedConsularCities", "allCities", "startDate", "endDate"]);
    const c = profiles[currentProfile] || {};
    const d = {
      username: c.username || "",
      password: c.password || "",
      apiKey: c.apiKey || "",
      question1: c.question1 || "",
      answer1: c.answer1 || "",
      question2: c.question2 || "",
      answer2: c.answer2 || "",
      question3: c.question3 || "",
      answer3: c.answer3 || "",
      startDate: a || "",
      endDate: b || "",
      selectedOfcCities: selectedOfcCities || {},
      selectedConsularCities: selectedConsularCities || {},
      allCities: allCities || {},
      currentProfile: currentProfile,
      hasRequiredData() {
        const e = Object.keys(this.selectedOfcCities).length > 0;
        const f = Object.keys(this.selectedConsularCities).length > 0;
        const g = e || f;
        const h = this.startDate && this.endDate;
        const i = this.username && this.password;
        return h && g;
      },
      getSelectedCitiesData(e = "auto") {
        let f = {};
        if (e === "ofc") {
          f = this.selectedOfcCities;
        } else if (e === "consular") {
          f = this.selectedConsularCities;
        } else {
          const g = window.location.pathname;
          if (g.includes("/ofc-schedule")) {
            f = this.selectedOfcCities;
          } else if (g.includes("/schedule")) {
            f = this.selectedConsularCities;
          } else {
            f = {
              ...this.selectedOfcCities,
              ...this.selectedConsularCities
            };
          }
        }
        return Object.entries(f).map(([h, i]) => ({
          id: h,
          name: i,
          postId: h,
          cityName: i
        }));
      }
    };
    return d;
  } catch (e) {
    throw new Error("Failed to get storage data: " + e.message);
  }
}
function hasRequiredSchedulingSettings(a) {
  try {
    if (!a) {
      return false;
    }
    if (!a.startDate || !a.endDate) {
      return false;
    }
    if (Object.keys(a.selectedOfcCities || {}).length === 0 && Object.keys(a.selectedConsularCities || {}).length === 0) {
      return false;
    }
    return true;
  } catch (b) {
    return false;
  }
}
async function getStoredSchedulingContext() {
  try {
    const a = await extractSchedulingContext();
    if (a && (a.contactId || a.primaryId)) {
      return a;
    }
    const b = await chrome.storage.local.get(["contactId", "primaryId", "postId"]);
    if (b.contactId && b.primaryId) {
      return {
        contactId: b.contactId,
        primaryId: b.primaryId,
        postId: b.postId
      };
    }
    const c = document.querySelector("[data-application-id]")?.dataset.primaryId || document.querySelector("[data-primary-id]")?.dataset.primaryId || document.querySelector("input[name=\"primaryId\"]")?.value;
    const d = document.querySelector("[data-contact-id]")?.dataset.contactId || document.querySelector("[data-appd]")?.dataset.appd || document.querySelector("input[name=\"contactId\"]")?.value;
    const e = document.querySelector("[data-post-id]")?.dataset.postId || document.querySelector("select#post_select")?.value;
    if (c || d) {
      const f = {
        primaryId: c,
        contactId: d,
        postId: e
      };
      if (c && d) {
        await chrome.storage.local.set(f);
      }
      return f;
    }
    return null;
  } catch (g) {
    return null;
  }
}
const schedulerPort = chrome.runtime.connect({
  name: "scheduler"
});
if (schedulerPort.onConnect) {
  schedulerPort.onConnect.addListener(function () {});
}
if (schedulerPort.onDisconnect) {
  schedulerPort.onDisconnect.addListener(function () {
    setTimeout(() => {
      try {
        const a = chrome.runtime.connect({
          name: "scheduler_reconnect"
        });
      } catch (b) {}
    }, 5000);
  });
}
function stopSchedulerAutomation() {
  cleanupSchedulerState();
}
schedulerPort.onMessage.addListener(async function (a) {
  if (a.action == "fetch_info") {
    let b = a.data.$active;
    isSchedulerActive = b;
    if (b) {
      if (window.location.href.includes("/appointment-confirmation/")) {
        runSchedulerPageAutomation();
      } else if (await resumePendingDateSelectionIfNeeded()) {} else {
        runSchedulerPageAutomation();
      }
    } else {
      stopSchedulerAutomation();
    }
  } else if (a.action == "activate") {
    let c = a.status;
    isSchedulerActive = c;
    if (c) {
      runSchedulerPageAutomation();
    } else {
      stopSchedulerAutomation();
    }
  }
});
schedulerPort.postMessage({
  action: "fetch_info"
});
setInterval(() => {}, 30000);
async function sendPushoverNotification(a, b, c, d, e, f = null) {
  if (!a) {
    return {
      skipped: true
    };
  }
  try {
    let g = "🎉 US Visa Appointment Confirmed!\n\n";
    g += "📧 Account: " + c + "\n";
    g += "📅 Date: " + e + "\n";
    g += "🌍 Location: " + d + "\n";
    if (f) {
      g += "⏰ Time: " + f + "\n";
    }
    if (b?.primaryApplicantDetails?.appointmentMadeBy) {
      const l = b.primaryApplicantDetails.appointmentMadeBy.replace(/\s+/g, " ").trim();
      g += "👤 Applicant: " + l + "\n";
    }
    if (b?.consularAppointmentDetails?.[0]?.appointmentDate) {
      g += "📅 Appointment: " + b.consularAppointmentDetails[0].appointmentDate + "\n";
    }
    g += "\nCheck your email for complete details!";
    const h = "ad8sf5aokfr2nhrmr4zoom7g4or92i";
    const i = {
      token: h,
      user: a,
      message: g,
      title: "🎉 Visa Appointment Confirmed!",
      priority: 1,
      url: "https://www.usvisascheduling.com",
      url_title: "Check Your Appointment"
    };
    const j = await schedulingJitteredApiFetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(i)
    });
    const k = await j.json();
    if (j.ok && k.status === 1) {
      await logSchedulerMessage("Pushover notification sent successfully");
      return {
        success: true,
        result: k
      };
    } else {
      await logSchedulerMessage("Pushover notification failed: " + (k.errors ? k.errors.join(", ") : "Unknown error"));
      return {
        success: false,
        error: k.errors || "Unknown error"
      };
    }
  } catch (m) {
    await logSchedulerMessage("Error sending Pushover notification: " + m.message);
    return {
      success: false,
      error: m.message
    };
  }
}
async function cacheAuthenticatedUserEmail() {
  try {
    const a = document.querySelectorAll("span.text-bold");
    for (const b of a) {
      if (b.textContent.trim() === "Visa Information") {
        const c = b.closest("div");
        if (c) {
          const d = c.querySelector("p");
          if (d) {
            const e = d.textContent.trim();
            const f = e.match(/([A-Z]\d+(?:\/[A-Z]\d+)*)/);
            if (f) {
              const g = f[1];
              await chrome.storage.sync.set({
                scrapedVisaType: g,
                visaTypeScrapedAt: new Date().toISOString()
              });
              return g;
            } else {}
          }
        }
        break;
      }
    }
    return null;
  } catch (h) {
    return null;
  }
}
async function readAppointmentConfirmationDetails() {
  await logSchedulerMessage("Starting to scrape appointment confirmation details");
  try {
    const a = {
      primaryApplicantDetails: {},
      consularAppointmentDetails: []
    };
    const b = [...document.querySelectorAll("h2")].find(d => d.textContent.includes("PRIMARY APPLICANT DETAILS"));
    if (b) {
      let d = b.nextElementSibling;
      let e = null;
      while (d && !e) {
        if (d.tagName === "TABLE") {
          e = d;
        } else if (d.tagName === "DIV") {
          e = d.querySelector("table");
        }
        if (!e) {
          d = d.nextElementSibling;
        }
      }
      if (e) {
        const f = e.querySelectorAll("tr");
        f.forEach(g => {
          const h = g.querySelectorAll("td");
          if (h.length >= 2) {
            const i = h[0].textContent.trim().replace(":", "");
            const j = h[1].textContent.trim();
            if (i.includes("Appointment(s) Made By")) {
              a.primaryApplicantDetails.appointmentMadeBy = j;
            } else if (i.includes("Number of Applicants")) {
              a.primaryApplicantDetails.numberOfApplicants = j;
            } else if (i.includes("Visa Class")) {
              a.primaryApplicantDetails.visaClass = j;
            }
          }
        });
      } else {}
    } else {}
    const c = [...document.querySelectorAll("h2")].find(g => g.textContent.includes("CONSULAR APPOINTMENT DETAILS"));
    if (c) {
      let g = c.nextElementSibling;
      let h = 0;
      while (g) {
        if (g.tagName === "H2") {
          break;
        }
        if (g.tagName === "DIV") {
          const i = g.querySelectorAll("table");
          i.forEach((j, k) => {
            const l = {};
            const m = j.querySelectorAll("tr");
            m.forEach(n => {
              const o = n.querySelectorAll("td");
              if (o.length >= 2) {
                const p = o[0].textContent.trim().replace(":", "");
                const q = o[1].textContent.trim();
                if (p.includes("Consular Appointment Number")) {
                  l.appointmentNumber = q;
                  h = parseInt(q) || h + 1;
                } else if (p.includes("Applicant Name")) {
                  l.applicantName = q;
                } else if (p.includes("City, Postal Code")) {
                  l.cityPostalCode = q;
                } else if (p.includes("Consular Appointment Date")) {
                  l.appointmentDate = q;
                }
              }
            });
            if (l.appointmentDate || l.applicantName) {
              a.consularAppointmentDetails.push(l);
            } else {}
          });
        }
        g = g.nextElementSibling;
      }
    } else {}
    await logSchedulerMessage("Scraped confirmation details: " + (a.primaryApplicantDetails.numberOfApplicants || "Unknown") + " applicants");
    return a;
  } catch (j) {
    await logSchedulerMessage("Error scraping confirmation details: " + j.message);
    return null;
  }
}
async function loadApplicationsFromPage() {
  await logSchedulerMessage("Starting appointment confirmation handling");
  try {
    if (window.location.href.includes("/appointment-confirmation/")) {
      await logSchedulerMessage("Already on appointment confirmation page - appointment confirmed successfully");
      const b = await readAppointmentConfirmationDetails();
      await chrome.storage.local.remove("bookingInProgress");
      await logSchedulerMessage("Stopping all bot operations - appointment confirmed");
      isDatePollingActive = false;
      isBookingInProgress = false;
      cleanupSchedulerState();
      return;
    }
    await logSchedulerMessage("Waiting for appointment confirmation redirect to: https://www.usvisascheduling.com/en-US/appointment-confirmation/");
    let a = setInterval(async () => {
      if (!isBookingInProgress) {
        clearInterval(a);
        return;
      }
      if (window.location.href.includes("/appointment-confirmation/")) {
        await logSchedulerMessage("Redirected to appointment confirmation page - appointment confirmed successfully");
        clearInterval(a);
        const c = await readAppointmentConfirmationDetails();
        await chrome.storage.local.remove("bookingInProgress");
        await logSchedulerMessage("Stopping all bot operations - appointment confirmed");
        isDatePollingActive = false;
        isBookingInProgress = false;
        cleanupSchedulerState();
      }
    }, 1000);
    setTimeout(async () => {
      if (isBookingInProgress) {
        await logSchedulerMessage("Appointment confirmation timeout - proceeding with notification");
        clearInterval(a);
        const c = await readAppointmentConfirmationDetails();
        await chrome.storage.local.remove("bookingInProgress");
        await logSchedulerMessage("Stopping all bot operations - appointment processed (timeout)");
        isDatePollingActive = false;
        isBookingInProgress = false;
        cleanupSchedulerState();
      }
    }, 15000);
  } catch (c) {
    await logSchedulerMessage("Error in appointment confirmation handling: " + c.message);
    await chrome.storage.local.remove("bookingInProgress");
    isDatePollingActive = false;
    isBookingInProgress = false;
    cleanupSchedulerState();
  }
}
async function fetchAppointmentDetails(a, b, c) {
  try {
    const d = window.location.href;
    let e = "";
    if (d.includes("/ofc-schedule")) {
      if (d.includes("reschedule=true")) {
        e = "/api/v1/schedule-group/query-family-members-ofc-reschedule";
      } else {
        e = "/api/v1/schedule-group/query-family-members-ofc";
      }
    } else if (d.includes("/schedule")) {
      if (d.includes("reschedule=true")) {
        e = "/api/v1/schedule-group/query-family-members-consular-reschedule";
      } else {
        e = "/api/v1/schedule-group/query-family-members-consular";
      }
    } else {
      e = "/api/v1/schedule-group/query-family-members-ofc-reschedule";
    }
    const f = Date.now();
    const g = "https://www.usvisascheduling.com/en-US/custom-actions/?route=" + e + "&appd=" + b + "&cacheString=" + f;
    const h = new URLSearchParams();
    h.append("parameters", JSON.stringify({
      primaryId: a,
      visaClass: "all"
    }));
    const i = {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      cookie: c ? c.getCookieHeader() : document.cookie
    };
    const j = await schedulingJitteredApiFetch(g, {
      method: "POST",
      headers: i,
      body: h
    });
    if (!j.ok) {
      throw new Error("Failed to fetch family members: " + j.status + " " + j.statusText);
    }
    const k = await j.json();
    if (k.HasError) {
      throw new Error("API error: " + (k.LocalizedGenericErrorMessage || "Unknown error"));
    }
    if (!k.Members || !Array.isArray(k.Members)) {
      console.warn("No members found or invalid response format");
      return [{
        ApplicationID: a,
        FullName: "Primary Applicant",
        VisaClassName: "Unknown"
      }];
    }
    const l = k.Members.map(n => n.ApplicationID);
    const m = {};
    k.Members.forEach(n => {
      m[n.ApplicationID] = n.VisaClassName;
    });
    await chrome.storage.local.set({
      applications: l,
      visaClassNames: m
    });
    return k.Members;
  } catch (n) {
    return [{
      ApplicationID: a,
      FullName: "Primary Applicant",
      VisaClassName: "Unknown"
    }];
  }
}
let cacheCleanupIntervalId = null;
function updateActionButtons() {
  if (cacheCleanupIntervalId) {
    return;
  }
  cacheCleanupIntervalId = scheduleTrackedInterval(() => {
    const a = Date.now();
    for (const [b, c] of apiResponseCache.entries()) {
      if (a - c.timestamp > API_RESPONSE_CACHE_TTL_MS * 2) {
        apiResponseCache.delete(b);
      }
    }
    if (cachedUserSettingsAt && a - cachedUserSettingsAt > USER_SETTINGS_CACHE_TTL_MS * 2) {
      cachedUserSettings = null;
      cachedUserSettingsAt = 0;
    }
  }, 60000);
}
updateActionButtons();
if (chrome.runtime && chrome.runtime.onSuspend) {
  chrome.runtime.onSuspend.addListener(() => {
    cleanupSchedulerState();
    apiResponseCache.clear();
    cachedUserSettings = null;
  });
}
