const a0a = 0x2, a0b = 0x4, a0c = 0x11, a0d = 0x4535, a0e = 0x82c8, a0f = 0x8821, a0g = {
        '3f6bf614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'CHENNAI\x20VAC',
            'topicId': a0a
        },
        '436bf614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'HYDERABAD\x20VAC',
            'topicId': a0a
        },
        '466bf614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'KOLKATA\x20VAC',
            'topicId': a0a
        },
        '486bf614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'MUMBAI\x20VAC',
            'topicId': a0a
        },
        '4a6bf614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'NEW\x20DELHI\x20VAC',
            'topicId': a0a
        },
        'c86af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'CHENNAI',
            'topicId': a0a
        },
        'ae6af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'HYDERABAD',
            'topicId': a0a
        },
        '816af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'KOLKATA',
            'topicId': a0a
        },
        '716af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'MUMBAI',
            'topicId': a0a
        },
        'e66af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'NEW\x20DELHI',
            'topicId': a0a
        },
        'b06af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'ISLAMABAD',
            'topicId': a0b
        },
        'be6af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'KARACHI',
            'topicId': a0b
        },
        '906af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'DHAKA',
            'topicId': a0c
        },
        '566af614-b0db-ec11-a7b4-001dd80234f6': {
            'location': 'ALGERIA',
            'topicId': a0d
        },
        '962fd063-ccb5-ef11-b8e9-001dd80637a9': {
            'location': 'DUBAI',
            'topicId': a0e
        },
        '5eb31865-cbb5-ef11-b8e9-001dd80637a9': {
            'location': 'Ankara',
            'topicId': a0f
        },
        '84cf7716-ccb5-ef11-b8e9-001dd80637a9': {
            'location': 'Istanbul',
            'topicId': a0f
        }
    };
