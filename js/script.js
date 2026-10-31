/* IART · Code your interviews
   Everything runs in the browser. Nothing is saved or sent anywhere. */
(function () {
  "use strict";

  var THEMES = [
    { id: "need", label: "Need" },
    { id: "goal", label: "Goal" },
    { id: "motivation", label: "Motivation" },
    { id: "behaviour", label: "Behaviour" },
    { id: "context", label: "Context" },
    { id: "star", label: "Star" }
  ];
  var LABELS = {};
  THEMES.forEach(function (t) { LABELS[t.id] = t.label; });

  /* ---------- Section menu: mark the section in view ---------- */
  (function menu() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var targets = Object.keys(map)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = map[entry.target.id];
        if (link) {
          link.setAttribute("aria-current", "true");
          // keep the active pill visible in the horizontal mobile menu
          if (link.scrollIntoView && window.matchMedia("(max-width: 1020px)").matches) {
            var list = link.closest("ol");
            if (list) list.scrollLeft = link.offsetLeft - 20;
          }
        }
      });
    }, { rootMargin: "-15% 0px -75% 0px", threshold: 0 });

    targets.forEach(function (t) { observer.observe(t); });
  })();

  /* ---------- Worked example: show or hide the codes ---------- */
  (function worked() {
    var btn = document.getElementById("toggle-codes");
    var box = document.getElementById("mila");
    if (!btn || !box) return;
    var label = btn.querySelector("span");
    btn.addEventListener("click", function () {
      var showing = box.classList.toggle("show-codes");
      label.textContent = showing ? "Hide the codes" : "Show the codes";
    });
  })();

  /* ---------- Practice: click to code, then check ---------- */
  (function practice() {
    var box = document.getElementById("jonas");
    if (!box) return;
    var turns = Array.prototype.slice.call(box.querySelectorAll(".turn[data-key]"));
    var checkBtn = document.getElementById("check");
    var resetBtn = document.getElementById("reset");
    var status = document.getElementById("practice-status");
    var summary = document.getElementById("summary");
    var summaryText = document.getElementById("summary-text");

    var SVG_NS = "http://www.w3.org/2000/svg";

    function starIcon() {
      var svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("class", "ic");
      svg.setAttribute("aria-hidden", "true");
      var use = document.createElementNS(SVG_NS, "use");
      use.setAttribute("href", "#i-star");
      svg.appendChild(use);
      return svg;
    }

    // build the chips and the feedback area for every coded line
    turns.forEach(function (turn) {
      var time = turn.querySelector(".turn__time").textContent;
      var extra = document.createElement("div");
      extra.className = "turn__extra";

      var group = document.createElement("div");
      group.className = "chips";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", "Codes for the line at " + time);

      THEMES.forEach(function (t) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.setAttribute("data-t", t.id);
        chip.setAttribute("aria-pressed", "false");
        if (t.id === "star") chip.appendChild(starIcon());
        chip.appendChild(document.createTextNode(t.label));
        chip.addEventListener("click", function () {
          var on = chip.getAttribute("aria-pressed") === "true";
          chip.setAttribute("aria-pressed", on ? "false" : "true");
        });
        group.appendChild(chip);
      });

      var feedback = document.createElement("div");
      feedback.className = "feedback";
      feedback.hidden = true;
      feedback.setAttribute("aria-live", "polite");

      extra.appendChild(group);
      extra.appendChild(feedback);
      turn.appendChild(extra);
    });

    function chosen(turn) {
      return Array.prototype.slice
        .call(turn.querySelectorAll('.chip[aria-pressed="true"]'))
        .map(function (c) { return c.getAttribute("data-t"); });
    }

    function names(list) {
      if (!list.length) return "nothing";
      return list.map(function (id) { return LABELS[id]; }).join(", ");
    }

    function sameSet(a, b) {
      if (a.length !== b.length) return false;
      return a.every(function (x) { return b.indexOf(x) !== -1; });
    }

    function say(text) {
      status.hidden = false;
      status.textContent = text;
    }

    checkBtn.addEventListener("click", function () {
      var anything = turns.some(function (t) { return chosen(t).length > 0; });
      if (!anything) {
        say("Pick at least one theme first, then check.");
        return;
      }

      var matched = 0;
      turns.forEach(function (turn) {
        var key = turn.getAttribute("data-key").split(",");
        var mine = chosen(turn);
        var fb = turn.querySelector(".feedback");
        var ok = sameSet(key, mine);
        if (ok) matched += 1;

        fb.hidden = false;
        fb.className = "feedback " + (ok ? "feedback--ok" : "feedback--diff");
        while (fb.firstChild) fb.removeChild(fb.firstChild);

        var head = document.createElement("span");
        head.className = "feedback__head";
        head.textContent = ok
          ? "Matches the key."
          : "Different from the key. The key has: " + names(key) + ". You chose: " + names(mine) + ".";
        fb.appendChild(head);

        var note = document.createElement("p");
        note.textContent = turn.getAttribute("data-note");
        fb.appendChild(note);
      });

      box.classList.add("show-codes");
      status.hidden = true;
      status.textContent = "";
      summary.hidden = false;
      summaryText.textContent =
        "You matched " + matched + " of " + turns.length + " lines exactly. " +
        "Read the note under every line where you differ. A different code can be reasonable, " +
        "as long as you can say why.";
      summary.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    resetBtn.addEventListener("click", function () {
      turns.forEach(function (turn) {
        Array.prototype.forEach.call(turn.querySelectorAll(".chip"), function (c) {
          c.setAttribute("aria-pressed", "false");
        });
        var fb = turn.querySelector(".feedback");
        fb.hidden = true;
        fb.className = "feedback";
        while (fb.firstChild) fb.removeChild(fb.firstChild);
      });
      box.classList.remove("show-codes");
      summary.hidden = true;
      summaryText.textContent = "";
      status.hidden = true;
      status.textContent = "";
      var first = box.querySelector(".chip");
      if (first) first.focus();
    });
  })();

  /* ---------- Copy the translation prompt ---------- */
  (function copyPrompt() {
    var btn = document.getElementById("copy-prompt");
    var src = document.getElementById("prompt-text");
    var status = document.getElementById("copy-status");
    if (!btn || !src) return;

    function done(ok) {
      status.textContent = ok ? "Copied." : "Could not copy. Select the text and copy it yourself.";
      window.setTimeout(function () { status.textContent = ""; }, 3500);
    }

    function fallback() {
      var range = document.createRange();
      range.selectNodeContents(src);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      sel.removeAllRanges();
      done(ok);
    }

    btn.addEventListener("click", function () {
      var text = src.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  })();

  /* ---------- Self-check list ---------- */
  (function checklist() {
    var list = document.getElementById("checklist");
    var ready = document.getElementById("ready");
    if (!list || !ready) return;
    var boxes = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]'));
    function update() {
      ready.hidden = !boxes.every(function (b) { return b.checked; });
    }
    boxes.forEach(function (b) { b.addEventListener("change", update); });
  })();

  /* ---------- Print ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-print]"), function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });
})();
