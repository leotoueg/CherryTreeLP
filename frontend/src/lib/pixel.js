// Safe Meta Pixel helpers — no-ops if the pixel script is blocked or not loaded.
const fbq = (...args) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};

export const trackEvent = (event, params) => fbq("track", event, params);
export const trackCustom = (event, params) => fbq("trackCustom", event, params);
