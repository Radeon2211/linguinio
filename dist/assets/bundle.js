!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var o=document.querySelector("#modal-box-login"),r=document.querySelector("#modal-box-register"),a=document.querySelectorAll(".modal-box__close"),i=document.querySelector("#button-register"),s=document.querySelector("#button-login"),c=document.querySelector("#link-to-login"),l=document.querySelector("#link-to-register"),d=function(e){e.classList.contains("hide-modal-box")&&e.classList.remove("hide-modal-box"),e.parentElement.classList.contains("hide-modal")&&e.parentElement.classList.remove("hide-modal"),e.classList.add("show-modal-box"),e.parentElement.classList.add("show-modal")};i.addEventListener("click",(function(){d(r)})),s.addEventListener("click",(function(){d(o)}));var u=function(e){e.parentElement.classList.remove("show-modal"),e.classList.remove("show-modal-box"),e.parentElement.classList.add("hide-modal"),e.classList.add("hide-modal-box")};a.forEach((function(e){var t=e.parentElement;e.addEventListener("click",(function(){u(t)})),t.parentElement.addEventListener("click",(function(e){e.target.classList.contains("modal")&&u(t)}))}));var m=function(e,t){e.classList.remove("show-modal-box"),e.parentElement.classList.remove("show-modal"),t.classList.remove("hide-modal-box"),t.parentElement.classList.remove("hide-modal"),t.classList.add("show-modal-box"),t.parentElement.classList.add("show-modal")};l.addEventListener("click",(function(){m(o,r)})),c.addEventListener("click",(function(){m(r,o)}));var f=document.querySelectorAll(".main-page"),h=document.querySelectorAll(".nav-list"),v=document.querySelector("#nav-toggler");h.forEach((function(e){e.addEventListener("click",(function(e){if(!e.target.classList.contains("not-page-link")&&("A"===e.target.tagName||"A"===e.target.parentElement||"A"===e.target.parentElement.parentElement)){var t=document.querySelector(e.target.getAttribute("data-target"));f.forEach((function(e){e.classList.contains("hide")||e.classList.add("hide")})),t.classList.remove("hide"),v.checked=!1}}))})),function(e,t,n){var o=document.querySelector(".introduction-container"),r=document.querySelector(".main-container");auth.onAuthStateChanged((function(e){e?(o.classList.contains("hide")||o.classList.add("hide"),r.classList.contains("hide")&&r.classList.remove("hide")):(o.classList.contains("hide")&&o.classList.remove("hide"),r.classList.contains("hide")||r.classList.add("hide"))}));var a=function(e,t){var n=e;n.innerHTML=t.message,n.classList.contains("hide")&&n.classList.remove("hide")},i=function(e){e.classList.contains("hide")||e.classList.add("hide")},s=document.querySelector("#form-register");s.addEventListener("submit",(function(e){e.preventDefault();var o=s.querySelector(".modal-form__error"),r=s.nick.value.trim();/^[a-z\d]{4,14}$/.test(r)?auth.createUserWithEmailAndPassword(s.email.value.trim(),s.password.value.trim()).then((function(e){return db.collection("users").doc(e.user.uid).set({nick:r})})).then((function(){window.location.reload(!0),s.reset(),n(t),i(o)})).catch((function(e){a(o,e)})):a(o,{message:"Nick should have 4-14 characters, only letters and digits"})}));var c=document.querySelector("#form-login");c.addEventListener("submit",(function(t){t.preventDefault();var o=c.querySelector(".modal-form__error");auth.signInWithEmailAndPassword(c.email.value.trim(),c.password.value.trim()).then((function(t){window.location.reload(!0),c.reset(),n(e),i(o)})).catch((function(e){a(o,e)}))})),document.querySelectorAll(".logout-link").forEach((function(e){e.addEventListener("click",(function(){auth.signOut().then((function(){window.location.reload(!0)}))}))}))}(o,r,u)}]);