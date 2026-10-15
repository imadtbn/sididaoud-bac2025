/* Initialize AdSense units once and only when their responsive containers have room.
   The containers reserve space in CSS; AdSense may still vary the final creative height. */
(function () {
  "use strict";
  var placements = Array.prototype.slice.call(document.querySelectorAll("[data-ad-placement]"));
  if (!placements.length) return;
  var minSafeWidth = 290;
  var observer = null;
  function requestAd(placement) {
    if (!placement || placement.dataset.adRequested === "true") return true;
    var frame = placement.querySelector(".ad-placement__creative");
    var unit = placement.querySelector("ins.adsbygoogle");
    if (!frame || !unit) return true;
    if (unit.getAttribute("data-adsbygoogle-status")) {
      placement.dataset.adRequested = "true";
      return true;
    }
    var frameWidth = frame.getBoundingClientRect().width;
    var unitWidth = unit.getBoundingClientRect().width;
    if (frameWidth < minSafeWidth || unitWidth < minSafeWidth) return false;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      placement.dataset.adRequested = "true";
      return true;
    } catch (error) {
      console.warn("AdSense unit initialization failed:", error);
      return false;
    }
  }
  function check(placement) {
    if (placement.dataset.adInRange !== "true") return;
    if (requestAd(placement) && observer) observer.unobserve(placement);
  }
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.dataset.adInRange = "true";
        check(entry.target);
      });
    }, { rootMargin: "450px 0px", threshold: 0 });
    placements.forEach(function (placement) { observer.observe(placement); });
  } else {
    placements.forEach(function (placement) {
      placement.dataset.adInRange = "true";
      check(placement);
    });
  }
  if ("ResizeObserver" in window) {
    var resizeObserver = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        var placement = entry.target.closest("[data-ad-placement]");
        if (placement) check(placement);
      });
    });
    placements.forEach(function (p) {
      var frame = p.querySelector(".ad-placement__creative");
      if (frame) resizeObserver.observe(frame);
    });
  } else {
    window.addEventListener("resize", function () {
      placements.forEach(check);
    }, { passive: true });
  }
})();
