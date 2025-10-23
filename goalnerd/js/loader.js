document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  function hideLoader() {
    loader.classList.add("hide");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
  }

  window.addEventListener("load", hideLoader);

  setTimeout(hideLoader, 4000);
});
