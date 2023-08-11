// ==UserScript==
// @name         Two Captions
// @version      0.1
// @description  Add two captions to JWPlayer videos, one on top of the other, for language learning purposes.
// @author       Nihta
// @match        https://*/*
// @grant        none
// ==/UserScript==

import { CaptionsRenderer, parseText } from "media-captions";
import { injectMenuSubElement, injectStyleSheet } from "./src/two-captions/utils";

window.jw = window["jwplayer"] ?? window.jw;
if (window.jw) {
  injectStyleSheet([
    "https://cdn.jsdelivr.net/npm/media-captions/styles/captions.min.css",
    "https://cdn.jsdelivr.net/npm/media-captions/styles/regions.min.css",
  ]);

  function checkVideoElmExists() {
    const video = document.querySelector("video");
    if (video) {
      ready();
    } else {
      setTimeout(checkVideoElmExists, 100);
    }
  }
  checkVideoElmExists();

  function ready() {
    const style = document.createElement("style");
    style.innerHTML = `:where([part="captions"] > [part="cue-display"]) {top: 50px; font-family: Arial, Helvetica, sans-serif;}`;
    document.head.appendChild(style);

    const video = document.querySelector("video");
    const captionContainer = document.createElement("div");
    captionContainer.id = "nihta_captions";
    captionContainer.style.position = "absolute";
    captionContainer.style.inset = "0";
    captionContainer.style.setProperty("--cue-font-size", "25px");
    video.parentElement.appendChild(captionContainer);
    const captions = document.querySelector("#nihta_captions");
    const renderer = new CaptionsRenderer(captions);

    injectMenuSubElement(async (sub) => {
      if (!sub) {
        renderer.reset();
        return;
      }

      const res = await fetch(sub.url);
      const text = await res.text();

      const { cues } = await parseText(text);
      renderer.changeTrack({ cues: cues });

      video.addEventListener("timeupdate", () => {
        renderer.currentTime = video.currentTime;
      });
    });
  }
}
