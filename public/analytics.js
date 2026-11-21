// Google Analytics (G-GYC5E742Y0) i Google Tag Manager (GTM-T7PVGTNZ) amb el mode de consentiment v2 de Google.
// Tot comença denegat; el missatge de privadesa certificat de Google (AdSense > Privadesa i missatges)
// actualitza el consentiment quan el visitant accepta. Analytics es carrega aquí directament:
// NO s'ha d'afegir també com a etiqueta dins de Tag Manager (comptaria les visites dues vegades).
(function () {
  if (window.__ecoynexoGTM) return; window.__ecoynexoGTM = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
  var carrega = function (src) { var s = document.createElement('script'); s.async = true; s.src = src; var f = document.getElementsByTagName('script')[0]; if (f && f.parentNode) f.parentNode.insertBefore(s, f); else document.head.appendChild(s); };
  // Google Analytics 4
  gtag('js', new Date());
  gtag('config', 'G-GYC5E742Y0');
  carrega('https://www.googletagmanager.com/gtag/js?id=G-GYC5E742Y0');
  // Google Tag Manager (per a altres etiquetes en el futur)
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  carrega('https://www.googletagmanager.com/gtm.js?id=GTM-T7PVGTNZ');
})();
