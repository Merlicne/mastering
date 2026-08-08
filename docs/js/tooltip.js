(function () {
  var popover = null;
  var arrowEl = null;
  var textEl = null;
  var currentTerm = null;
  var locked = false;

  function ensurePopover() {
    if (popover) return;
    popover = document.createElement("div");
    popover.className = "tooltip-popover";
    arrowEl = document.createElement("div");
    arrowEl.className = "tooltip-arrow";
    textEl = document.createElement("div");
    popover.appendChild(arrowEl);
    popover.appendChild(textEl);
    document.body.appendChild(popover);
  }

  function showTooltip(term) {
    ensurePopover();
    currentTerm = term;
    textEl.textContent = term.getAttribute("data-tip") || "";

    popover.style.left = "0px";
    popover.style.top = "0px";
    var termRect = term.getBoundingClientRect();
    var popRect = popover.getBoundingClientRect();
    var pw = popRect.width;
    var ph = popRect.height;
    var vw = window.innerWidth;

    var placement = "top";
    var top = termRect.top - ph - 10;
    if (top < 8) {
      placement = "bottom";
      top = termRect.bottom + 10;
    }

    var left = termRect.left + termRect.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, vw - pw - 8));

    popover.style.left = left + "px";
    popover.style.top = top + "px";
    popover.setAttribute("data-placement", placement);

    var arrowLeft = termRect.left + termRect.width / 2 - left - 5;
    arrowLeft = Math.max(10, Math.min(arrowLeft, pw - 20));
    arrowEl.style.left = arrowLeft + "px";

    requestAnimationFrame(function () {
      popover.classList.add("visible");
    });
  }

  function hideTooltip() {
    if (!popover) return;
    popover.classList.remove("visible");
    currentTerm = null;
    locked = false;
  }

  function closestTerm(el) {
    return el && el.closest ? el.closest(".term") : null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".term"), function (el) {
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    });
  });

  document.addEventListener("mouseover", function (e) {
    var term = closestTerm(e.target);
    if (term) showTooltip(term);
  });

  document.addEventListener("mouseout", function (e) {
    var term = closestTerm(e.target);
    if (term && !locked) hideTooltip();
  });

  document.addEventListener("focus", function (e) {
    var term = closestTerm(e.target);
    if (term) showTooltip(term);
  }, true);

  document.addEventListener("blur", function (e) {
    var term = closestTerm(e.target);
    if (term && !locked) hideTooltip();
  }, true);

  document.addEventListener("click", function (e) {
    var term = closestTerm(e.target);
    if (term) {
      if (currentTerm === term && locked) {
        hideTooltip();
      } else {
        showTooltip(term);
        locked = true;
      }
      e.stopPropagation();
      return;
    }
    if (locked) hideTooltip();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideTooltip();
  });

  window.addEventListener("scroll", function () {
    if (currentTerm && !locked) hideTooltip();
  }, true);

  window.addEventListener("resize", function () {
    if (currentTerm) showTooltip(currentTerm);
  });
})();
