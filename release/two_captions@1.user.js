// ==UserScript==
// @name         Two Captions
// @version      0.1
// @description  Add two captions to JWPlayer videos, one on top of the other, for language learning purposes.
// @author       Nihta
// @match        https://*/*
// @grant        none
// ==/UserScript==

!(function () {
  "use strict";
  const t = 1,
    e = 2,
    i = 3,
    s = 4,
    n = 5;
  class r extends Error {
    code;
    line;
    constructor(t) {
      super(t.reason), (this.code = t.code), (this.line = t.line);
    }
  }
  const a = /\r?\n|\r/gm;
  async function o(t, e) {
    return (async function (t, e) {
      const i = e?.type ?? "vtt";
      let s, n;
      if ("string" == typeof i)
        switch (i) {
          case "srt":
            s = (
              await Promise.resolve().then(function () {
                return lt;
              })
            ).default;
            break;
          case "ssa":
          case "ass":
            s = (
              await Promise.resolve().then(function () {
                return wt;
              })
            ).default;
            break;
          default:
            s = (
              await Promise.resolve().then(function () {
                return I;
              })
            ).default;
        }
      else s = i;
      const r = t.getReader(),
        a = s(),
        o = !!e?.strict || !!e?.errors;
      await a.init({
        strict: !1,
        ...e,
        errors: o,
        type: i,
        cancel() {
          r.cancel(), (n = a.done(!0));
        },
      });
      let l = 1;
      for (;;) {
        const { value: t, done: e } = await r.read();
        if (e) {
          a.parse("", l), (n = a.done(!1));
          break;
        }
        a.parse(t, l), l++;
      }
      return n;
    })(
      new ReadableStream({
        start(e) {
          const i = t.split(a);
          for (const t of i) e.enqueue(t);
          e.close();
        },
      }),
      e
    );
  }
  const l = window.VTTCue;
  class c extends l {
    region = null;
    vertical = "";
    snapToLines = !0;
    line = "auto";
    lineAlign = "start";
    position = "auto";
    positionAlign = "auto";
    size = 100;
    align = "center";
    style;
  }
  class h {
    id = "";
    width = 100;
    lines = 3;
    regionAnchorX = 0;
    regionAnchorY = 100;
    viewportAnchorX = 0;
    viewportAnchorY = 100;
    scroll = "";
  }
  const u = "%";
  function g(t) {
    const e = parseInt(t, 10);
    return Number.isNaN(e) ? null : e;
  }
  function d(t) {
    const e = parseInt(t.replace(u, ""), 10);
    return !Number.isNaN(e) && e >= 0 && e <= 100 ? e : null;
  }
  function p(t) {
    if (!t.includes(",")) return null;
    const [e, i] = t.split(",").map(d);
    return null !== e && null !== i ? [e, i] : null;
  }
  function f(t) {
    const e = parseFloat(t);
    return Number.isNaN(e) ? null : e;
  }
  const m = /[:=]/,
    M = /^[\s\t]*(region|vertical|line|position|size|align)[:=]/,
    y = /^REGION:?[\s\t]+/,
    b = /[\s\t]+/,
    w = /[\s\t]*-->[\s\t]+/,
    j = /start|center|end|left|right/,
    N = /start|center|end/,
    A = /line-(?:left|right)|center|auto/,
    x = /^(?:(\d{1,2}):)?(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;
  var v = ((t) => (
    (t[(t.None = 0)] = "None"),
    (t[(t.Header = 1)] = "Header"),
    (t[(t.Cue = 2)] = "Cue"),
    (t[(t.Region = 3)] = "Region"),
    (t[(t.Note = 4)] = "Note"),
    t
  ))(v || {});
  class k {
    f;
    c = 0;
    g = {};
    h = {};
    j = [];
    a = null;
    b = null;
    k = [];
    d;
    l = "";
    async init(t) {
      (this.f = t),
        t.strict && (this.c = 1),
        t.errors &&
          (this.d = (
            await Promise.resolve().then(function () {
              return Nt;
            })
          ).ParseErrorBuilder);
    }
    parse(t, e) {
      if ("" === t)
        this.a
          ? (this.j.push(this.a), this.f.onCue?.(this.a), (this.a = null))
          : this.b
          ? ((this.h[this.b.id] = this.b), this.f.onRegion?.(this.b), (this.b = null))
          : 1 === this.c && (this.i(t, e), this.f.onHeaderMetadata?.(this.g)),
          (this.c = 0);
      else if (this.c)
        switch (this.c) {
          case 1:
            this.i(t, e);
            break;
          case 2:
            if (this.a) {
              const i = this.a.text.length > 0;
              !i && M.test(t) ? this.m(t.split(b), e) : (this.a.text += (i ? "\n" : "") + t);
            }
            break;
          case 3:
            this.n(t.split(b), e);
        }
      else if (t.startsWith("NOTE")) this.c = 4;
      else if (t.startsWith("REGION")) (this.c = 3), (this.b = new h()), this.n(t.replace(y, "").split(b), e);
      else if (t.includes("--\x3e")) {
        const i = this.o(t, e);
        i && ((this.a = new c(i[0], i[1], "")), (this.a.id = this.l), this.m(i[2], e)), (this.c = 2);
      } else 1 === e && this.i(t, e);
      this.l = t;
    }
    done() {
      return { metadata: this.g, cues: this.j, regions: Object.values(this.h), errors: this.k };
    }
    i(t, e) {
      if (e > 1) {
        if (m.test(t)) {
          const [e, i] = t.split(m);
          e && (this.g[e] = (i || "").replace(b, ""));
        }
      } else t.startsWith("WEBVTT") ? (this.c = 1) : this.e(this.d?.p());
    }
    o(t, e) {
      const [i, s = ""] = t.split(w),
        [n, ...r] = s.split(b),
        a = T(i),
        o = T(n);
      if (null !== a && null !== o && o > a) return [a, o, r];
      null === a && this.e(this.d?.q(i, e)),
        null === o && this.e(this.d?.r(n, e)),
        null != a && null !== o && o > a && this.e(this.d?.s(a, o, e));
    }
    n(t, e) {
      let i;
      for (let s = 0; s < t.length; s++)
        if (m.test(t[s])) {
          i = !1;
          const [n, r] = t[s].split(m);
          switch (n) {
            case "id":
              this.b.id = r;
              break;
            case "width":
              const t = d(r);
              null !== t ? (this.b.width = t) : (i = !0);
              break;
            case "lines":
              const s = g(r);
              null !== s ? (this.b.lines = s) : (i = !0);
              break;
            case "regionanchor":
              const a = p(r);
              null !== a ? ((this.b.regionAnchorX = a[0]), (this.b.regionAnchorY = a[1])) : (i = !0);
              break;
            case "viewportanchor":
              const o = p(r);
              null !== o ? ((this.b.viewportAnchorX = o[0]), (this.b.viewportAnchorY = o[1])) : (i = !0);
              break;
            case "scroll":
              "up" === r ? (this.b.scroll = "up") : (i = !0);
              break;
            default:
              this.e(this.d?.t(n, r, e));
          }
          i && this.e(this.d?.u(n, r, e));
        }
    }
    m(t, e) {
      let i;
      for (let s = 0; s < t.length; s++)
        if (((i = !1), m.test(t[s]))) {
          const [n, r] = t[s].split(m);
          switch (n) {
            case "region":
              const t = this.h[r];
              t && (this.a.region = t);
              break;
            case "vertical":
              "lr" === r || "rl" === r ? ((this.a.vertical = r), (this.a.region = null)) : (i = !0);
              break;
            case "line":
              const [s, a] = r.split(",");
              if (s.includes("%")) {
                const t = d(s);
                null !== t ? ((this.a.line = t), (this.a.snapToLines = !1)) : (i = !0);
              } else {
                const t = f(s);
                null !== t ? (this.a.line = t) : (i = !0);
              }
              N.test(a) ? (this.a.lineAlign = a) : a && (i = !0), "auto" !== this.a.line && (this.a.region = null);
              break;
            case "position":
              const [o, l] = r.split(","),
                c = d(o);
              null !== c ? (this.a.position = c) : (i = !0),
                l && A.test(l) ? (this.a.positionAlign = l) : l && (i = !0);
              break;
            case "size":
              const h = d(r);
              null !== h ? ((this.a.size = h), h < 100 && (this.a.region = null)) : (i = !0);
              break;
            case "align":
              j.test(r) ? (this.a.align = r) : (i = !0);
              break;
            default:
              this.e(this.d?.v(n, r, e));
          }
          i && this.e(this.d?.w(n, r, e));
        }
    }
    e(t) {
      if (t) {
        if ((this.k.push(t), this.f.strict)) throw (this.f.cancel(), t);
        this.f.onError?.(t);
      }
    }
  }
  function T(t) {
    const e = t.match(x);
    if (!e) return null;
    const i = e[1] ? parseInt(e[1], 10) : 0,
      s = parseInt(e[2], 10),
      n = parseInt(e[3], 10),
      r = e[4] ? parseInt(e[4].padEnd(3, "0"), 10) : 0;
    return i < 0 || s < 0 || n < 0 || r < 0 || s > 59 || n > 59 ? null : 3600 * i + 60 * s + n + r / 1e3;
  }
  var I = Object.freeze({
    __proto__: null,
    VTTBlock: v,
    VTTParser: k,
    default: function () {
      return new k();
    },
    parseVTTTimestamp: T,
  });
  const E = /[0-9]/,
    D = /[\s\t]+/,
    L = { c: "span", i: "i", b: "b", u: "u", ruby: "ruby", rt: "rt", v: "span", lang: "span", timestamp: "span" },
    C = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&nbsp;": " ",
      "&lrm;": "‎",
      "&rlm;": "‏",
    },
    S = /&(?:amp|lt|gt|quot|#(0+)?39|nbsp|lrm|rlm);/g,
    O = new Set(["white", "lime", "cyan", "red", "yellow", "magenta", "blue", "black"]),
    z = new Set(Object.keys(L));
  function $(t) {
    let e,
      i = "",
      s = 1,
      n = [],
      r = [];
    for (let n = 0; n < t.text.length; n++) {
      const c = t.text[n];
      switch (s) {
        case 1:
          "<" === c ? (l(), (s = 2)) : (i += c);
          break;
        case 2:
          switch (c) {
            case "\n":
            case "\t":
            case " ":
              a(), (s = 4);
              break;
            case ".":
              a(), (s = 3);
              break;
            case "/":
              s = 5;
              break;
            case ">":
              a(), (s = 1);
              break;
            default:
              !i && E.test(c) && (s = 6), (i += c);
          }
          break;
        case 3:
          switch (c) {
            case "\t":
            case " ":
            case "\n":
              o(), e && e.class?.trim(), (s = 4);
              break;
            case ".":
              o();
              break;
            case ">":
              o(), e && e.class?.trim(), (s = 1);
              break;
            default:
              i += c;
          }
          break;
        case 4:
          ">" === c
            ? ((i = i.replace(D, " ")),
              "v" === e?.type ? (e.voice = Q(i)) : "lang" === e?.type && (e.lang = Q(i)),
              (i = ""),
              (s = 1))
            : (i += c);
          break;
        case 5:
          ">" === c && ((i = ""), (e = r.pop()), (s = 1));
          break;
        case 6:
          if (">" === c) {
            const n = T(i);
            null !== n && n >= t.startTime && n <= t.endTime && ((i = "timestamp"), a(), (e.time = n)),
              (i = ""),
              (s = 1);
          } else i += c;
      }
    }
    function a() {
      if (z.has(i)) {
        const s = e;
        (e = { tagName: L[(t = i)], type: t, children: [] }),
          s ? (r[r.length - 1] !== s && r.push(s), s.children.push(e)) : n.push(e);
      }
      var t;
      (i = ""), (s = 1);
    }
    function o() {
      if (e && i) {
        const t = i.replace("bg_", "");
        O.has(t) ? (e[i.startsWith("bg_") ? "bgColor" : "color"] = t) : (e.class = e.class ? e.class + " " + i : i);
      }
      i = "";
    }
    function l() {
      if (!i) return;
      const t = { type: "text", data: Q(i) };
      e ? e.children.push(t) : n.push(t), (i = "");
    }
    return 1 === s && l(), n;
  }
  function Q(t) {
    return t.replace(S, (t) => C[t] || "'");
  }
  function U(t, e, i) {
    t.style.setProperty(`--${e}`, i + "");
  }
  function P(t, e, i = !0) {
    t.setAttribute(`data-${e}`, !0 === i ? "" : i + "");
  }
  function F(t, e) {
    t.setAttribute("part", e);
  }
  function Y(t, e = 0) {
    return B($(t), e);
  }
  function B(t, e = 0) {
    let i,
      s = "";
    for (const n of t)
      if ("text" === n.type) s += n.data;
      else {
        const t = "timestamp" === n.type;
        (i = {}),
          (i.class = n.class),
          (i.title = "v" === n.type && n.voice),
          (i.lang = "lang" === n.type && n.lang),
          (i.part = "v" === n.type && "voice"),
          t &&
            ((i.part = "timed"),
            (i["data-time"] = n.time),
            (i["data-future"] = n.time > e),
            (i["data-past"] = n.time < e)),
          (i.style = `${n.color ? `color: ${n.color};` : ""}${n.bgColor ? `background-color: ${n.bgColor};` : ""}`);
        const r = Object.entries(i)
          .filter((t) => t[1])
          .map((t) => `${t[0]}="${!0 === t[1] ? "" : t[1]}"`)
          .join(" ");
        s += `<${n.tagName}${r ? " " + r : ""}>${B(n.children)}</${n.tagName}>`;
      }
    return s;
  }
  const H = Symbol(0);
  function _(t) {
    return t instanceof HTMLElement
      ? {
          top: t.offsetTop,
          width: t.clientWidth,
          height: t.clientHeight,
          left: t.offsetLeft,
          right: t.offsetLeft + t.clientWidth,
          bottom: t.offsetTop + t.clientHeight,
        }
      : { ...t };
  }
  function V(t, e, i) {
    switch (e) {
      case "+x":
        (t.left += i), (t.right += i);
        break;
      case "-x":
        (t.left -= i), (t.right -= i);
        break;
      case "+y":
        (t.top += i), (t.bottom += i);
        break;
      case "-y":
        (t.top -= i), (t.bottom -= i);
    }
  }
  function R(t, e) {
    for (let n = 0; n < e.length; n++)
      if (((i = t), (s = e[n]), i.left <= s.right && i.right >= s.left && i.top <= s.bottom && i.bottom >= s.top))
        return e[n];
    var i, s;
    return null;
  }
  function W(t, e) {
    return e.top >= 0 && e.bottom <= t.height && e.left >= 0 && e.right <= t.width;
  }
  function q(t, e, i) {
    switch (i) {
      case "+x":
        return e.left < 0;
      case "-x":
        return e.right > t.width;
      case "+y":
        return e.top < 0;
      case "-y":
        return e.bottom > t.height;
    }
  }
  function Z(t, e) {
    return (
      (Math.max(0, Math.min(t.width, e.right) - Math.max(0, e.left)) *
        Math.max(0, Math.min(t.height, e.bottom) - Math.max(0, e.top))) /
      (t.height * t.width)
    );
  }
  function G(t, e) {
    return {
      top: e.top / t.height,
      left: e.left / t.width,
      right: (t.width - e.right) / t.width,
      bottom: (t.height - e.bottom) / t.height,
    };
  }
  function X(t, e) {
    return (
      (e.top = e.top * t.height),
      (e.left = e.left * t.width),
      (e.right = t.width - e.right * t.width),
      (e.bottom = t.height - e.bottom * t.height),
      e
    );
  }
  const J = ["top", "left", "right", "bottom"];
  function K(t, e, i, s) {
    const n = G(e, i);
    for (const e of J) U(t, `${s}-${e}`, 100 * n[e] + "%");
  }
  function tt(t, e, i, s) {
    let n,
      r = 1,
      a = { ...e };
    for (let o = 0; o < s.length; o++) {
      for (; q(t, e, s[o]) || (W(t, e) && R(e, i)); ) V(e, s[o], 1);
      if (W(t, e)) return e;
      const l = Z(t, e);
      r > l && ((n = { ...e }), (r = l)), (e = { ...a });
    }
    return n || a;
  }
  const et = Symbol(0);
  function it(t, e, i, s) {
    let n,
      r = i.firstElementChild,
      a = (function (t) {
        if ("auto" === t.line) return t.snapToLines ? -1 : 100;
        return t.line;
      })(e),
      o = [];
    if (
      (i[H] ||
        (i[H] = (function (t, e) {
          const i = _(e),
            s = (function (t) {
              const e = {};
              for (const i of J) e[i] = parseFloat(t.style.getPropertyValue(`--cue-${i}`));
              return e;
            })(e);
          (e[et] = !1), s.top && ((i.top = s.top), (i.bottom = s.top + i.height), (e[et] = "top"));
          if (s.bottom) {
            const n = t.height - s.bottom;
            (i.top = n - i.height), (i.bottom = n), (e[et] = "bottom");
          }
          s.left && (i.left = s.left);
          s.right && (i.right = t.width - s.right);
          return G(t, i);
        })(t, i)),
      (n = X(t, { ...i[H] })),
      i[et])
    )
      o = ["top" === i[et] ? "+y" : "-y", "+x", "-x"];
    else if (e.snapToLines) {
      let i;
      switch (e.vertical) {
        case "":
          (o = ["+y", "-y"]), (i = "height");
          break;
        case "rl":
          (o = ["+x", "-x"]), (i = "width");
          break;
        case "lr":
          (o = ["-x", "+x"]), (i = "width");
      }
      let s = parseFloat(getComputedStyle(r).lineHeight) || 0,
        l = s * Math.round(a),
        c = t[i] + s,
        h = o[0];
      Math.abs(l) > c && ((l = l < 0 ? -1 : 1), (l *= Math.ceil(c / s) * s)),
        a < 0 && ((l += "" === e.vertical ? t.height : t.width), (o = o.reverse())),
        V(n, h, l);
    } else {
      const i = "" === e.vertical,
        s = i ? "+y" : "+x",
        r = i ? n.height : n.width;
      V(n, s, ((i ? t.height : t.width) * a) / 100),
        V(n, s, "center" === e.lineAlign ? r / 2 : "end" === e.lineAlign ? r : 0),
        (o = i ? ["-y", "+y", "-x", "+x"] : ["-x", "+x", "-y", "+y"]);
    }
    return (n = tt(t, n, s, o)), K(i, t, n, "cue"), n;
  }
  const st = ["-y", "+y", "-x", "+x"];
  function nt(t, e, i, s) {
    let n = Array.from(i.querySelectorAll('[part="cue-display"]')),
      r = 0,
      a = Math.max(0, n.length - e.lines);
    for (let t = n.length - 1; t >= a; t--) r += n[t].offsetHeight;
    U(i, "region-height", r + "px"), i[H] || (i[H] = G(t, _(i)));
    let o = { ...i[H] };
    return (
      (o = X(t, o)),
      (o.width = i.clientWidth),
      (o.height = r),
      (o.right = o.left + o.width),
      (o.bottom = o.top + r),
      (o = tt(t, o, s, st)),
      K(i, t, o, "region"),
      o
    );
  }
  class rt {
    overlay;
    z;
    A = 0;
    C = "ltr";
    B = [];
    D = !1;
    E;
    h = new Map();
    j = new Map();
    get dir() {
      return this.C;
    }
    set dir(t) {
      (this.C = t), P(this.overlay, "dir", t);
    }
    get currentTime() {
      return this.A;
    }
    set currentTime(t) {
      (this.A = t), this.update();
    }
    constructor(t, e) {
      (this.overlay = t),
        (this.dir = e?.dir ?? "ltr"),
        t.setAttribute("translate", "yes"),
        t.setAttribute("aria-live", "off"),
        t.setAttribute("aria-atomic", "true"),
        F(t, "captions"),
        this.G(),
        (this.E = new ResizeObserver(this.I.bind(this))),
        this.E.observe(t);
    }
    changeTrack({ regions: t, cues: e }) {
      this.reset(), this.J(t);
      for (const t of e) this.j.set(t, null);
      this.update();
    }
    addCue(t) {
      this.j.set(t, null), this.update();
    }
    removeCue(t) {
      this.j.delete(t), this.update();
    }
    update(t = !1) {
      this.H(t);
    }
    reset() {
      this.j.clear(), this.h.clear(), (this.B = []), (this.overlay.textContent = "");
    }
    destroy() {
      this.reset(), this.E.disconnect();
    }
    I() {
      (this.D = !0), this.K();
    }
    K = (function (t, e) {
      let i,
        s = null;
      function n() {
        r(), t(...i), (i = void 0);
      }
      function r() {
        clearTimeout(s), (s = null);
      }
      return function () {
        (i = [].slice.call(arguments)), r(), (s = setTimeout(n, e));
      };
    })(() => {
      (this.D = !1), this.G();
      for (const t of this.h.values()) t[H] = null;
      for (const t of this.j.values()) t && (t[H] = null);
      this.H(!0);
    }, 50);
    G() {
      (this.z = _(this.overlay)),
        U(this.overlay, "overlay-width", this.z.width + "px"),
        U(this.overlay, "overlay-height", this.z.height + "px");
    }
    H(t = !1) {
      if (!this.j.size || this.D) return;
      let e,
        i = [...this.j.keys()]
          .filter((t) => this.A >= t.startTime && this.A <= t.endTime)
          .sort((t, e) => (t.startTime !== e.startTime ? t.startTime - e.startTime : t.endTime - e.endTime)),
        s = i.map((t) => t.region);
      for (let n = 0; n < this.B.length; n++) {
        if (((e = this.B[n]), i[n] === e)) continue;
        if (e.region && !s.includes(e.region)) {
          const i = this.h.get(e.region.id);
          i && (i.removeAttribute("data-active"), (t = !0));
        }
        const r = this.j.get(e);
        r && (r.remove(), (t = !0));
      }
      for (let s = 0; s < i.length; s++) {
        e = i[s];
        let n = this.j.get(e);
        n || this.j.set(e, (n = this.L(e)));
        const r = this.F(e) && this.h.get(e.region.id);
        r && !r.hasAttribute("data-active") && (requestAnimationFrame(() => P(r, "active")), (t = !0)),
          n.isConnected || ((r || this.overlay).append(n), (t = !0));
      }
      if (t) {
        const t = [],
          s = new Set();
        for (let n = i.length - 1; n >= 0; n--) {
          if (((e = i[n]), s.has(e.region || e))) continue;
          const r = this.F(e),
            a = r ? this.h.get(e.region.id) : this.j.get(e);
          r ? t.push(nt(this.z, e.region, a, t)) : t.push(it(this.z, e, a, t)), s.add(r ? e.region : e);
        }
      }
      !(function (t, e) {
        for (const i of t.querySelectorAll('[part="timed"]')) {
          const t = Number(i.getAttribute("data-time"));
          Number.isNaN(t) ||
            (t > e ? P(i, "future") : i.removeAttribute("data-future"),
            t < e ? P(i, "past") : i.removeAttribute("data-past"));
        }
      })(this.overlay, this.A),
        (this.B = i);
    }
    J(t) {
      if (t)
        for (const e of t) {
          const t = this.M(e);
          this.h.set(e.id, t), this.overlay.append(t);
        }
    }
    M(t) {
      const e = document.createElement("div");
      return (
        F(e, "region"),
        P(e, "id", t.id),
        P(e, "scroll", t.scroll),
        U(e, "region-width", t.width + "%"),
        U(e, "region-anchor-x", t.regionAnchorX),
        U(e, "region-anchor-y", t.regionAnchorY),
        U(e, "region-viewport-anchor-x", t.viewportAnchorX),
        U(e, "region-viewport-anchor-y", t.viewportAnchorY),
        U(e, "region-lines", t.lines),
        e
      );
    }
    L(t) {
      const e = document.createElement("div"),
        i = (function (t) {
          if ("auto" === t.position)
            switch (t.align) {
              case "start":
              case "left":
                return 0;
              case "right":
              case "end":
                return 100;
              default:
                return 50;
            }
          return t.position;
        })(t),
        s = (function (t, e) {
          if ("auto" === t.positionAlign)
            switch (t.align) {
              case "start":
                return "ltr" === e ? "line-left" : "line-right";
              case "end":
                return "ltr" === e ? "line-right" : "line-left";
              case "center":
                return "center";
              default:
                return `line-${t.align}`;
            }
          return t.positionAlign;
        })(t, this.C);
      if ((F(e, "cue-display"), "" !== t.vertical && P(e, "vertical"), U(e, "cue-text-align", t.align), t.style))
        for (const i of Object.keys(t.style)) e.style.setProperty(i, t.style[i]);
      if (this.F(t)) U(e, "cue-offset", i - ("line-right" === s ? 100 : "center" === s ? 50 : 0) + "%");
      else if (
        (U(
          e,
          "cue-writing-mode",
          "" === t.vertical ? "horizontal-tb" : "lr" === t.vertical ? "vertical-lr" : "vertical-rl"
        ),
        !t.style?.["--cue-width"])
      ) {
        let n = i;
        "line-left" === s
          ? (n = 100 - i)
          : "center" === s && i <= 50
          ? (n = 2 * i)
          : "center" === s && i > 50 && (n = 2 * (100 - i));
        const r = t.size < n ? t.size : n;
        "" === t.vertical ? U(e, "cue-width", r + "%") : U(e, "cue-height", r + "%");
      }
      const n = document.createElement("div");
      return F(n, "cue"), t.id && P(n, "id", t.id), (n.innerHTML = Y(t)), e.append(n), e;
    }
    F(t) {
      return t.region && 100 === t.size && "" === t.vertical && "auto" === t.line;
    }
  }
  if (((window.jw = window.jwplayer ?? window.jw), window.jw)) {
    function At() {
      document.querySelector("video") ? xt() : setTimeout(At, 100);
    }
    function xt() {
      const t = document.createElement("style");
      (t.innerHTML =
        ':where([part="captions"] > [part="cue-display"]) {top: 50px; font-family: Arial, Helvetica, sans-serif;}'),
        document.head.appendChild(t);
      const e = document.querySelector("video"),
        i = document.createElement("div");
      (i.id = "nihta_captions"),
        (i.style.position = "absolute"),
        (i.style.inset = "0"),
        i.style.setProperty("--cue-font-size", "25px"),
        e.parentElement.appendChild(i);
      const s = document.querySelector("#nihta_captions"),
        n = new rt(s);
      !(function (t) {
        const e = (function () {
          const e = document.createElement("div");
          e.classList.add("jw-reset", "jw-settings-menu"),
            (e.style.display = "none"),
            document.querySelector(".jw-controls").appendChild(e);
          const i = window
              .jw()
              .getCaptionsList()
              .filter(({ id: t }) => t.includes("https"))
              .map((t) => ({ lang: t.label, url: t.id })),
            s = document.createElement("div");
          s.className = "jw-reset jw-settings-submenu jw-settings-submenu-active";
          const n = document.createElement("div");
          return (
            (n.className = "jw-reset jw-settings-submenu-items"),
            s.appendChild(n),
            (function i(s, r) {
              n.innerHTML = "";
              const a = document.createElement("button");
              (a.type = "button"),
                (a.innerText = "Off"),
                (a.className = "jw-reset-text jw-settings-content-item"),
                r || (a.className += " jw-settings-item-active"),
                (a.onclick = function () {
                  i(s), t(void 0), (e.style.display = "none");
                }),
                n.appendChild(a),
                s.forEach((a) => {
                  const o = document.createElement("button");
                  (o.className = "jw-reset-text jw-settings-content-item"),
                    (o.innerText = a.lang),
                    r === a.lang && o.classList.add("jw-settings-item-active"),
                    o.addEventListener("click", function () {
                      r !== a.lang && (i(s, a.lang), t(a), (e.style.display = "none"));
                    }),
                    n.appendChild(o);
                });
            })(i),
            e.appendChild(s),
            e
          );
        })();
        window
          .jw()
          .addButton(
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuOTQgOS43OEM5LjcgOS43NiA5LjQ2IDkuODUgOS4yOCAxMC4wMUM5LjExIDEwLjE4IDkuMDMgMTAuNDIgOS4wNCAxMC42NlYxMy4yMkM5LjA0IDE0LjE4IDEwLjIgMTQuMzYgMTAuODEgMTMuNzdDMTAuODggMTMuNyAxMC45NiAxMy42MiAxMS4wNSAxMy41NEwxMS43MSAxNC4zMkMxMS40OSAxNC41NiAxMS4yMSAxNC43NiAxMC45MSAxNC45QzEwLjExIDE1LjI1IDkuMTggMTUuMTQgOC40OCAxNC42MUM4LjA5IDE0LjI1IDcuODkgMTMuNzQgNy45MyAxMy4yMVYxMC42NUM3LjkzIDEwLjM4IDcuOTggMTAuMTIgOC4wOCA5Ljg3QzguMTcgOS42NSA4LjMyIDkuNDQgOC41IDkuMjhDOS4wNyA4LjgzIDkuODIgOC42NiAxMC41MyA4LjgyQzEwLjg2IDguODcgMTEuMTYgOS4wMiAxMS40IDkuMjVDMTEuNTMgOS4zOCAxMS42NSA5LjUxIDExLjc1IDkuNjdMMTEuMDQgMTAuMzZDMTAuNzkgMTAgMTAuMzggOS43OCA5Ljk0IDkuNzhaTTE0LjQxIDkuNzhDMTQuMTcgOS43NiAxMy45MyA5Ljg1IDEzLjc1IDEwLjAxQzEzLjU4IDEwLjE4IDEzLjUgMTAuNDIgMTMuNTEgMTAuNjZWMTMuMjJDMTMuNTEgMTQuMTggMTQuNjcgMTQuMzYgMTUuMjggMTMuNzdDMTUuMzUgMTMuNyAxNS40MyAxMy42MiAxNS41MiAxMy41NEwxNi4xOCAxNC4zMkMxNS45NiAxNC41NiAxNS42OCAxNC43NiAxNS4zOCAxNC45QzE0LjU4IDE1LjI1IDEzLjY1IDE1LjE0IDEyLjk1IDE0LjYxQzEyLjU2IDE0LjI1IDEyLjM2IDEzLjc0IDEyLjQgMTMuMjFWMTAuNjVDMTIuNCAxMC4zOCAxMi40NSAxMC4xMiAxMi41NSA5Ljg3QzEyLjY0IDkuNjUgMTIuNzkgOS40NCAxMi45NyA5LjI4QzEzLjU0IDguODMgMTQuMjkgOC42NiAxNSA4LjgyQzE1LjMzIDguODcgMTUuNjMgOS4wMiAxNS44NyA5LjI1QzE2IDkuMzggMTYuMTIgOS41MSAxNi4yMiA5LjY3TDE1LjUxIDEwLjM2QzE1LjI2IDEwIDE0Ljg1IDkuNzggMTQuNDEgOS43OFpNMjAgNlYxOEg0VjZIMjBaTTIxLjUgNEgyLjVDMi4yMyA0IDIgNC4yMiAyIDQuNVYxOS41QzIgMTkuNzcgMi4yMiAyMCAyLjUgMjBIMjEuNUMyMS43NyAyMCAyMiAxOS43OCAyMiAxOS41VjQuNUMyMiA0LjIyIDIxLjc4IDQgMjEuNSA0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
            "Subtitles 2 by Nihta",
            function () {
              "none" === e.style.display ? (e.style.display = "block") : (e.style.display = "none");
            }
          );
      })(async (t) => {
        if (!t) return void n.reset();
        const i = await fetch(t.url),
          s = await i.text(),
          { cues: r } = await o(s);
        n.changeTrack({ cues: r }),
          e.addEventListener("timeupdate", () => {
            n.currentTime = e.currentTime;
          });
      });
    }
    [
      "https://cdn.jsdelivr.net/npm/media-captions/styles/captions.min.css",
      "https://cdn.jsdelivr.net/npm/media-captions/styles/regions.min.css",
    ].forEach((t) => {
      const e = document.createElement("link");
      (e.rel = "stylesheet"), (e.href = t), document.head.appendChild(e);
    }),
      At();
  }
  const at = /,/g;
  class ot extends k {
    parse(t, e) {
      if ("" === t) this.a && (this.j.push(this.a), this.f.onCue?.(this.a), (this.a = null)), (this.c = v.None);
      else if (this.c === v.Cue) this.a.text += (this.a.text ? "\n" : "") + t;
      else if (t.includes("--\x3e")) {
        const i = this.o(t, e);
        i && ((this.a = new c(i[0], i[1], i[2].join(" "))), (this.a.id = this.l), (this.c = v.Cue));
      }
      this.l = t;
    }
    o(t, e) {
      return super.o(t.replace(at, "."), e);
    }
  }
  var lt = Object.freeze({
    __proto__: null,
    SRTParser: ot,
    default: function () {
      return new ot();
    },
  });
  const ct = /^Format:[\s\t]*/,
    ht = /^Style:[\s\t]*/,
    ut = /^Dialogue:[\s\t]*/,
    gt = /[\s\t]*,[\s\t]*/,
    dt = /\{[^}]+\}/g,
    pt = /\\N/g,
    ft = /^\[(.*)[\s\t]?Styles\]$/,
    mt = /^\[(.*)[\s\t]?Events\]$/;
  class Mt {
    f;
    O = 0;
    a = null;
    j = [];
    k = [];
    N = null;
    d;
    P = {};
    async init(t) {
      (this.f = t),
        t.errors &&
          (this.d = (
            await Promise.resolve().then(function () {
              return Nt;
            })
          ).ParseErrorBuilder);
    }
    parse(t, e) {
      if (this.O)
        switch (this.O) {
          case 1:
            if ("" === t) this.O = 0;
            else if (ht.test(t))
              if (this.N) {
                const e = t.replace(ht, "").split(gt);
                this.S(e);
              } else this.e(this.d?.T("Style", e));
            else ct.test(t) ? (this.N = t.replace(ct, "").split(gt)) : mt.test(t) && ((this.N = null), (this.O = 2));
            break;
          case 2:
            if ("" === t) this.Q();
            else if (ut.test(t))
              if ((this.Q(), this.N)) {
                const i = t.replace(ut, "").split(gt),
                  s = this.U(i, e);
                s && (this.a = s);
              } else this.e(this.d?.T("Dialogue", e));
            else
              this.a
                ? (this.a.text += "\n" + t.replace(dt, "").replace(pt, "\n"))
                : ct.test(t)
                ? (this.N = t.replace(ct, "").split(gt))
                : ft.test(t)
                ? ((this.N = null), (this.O = 1))
                : mt.test(t) && (this.N = null);
        }
      else "" === t || (ft.test(t) ? ((this.N = null), (this.O = 1)) : mt.test(t) && ((this.N = null), (this.O = 2)));
    }
    done() {
      return { metadata: {}, cues: this.j, regions: [], errors: this.k };
    }
    Q() {
      this.a && (this.j.push(this.a), this.f.onCue?.(this.a), (this.a = null));
    }
    S(t) {
      let e,
        i,
        s,
        n,
        r = "Default",
        a = {},
        o = "center",
        l = "bottom",
        c = 1.2,
        h = 3,
        u = [];
      for (let g = 0; g < this.N.length; g++) {
        const d = this.N[g],
          p = t[g];
        switch (d) {
          case "Name":
            r = p;
            break;
          case "Fontname":
            a["font-family"] = p;
            break;
          case "Fontsize":
            a["font-size"] = `calc(${p} / var(--overlay-height))`;
            break;
          case "PrimaryColour":
            const t = yt(p);
            t && (a["--cue-color"] = t);
            break;
          case "BorderStyle":
            h = parseInt(p, 10);
            break;
          case "BackColour":
            n = yt(p);
            break;
          case "OutlineColour":
            const g = yt(p);
            g && (s = g);
            break;
          case "Bold":
            parseInt(p) && (a["font-weight"] = "bold");
            break;
          case "Italic":
            parseInt(p) && (a["font-style"] = "italic");
            break;
          case "Underline":
            parseInt(p) && (a["text-decoration"] = "underline");
            break;
          case "StrikeOut":
            parseInt(p) && (a["text-decoration"] = "line-through");
            break;
          case "Spacing":
            a["letter-spacing"] = p + "px";
            break;
          case "AlphaLevel":
            a.opacity = parseFloat(p);
            break;
          case "ScaleX":
            u.push(`scaleX(${parseFloat(p) / 100})`);
            break;
          case "ScaleY":
            u.push(`scaleY(${parseFloat(p) / 100})`);
            break;
          case "Angle":
            u.push(`rotate(${p}deg)`);
            break;
          case "Shadow":
            c = 1.2 * parseInt(p, 10);
            break;
          case "MarginL":
            (a["--cue-width"] = "auto"), (a["--cue-left"] = parseFloat(p) + "px");
            break;
          case "MarginR":
            (a["--cue-width"] = "auto"), (a["--cue-right"] = parseFloat(p) + "px");
            break;
          case "MarginV":
            i = parseFloat(p);
            break;
          case "Outline":
            e = parseInt(p, 10);
            break;
          case "Alignment":
            const d = parseInt(p, 10);
            switch ((d >= 4 && (l = d >= 7 ? "top" : "center"), d % 3)) {
              case 1:
                o = "start";
                break;
              case 2:
                o = "center";
                break;
              case 3:
                o = "end";
            }
        }
      }
      if (
        ((a.R = l),
        (a["--cue-white-space"] = "normal"),
        (a["--cue-line-height"] = "normal"),
        (a["--cue-text-align"] = o),
        "center" === l ? ((a["--cue-top"] = "50%"), u.push("translateY(-50%)")) : (a[`--cue-${l}`] = (i || 0) + "px"),
        1 === h && (a["--cue-padding-y"] = "0"),
        (1 === h || n) && (a["--cue-bg-color"] = 1 === h ? "none" : n),
        3 === h && s && (a["--cue-outline"] = `${e}px solid ${s}`),
        1 === h && "number" == typeof e)
      ) {
        const t = n ?? "#000";
        a["--cue-text-shadow"] = [s && bt(1.2 * e, 1.2 * c, s), s ? bt(e * (e / 2), c * (e / 2), t) : bt(e, c, t)]
          .filter(Boolean)
          .join(", ");
      }
      u.length && (a["--cue-transform"] = u.join(" ")), (this.P[r] = a);
    }
    U(t, e) {
      const i = this.V(t),
        s = this.o(i.Start, i.End, e);
      if (!s) return;
      const n = new c(s[0], s[1], ""),
        r = { ...(this.P[i.Style] || {}) },
        a = i.Name ? `<v ${i.Name}>` : "",
        o = r.R,
        l = i.MarginL && parseFloat(i.MarginL),
        h = i.MarginR && parseFloat(i.MarginR),
        u = i.MarginV && parseFloat(i.MarginV);
      return (
        l && ((r["--cue-width"] = "auto"), (r["--cue-left"] = l + "px")),
        h && ((r["--cue-width"] = "auto"), (r["--cue-right"] = h + "px")),
        u && "center" !== o && (r[`--cue-${o}`] = u + "px"),
        (n.text =
          a +
          t
            .slice(this.N.length - 1)
            .join(", ")
            .replace(dt, "")
            .replace(pt, "\n")),
        delete r.R,
        Object.keys(r).length && (n.style = r),
        n
      );
    }
    V(t) {
      const e = {};
      for (let i = 0; i < this.N.length; i++) e[this.N[i]] = t[i];
      return e;
    }
    o(t, e, i) {
      const s = T(t),
        n = T(e);
      if (null !== s && null !== n && n > s) return [s, n];
      null === s && this.e(this.d?.q(t, i)),
        null === n && this.e(this.d?.r(e, i)),
        null != s && null !== n && n > s && this.e(this.d?.s(s, n, i));
    }
    e(t) {
      if (t) {
        if ((this.k.push(t), this.f.strict)) throw (this.f.cancel(), t);
        this.f.onError?.(t);
      }
    }
  }
  function yt(t) {
    const e = parseInt(t.replace("&H", ""), 16);
    if (e >= 0) {
      return "rgba(" + [255 & e, (e >> 8) & 255, (e >> 16) & 255, (((e >> 24) & 255) ^ 255) / 255].join(",") + ")";
    }
    return null;
  }
  function bt(t, e, i) {
    const s = Math.ceil(2 * Math.PI * t);
    let n = "";
    for (let r = 0; r < s; r++) {
      const a = (2 * Math.PI * r) / s;
      n += t * Math.cos(a) + "px " + e * Math.sin(a) + "px 0 " + i + (r == s - 1 ? "" : ",");
    }
    return n;
  }
  var wt = Object.freeze({
    __proto__: null,
    SSAParser: Mt,
    default: function () {
      return new Mt();
    },
  });
  const jt = {
    p: () => new r({ code: t, reason: "missing WEBVTT file header", line: 1 }),
    q: (t, i) => new r({ code: e, reason: `cue start timestamp \`${t}\` is invalid on line ${i}`, line: i }),
    r: (t, i) => new r({ code: e, reason: `cue end timestamp \`${t}\` is invalid on line ${i}`, line: i }),
    s: (t, i, s) =>
      new r({ code: e, reason: `cue end timestamp \`${i}\` is greater than start \`${t}\` on line ${s}`, line: s }),
    w: (t, e, s) =>
      new r({ code: i, reason: `invalid value for cue setting \`${t}\` on line ${s} (value: ${e})`, line: s }),
    v: (t, e, i) => new r({ code: n, reason: `unknown cue setting \`${t}\` on line ${i} (value: ${e})`, line: i }),
    u: (t, e, s) =>
      new r({ code: i, reason: `invalid value for region setting \`${t}\` on line ${s} (value: ${e})`, line: s }),
    t: (t, e, i) => new r({ code: n, reason: `unknown region setting \`${t}\` on line ${i} (value: ${e})`, line: i }),
    T: (t, e) => new r({ code: s, reason: `format missing for \`${t}\` block on line ${e}`, line: e }),
  };
  var Nt = Object.freeze({ __proto__: null, ParseErrorBuilder: jt });
})();
