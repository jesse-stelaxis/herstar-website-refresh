/* Local demonstration events only. No network requests or visitor tracking. */
(function () {
  const key = 'herstar-demo-events';
  window.HerstarDemo = {
    events() { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
    record(type, detail = {}) {
      const rows = this.events();
      rows.push({ type, at: new Date().toISOString(), ...detail });
      try { localStorage.setItem(key, JSON.stringify(rows.slice(-1000))); } catch { /* Demo storage may be full. */ }
    }
  };
})();
