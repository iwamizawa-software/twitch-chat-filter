// ==UserScript==
// @name     twitch-chat-filter
// @version  1
// @grant    none
// @run-at   document-start
// @match    https://www.twitch.tv/*
// ==/UserScript==

function inject() {
  var regex;
  var load = () => localStorage.getItem('bannedWord') || '';
  var setBannedWord = function (str, save) {
    try {
      regex = new RegExp(str || '0^');
      if (save)
        localStorage.setItem('bannedWord', str);
    } catch (e) {
      alert(e);
    }
  };
  setBannedWord(load());
  HTMLUListElement.prototype.appendChild = HTMLDivElement.prototype.appendChild = function (a) {
    if (this.role === 'log' || document.querySelector('.video-chat__message-list-wrapper')?.contains?.(this)) {
      var element = a.querySelector('[data-a-target="chat-message-text"]');
      if (element && regex.test(element.textContent)) {
        element.setAttribute('style', 'display:none');
        a.style.display = 'none';
      }
    }
    return HTMLElement.prototype.appendChild.apply(this, arguments);
  };
  var button = document.createElement('button');
  button.textContent = '🚫';
  button.setAttribute('style', 'position:fixed;left:0;top:0;z-index:10000');
  button.onclick = function () {
    var str = prompt('set banned word by regular expression', load());
    if (typeof str === 'string')
      setBannedWord(str, true);
  };
  setInterval(() => {
    if (!document.body.contains(button))
      document.body.appendChild(button);
  }, 3000);
}
window.eval(`(${inject})()`);