function a0h(a) {
    const b = a0g[a];
    return b ? b['location'] : 'undefined';
}
let a0n = ![], a0o = ![], a0p = ![], a0q = 0x0, a0r = ![], a0s = null, a0t = null, a0u = ![], a0v = ![], a0w = 0x0, a0x = ![], a0y = ![], a0z = null, a0A = null;
const a0B = 0x2d * 0x3c * 0x3e8;
let a0C = new Set(), a0D = new Set(), a0E = new Set();
function a0F(a, b) {
    const c = setTimeout(() => {
        a0C['delete'](c), a();
    }, b);
    return a0C['add'](c), c;
}
function a0G(a, b) {
    const c = setInterval(a, b);
    return a0D['add'](c), c;
}
function a0H() {
    a0C['forEach'](a => clearTimeout(a)), a0C['clear'](), a0D['forEach'](a => clearInterval(a)), a0D['clear'](), a0E['forEach'](a => {
        try {
            a['disconnect']();
        } catch (b) {
            console['warn']('Error\x20disconnecting\x20observer:', b);
        }
    }), a0E['clear'](), a0z && (clearInterval(a0z), a0z = null), a0A && (a0A['remove'](), a0A = null), a0r = ![], a0p = ![], a0o = ![], a0x = ![], a0w++;
}
window['addEventListener']('beforeunload', a0H), window['addEventListener']('unload', a0H);
async function a0I() {
    const a = Date['now']();
    try {
        await chrome['storage']['local']['set']({
            'ofcTimerStartTime': a,
            'ofcTimerActive': !![]
        });
    } catch (b) {
        return;
    }
    a0L(), a0z && clearInterval(a0z), a0z = setInterval(async () => {
        await a0M();
    }, 0x3e8);
}
async function a0J() {
    a0z && (clearInterval(a0z), a0z = null), a0A && (a0A['remove'](), a0A = null), await chrome['storage']['local']['remove']([
        'ofcTimerStartTime',
        'ofcTimerActive'
    ]);
}
async function a0K() {
    try {
        const {
            ofcTimerStartTime: a,
            ofcTimerActive: b
        } = await chrome['storage']['local']['get']([
            'ofcTimerStartTime',
            'ofcTimerActive'
        ]);
        if (!b || !a)
            return { 'active': ![] };
        const c = Date['now'](), d = c - a, e = a0B - d;
        if (e <= 0x0)
            return await a0J(), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20orange\x22>⏰\x20OFC\x20Timer\x20Expired</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>30\x20minutes\x20have\x20passed\x20without\x20finding\x20a\x20consular\x20date</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Redirecting\x20to\x20home\x20page\x20to\x20restart...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388), setTimeout(() => {
                window['location']['href'] = 'https://www.usvisascheduling.com/en-US/';
            }, 0xbb8), {
                'active': ![],
                'expired': !![]
            };
        return {
            'active': !![],
            'remainingTime': e,
            'startTime': a
        };
    } catch (f) {
        return { 'active': ![] };
    }
}
function a0L() {
    a0A && a0A['remove']();
    a0A = document['createElement']('div'), a0A['id'] = 'ofc-timer-display', a0A['style']['cssText'] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20fixed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20bottom:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20right:\x2020px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background:\x20linear-gradient(135deg,\x20#FF6B35,\x20#F7931E);\x0a\x20\x20\x20\x20\x20\x20\x20\x20color:\x20white;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x2012px\x2016px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x208px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-family:\x20\x27Arial\x27,\x20sans-serif;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-size:\x2014px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-weight:\x20bold;\x0a\x20\x20\x20\x20\x20\x20\x20\x20box-shadow:\x200\x204px\x2012px\x20rgba(0,0,0,0.3);\x0a\x20\x20\x20\x20\x20\x20\x20\x20z-index:\x2010000;\x0a\x20\x20\x20\x20\x20\x20\x20\x20border:\x202px\x20solid\x20#FFF;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20min-width:\x20180px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20animation:\x20pulse\x202s\x20infinite;\x0a\x20\x20\x20\x20';
    const a = document['createElement']('style');
    a['textContent'] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20@keyframes\x20pulse\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x200%\x20{\x20transform:\x20scale(1);\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2050%\x20{\x20transform:\x20scale(1.05);\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20100%\x20{\x20transform:\x20scale(1);\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20', document['head']['appendChild'](a), a0A['innerHTML'] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22margin-bottom:\x204px;\x22>🕐\x20OFC\x20Timer</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20id=\x22timer-countdown\x22\x20style=\x22font-size:\x2016px;\x22>30:00</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22font-size:\x2011px;\x20margin-top:\x202px;\x22>Searching\x20for\x20consular\x20dates...</div>\x0a\x20\x20\x20\x20', document['body']['appendChild'](a0A);
}
async function a0M() {
    const a = await a0K();
    if (!a['active'] || a['expired'])
        return;
    if (a0A) {
        const b = Math['floor'](a['remainingTime'] / 0xea60), c = Math['floor'](a['remainingTime'] % 0xea60 / 0x3e8), d = a0A['querySelector']('#timer-countdown');
        if (d) {
            d['textContent'] = b['toString']()['padStart'](0x2, '0') + ':' + c['toString']()['padStart'](0x2, '0');
            if (a['remainingTime'] < 0x5 * 0x3c * 0x3e8)
                a0A['style']['background'] = 'linear-gradient(135deg,\x20#FF4444,\x20#CC0000)';
            else
                a['remainingTime'] < 0xa * 0x3c * 0x3e8 && (a0A['style']['background'] = 'linear-gradient(135deg,\x20#FF8C00,\x20#FF6B35)');
        }
    }
}
async function a0N() {
    const a = await a0K();
    if (a['active'] && !a['expired']) {
        const b = window['location']['pathname']['includes']('/schedule') && !window['location']['pathname']['includes']('/ofc-schedule');
        b && a0u && (a0L(), a0z && clearInterval(a0z), a0z = setInterval(async () => {
            await a0M();
        }, 0x3e8));
    }
}
async function a0O() {
    if (a0n)
        return !![];
    if (window['location']['href']['includes']('/appointment-confirmation/'))
        return await chrome['storage']['local']['set']({
            'dateSelectionInProgress': ![],
            'preferredDateString': null,
            'preferredDateId': null
        }), !![];
    const {
        dateSelectionInProgress: a,
        preferredDateString: b,
        preferredDateId: c
    } = await chrome['storage']['local']['get']([
        'dateSelectionInProgress',
        'preferredDateString',
        'preferredDateId'
    ]);
    if (a === !![]) {
        let d = a0s, e = a0t;
        !d && b && (d = new Date(b));
        !e && c && (e = c);
        if (d) {
            const f = await a0aa(d);
            if (f) {
                const g = window['location']['pathname']['includes']('/ofc-schedule'), h = await a0ad(g);
                if (h) {
                } else {
                }
            }
            await chrome['storage']['local']['set']({
                'dateSelectionInProgress': ![],
                'preferredDateString': null,
                'preferredDateId': null
            });
        } else
            await chrome['storage']['local']['set']({
                'dateSelectionInProgress': ![],
                'preferredDateString': null,
                'preferredDateId': null
            });
        return !![];
    }
    return ![];
}
if (!document['querySelector']('#extension-styles')) {
    const a0av = document['createElement']('style');
    a0av['id'] = 'extension-styles', a0av['textContent'] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20.swal2-modal\x20:is(h2,\x20p){color:\x20initial;\x20margin:\x200;line-height:\x201.25;}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.swal2-modal\x20p+p{margin-top:\x201rem;}\x0a\x20\x20\x20\x20\x20\x20\x20\x20#consulate_date_time,#asc_date_time{display:block!important;}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.swal2-select{width:auto!important;}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.swal2-timer-progress-bar{background:rgba(255,255,255,0.6)!important;}\x0a\x20\x20\x20\x20\x20\x20\x20\x20.swal2-toast.swal2-show{background:rgba(0,0,0,0.75)!important;}\x0a\x20\x20\x20\x20', document['head']['appendChild'](a0av);
}
async function a0P() {
    if (await a0O())
        return;
    try {
        const {__ap: a} = await chrome['storage']['local']['get']('__ap');
        a0u = a || ![];
    } catch (b) {
        a0u = ![];
    }
}
!window['schedulingPageInitialized'] && (window['schedulingPageInitialized'] = !![], document['addEventListener']('DOMContentLoaded', async () => {
    await a0P(), window['location']['href']['match'](/usvisascheduling\.com\/en-US\/?$/) && setTimeout(async () => {
        await a0ao(), await a0a7();
    }, 0x7d0), setTimeout(async () => {
        await a0N();
    }, 0x3e8);
}), window['addEventListener']('load', () => {
    window['location']['href']['match'](/usvisascheduling\.com\/en-US\/?$/) && setTimeout(async () => {
        await a0ao(), await a0a7();
    }, 0xbb8), setTimeout(async () => {
        await a0N();
    }, 0x7d0);
}));
async function a0Q() {
    const a = await a0O();
    if (window['location']['href']['includes']('/appointment-confirmation/')) {
        await chrome['storage']['local']['set']({
            'dateSelectionInProgress': ![],
            'preferredDateString': null,
            'preferredDateId': null
        });
        const b = await a0ap(), {bookingInProgress: c} = await chrome['storage']['local']['get']('bookingInProgress');
        if (c) {
            await chrome['storage']['local']['remove']('bookingInProgress');
            try {
                const {pushoverUserKey: d} = await chrome['storage']['sync']['get']('pushoverUserKey');
                if (d && d['trim']() !== '') {
                    let e = 'unknown@example.com', f = 'unknown', g = 'UNKNOWN';
                    try {
                        const k = [...document['querySelectorAll']('script')]['map'](l => l['innerText'] || l['textContent'])['join']('\x0a')['match'](/setAuthenticatedUserContext\(['"]([^'"]+)['"]\)/)?.[0x1];
                        k && (e = k);
                    } catch (l) {
                    }
                    try {
                        const {username: m} = await chrome['storage']['sync']['get']('username');
                        m && (f = m);
                    } catch (n) {
                    }
                    try {
                        if (b?.['consularAppointmentDetails']?.[0x0]?.['cityPostalCode']) {
                            const o = b['consularAppointmentDetails'][0x0]['cityPostalCode']['replace'](',', '')['trim']();
                            g = o;
                        }
                        if (g === 'UNKNOWN') {
                            const {preferredLocation: p} = await chrome['storage']['local']['get']('preferredLocation');
                            if (p && p['postId']) {
                                const q = a0g[p['postId']];
                                q && (g = q['location']);
                            }
                        }
                        if (g === 'UNKNOWN') {
                            const r = document['getElementById']('post_select');
                            if (r && r['selectedIndex'] >= 0x0) {
                                const s = r['options'][r['selectedIndex']];
                                if (s && s['value']) {
                                    const t = a0g[s['value']];
                                    t ? g = t['location'] : g = s['text'] || 'UNKNOWN';
                                }
                            }
                        }
                        if (g === 'UNKNOWN') {
                        }
                    } catch (u) {
                        g = 'UNKNOWN';
                    }
                    const h = f !== 'unknown' ? f + '_' + e : e;
                    let i = null, j = ![];
                    try {
                        if (b?.['consularAppointmentDetails']?.[0x0]?.['appointmentDate']) {
                            const v = b['consularAppointmentDetails'][0x0]['appointmentDate'], w = new Date(v);
                            if (!isNaN(w['getTime']()))
                                i = w['toISOString']()['split']('T')[0x0], j = !![];
                            else {
                            }
                        } else {
                        }
                    } catch (x) {
                    }
                    if (!j) {
                        await a0a9('Skipping\x20notifications\x20-\x20no\x20valid\x20appointment\x20date\x20found\x20on\x20confirmation\x20page');
                        return;
                    }
                    g === 'UNKNOWN' && (console['warn']('⚠️\x20Sending\x20notifications\x20with\x20UNKNOWN\x20city\x20-\x20consider\x20improving\x20city\x20detection'), await a0a9('Warning:\x20Sending\x20notifications\x20with\x20UNKNOWN\x20city'));
                    await a0an(d, b, h, g, i);
                }
            } catch (G) {
                await a0a9('Error\x20sending\x20Pushover\x20notification:\x20' + G['message']);
            }
        } else {
        }
        await a0a9('Stopping\x20all\x20bot\x20operations\x20-\x20appointment\x20confirmed\x20on\x20page\x20load'), a0r = ![], a0y = ![], a0H();
        return;
    }
    if (a)
        return;
    try {
        if (!a0u)
            return;
        a0H();
        if (window['location']['href']['includes']('usvisascheduling.com/') && !window['location']['href']['includes']('/en-US/') && !window['location']['href']['includes']('/signin-aad-b2c_1')) {
            redirectionHandled = !![];
            const I = window['location']['href']['replace'](/\/[a-z]{2}-[A-Z]{2}\//, '/en-US/');
            window['location']['replace'](I);
            return;
        }
        if (window['location']['href']['match'](/usvisascheduling\.com\/en-US\/?$/)) {
            redirectionHandled = !![], await a0ao(), await a0a7();
            try {
                const K = [...document['querySelectorAll']('script')]['map'](M => M['innerText'] || M['textContent'])['join']('\x0a')['match'](/setAuthenticatedUserContext\(['"]([^'"]+)['"]\)/)?.[0x1];
                if (K)
                    await chrome['storage']['local']['set']({ 'email': K });
                else {
                }
            } catch (Q) {
                return;
            }
            const J = Swal['fire']({
                'title': 'Please\x20Wait',
                'html': '<p>Looking\x20for\x20navigation\x20links,\x20we\x27ll\x20redirect\x20you\x20shortly...</p>',
                'allowOutsideClick': ![],
                'showConfirmButton': ![],
                'didOpen': () => {
                    Swal['showLoading']();
                }
            });
            a0ae('a#reschedule_appointment')['then'](R => {
                const S = R['getAttribute']('href'), T = window['location']['origin'] + (S['startsWith']('/') ? '' : '/') + S;
                J['close'](), window['location']['replace'](T);
            })['catch'](R => {
                a0ae('a#continue_application')['then'](S => {
                    const T = S['getAttribute']('href'), U = window['location']['origin'] + '/en-US' + T;
                    J['close'](), window['location']['replace'](U);
                })['catch'](S => {
                    J['close'](), window['location']['replace'](window['location']['href']['replace'](/\/?$/, '/schedule/'));
                });
            });
            return;
        }
        if (window['location']['href']['includes']('/ofc-schedule')) {
            const R = a0S(), S = new MutationObserver(async (T, U) => {
                    try {
                        const V = document['getElementById']('post_select');
                        if (V && V['options'] && typeof V['options'] === 'object' && 'length' in V['options'] && V['options']['length'] > 0x1) {
                            U['disconnect'](), a0E['delete'](U);
                            const W = await a0af();
                            if (W) {
                                const X = await a0R();
                                if (X)
                                    X['contactId'] = X['contactId']['replace'](/['"+ ]/g, ''), await a0ag(X, R);
                                else {
                                }
                            } else {
                            }
                        } else {
                            if (document['readyState'] === 'complete' || T['some'](Y => Y['target']['id'] === 'main-content')) {
                                U['disconnect'](), a0E['delete'](U);
                                const Y = await a0af();
                                if (Y) {
                                    const Z = await a0R();
                                    if (Z)
                                        Z['contactId'] = Z['contactId']['replace'](/['"+ ]/g, ''), await a0ag(Z, R);
                                    else {
                                    }
                                } else {
                                }
                            }
                        }
                    } catch (a0) {
                        U['disconnect'](), a0E['delete'](U);
                    }
                });
            a0E['add'](S), S['observe'](document['body'], {
                'childList': !![],
                'subtree': !![],
                'attributes': !![],
                'attributeFilter': [
                    'id',
                    'class'
                ]
            });
            return;
        }
        if (!window['location']['href']['includes']('usvisascheduling.com/en-US'))
            return;
        const H = new MutationObserver(async (T, U) => {
            try {
                if (await a0O()) {
                    U['disconnect'](), a0E['delete'](U);
                    return;
                }
                if (a0o)
                    return;
                const V = await a0R();
                if (V) {
                    a0o = !![], await chrome['storage']['local']['set'](V);
                    const W = a0S();
                    try {
                        await a0ag(V, W);
                    } catch (X) {
                    }
                    U['disconnect'](), a0E['delete'](U);
                }
            } catch (Y) {
                U['disconnect'](), a0E['delete'](U);
            }
        });
        a0E['add'](H), H['observe'](document['body'], {
            'childList': !![],
            'subtree': !![],
            'attributes': !![]
        });
    } catch (T) {
    }
}
async function a0R() {
    try {
        const {dateSelectionInProgress: a} = await chrome['storage']['local']['get']('dateSelectionInProgress');
        if (a)
            return null;
    } catch (b) {
    }
    try {
        const c = document['documentElement']['innerHTML'], d = [
                /[?&]appd=([^&"]+)/,
                /contactId["']?\s*:\s*["']([^"']+)/i,
                /appd["']?\s*:\s*["']([^"']+)/i
            ], e = [
                /[?&]primaryId=([^&"]+)/,
                /primaryId["']?\s*:\s*["']([^"']+)/i,
                /jsdata\['primaryId'\]\s*=\s*"([^"]+)"/i,
                /applications["']?\s*:\s*\[["']([^"']+)/i
            ], f = [
                /[?&]postId=([^&"]+)/,
                /postId["']?\s*:\s*["']([^"']+)/i,
                /jsdata\['postId'\]\s*=\s*"([^"]+)"/i,
                /\['postId'\]\s*=\s*"([^"]+)"/
            ];
        let g, h, i;
        for (const m of d) {
            const n = c['match'](m);
            if (n) {
                g = n[0x1]['replace'](/['"\s+]/g, '');
                break;
            }
        }
        for (const o of e) {
            const p = c['match'](o);
            if (p) {
                h = p[0x1];
                break;
            }
        }
        for (const q of f) {
            const r = c['match'](q);
            if (r) {
                i = r[0x1];
                break;
            }
        }
        if (!i || !h) {
            const s = document['getElementsByTagName']('script');
            for (const t of s) {
                const u = t['textContent'] || '';
                if (u['includes']('jsdata')) {
                    const v = u['match'](/jsdata\['postId'\]\s*=\s*"([^"]+)"/);
                    v && !i && (i = v[0x1]);
                    const w = u['match'](/jsdata\['primaryId'\]\s*=\s*"([^"]+)"/);
                    w && !h && (h = w[0x1]);
                }
            }
        }
        if (!i) {
            const x = document['getElementById']('post_select');
            if (x) {
                const y = Array['from'](x['options'])['find'](z => z['value'] !== '');
                y && (i = y['value']);
            }
        }
        const j = document['querySelectorAll']('[data-appd],\x20[data-primary-id],\x20[data-post-id],\x20input[type=\x22hidden\x22]');
        j['forEach'](z => {
        });
        if (g)
            g = g['replace'](/['"\s+]/g, '');
        if (h)
            h = h['replace'](/['"\s+]/g, '');
        if (i)
            i = i['replace'](/['"\s+]/g, '');
        const k = {
            'contactId': g,
            'primaryId': h,
            'postId': i
        };
        if (window['location']['href']['includes']('/ofc-schedule')) {
            if (!g || !h)
                return console['warn']('Missing\x20required\x20values\x20for\x20OFC:', {
                    'contactId': g,
                    'primaryId': h
                }), null;
            return {
                'contactId': g,
                'primaryId': h
            };
        }
        const l = Object['entries'](k)['filter'](([z, A]) => !A)['map'](([z]) => z);
        if (l['length'] > 0x0)
            return console['warn']('Missing\x20required\x20values:', l), null;
        return k;
    } catch (z) {
        return null;
    }
}
function a0S() {
    const a = {
        'storedCookies': {},
        'start': function () {
            this['captureCookies'](document['cookie']);
            if (!a0v)
                try {
                    Object['defineProperty'](document, 'cookie', {
                        'set': c => {
                            const [d, e] = c['split']('=');
                            return this['storedCookies'][d] = e['split'](';')[0x0], c;
                        },
                        'get': () => Object['entries'](this['storedCookies'])['map'](([c, d]) => c + '=' + d)['join'](';\x20')
                    }), a0v = !![];
                } catch (c) {
                    console['warn']('Cookie\x20monitor\x20already\x20initialized,\x20continuing\x20with\x20existing\x20implementation:', c), a0v = !![];
                }
            const b = window['fetch'];
            window['fetch'] = async (...d) => {
                const e = await b(...d);
                return this['checkResponseCookies'](e), e;
            };
        },
        'captureCookies': function (b) {
            b['split'](';')['forEach'](c => {
                const [d, e] = c['trim']()['split']('=');
                this['storedCookies'][d] = e;
            });
        },
        'checkResponseCookies': function (b) {
            const c = b['headers']['get']('set-cookie');
            c && c['split'](/,\s*/)['forEach'](d => {
                const [e, f] = d['split']('=');
                this['storedCookies'][e] = f['split'](';')[0x0];
            });
        },
        'getCookieHeader': function () {
            return Object['entries'](this['storedCookies'])['map'](([b, c]) => b + '=' + c)['join'](';\x20');
        }
    };
    return a['start'](), a;
}
const a0T = new Map(), a0U = 0x2710;
function a0V(a, b, c) {
    const d = Date['now']();
    if (a0T['has'](c)) {
        const e = a0T['get'](c);
        if (d - e['timestamp'] < a0U)
            return Promise['resolve'](e['response']['clone']());
    }
    return fetch(a, b)['then'](f => {
        if (f['ok']) {
            const g = f['clone']();
            a0T['set'](c, {
                'response': g,
                'timestamp': d
            });
            if (a0T['size'] > 0x14) {
                const h = a0T['keys']()['next']()['value'];
                a0T['delete'](h);
            }
        }
        return f;
    });
}
chrome['storage']['onChanged']['addListener'](async (a, b) => {
    if (b === 'sync') {
        a0W = null, a0X = 0x0;
        if (a['selectedOfcCities'] || a['selectedConsularCities'] || a['startDate'] || a['endDate']) {
            if (a0x)
                return;
            const c = await a0Z();
            if (c['hasRequiredData'] && c['hasRequiredData']()) {
                a0r && (a0r = ![], a0w++, await new Promise(f => setTimeout(f, 0x3e8)));
                while (a0p) {
                    await new Promise(f => setTimeout(f, 0x64));
                }
                const d = await a0ak();
                if (!d)
                    return;
                const e = a0S();
                await a0ag(d, e);
            } else {
            }
        }
    }
});
let a0W = null, a0X = 0x0;
const a0Y = 0x7530;
async function a0Z() {
    const a = Date['now']();
    if (a0W && a - a0X < a0Y)
        return a0W;
    try {
        return a0W = await a0ai(), a0X = a, a0W;
    } catch (b) {
        return a0W || {};
    }
}
async function a0a0(a, b) {
    const c = await a0O();
    if (c)
        return;
    const d = await a0K();
    if (d['active'] && window['location']['pathname']['includes']('/ofc-schedule'))
        return;
    if (d['active'] && window['location']['pathname']['includes']('/schedule') && !window['location']['pathname']['includes']('/ofc-schedule')) {
    }
    if (a0r)
        return;
    if (!a0u)
        return;
    a0r = !![];
    const e = ++a0w;
    try {
        if (!a || !a['primaryId'] || !a['contactId'])
            return;
        const f = await a0Z();
        if (a['primaryId'] && a['contactId']) {
            if (!c)
                await Swal['fire']({
                    'title': 'Please\x20Wait',
                    'html': '<p>Will\x20start\x20fetching\x20dates\x20shortly...</p>',
                    'timer': 0xbb8,
                    'timerProgressBar': !![],
                    'showConfirmButton': ![],
                    'allowOutsideClick': ![]
                });
            else {
            }
            try {
                const n = await a0ar(a['primaryId'], a['contactId'], b);
            } catch (o) {
            }
        }
        let g = [];
        const h = p => new Promise(q => setTimeout(q, p));
        await h(0x7d0);
        const j = document['getElementById']('post_select'), k = j && j['options'] && Array['from'](j['options'])['filter'](p => p['value'])['length'] > 0x1, l = window['location']['pathname'];
        if (l['includes']('/schedule') && !l['includes']('/ofc-schedule') && !k) {
            if (a && a['postId']) {
                let p = a0h(a['postId']);
                if (p === 'undefined' && j) {
                    const q = Array['from'](j['options'])['find'](r => r['value'] === a['postId']);
                    q && (p = q['text']['trim']());
                }
                g['push']([
                    a['postId'],
                    p
                ]);
            } else {
                const r = document['documentElement']['innerHTML'], s = [
                        /[?&]postId=([^&"]+)/,
                        /postId["']?\s*:\s*["']([^"']+)/i,
                        /jsdata\['postId'\]\s*=\s*"([^"]+)"/i,
                        /\['postId'\]\s*=\s*"([^"]+)"/
                    ];
                let t = null;
                for (const u of s) {
                    const v = r['match'](u);
                    if (v) {
                        t = v[0x1]['replace'](/['"\s+]/g, '');
                        break;
                    }
                }
                if (t) {
                    const w = j && j['options'] && j['options']['length'] === 0x1 ? j['options'][0x0]['text']['trim']() : 'Unknown\x20City';
                    g['push']([
                        t,
                        w
                    ]);
                } else {
                }
            }
        } else
            try {
                const {
                    selectedOfcCities: selectedOfcCities = {},
                    selectedConsularCities: selectedConsularCities = {}
                } = await chrome['storage']['sync']['get']([
                    'selectedOfcCities',
                    'selectedConsularCities'
                ]);
                let x = {};
                const y = window['location']['pathname'];
                if (y['includes']('/ofc-schedule'))
                    x = selectedOfcCities;
                else
                    y['includes']('/schedule') ? x = selectedConsularCities : x = {
                        ...selectedOfcCities,
                        ...selectedConsularCities
                    };
                if (Object['keys'](x)['length'] > 0x0)
                    Object['entries'](x)['forEach'](([z, A]) => {
                        g['push']([
                            z,
                            A
                        ]);
                    });
                else {
                }
            } catch (z) {
            }
        if (g['length'] === 0x0) {
            const A = document['getElementById']('post_select');
            if (A && A['options'] && typeof A['options'] === 'object' && 'length' in A['options'] && A['options']['length'] > 0x0) {
                for (let D = 0x0; D < A['options']['length']; D++) {
                    const E = A['options'][D];
                    E && E['value'] && g['push']([
                        E['value'],
                        E['text'] ? E['text']['trim']() : 'Unknown'
                    ]);
                }
                const B = window['location']['pathname'];
                let C = {};
                if (B['includes']('/ofc-schedule')) {
                    const F = {};
                    g['forEach'](([G, H]) => {
                        F[G] = H;
                    }), C['selectedOfcCities'] = F;
                } else {
                    if (B['includes']('/schedule')) {
                        const G = {};
                        g['forEach'](([H, I]) => {
                            G[H] = I;
                        }), C['selectedConsularCities'] = G;
                    } else {
                        const H = {};
                        g['forEach'](([I, J]) => {
                            H[I] = J;
                        }), C['selectedOfcCities'] = H, C['selectedConsularCities'] = H;
                    }
                }
                await chrome['storage']['sync']['set'](C);
            } else {
                if (a['postId']) {
                    const I = document['querySelector']('#post_select\x20option[value=\x22' + a['postId'] + '\x22]')?.['textContent'] || 'Unknown';
                    g['push']([
                        a['postId'],
                        I
                    ]);
                } else {
                    a0r = ![];
                    return;
                }
            }
        }
        if (g['length'] === 0x0) {
            e === a0w && (a0r = ![]);
            return;
        }
        a0q = 0x0;
        async function m() {
            if (e !== a0w)
                return;
            if (!a0u) {
                e === a0w && (a0r = ![]);
                return;
            }
            if (!a0r)
                return;
            const M = Date['now']();
            try {
                if (!g || g['length'] === 0x0) {
                    e === a0w && (a0r = ![]);
                    return;
                }
                const [Q, R] = g[a0q], S = {
                        ...a,
                        'postId': Q,
                        'cityName': R
                    }, T = window['location']['pathname'];
                T['includes']('/ofc-schedule') ? a0ah(S, b)['catch'](X => {
                }) : a0a1(S, b)['catch'](X => {
                });
                a0q = (a0q + 0x1) % g['length'];
                const U = await a0a3(), V = Date['now']() - M, W = Math['max'](U - V, 0x3e8);
                a0F(m, W);
            } catch (X) {
                if (a0u && a0r && e === a0w) {
                    const Y = await a0a3();
                    a0F(m, Y);
                }
            }
        }
        m();
    } catch (J) {
        e === a0w && (a0r = ![]);
    }
}
async function a0a1(a, b) {
    try {
        const c = await a0K();
        if (c['expired'])
            return;
        const d = await a0Z();
        if (!d['startDate'] || !d['endDate']) {
            await Swal['fire']({
                'title': 'Date\x20Range\x20Required',
                'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Please\x20add\x20<strong>Start\x20Date</strong>\x20and\x20<strong>End\x20Date</strong>\x20in\x20the\x20extension\x20popup\x20to\x20continue\x20using\x20the\x20bot.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>The\x20bot\x20needs\x20a\x20date\x20range\x20to\x20search\x20for\x20available\x20appointments.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                'icon': 'warning',
                'confirmButtonText': 'OK,\x20I\x27ll\x20Set\x20the\x20Dates',
                'allowOutsideClick': ![],
                'allowEscapeKey': ![]
            }), await a0a9('Date\x20range\x20not\x20set\x20for\x20date\x20check');
            return;
        }
        const e = window['location']['href']['includes']('reschedule=true');
        let f = [a['primaryId']];
        try {
            const n = await chrome['storage']['local']['get'](['applications']);
            if (n['applications'] && Array['isArray'](n['applications']) && n['applications']['length'] > 0x0)
                f = n['applications'];
            else {
            }
        } catch (o) {
        }
        const g = new URLSearchParams();
        g['append']('parameters', JSON['stringify']({
            'primaryId': a['primaryId'],
            'applications': f,
            'scheduleDayId': '',
            'scheduleEntryId': '',
            'postId': a['postId'],
            'isReschedule': e ? 'true' : 'false'
        }));
        const h = Date['now'](), j = 'https://www.usvisascheduling.com/en-US/custom-actions/?route=/api/v1/schedule-group/get-family-consular-schedule-days&appd=' + a['contactId'] + '&cacheString=' + h, k = await fetch(j, {
                'method': 'POST',
                'headers': {
                    'accept': 'application/json,\x20text/javascript,\x20*/*;\x20q=0.01',
                    'content-type': 'application/x-www-form-urlencoded;\x20charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': b['getCookieHeader']()
                },
                'body': g
            });
        if (!k['ok'])
            throw new Error('HTTP\x20error!\x20status:\x20' + k['status']);
        const l = await k['json'](), m = { ...l };
        m['Token'] && (m['Token'] = '[Token\x20length:\x20' + m['Token']['length'] + '\x20chars]');
        if (l['ScheduleDays'] && l['ScheduleDays']['length'] > 0x0) {
            const p = l['ScheduleDays']['sort']((r, s) => new Date(r['Date']) - new Date(s['Date']));
            if (p['length'] > 0x0) {
                const r = p[0x0]['Date'];
                let s;
                if (r['includes']('T')) {
                    const [B] = r['split']('T'), [C, D, E] = B['split']('-')['map'](Number);
                    s = new Date(C, D - 0x1, E);
                } else {
                    const [F, G, H] = r['split']('-')['map'](Number);
                    s = new Date(F, G - 0x1, H);
                }
                const t = s['toLocaleDateString']('en-US', {
                        'year': 'numeric',
                        'month': 'long',
                        'day': 'numeric'
                    }), u = await a0Z(), v = u['startDate']['split']('-')['map'](Number), w = u['endDate']['split']('-')['map'](Number), x = new Date(v[0x0], v[0x1] - 0x1, v[0x2]), y = new Date(w[0x0], w[0x1] - 0x1, w[0x2]), z = s >= x && s <= y, A = p['filter'](I => {
                        const J = I['Date'];
                        let K;
                        if (J['includes']('T')) {
                            const [L] = J['split']('T'), [M, N, O] = L['split']('-')['map'](Number);
                            K = new Date(M, N - 0x1, O);
                        } else {
                            const [P, Q, R] = J['split']('-')['map'](Number);
                            K = new Date(P, Q - 0x1, R);
                        }
                        return K >= x && K <= y;
                    });
                if (A['length'] > 0x0) {
                    const I = A['slice'](0x0, 0x5)['map'](K => {
                            const L = K['Date'];
                            let M;
                            if (L['includes']('T')) {
                                const [N] = L['split']('T'), [O, P, Q] = N['split']('-')['map'](Number);
                                M = new Date(O, P - 0x1, Q);
                            } else {
                                const [R, S, T] = L['split']('-')['map'](Number);
                                M = new Date(R, S - 0x1, T);
                            }
                            return M['toLocaleDateString']('en-US', {
                                'year': 'numeric',
                                'month': 'long',
                                'day': 'numeric'
                            });
                        })['join'](',\x20'), J = z ? 'EARLIEST\x20IN\x20RANGE' : 'EARLIEST\x20OUT\x20OF\x20RANGE';
                    await a0a9('\x20-\x20City:\x20' + a['cityName'] + '\x20-\x20Earliest\x20available\x20date:\x20' + t + '\x20(' + J + ')\x20-\x20First\x205\x20dates\x20within\x20range:\x20' + I + '\x20(' + A['length'] + '\x20dates\x20within\x20range,\x20' + p['length'] + '\x20total\x20dates\x20available)');
                } else
                    await a0a9('\x20-\x20City:\x20' + a['cityName'] + '\x20-\x20Earliest\x20available\x20date:\x20' + t + '\x20(' + p['length'] + '\x20dates\x20available,\x20NONE\x20within\x20preferred\x20range)');
            }
            let q = ![];
            for (const K of p) {
                const L = K['Date'];
                let M;
                if (L['includes']('T')) {
                    const [U] = L['split']('T'), [V, W, X] = U['split']('-')['map'](Number);
                    M = new Date(V, W - 0x1, X);
                } else {
                    const [Y, Z, a0] = L['split']('-')['map'](Number);
                    M = new Date(Y, Z - 0x1, a0);
                }
                const N = K['ID'], O = M['toLocaleDateString']('en-US', {
                        'year': 'numeric',
                        'month': 'long',
                        'day': 'numeric'
                    }), P = d['startDate']['split']('-')['map'](Number), Q = d['endDate']['split']('-')['map'](Number), R = new Date(P[0x0], P[0x1] - 0x1, P[0x2]), S = new Date(Q[0x0], Q[0x1] - 0x1, Q[0x2]), T = M >= R && M <= S;
                if (T) {
                    q = !![], await chrome['storage']['local']['set']({ 'dateSelectionInProgress': !![] }), a0s = M, a0t = N, await chrome['storage']['local']['set']({
                        'preferredDateString': M['toISOString'](),
                        'preferredDateId': N
                    }), await chrome['storage']['local']['set']({
                        'preferredLocation': {
                            'postId': a['postId'],
                            'cityName': a['cityName'] || 'Unknown'
                        }
                    }), a0r = ![];
                    const a1 = document['getElementById']('post_select');
                    let a2 = ![];
                    a1 && (a1['tagName'] === 'SELECT' && a1['options']['length'] > 0x1 && (a2 = !![]));
                    if (!a2)
                        window['location']['reload']();
                    else {
                        a0n = !![];
                        for (let a4 = 0x0; a4 < a1['options']['length']; a4++) {
                            if (a1['options'][a4]['value'] === a['postId']) {
                                a1['selectedIndex'] = a4;
                                const a5 = new Event('change', { 'bubbles': !![] });
                                a1['dispatchEvent'](a5), await new Promise(a6 => setTimeout(a6, 0x3e8));
                                break;
                            }
                        }
                        const a3 = await a0aa(M);
                        a3 ? await a0ad(![]) : a0n = ![];
                    }
                    return;
                }
            }
            if (!q) {
                const a6 = p[0x0]['Date'];
                let a7;
                if (a6['includes']('T')) {
                    const [a9] = a6['split']('T'), [aa, ab, ac] = a9['split']('-')['map'](Number);
                    a7 = new Date(aa, ab - 0x1, ac);
                } else {
                    const [ad, ae, af] = a6['split']('-')['map'](Number);
                    a7 = new Date(ad, ae - 0x1, af);
                }
                const a8 = a7['toLocaleDateString']('en-US', {
                    'year': 'numeric',
                    'month': 'long',
                    'day': 'numeric'
                });
                await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>Checking\x20for\x20available\x20dates</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Location:\x20' + (a['cityName'] || 'Unknown') + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Earliest\x20availability:\x20' + a8 + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Preferred\x20range:\x20' + a0a6(d['startDate'], d['endDate']) + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>No\x20dates\x20found\x20within\x20preferred\x20range</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Checked\x20@\x20' + new Date()['toLocaleString']() + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20');
            }
        } else
            await a0a9('\x20-\x20Location:\x20' + (a['cityName'] || 'Unknown') + '\x20-\x20No\x20available\x20dates\x20found'), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>No\x20available\x20dates\x20found</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Location:\x20' + (a['cityName'] || 'Unknown') + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Preferred\x20range:\x20' + a0a6(d['startDate'], d['endDate']) + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Checked\x20@\x20' + new Date()['toLocaleString']() + '</span>\x0a\x20\x20\x20\x20\x20\x20');
    } catch (ag) {
        await a0a9('\x20-\x20Location:\x20' + (a['cityName'] || 'Unknown') + '\x20-\x20Error:\x20' + ag['message']);
        if (ag['message'] && (ag['message']['includes']('429') || ag['message']['includes']('rate\x20limit') || ag['message']['includes']('too\x20many\x20requests'))) {
            await Swal['fire']({
                'title': '🚦\x20Consulate\x20sent\x20Error\x20429',
                'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22text-align:\x20center;\x20padding:\x2020px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h3\x20style=\x22color:\x20#ff6b35;\x20margin-bottom:\x2020px;\x22>⚠️\x20Server\x20Rate\x20Limit\x20Detected</h3>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin-bottom:\x2015px;\x22>The\x20server\x20is\x20receiving\x20too\x20many\x20requests\x20and\x20has\x20temporarily\x20blocked\x20further\x20requests.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin-bottom:\x2015px;\x22><strong>Please\x20turn\x20off\x20the\x20bot\x20for\x20a\x20few\x20hours</strong>\x20to\x20allow\x20the\x20rate\x20limit\x20to\x20reset.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#666;\x20font-size:\x2014px;\x20margin-bottom:\x2020px;\x22>This\x20helps\x20prevent\x20your\x20account\x20from\x20being\x20temporarily\x20suspended.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22background:\x20#f8f9fa;\x20padding:\x2015px;\x20border-radius:\x208px;\x20margin:\x2015px\x200;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin:\x200;\x20color:\x20#495057;\x22><strong>💡\x20Recommended\x20Action:</strong></p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin:\x205px\x200\x200\x200;\x20color:\x20#495057;\x22>Wait\x202-4\x20hours\x20before\x20reactivating\x20the\x20bot</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                'icon': 'warning',
                'confirmButtonText': 'I\x27ll\x20Turn\x20Off\x20the\x20Bot',
                'allowOutsideClick': ![],
                'allowEscapeKey': ![],
                'customClass': { 'popup': 'swal-wide' }
            }), a0r = ![], a0H();
            return;
        }
        const ah = await a0Z();
        !ah['startDate'] || !ah['endDate'] ? await Swal['fire']({
            'title': 'Date\x20Range\x20Required',
            'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Please\x20add\x20<strong>Start\x20Date</strong>\x20and\x20<strong>End\x20Date</strong>\x20in\x20the\x20extension\x20popup\x20to\x20continue\x20using\x20the\x20bot.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>The\x20bot\x20needs\x20a\x20date\x20range\x20to\x20search\x20for\x20available\x20appointments.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
            'icon': 'warning',
            'confirmButtonText': 'OK,\x20I\x27ll\x20Set\x20the\x20Dates',
            'allowOutsideClick': ![],
            'allowEscapeKey': ![]
        }) : await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>Error\x20checking\x20dates:\x20' + ag['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Location:\x20' + (a['cityName'] || 'Unknown') + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Preferred\x20range:\x20' + a0a6(ah['startDate'], ah['endDate']) + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Checked\x20@\x20' + new Date()['toLocaleString']() + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'), setTimeout(() => {
            window['location']['href'] = 'https://www.usvisascheduling.com/en-US/';
        }, 0xbb8);
    }
}
document['addEventListener']('DOMContentLoaded', async () => {
});
async function a0a2(a, b, c) {
    const d = await a0Z();
    try {
        if (!b)
            return null;
        let e = [a['primaryId']];
        try {
            const k = await chrome['storage']['local']['get'](['applications']);
            if (k['applications'] && Array['isArray'](k['applications']) && k['applications']['length'] > 0x0)
                e = k['applications'];
            else {
            }
        } catch (l) {
        }
        const f = new URLSearchParams();
        f['append']('parameters', JSON['stringify']({
            'primaryId': a['primaryId'],
            'applications': e,
            'scheduleDayId': b,
            'scheduleEntryId': '',
            'postId': a['postId'],
            'isReschedule': window['location']['href']['includes']('reschedule=true') ? 'true' : 'false'
        }));
        const g = Date['now'](), h = 'https://www.usvisascheduling.com/en-US/custom-actions/?route=/api/v1/schedule-group/get-family-consular-schedule-entries&appd=' + a['contactId'] + '&cacheString=' + g, i = await fetch(h, {
                'method': 'POST',
                'headers': {
                    'accept': 'application/json,\x20text/javascript,\x20*/*;\x20q=0.01',
                    'content-type': 'application/x-www-form-urlencoded;\x20charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': c['getCookieHeader']()
                },
                'body': f['toString'](),
                'credentials': 'include'
            });
        if (!i['ok'])
            throw new Error('HTTP\x20error!\x20status:\x20' + i['status']);
        const j = await i['json']();
        return j['ScheduleEntries'];
    } catch (m) {
        return await a0a9('Error\x20fetching\x20time\x20slots:\x20' + m['message']), null;
    }
}
async function a0a3() {
    try {
        const a = await new Promise(b => {
            chrome['storage']['local']['get']([
                '__fq',
                '__fqType'
            ], c => {
                let d = c['__fq'] || 0x1e, e = c['__fqType'] || 'seconds', f = 0x7530;
                if (d) {
                    if (e === 'seconds')
                        f = d * 0x3e8;
                    else {
                        if (e === 'minutes')
                            f = d * 0x3c * 0x3e8;
                        else
                            e === 'hours' && (f = d * 0x3c * 0x3c * 0x3e8);
                    }
                }
                b(f);
            });
        });
        return a;
    } catch (b) {
        return 0x7530;
    }
}
async function a0a4() {
    try {
        const {currentAppointment: a} = await chrome['storage']['local']['get']('currentAppointment');
        return a || null;
    } catch (b) {
        return null;
    }
}
const a0a5 = async a => {
    const b = await a0a3(), c = await a0a4();
    let d = a;
    c && c['dateString'] && (d += '<br><span\x20style=\x22color:\x20#FFD700;\x22>Current\x20Appointment:\x20' + c['dateString'] + '</span>'), Swal['fire']({
        'toast': !![],
        'position': 'bottom-start',
        'timer': b,
        'showConfirmButton': ![],
        'timerProgressBar': !![],
        'html': d
    });
};
function a0a6(a, b) {
    const c = a['split']('-')['map'](Number), d = b['split']('-')['map'](Number), e = new Date(c[0x0], c[0x1] - 0x1, c[0x2]), f = new Date(d[0x0], d[0x1] - 0x1, d[0x2]);
    return e['toLocaleDateString']() + '\x20-\x20' + f['toLocaleDateString']();
}
async function a0a7() {
    try {
        const a = document['querySelectorAll']('.text-bold');
        for (const b of a) {
            if (b['textContent']['includes']('Appointment\x20Confirmation')) {
                const c = document['getElementById']('appointment-card');
                if (c && c['textContent'] && !c['textContent']['includes']('No\x20Appointment\x20Scheduled')) {
                    const e = c['textContent']['trim'](), f = e['match'](/(Consular|OFC):\s*(.+)/);
                    if (f) {
                        const g = f[0x1], h = f[0x2];
                        await chrome['storage']['local']['set']({
                            'currentAppointment': {
                                'type': g,
                                'dateString': h,
                                'extractedAt': new Date()['toISOString']()
                            }
                        });
                        return;
                    }
                }
                const d = b['closest']('.border-base-lightest');
                if (d) {
                    const i = d['querySelector']('script');
                    if (i && i['textContent']) {
                        const j = i['textContent'], k = j['match'](/moment\('([^']+)'\)\.format\('([^']+)'\)/);
                        if (k) {
                            const l = k[0x1], m = k[0x2], n = j['match'](/'(\d+)'\s*==\s*'1'\s*\?\s*'Consular'\s*:\s*'OFC'/), o = n && n[0x1] === '1' ? 'Consular' : 'OFC';
                            await chrome['storage']['local']['set']({
                                'currentAppointment': {
                                    'type': o,
                                    'dateString': o + ':\x20' + l,
                                    'rawDate': l,
                                    'format': m,
                                    'extractedAt': new Date()['toISOString']()
                                }
                            });
                            return;
                        }
                    }
                }
            }
        }
        await chrome['storage']['local']['remove']('currentAppointment');
    } catch (p) {
    }
}
const a0a8 = 0x186a0;
async function a0a9(a) {
    const b = new Date()['toLocaleString'](), c = b + ':\x20' + a + '\x0a';
    try {
        const {
            logs: logs = ''
        } = await chrome['storage']['local']['get']({ 'logs': '' });
        let d = logs + c;
        if (d['length'] > a0a8) {
            const e = d['split']('\x0a'), f = Math['floor'](e['length'] * 0.5);
            d = e['slice'](-f)['join']('\x0a');
        }
        await chrome['storage']['local']['set']({ 'logs': d });
    } catch (g) {
        console['warn']('Failed\x20to\x20save\x20log:', g);
    }
}
async function a0aa(a) {
    const b = await a0Z();
    try {
        const c = new Date(a), d = c['getMonth'](), e = c['getFullYear'](), f = c['getDate'](), g = 0x7530, h = Date['now'](), i = Swal['fire']({
                'toast': !![],
                'position': 'bottom-start',
                'timer': g + 0x3e8,
                'showConfirmButton': ![],
                'timerProgressBar': !![],
                'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>📅\x20Selecting\x20Date\x20in\x20Calendar...</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Target\x20Date:\x20' + (d + 0x1) + '/' + f + '/' + e + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>It\x20is\x20loading\x20calendar...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'
            });
        let j, k;
        while (Date['now']() - h < g) {
            j = document['querySelector']('.ui-datepicker-month'), k = document['querySelector']('.ui-datepicker-year');
            if (j && k) {
                i['close']();
                break;
            }
            if ((Date['now']() - h) % 0x1388 < 0xc8) {
            }
            await new Promise(n => setTimeout(n, 0xc8));
        }
        i['close']();
        if (!j || !k)
            throw new Error('Calendar\x20selectors\x20not\x20found\x20after\x20waiting\x20' + g / 0x3e8 + '\x20seconds');
        document['querySelector']('.ui-datepicker-year')['value'] = e['toString'](), document['querySelector']('.ui-datepicker-year')['dispatchEvent'](new Event('change', { 'bubbles': !![] })), document['querySelector']('.ui-datepicker-month')['value'] = d['toString'](), document['querySelector']('.ui-datepicker-month')['dispatchEvent'](new Event('change', { 'bubbles': !![] })), await new Promise(n => setTimeout(n, 0x12c));
        const l = Date['now']();
        let m = null;
        while (Date['now']() - l < g) {
            const n = [
                'td.greenday[data-month=\x22' + d + '\x22][data-year=\x22' + e + '\x22]\x20a[data-date=\x22' + f + '\x22]',
                'td[data-month=\x22' + d + '\x22][data-year=\x22' + e + '\x22]\x20a[data-date=\x22' + f + '\x22]',
                'td.greenday\x20a[data-date=\x22' + f + '\x22]'
            ];
            for (const o of n) {
                m = document['querySelector'](o);
                if (m)
                    break;
            }
            if (m)
                break;
            if ((Date['now']() - l) % 0x1388 < 0xc8) {
            }
            await new Promise(p => setTimeout(p, 0xc8));
        }
        if (!m)
            throw new Error('Date\x20cell\x20not\x20found\x20for\x20' + (d + 0x1) + '/' + f + '/' + e + '\x20after\x20waiting\x20' + g / 0x3e8 + '\x20seconds');
        return m['click'](), !![];
    } catch (p) {
        return await a0a9('Error\x20selecting\x20date:\x20' + p['message']), await chrome['storage']['local']['set']({
            'dateSelectionInProgress': ![],
            'preferredDateString': null,
            'preferredDateId': null
        }), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>❌\x20Date\x20Selection\x20Failed</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>Error:\x20' + p['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Redirecting\x20to\x20home\x20page...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388), setTimeout(() => {
            window['location']['href'] = 'https://www.usvisascheduling.com/en-US/';
        }, 0x7d0), ![];
    }
}
async function a0ab() {
    const a = [
        '.atlas_validationalert.alert.alert-danger',
        '.alert.alert-danger',
        '.error-message',
        '.validation-error',
        '.alert-danger'
    ];
    for (const b of a) {
        const c = document['querySelector'](b);
        if (c && c['textContent']['trim']()) {
            const d = c['textContent']['trim']();
            await a0a9('Booking\x20Error\x20Detected:\x20' + d + '\x20(Selector:\x20' + b + ')');
            const e = [
                    'no\x20longer\x20available',
                    'selected\x20appointment\x20time\x20is\x20no\x20longer\x20available',
                    'please\x20select\x20another\x20appointment\x20time',
                    'already\x20booked',
                    'network\x20error',
                    'server\x20error',
                    'booking\x20failed',
                    'try\x20again',
                    'invalid\x20request',
                    'session\x20expired',
                    'error\x20occurred',
                    'lütfen\x20başka\x20bir\x20randevu\x20saati\x20seçin',
                    'Seçilen\x20randevu\x20saati\x20artık\x20müsait\x20değil',
                    'Sistem\x20çok\x20fazla\x20talep\x20isliyor.\x20Lütfen\x20tekrar\x20deneyin'
                ], f = e['some'](g => d['toLowerCase']()['includes'](g['toLowerCase']()));
            if (f)
                return {
                    'found': !![],
                    'message': d,
                    'element': c
                };
        }
    }
    return {
        'found': ![],
        'message': null,
        'element': null
    };
}
function a0ac(a, b, c = 0x1e) {
    return new Promise(d => {
        const e = Date['now'](), f = c * 0x3e8;
        let g = 0x0;
        const h = setInterval(async () => {
            g++;
            const i = Date['now']() - e, j = await a0ab();
            if (j['found']) {
                clearInterval(h), a(j), d({
                    'errorFound': !![],
                    'pollCount': g,
                    'elapsedTime': i
                });
                return;
            }
            if (i >= f) {
                clearInterval(h), b(), d({
                    'errorFound': ![],
                    'pollCount': g,
                    'elapsedTime': i
                });
                return;
            }
        }, 0x3e8);
    });
}
async function a0ad(a = ![]) {
    try {
        const b = Swal['fire']({
            'toast': !![],
            'position': 'bottom-start',
            'timer': 0x1f40,
            'showConfirmButton': ![],
            'timerProgressBar': !![],
            'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>⏰\x20Looking\x20for\x20Time\x20Slots...</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Searching\x20for\x20available\x20appointments</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'
        });
        let c = 0x0;
        const d = 0xf;
        let e = [];
        while (e['length'] === 0x0 && c < d) {
            e = document['querySelectorAll']('#time_select\x20input[type=\x22radio\x22]'), e['length'] === 0x0 && (await new Promise(m => setTimeout(m, 0x1f4)), c++);
        }
        b['close']();
        if (!e['length'])
            throw new Error('No\x20time\x20slots\x20found\x20after\x20multiple\x20attempts');
        const f = Math['floor'](Math['random']() * e['length']), g = e[f], h = g['closest']('tr'), i = h['querySelector']('td:nth-child(2)')?.['textContent']['trim']() || 'Unknown\x20time', j = g['getAttribute']('data-slots') || 'Unknown\x20slots';
        g['click']();
        const {__ab: k} = await chrome['storage']['local']['get']('__ab'), l = k === !![];
        if (l) {
            await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>AutoBook\x20Enabled!</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Selected\x20Time:\x20' + i + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white;\x22>Slots:\x20' + j + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Proceeding\x20with\x20automatic\x20booking...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xbb8);
            const m = document['getElementById']('submitbtn');
            if (m) {
                m['disabled'] && (m['disabled'] = ![], m['style']['opacity'] = '1');
                m['click'](), setTimeout(() => {
                    try {
                        const n = document['getElementById']('time_select');
                        if (n) {
                            const o = n['querySelectorAll']('tbody\x20tr'), p = [];
                            o['forEach']((q, r) => {
                                const s = q['querySelector']('td:nth-child(2)\x20div'), t = q['querySelector']('td:nth-child(3)\x20div'), u = q['querySelector']('input[type=\x22radio\x22]');
                                if (s && t) {
                                    const v = s['textContent']['trim'](), w = t['textContent']['trim'](), x = u ? u['id'] : 'N/A', y = u ? u['getAttribute']('data-slots') : 'N/A';
                                    p['push'](v + '\x20(' + w + '\x20slots,\x20ID:\x20' + x + ')');
                                }
                            });
                            if (p['length'] > 0x0)
                                a0a9('Available\x20Time\x20Slots\x20for\x20Selected\x20Date:\x20' + p['join'](',\x20'));
                            else {
                            }
                        } else {
                        }
                    } catch (q) {
                    }
                }, 0x64);
                if (a) {
                    await a0I();
                    const n = await new Promise(o => {
                        let p = ![];
                        a0ac(async q => {
                            await a0a9('Booking\x20submission\x20failed:\x20' + q['message'] + '\x20-\x20Time:\x20' + i + '\x20-\x20Error\x20found,\x20next\x20step\x20will\x20refresh\x20the\x20page'), await a0J(), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>❌\x20OFC\x20Booking\x20Failed</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>' + q['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Refreshing\x20page\x20to\x20retry...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xfa0), await chrome['storage']['local']['set']({
                                'dateSelectionInProgress': ![],
                                'preferredDateString': null,
                                'preferredDateId': null
                            }), a0r = ![], a0H(), p = !![], o(![]), setTimeout(() => {
                                window['location']['reload']();
                            }, 0x7d0);
                        }, () => {
                            !p && o(!![]);
                        }, 0x1e);
                    });
                    return n ? (await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>OFC\x20Booking\x20submitted!</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Time:\x20' + i + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20orange;\x22>30-minute\x20timer\x20started\x20for\x20consular\x20search</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Website\x20will\x20redirect\x20to\x20consular\x20page</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388), !![]) : ![];
                } else {
                    a0ac(async o => {
                        await a0a9('Booking\x20submission\x20failed:\x20' + o['message'] + '\x20-\x20Time:\x20' + i + '\x20-\x20Error\x20found,\x20next\x20step\x20will\x20refresh\x20the\x20page'), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>❌\x20Booking\x20Failed</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>' + o['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Refreshing\x20page\x20to\x20retry...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xfa0), await chrome['storage']['local']['set']({
                            'dateSelectionInProgress': ![],
                            'preferredDateString': null,
                            'preferredDateId': null
                        }), a0r = ![], a0H(), setTimeout(() => {
                            window['location']['reload']();
                        }, 0x7d0);
                    }, () => {
                    }, 0x1e), await a0a9('Consular\x20booking\x20submitted,\x20starting\x20appointment\x20confirmation\x20monitoring...');
                    if (!a) {
                        const o = await a0K();
                        o['active'] && await a0J();
                    }
                    a0y = !![], await a0a9('Appointment\x20confirmation\x20monitoring\x20activated'), await chrome['storage']['local']['set']({ 'bookingInProgress': !![] }), await a0aq();
                }
            } else
                await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>Error:\x20Submit\x20button\x20not\x20found</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Please\x20submit\x20manually</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388);
        } else {
            try {
                const q = document['getElementById']('time_select');
                if (q) {
                    const r = q['querySelectorAll']('tbody\x20tr'), s = [];
                    r['forEach']((t, u) => {
                        const v = t['querySelector']('td:nth-child(2)\x20div'), w = t['querySelector']('td:nth-child(3)\x20div'), x = t['querySelector']('input[type=\x22radio\x22]');
                        if (v && w) {
                            const y = v['textContent']['trim'](), z = w['textContent']['trim'](), A = x ? x['id'] : 'N/A', B = x ? x['getAttribute']('data-slots') : 'N/A';
                            s['push'](y + '\x20(' + z + '\x20slots,\x20ID:\x20' + A + ')');
                        }
                    });
                    if (s['length'] > 0x0)
                        await a0a9('Available\x20Time\x20Slots\x20for\x20Selected\x20Date\x20(Before\x20Manual\x20Confirmation):\x20' + s['join'](',\x20'));
                    else {
                    }
                } else {
                }
            } catch (t) {
            }
            const p = await Swal['fire']({
                'title': '🎉\x20Perfect\x20Time\x20Slot\x20Found!',
                'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22text-align:\x20center;\x20padding:\x2010px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#4CAF50;\x20font-size:\x2018px;\x20font-weight:\x20bold;\x20margin-bottom:\x2015px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20✅\x20Available\x20Appointment\x20Found!\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#333;\x20margin-bottom:\x2010px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>📅\x20Selected\x20Time:</strong>\x20' + i + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#333;\x20margin-bottom:\x2015px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>📊\x20Available\x20Slots:</strong>\x20' + j + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#666;\x20font-size:\x2014px;\x20margin-bottom:\x2020px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20Would\x20you\x20like\x20to\x20proceed\x20with\x20booking\x20this\x20appointment?\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#FF9800;\x20font-size:\x2012px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<em>💡\x20Tip:\x20Enable\x20\x22AutoBook\x22\x20in\x20the\x20extension\x20popup\x20to\x20automatically\x20book\x20future\x20appointments</em>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                'icon': 'success',
                'showCancelButton': !![],
                'confirmButtonText': '📝\x20Book\x20This\x20Appointment',
                'cancelButtonText': '❌\x20Cancel',
                'confirmButtonColor': '#4CAF50',
                'cancelButtonColor': '#f44336',
                'allowOutsideClick': ![],
                'allowEscapeKey': ![],
                'buttonsStyling': !![]
            });
            if (p['isConfirmed']) {
                const u = document['getElementById']('submitbtn');
                if (u) {
                    u['disabled'] && (u['disabled'] = ![], u['style']['opacity'] = '1');
                    u['click']();
                    if (a) {
                        await a0I();
                        const v = await new Promise(w => {
                            let x = ![];
                            a0ac(async y => {
                                await a0a9('Booking\x20submission\x20failed:\x20' + y['message'] + '\x20-\x20Time:\x20' + i + '\x20-\x20Error\x20found,\x20next\x20step\x20will\x20refresh\x20the\x20page'), await a0J(), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>❌\x20OFC\x20Booking\x20Failed</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>' + y['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Refreshing\x20page\x20to\x20retry...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xfa0), await chrome['storage']['local']['set']({
                                    'dateSelectionInProgress': ![],
                                    'preferredDateString': null,
                                    'preferredDateId': null
                                }), a0r = ![], a0H(), x = !![], w(![]), setTimeout(() => {
                                    window['location']['reload']();
                                }, 0x7d0);
                            }, () => {
                                !x && w(!![]);
                            }, 0x1e);
                        });
                        return v ? (await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>🎉\x20OFC\x20Booking\x20submitted!</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Time:\x20' + i + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20orange;\x22>30-minute\x20timer\x20started\x20for\x20consular\x20search</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Website\x20will\x20redirect\x20to\x20consular\x20page</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388), !![]) : ![];
                    } else {
                        a0ac(async w => {
                            await a0a9('Booking\x20submission\x20failed:\x20' + w['message'] + '\x20-\x20Time:\x20' + i + '\x20-\x20Error\x20found,\x20next\x20step\x20will\x20refresh\x20the\x20page'), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>❌\x20Booking\x20Failed</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>' + w['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Refreshing\x20page\x20to\x20retry...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xfa0), await chrome['storage']['local']['set']({
                                'dateSelectionInProgress': ![],
                                'preferredDateString': null,
                                'preferredDateId': null
                            }), a0r = ![], a0H(), setTimeout(() => {
                                window['location']['reload']();
                            }, 0x7d0);
                        }, () => {
                        }, 0x1e);
                        if (!a) {
                            const w = await a0K();
                            w['active'] && await a0J();
                        }
                        a0r = ![], a0H();
                    }
                } else
                    await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>Error:\x20Submit\x20button\x20not\x20found</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Please\x20submit\x20manually</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388);
            } else
                return await chrome['storage']['local']['set']({
                    'dateSelectionInProgress': ![],
                    'preferredDateString': null,
                    'preferredDateId': null
                }), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20orange\x22>⚠️\x20Booking\x20cancelled</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>The\x20system\x20will\x20continue\x20monitoring\x20for\x20appointments</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xfa0), ![];
        }
        return !![];
    } catch (x) {
        return await a0a9('Error\x20selecting\x20time\x20slot:\x20' + x['message']), await chrome['storage']['local']['set']({
            'dateSelectionInProgress': ![],
            'preferredDateString': null,
            'preferredDateId': null
        }), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>❌\x20Time\x20Slot\x20Selection\x20Failed</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>Error:\x20' + x['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Redirecting\x20to\x20home\x20page...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20', 0x1388), setTimeout(() => {
            window['location']['href'] = 'https://www.usvisascheduling.com/en-US/';
        }, 0x7d0), ![];
    }
}
async function a0ae(a, b = 0xbb8) {
    return new Promise((c, d) => {
        if (document['querySelector'](a))
            return c(document['querySelector'](a));
        const e = new MutationObserver(() => {
            document['querySelector'](a) && (e['disconnect'](), c(document['querySelector'](a)));
        });
        e['observe'](document['body'], {
            'childList': !![],
            'subtree': !![]
        }), setTimeout(() => {
            e['disconnect'](), d(new Error('Timeout\x20waiting\x20for\x20element:\x20' + a));
        }, b);
    });
}
async function a0af() {
    const a = window['location']['pathname'], b = {
            '/ofc-schedule': {
                '3f6bf614-b0db-ec11-a7b4-001dd80234f6': 'CHENNAI\x20VAC',
                '436bf614-b0db-ec11-a7b4-001dd80234f6': 'HYDERABAD\x20VAC',
                '466bf614-b0db-ec11-a7b4-001dd80234f6': 'KOLKATA\x20VAC',
                '486bf614-b0db-ec11-a7b4-001dd80234f6': 'MUMBAI\x20VAC',
                '4a6bf614-b0db-ec11-a7b4-001dd80234f6': 'NEW\x20DELHI\x20VAC'
            },
            '/schedule': {
                'c86af614-b0db-ec11-a7b4-001dd80234f6': 'CHENNAI',
                'ae6af614-b0db-ec11-a7b4-001dd80234f6': 'HYDERABAD',
                '816af614-b0db-ec11-a7b4-001dd80234f6': 'KOLKATA',
                '716af614-b0db-ec11-a7b4-001dd80234f6': 'MUMBAI',
                'e66af614-b0db-ec11-a7b4-001dd80234f6': 'NEW\x20DELHI'
            }
        };
    function c(i) {
        const j = {}, k = {
                'CHENNAI\x20VAC': {
                    'id': 'c86af614-b0db-ec11-a7b4-001dd80234f6',
                    'name': 'CHENNAI'
                },
                'HYDERABAD\x20VAC': {
                    'id': 'ae6af614-b0db-ec11-a7b4-001dd80234f6',
                    'name': 'HYDERABAD'
                },
                'KOLKATA\x20VAC': {
                    'id': '816af614-b0db-ec11-a7b4-001dd80234f6',
                    'name': 'KOLKATA'
                },
                'MUMBAI\x20VAC': {
                    'id': '716af614-b0db-ec11-a7b4-001dd80234f6',
                    'name': 'MUMBAI'
                },
                'NEW\x20DELHI\x20VAC': {
                    'id': 'e66af614-b0db-ec11-a7b4-001dd80234f6',
                    'name': 'NEW\x20DELHI'
                }
            };
        return Object['values'](i)['forEach'](l => {
            if (k[l]) {
                const m = k[l];
                j[m['id']] = m['name'];
            }
        }), j;
    }
    let d = {};
    if (a['includes']('/ofc-schedule'))
        d = b['/ofc-schedule'];
    else {
        if (a['includes']('/schedule'))
            d = b['/schedule'];
        else {
            let i = 0x0, j;
            while (i < 0xa) {
                j = document['getElementById']('post_select');
                if (j && j['options'] && typeof j['options'] === 'object' && 'length' in j['options'] && j['options']['length'] > 0x1)
                    break;
                await new Promise(k => setTimeout(k, 0x3e8)), i++;
            }
            if (!j || !j['options'] || typeof j['options'] !== 'object' || !('length' in j['options']) || j['options']['length'] <= 0x1) {
                const k = {}, l = new URLSearchParams(window['location']['search']), m = l['get']('postId');
                if (m) {
                    const o = document['querySelector']('h1,\x20h2,\x20.location-name,\x20.city-name')?.['textContent'] || 'Unknown\x20City';
                    k[m] = o;
                } else {
                    if (j && j['options'] && j['options']['length'] === 0x1 && j['options'][0x0]['value']) {
                        const p = j['options'][0x0];
                        k[p['value']] = p['text']['trim']();
                    } else {
                        if (pageData['postId']) {
                            const q = document['querySelector']('#post_select\x20option[value=\x22' + pageData['postId'] + '\x22]')?.['textContent'] || 'Unknown';
                            locationsArray['push']([
                                pageData['postId'],
                                q
                            ]);
                        } else {
                            a0r = ![];
                            return;
                        }
                    }
                }
                let n = { 'allCities': k };
                if (a['includes']('/ofc-schedule'))
                    n['selectedOfcCities'] = k;
                else
                    a['includes']('/schedule') ? n['selectedConsularCities'] = k : (n['selectedOfcCities'] = k, n['selectedConsularCities'] = k);
                return await chrome['storage']['sync']['set'](n), k;
            }
            Array['from'](j['options'])['forEach'](r => {
                r['value'] && r['text'] && (d[r['value']] = r['text']['trim']());
            });
        }
    }
    await chrome['storage']['sync']['set']({ 'allCities': d });
    let f = {}, g = '', h = '';
    if (a['includes']('/ofc-schedule')) {
        const {
            selectedOfcCities: selectedOfcCities = {}
        } = await chrome['storage']['sync']['get']('selectedOfcCities');
        f = selectedOfcCities, g = 'selectedOfcCities', h = 'OFC';
    } else {
        if (a['includes']('/schedule')) {
            const {
                selectedConsularCities: selectedConsularCities = {}
            } = await chrome['storage']['sync']['get']('selectedConsularCities');
            f = selectedConsularCities, g = 'selectedConsularCities', h = 'Consular';
        } else {
            const {
                selectedOfcCities: selectedOfcCities = {},
                selectedConsularCities: selectedConsularCities = {}
            } = await chrome['storage']['sync']['get']([
                'selectedOfcCities',
                'selectedConsularCities'
            ]);
            f = {
                ...selectedOfcCities,
                ...selectedConsularCities
            }, g = 'selectedCities', h = 'Unknown';
        }
    }
    if (Object['keys'](f)['length'] === 0x0) {
        a0x = !![];
        const r = await Swal['fire']({
            'title': 'Select\x20' + h + '\x20Cities',
            'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22text-align:\x20left;\x20max-height:\x20300px;\x20overflow-y:\x20auto;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Please\x20select\x20the\x20cities\x20you\x20want\x20to\x20monitor\x20for\x20' + h + '\x20appointments:</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + Object['entries'](d)['map'](([s, t]) => '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22form-check\x22\x20style=\x22margin:\x2010px\x200;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20class=\x22form-check-input\x22\x20type=\x22checkbox\x22\x20value=\x22' + s + '\x22\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id=\x22city_' + s + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<label\x20class=\x22form-check-label\x22\x20for=\x22city_' + s + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + t['replace']('\x20VAC', '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20')['join']('') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
            'confirmButtonText': 'Save\x20Selection',
            'showCancelButton': !![],
            'allowOutsideClick': ![],
            'preConfirm': () => {
                const s = {};
                Object['keys'](d)['forEach'](t => {
                    const u = document['getElementById']('city_' + t);
                    u && u['checked'] && (s[t] = d[t]);
                });
                if (Object['keys'](s)['length'] === 0x0)
                    return Swal['showValidationMessage']('Please\x20select\x20at\x20least\x20one\x20city'), ![];
                return s;
            }
        });
        if (r['isConfirmed'] && r['value']) {
            await chrome['storage']['sync']['set']({ [g]: r['value'] });
            if (h === 'OFC') {
                a0r = ![], a0w++;
                const s = c(r['value']), {
                        selectedConsularCities: selectedConsularCities = {}
                    } = await chrome['storage']['sync']['get']('selectedConsularCities'), t = b['/schedule'];
                let u = 'Select\x20Consular\x20Cities', v = '';
                Object['keys'](selectedConsularCities)['length'] > 0x0 && (u = 'Update\x20Consular\x20Cities', v = '<p\x20style=\x22color:\x20#FF9800;\x20font-size:\x2013px;\x20margin-bottom:\x2015px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Current\x20Consular\x20cities:</strong>\x20' + Object['values'](selectedConsularCities)['join'](',\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>');
                try {
                    Swal['close']();
                } catch (x) {
                }
                await new Promise(y => setTimeout(y, 0x1f4));
                const w = await Swal['fire']({
                    'title': u,
                    'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22text-align:\x20left;\x20max-height:\x20300px;\x20overflow-y:\x20auto;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Please\x20select\x20the\x20<strong>Consular\x20cities</strong>\x20you\x20want\x20to\x20monitor:</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#666;\x20font-size:\x2014px;\x20margin-bottom:\x2015px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<em>💡\x20Tip:\x20You\x20can\x20select\x20different\x20cities\x20for\x20Consular\x20appointments\x20than\x20your\x20OFC\x20selection</em>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#4CAF50;\x20font-size:\x2013px;\x20margin-bottom:\x2015px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Your\x20OFC\x20selection:</strong>\x20' + Object['values'](r['value'])['map'](y => y['replace']('\x20VAC', ''))['join'](',\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + v + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + Object['entries'](t)['map'](([y, z]) => {
                        const A = selectedConsularCities[y], B = Object['values'](s)['includes'](z), C = A || B && Object['keys'](selectedConsularCities)['length'] === 0x0;
                        return '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22form-check\x22\x20style=\x22margin:\x2010px\x200;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20class=\x22form-check-input\x22\x20type=\x22checkbox\x22\x20value=\x22' + y + '\x22\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id=\x22consular_city_' + y + '\x22\x20' + (C ? 'checked' : '') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<label\x20class=\x22form-check-label\x22\x20for=\x22consular_city_' + y + '\x22\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20style=\x22' + (B ? 'font-weight:\x20bold;\x20color:\x20#4CAF50;' : '') + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + z + '\x20' + (B ? '(matches\x20your\x20OFC\x20selection)' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20';
                    })['join']('') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                    'confirmButtonText': 'Save\x20Consular\x20Cities',
                    'showCancelButton': ![],
                    'allowOutsideClick': ![],
                    'allowEscapeKey': ![],
                    'preConfirm': () => {
                        const y = {};
                        Object['keys'](t)['forEach'](z => {
                            const A = document['getElementById']('consular_city_' + z);
                            A && A['checked'] && (y[z] = t[z]);
                        });
                        if (Object['keys'](y)['length'] === 0x0)
                            return Swal['showValidationMessage']('Please\x20select\x20at\x20least\x20one\x20consular\x20city'), ![];
                        return y;
                    }
                });
                w['isConfirmed'] && w['value'] ? (await chrome['storage']['sync']['set']({ 'selectedConsularCities': w['value'] }), await Swal['fire']({
                    'title': 'Setup\x20Complete!',
                    'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22text-align:\x20left;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>✅\x20<strong>OFC\x20Cities:</strong>\x20' + Object['values'](r['value'])['join'](',\x20') + '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>✅\x20<strong>Consular\x20Cities:</strong>\x20' + Object['values'](w['value'])['join'](',\x20') + '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#4CAF50;\x20margin-top:\x2015px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Both\x20appointment\x20types\x20are\x20now\x20configured\x20for\x20monitoring!</strong>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#2196F3;\x20margin-top:\x2010px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20The\x20system\x20will\x20now\x20start\x20checking\x20for\x20available\x20dates...\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                    'icon': 'success',
                    'confirmButtonText': 'Start\x20Monitoring!',
                    'timer': 0x1f40,
                    'allowOutsideClick': ![]
                }), a0x = ![]) : (await Swal['fire']({
                    'title': 'Incomplete\x20Setup',
                    'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>⚠️\x20<strong>OFC\x20cities\x20selected\x20but\x20Consular\x20cities\x20not\x20configured.</strong></p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>You\x20can\x20complete\x20the\x20setup\x20later\x20by\x20visiting\x20the\x20Consular\x20appointment\x20page.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Only\x20OFC\x20monitoring\x20will\x20be\x20active\x20for\x20now.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                    'icon': 'warning',
                    'confirmButtonText': 'Continue\x20with\x20OFC\x20Only',
                    'timer': 0x1770
                }), a0x = ![]);
            } else
                h === 'Consular' && (await Swal['fire']({
                    'title': 'Consular\x20Cities\x20Selected!',
                    'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>You\x20have\x20selected\x20cities\x20for\x20<strong>Consular\x20appointments</strong>.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Make\x20sure\x20you\x20have\x20also\x20selected\x20cities\x20for\x20<strong>OFC\x20appointments</strong>.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Both\x20selections\x20are\x20required\x20for\x20complete\x20monitoring.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#2196F3;\x20margin-top:\x2010px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20The\x20system\x20will\x20now\x20start\x20checking\x20for\x20available\x20dates...\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                    'icon': 'success',
                    'confirmButtonText': 'Start\x20Monitoring!',
                    'timer': 0x1770,
                    'allowOutsideClick': ![]
                }), a0x = ![]);
            return r['value'];
        } else
            a0x = ![];
    }
    return f;
}
async function a0ag(a, b) {
    const c = await a0O();
    if (c)
        return;
    if (!a0u)
        return;
    if (a0p)
        return;
    try {
        a0p = !![], await a0a0(a, b);
    } catch (d) {
        if (a0u) {
            const e = await a0a3();
            setTimeout(() => a0ag(a, b), e);
        }
    } finally {
        a0p = ![];
    }
}
async function a0ah(a, b) {
    if (!a0u)
        return;
    try {
        const c = await a0Z();
        if (!c['startDate'] || !c['endDate']) {
            await Swal['fire']({
                'title': 'Date\x20Range\x20Required',
                'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>Please\x20add\x20<strong>Start\x20Date</strong>\x20and\x20<strong>End\x20Date</strong>\x20in\x20the\x20extension\x20popup\x20to\x20continue\x20using\x20the\x20bot.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>The\x20bot\x20needs\x20a\x20date\x20range\x20to\x20search\x20for\x20available\x20appointments.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                'icon': 'warning',
                'confirmButtonText': 'OK,\x20I\x27ll\x20Set\x20the\x20Dates',
                'allowOutsideClick': ![],
                'allowEscapeKey': ![]
            });
            return;
        }
        let d = [a['primaryId']];
        try {
            const m = await chrome['storage']['local']['get'](['applications']);
            if (m['applications'] && Array['isArray'](m['applications']) && m['applications']['length'] > 0x0)
                d = m['applications'];
            else {
            }
        } catch (n) {
        }
        const f = new URLSearchParams();
        f['append']('parameters', JSON['stringify']({
            'primaryId': a['primaryId'],
            'applications': d,
            'scheduleDayId': '',
            'scheduleEntryId': '',
            'postId': a['postId'],
            'isReschedule': window['location']['href']['includes']('reschedule=true') ? 'true' : 'false'
        }));
        const g = Date['now'](), h = 'https://www.usvisascheduling.com/en-US/custom-actions/?route=/api/v1/schedule-group/get-family-ofc-schedule-days&appd=' + a['contactId'] + '&cacheString=' + g, j = await fetch(h, {
                'method': 'POST',
                'headers': {
                    'accept': 'application/json,\x20text/javascript,\x20*/*;\x20q=0.01',
                    'content-type': 'application/x-www-form-urlencoded;\x20charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': b['getCookieHeader']()
                },
                'body': f['toString'](),
                'credentials': 'include'
            });
        if (!j['ok'])
            throw new Error('HTTP\x20error!\x20status:\x20' + j['status']);
        let k;
        try {
            const o = await j['text']();
            k = JSON['parse'](o);
        } catch (p) {
            await a0a9('JSON\x20parse\x20error\x20occurred:\x20' + p['message'] + '.\x20Refreshing\x20the\x20page.'), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20orange\x22>Invalid\x20response\x20detected</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>Refreshing\x20the\x20page\x20to\x20recover...</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0xbb8), setTimeout(() => {
                window['location']['reload']();
            }, 0xdac);
            throw new Error('Invalid\x20JSON\x20response:\x20' + p['message']);
        }
        const l = { ...k };
        l['Token'] && (l['Token'] = '[Token\x20length:\x20' + l['Token']['length'] + '\x20chars]');
        if (k['ScheduleDays'] && k['ScheduleDays']['length'] > 0x0) {
            const q = k['ScheduleDays']['sort']((s, t) => new Date(s['Date']) - new Date(t['Date']));
            if (q['length'] > 0x0) {
                const s = q[0x0]['Date'];
                let t;
                if (s['includes']('T')) {
                    const [B] = s['split']('T'), [C, D, E] = B['split']('-')['map'](Number);
                    t = new Date(C, D - 0x1, E);
                } else {
                    const [F, G, H] = s['split']('-')['map'](Number);
                    t = new Date(F, G - 0x1, H);
                }
                const u = t['toLocaleDateString']('en-US', {
                        'year': 'numeric',
                        'month': 'long',
                        'day': 'numeric'
                    }), v = c['startDate']['split']('-')['map'](Number), w = c['endDate']['split']('-')['map'](Number), x = new Date(v[0x0], v[0x1] - 0x1, v[0x2]), y = new Date(w[0x0], w[0x1] - 0x1, w[0x2]), z = t >= x && t <= y, A = q['filter'](I => {
                        const J = I['Date'];
                        let K;
                        if (J['includes']('T')) {
                            const [L] = J['split']('T'), [M, N, O] = L['split']('-')['map'](Number);
                            K = new Date(M, N - 0x1, O);
                        } else {
                            const [P, Q, R] = J['split']('-')['map'](Number);
                            K = new Date(P, Q - 0x1, R);
                        }
                        return K >= x && K <= y;
                    });
                if (A['length'] > 0x0) {
                    const I = A['slice'](0x0, 0x5)['map'](K => {
                            const L = K['Date'];
                            let M;
                            if (L['includes']('T')) {
                                const [N] = L['split']('T'), [O, P, Q] = N['split']('-')['map'](Number);
                                M = new Date(O, P - 0x1, Q);
                            } else {
                                const [R, S, T] = L['split']('-')['map'](Number);
                                M = new Date(R, S - 0x1, T);
                            }
                            return M['toLocaleDateString']('en-US', {
                                'year': 'numeric',
                                'month': 'long',
                                'day': 'numeric'
                            });
                        })['join'](',\x20'), J = z ? 'EARLIEST\x20IN\x20RANGE' : 'EARLIEST\x20OUT\x20OF\x20RANGE';
                    await a0a9('OFC\x20\x20-\x20City:\x20' + a['cityName'] + '\x20-\x20Earliest\x20available\x20date:\x20' + u + '\x20(' + J + ')\x20-\x20First\x205\x20dates\x20within\x20range:\x20' + I + '\x20(' + A['length'] + '\x20dates\x20within\x20range,\x20' + q['length'] + '\x20total\x20dates\x20available)');
                } else
                    await a0a9('OFC\x20\x20-\x20City:\x20' + a['cityName'] + '\x20-\x20Earliest\x20available\x20date:\x20' + u + '\x20(' + q['length'] + '\x20dates\x20available,\x20NONE\x20within\x20preferred\x20range)');
            }
            let r = ![];
            for (const K of q) {
                const L = K['Date'];
                let M;
                if (L['includes']('T')) {
                    const [U] = L['split']('T'), [V, W, X] = U['split']('-')['map'](Number);
                    M = new Date(V, W - 0x1, X);
                } else {
                    const [Y, Z, a0] = L['split']('-')['map'](Number);
                    M = new Date(Y, Z - 0x1, a0);
                }
                const N = K['ID'], O = M['toLocaleDateString']('en-US', {
                        'year': 'numeric',
                        'month': 'long',
                        'day': 'numeric'
                    }), P = c['startDate']['split']('-')['map'](Number), Q = c['endDate']['split']('-')['map'](Number), R = new Date(P[0x0], P[0x1] - 0x1, P[0x2]), S = new Date(Q[0x0], Q[0x1] - 0x1, Q[0x2]), T = M >= R && M <= S;
                if (T) {
                    r = !![], a0r = ![];
                    const a1 = document['getElementById']('post_select');
                    if (a1)
                        for (let a8 = 0x0; a8 < a1['options']['length']; a8++) {
                            if (a1['options'][a8]['value'] === a['postId']) {
                                a1['selectedIndex'] = a8;
                                const a9 = new Event('change', { 'bubbles': !![] });
                                a1['dispatchEvent'](a9);
                                break;
                            }
                        }
                    else {
                    }
                    let a2 = ![], a3 = 0x0;
                    const a4 = 0xa;
                    while (!a2 && a3 < a4) {
                        await new Promise(ac => setTimeout(ac, 0x1f4));
                        const aa = document['querySelector']('.ui-datepicker-month'), ab = document['querySelector']('.ui-datepicker-year');
                        aa && ab ? a2 = !![] : a3++;
                    }
                    if (!a2) {
                        await a0a9('Failed\x20to\x20load\x20calendar\x20for\x20city:\x20' + a['cityName']);
                        return;
                    }
                    const a5 = await a0aa(M), a6 = window['location']['pathname']['includes']('/ofc-schedule'), a7 = await a0ad(a6);
                    a6 && a7 && (await a0I(), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20green\x22>✅\x20OFC\x20Appointment\x20Booked!</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>30-minute\x20timer\x20started\x20for\x20consular\x20search</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Website\x20will\x20redirect\x20to\x20consular\x20page\x20automatically</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 0x1770));
                    break;
                }
            }
            if (!r) {
                const ac = q[0x0]['Date'];
                let ad;
                if (ac['includes']('T')) {
                    const [af] = ac['split']('T'), [ag, ah, ai] = af['split']('-')['map'](Number);
                    ad = new Date(ag, ah - 0x1, ai);
                } else {
                    const [aj, ak, al] = ac['split']('-')['map'](Number);
                    ad = new Date(aj, ak - 0x1, al);
                }
                const ae = ad['toLocaleDateString']('en-US', {
                    'year': 'numeric',
                    'month': 'long',
                    'day': 'numeric'
                });
                await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>Checking\x20OFC\x20dates</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>City:\x20' + a['cityName'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>Earliest\x20availability:\x20' + ae + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Preferred\x20range:\x20' + a0a6(c['startDate'], c['endDate']) + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>No\x20dates\x20found\x20within\x20preferred\x20range</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Checked\x20@\x20' + new Date()['toLocaleString']() + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20');
            }
        } else
            await a0a9('OFC\x20\x20-\x20City:\x20' + a['cityName'] + '\x20-\x20No\x20available\x20dates\x20found'), await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20white\x22>No\x20OFC\x20dates\x20available</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>City:\x20' + a['cityName'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Preferred\x20range:\x20' + a0a6(c['startDate'], c['endDate']) + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Checked\x20@\x20' + new Date()['toLocaleString']() + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
    } catch (am) {
        await a0a9('OFC\x20\x20-\x20City:\x20' + (a['cityName'] || 'Unknown') + '\x20-\x20Error:\x20' + am['message']);
        if (am['message'] && (am['message']['includes']('429') || am['message']['includes']('rate\x20limit') || am['message']['includes']('too\x20many\x20requests'))) {
            await Swal['fire']({
                'title': '🚦\x20Consulate\x20sent\x20Error\x20429',
                'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22text-align:\x20center;\x20padding:\x2020px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h3\x20style=\x22color:\x20#ff6b35;\x20margin-bottom:\x2020px;\x22>⚠️\x20Server\x20Rate\x20Limit\x20Detected</h3>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin-bottom:\x2015px;\x22>The\x20server\x20is\x20receiving\x20too\x20many\x20requests\x20and\x20has\x20temporarily\x20blocked\x20further\x20requests.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin-bottom:\x2015px;\x22><strong>Please\x20turn\x20off\x20the\x20bot\x20for\x20a\x20few\x20hours</strong>\x20to\x20allow\x20the\x20rate\x20limit\x20to\x20reset.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22color:\x20#666;\x20font-size:\x2014px;\x20margin-bottom:\x2020px;\x22>This\x20helps\x20prevent\x20your\x20account\x20from\x20being\x20temporarily\x20suspended.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22background:\x20#f8f9fa;\x20padding:\x2015px;\x20border-radius:\x208px;\x20margin:\x2015px\x200;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin:\x200;\x20color:\x20#495057;\x22><strong>💡\x20Recommended\x20Action:</strong></p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20style=\x22margin:\x205px\x200\x200\x200;\x20color:\x20#495057;\x22>Wait\x202-4\x20hours\x20before\x20reactivating\x20the\x20bot</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                'icon': 'warning',
                'confirmButtonText': 'I\x27ll\x20Turn\x20Off\x20the\x20Bot',
                'allowOutsideClick': ![],
                'allowEscapeKey': ![],
                'customClass': { 'popup': 'swal-wide' }
            }), a0r = ![], a0H();
            return;
        }
        let an = 'Unknown';
        try {
            storageData && storageData['startDate'] && storageData['endDate'] && (an = a0a6(storageData['startDate'], storageData['endDate']));
        } catch (ao) {
        }
        await a0a5('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20red\x22>Error\x20checking\x20OFC\x20dates:\x20' + am['message'] + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20lightgreen;\x22>City:\x20' + (a['cityName'] || 'Unknown') + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Preferred\x20range:\x20' + an + '</span><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22color:\x20yellow;\x22>Checked\x20@\x20' + new Date()['toLocaleString']() + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20'), setTimeout(() => {
            window['location']['href'] = 'https://www.usvisascheduling.com/en-US/';
        }, 0xbb8);
    }
}
async function a0ai() {
    try {
        const {
                profiles: profiles = {},
                currentProfile: currentProfile = 'default',
                selectedOfcCities: selectedOfcCities = {},
                selectedConsularCities: selectedConsularCities = {},
                allCities: allCities = {},
                startDate: a,
                endDate: b
            } = await chrome['storage']['sync']['get']([
                'profiles',
                'currentProfile',
                'selectedOfcCities',
                'selectedConsularCities',
                'allCities',
                'startDate',
                'endDate'
            ]), c = profiles[currentProfile] || {}, d = {
                'username': c['username'] || '',
                'password': c['password'] || '',
                'apiKey': c['apiKey'] || '',
                'question1': c['question1'] || '',
                'answer1': c['answer1'] || '',
                'question2': c['question2'] || '',
                'answer2': c['answer2'] || '',
                'question3': c['question3'] || '',
                'answer3': c['answer3'] || '',
                'startDate': a || '',
                'endDate': b || '',
                'selectedOfcCities': selectedOfcCities || {},
                'selectedConsularCities': selectedConsularCities || {},
                'allCities': allCities || {},
                'currentProfile': currentProfile,
                'hasRequiredData'() {
                    const e = Object['keys'](this['selectedOfcCities'])['length'] > 0x0, f = Object['keys'](this['selectedConsularCities'])['length'] > 0x0, g = e || f, h = this['startDate'] && this['endDate'], i = this['username'] && this['password'];
                    return h && g;
                },
                'getSelectedCitiesData'(e = 'auto') {
                    let f = {};
                    if (e === 'ofc')
                        f = this['selectedOfcCities'];
                    else {
                        if (e === 'consular')
                            f = this['selectedConsularCities'];
                        else {
                            const g = window['location']['pathname'];
                            if (g['includes']('/ofc-schedule'))
                                f = this['selectedOfcCities'];
                            else
                                g['includes']('/schedule') ? f = this['selectedConsularCities'] : f = {
                                    ...this['selectedOfcCities'],
                                    ...this['selectedConsularCities']
                                };
                        }
                    }
                    return Object['entries'](f)['map'](([h, i]) => ({
                        'id': h,
                        'name': i,
                        'postId': h,
                        'cityName': i
                    }));
                }
            };
        return d;
    } catch (e) {
        throw new Error('Failed\x20to\x20get\x20storage\x20data:\x20' + e['message']);
    }
}
function a0aj(a) {
    try {
        if (!a)
            return ![];
        if (!a['startDate'] || !a['endDate'])
            return ![];
        if (Object['keys'](a['selectedOfcCities'] || {})['length'] === 0x0 && Object['keys'](a['selectedConsularCities'] || {})['length'] === 0x0)
            return ![];
        return !![];
    } catch (b) {
        return ![];
    }
}
async function a0ak() {
    try {
        const a = await a0R();
        if (a && (a['contactId'] || a['primaryId']))
            return a;
        const b = await chrome['storage']['local']['get']([
            'contactId',
            'primaryId',
            'postId'
        ]);
        if (b['contactId'] && b['primaryId'])
            return {
                'contactId': b['contactId'],
                'primaryId': b['primaryId'],
                'postId': b['postId']
            };
        const c = document['querySelector']('[data-application-id]')?.['dataset']['primaryId'] || document['querySelector']('[data-primary-id]')?.['dataset']['primaryId'] || document['querySelector']('input[name=\x22primaryId\x22]')?.['value'], d = document['querySelector']('[data-contact-id]')?.['dataset']['contactId'] || document['querySelector']('[data-appd]')?.['dataset']['appd'] || document['querySelector']('input[name=\x22contactId\x22]')?.['value'], e = document['querySelector']('[data-post-id]')?.['dataset']['postId'] || document['querySelector']('select#post_select')?.['value'];
        if (c || d) {
            const f = {
                'primaryId': c,
                'contactId': d,
                'postId': e
            };
            return c && d && await chrome['storage']['local']['set'](f), f;
        }
        return null;
    } catch (g) {
        return null;
    }
}
const a0al = chrome['runtime']['connect']({ 'name': 'scheduler' });
a0al['onConnect'] && a0al['onConnect']['addListener'](function () {
}), a0al['onDisconnect'] && a0al['onDisconnect']['addListener'](function () {
    setTimeout(() => {
        try {
            const a = chrome['runtime']['connect']({ 'name': 'scheduler_reconnect' });
        } catch (b) {
        }
    }, 0x1388);
});
function a0am() {
    a0H();
}
a0al['onMessage']['addListener'](async function (a) {
    if (a['action'] == 'fetch_info') {
        let b = a['data']['$active'];
        a0u = b;
        if (b) {
            if (window['location']['href']['includes']('/appointment-confirmation/'))
                a0Q();
            else {
                if (await a0O()) {
                } else
                    a0Q();
            }
        } else
            a0am();
    } else {
        if (a['action'] == 'activate') {
            let c = a['status'];
            a0u = c, c ? a0Q() : a0am();
        }
    }
}), a0al['postMessage']({ 'action': 'fetch_info' }), setInterval(() => {
}, 0x7530);
async function a0an(a, b, c, d, e, f = null) {
    if (!a)
        return { 'skipped': !![] };
    try {
        let g = '🎉\x20US\x20Visa\x20Appointment\x20Confirmed!\x0a\x0a';
        g += '📧\x20Account:\x20' + c + '\x0a', g += '📅\x20Date:\x20' + e + '\x0a', g += '🌍\x20Location:\x20' + d + '\x0a';
        f && (g += '⏰\x20Time:\x20' + f + '\x0a');
        if (b?.['primaryApplicantDetails']?.['appointmentMadeBy']) {
            const l = b['primaryApplicantDetails']['appointmentMadeBy']['replace'](/\s+/g, '\x20')['trim']();
            g += '👤\x20Applicant:\x20' + l + '\x0a';
        }
        b?.['consularAppointmentDetails']?.[0x0]?.['appointmentDate'] && (g += '📅\x20Appointment:\x20' + b['consularAppointmentDetails'][0x0]['appointmentDate'] + '\x0a');
        g += '\x0aCheck\x20your\x20email\x20for\x20complete\x20details!';
        const h = 'ad8sf5aokfr2nhrmr4zoom7g4or92i', i = {
                'token': h,
                'user': a,
                'message': g,
                'title': '🎉\x20Visa\x20Appointment\x20Confirmed!',
                'priority': 0x1,
                'url': 'https://www.usvisascheduling.com',
                'url_title': 'Check\x20Your\x20Appointment'
            }, j = await fetch('https://api.pushover.net/1/messages.json', {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
                'body': new URLSearchParams(i)
            }), k = await j['json']();
        return j['ok'] && k['status'] === 0x1 ? (await a0a9('Pushover\x20notification\x20sent\x20successfully'), {
            'success': !![],
            'result': k
        }) : (await a0a9('Pushover\x20notification\x20failed:\x20' + (k['errors'] ? k['errors']['join'](',\x20') : 'Unknown\x20error')), {
            'success': ![],
            'error': k['errors'] || 'Unknown\x20error'
        });
    } catch (m) {
        return await a0a9('Error\x20sending\x20Pushover\x20notification:\x20' + m['message']), {
            'success': ![],
            'error': m['message']
        };
    }
}
async function a0ao() {
    try {
        const a = document['querySelectorAll']('span.text-bold');
        for (const b of a) {
            if (b['textContent']['trim']() === 'Visa\x20Information') {
                const c = b['closest']('div');
                if (c) {
                    const d = c['querySelector']('p');
                    if (d) {
                        const e = d['textContent']['trim'](), f = e['match'](/([A-Z]\d+(?:\/[A-Z]\d+)*)/);
                        if (f) {
                            const g = f[0x1];
                            return await chrome['storage']['sync']['set']({
                                'scrapedVisaType': g,
                                'visaTypeScrapedAt': new Date()['toISOString']()
                            }), g;
                        } else {
                        }
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
async function a0ap() {
    await a0a9('Starting\x20to\x20scrape\x20appointment\x20confirmation\x20details');
    try {
        const a = {
                'primaryApplicantDetails': {},
                'consularAppointmentDetails': []
            }, b = [...document['querySelectorAll']('h2')]['find'](d => d['textContent']['includes']('PRIMARY\x20APPLICANT\x20DETAILS'));
        if (b) {
            let d = b['nextElementSibling'], e = null;
            while (d && !e) {
                if (d['tagName'] === 'TABLE')
                    e = d;
                else
                    d['tagName'] === 'DIV' && (e = d['querySelector']('table'));
                !e && (d = d['nextElementSibling']);
            }
            if (e) {
                const f = e['querySelectorAll']('tr');
                f['forEach'](g => {
                    const h = g['querySelectorAll']('td');
                    if (h['length'] >= 0x2) {
                        const i = h[0x0]['textContent']['trim']()['replace'](':', ''), j = h[0x1]['textContent']['trim']();
                        if (i['includes']('Appointment(s)\x20Made\x20By'))
                            a['primaryApplicantDetails']['appointmentMadeBy'] = j;
                        else {
                            if (i['includes']('Number\x20of\x20Applicants'))
                                a['primaryApplicantDetails']['numberOfApplicants'] = j;
                            else
                                i['includes']('Visa\x20Class') && (a['primaryApplicantDetails']['visaClass'] = j);
                        }
                    }
                });
            } else {
            }
        } else {
        }
        const c = [...document['querySelectorAll']('h2')]['find'](g => g['textContent']['includes']('CONSULAR\x20APPOINTMENT\x20DETAILS'));
        if (c) {
            let g = c['nextElementSibling'], h = 0x0;
            while (g) {
                if (g['tagName'] === 'H2')
                    break;
                if (g['tagName'] === 'DIV') {
                    const i = g['querySelectorAll']('table');
                    i['forEach']((j, k) => {
                        const l = {}, m = j['querySelectorAll']('tr');
                        m['forEach'](n => {
                            const o = n['querySelectorAll']('td');
                            if (o['length'] >= 0x2) {
                                const p = o[0x0]['textContent']['trim']()['replace'](':', ''), q = o[0x1]['textContent']['trim']();
                                if (p['includes']('Consular\x20Appointment\x20Number'))
                                    l['appointmentNumber'] = q, h = parseInt(q) || h + 0x1;
                                else {
                                    if (p['includes']('Applicant\x20Name'))
                                        l['applicantName'] = q;
                                    else {
                                        if (p['includes']('City,\x20Postal\x20Code'))
                                            l['cityPostalCode'] = q;
                                        else
                                            p['includes']('Consular\x20Appointment\x20Date') && (l['appointmentDate'] = q);
                                    }
                                }
                            }
                        });
                        if (l['appointmentDate'] || l['applicantName'])
                            a['consularAppointmentDetails']['push'](l);
                        else {
                        }
                    });
                }
                g = g['nextElementSibling'];
            }
        } else {
        }
        return await a0a9('Scraped\x20confirmation\x20details:\x20' + (a['primaryApplicantDetails']['numberOfApplicants'] || 'Unknown') + '\x20applicants'), a;
    } catch (j) {
        return await a0a9('Error\x20scraping\x20confirmation\x20details:\x20' + j['message']), null;
    }
}
async function a0aq() {
    await a0a9('Starting\x20appointment\x20confirmation\x20handling');
    try {
        if (window['location']['href']['includes']('/appointment-confirmation/')) {
            await a0a9('Already\x20on\x20appointment\x20confirmation\x20page\x20-\x20appointment\x20confirmed\x20successfully');
            const b = await a0ap();
            await chrome['storage']['local']['remove']('bookingInProgress'), await a0a9('Stopping\x20all\x20bot\x20operations\x20-\x20appointment\x20confirmed'), a0r = ![], a0y = ![], a0H();
            return;
        }
        await a0a9('Waiting\x20for\x20appointment\x20confirmation\x20redirect\x20to:\x20https://www.usvisascheduling.com/en-US/appointment-confirmation/');
        let a = setInterval(async () => {
            if (!a0y) {
                clearInterval(a);
                return;
            }
            if (window['location']['href']['includes']('/appointment-confirmation/')) {
                await a0a9('Redirected\x20to\x20appointment\x20confirmation\x20page\x20-\x20appointment\x20confirmed\x20successfully'), clearInterval(a);
                const c = await a0ap();
                await chrome['storage']['local']['remove']('bookingInProgress'), await a0a9('Stopping\x20all\x20bot\x20operations\x20-\x20appointment\x20confirmed'), a0r = ![], a0y = ![], a0H();
            }
        }, 0x3e8);
        setTimeout(async () => {
            if (a0y) {
                await a0a9('Appointment\x20confirmation\x20timeout\x20-\x20proceeding\x20with\x20notification'), clearInterval(a);
                const c = await a0ap();
                await chrome['storage']['local']['remove']('bookingInProgress'), await a0a9('Stopping\x20all\x20bot\x20operations\x20-\x20appointment\x20processed\x20(timeout)'), a0r = ![], a0y = ![], a0H();
            }
        }, 0x3a98);
    } catch (c) {
        await a0a9('Error\x20in\x20appointment\x20confirmation\x20handling:\x20' + c['message']), await chrome['storage']['local']['remove']('bookingInProgress'), a0r = ![], a0y = ![], a0H();
    }
}
async function a0ar(a, b, c) {
    try {
        const d = window['location']['href'];
        let e = '';
        if (d['includes']('/ofc-schedule'))
            d['includes']('reschedule=true') ? e = '/api/v1/schedule-group/query-family-members-ofc-reschedule' : e = '/api/v1/schedule-group/query-family-members-ofc';
        else
            d['includes']('/schedule') ? d['includes']('reschedule=true') ? e = '/api/v1/schedule-group/query-family-members-consular-reschedule' : e = '/api/v1/schedule-group/query-family-members-consular' : e = '/api/v1/schedule-group/query-family-members-ofc-reschedule';
        const f = Date['now'](), g = 'https://www.usvisascheduling.com/en-US/custom-actions/?route=' + e + '&appd=' + b + '&cacheString=' + f, h = new URLSearchParams();
        h['append']('parameters', JSON['stringify']({
            'primaryId': a,
            'visaClass': 'all'
        }));
        const i = {
                'accept': 'application/json,\x20text/javascript,\x20*/*;\x20q=0.01',
                'content-type': 'application/x-www-form-urlencoded;\x20charset=UTF-8',
                'x-requested-with': 'XMLHttpRequest',
                'cookie': c ? c['getCookieHeader']() : document['cookie']
            }, j = await fetch(g, {
                'method': 'POST',
                'headers': i,
                'body': h
            });
        if (!j['ok'])
            throw new Error('Failed\x20to\x20fetch\x20family\x20members:\x20' + j['status'] + '\x20' + j['statusText']);
        const k = await j['json']();
        if (k['HasError'])
            throw new Error('API\x20error:\x20' + (k['LocalizedGenericErrorMessage'] || 'Unknown\x20error'));
        if (!k['Members'] || !Array['isArray'](k['Members']))
            return console['warn']('No\x20members\x20found\x20or\x20invalid\x20response\x20format'), [{
                    'ApplicationID': a,
                    'FullName': 'Primary\x20Applicant',
                    'VisaClassName': 'Unknown'
                }];
        const l = k['Members']['map'](n => n['ApplicationID']), m = {};
        return k['Members']['forEach'](n => {
            m[n['ApplicationID']] = n['VisaClassName'];
        }), await chrome['storage']['local']['set']({
            'applications': l,
            'visaClassNames': m
        }), k['Members'];
    } catch (n) {
        return [{
                'ApplicationID': a,
                'FullName': 'Primary\x20Applicant',
                'VisaClassName': 'Unknown'
            }];
    }
}
let a0as = null;
function a0at() {
    if (a0as)
        return;
    a0as = a0G(() => {
        const a = Date['now']();
        for (const [b, c] of a0T['entries']()) {
            a - c['timestamp'] > a0U * 0x2 && a0T['delete'](b);
        }
        a0X && a - a0X > a0Y * 0x2 && (a0W = null, a0X = 0x0);
    }, 0xea60);
}
a0at();
chrome['runtime'] && chrome['runtime']['onSuspend'] && chrome['runtime']['onSuspend']['addListener'](() => {
    a0H(), a0T['clear'](), a0W = null;
});
