(function () {
  var now = new Date(), d = now.getDay();
  document.getElementById('year').textContent = now.getFullYear();
  document.querySelectorAll('.hours li').forEach(function (li) {
    if (+li.dataset.day === d) li.classList.add('today');
  });
  // [open, close] on a 24h clock; close above 24 runs past midnight
  var s = { 3: [18, 24], 4: [18, 22], 5: [18, 26], 6: [15, 25], 0: [18, 22] };
  var h = now.getHours() + now.getMinutes() / 60, t = s[d], y = s[(d + 6) % 7], open = false;
  if (t && h >= t[0] && h < Math.min(t[1], 24)) open = true;
  if (y && y[1] > 24 && h < y[1] - 24) open = true;
  var el = document.getElementById('openNow');
  el.textContent = open ? 'Open now' : 'Closed right now';
  el.classList.toggle('is-open', open);
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { a.closest('details').removeAttribute('open'); });
  });
  var f = document.getElementById('contactForm'), st = document.getElementById('formStatus');
  f.addEventListener('submit', function (e) {
    if (f.action.indexOf('YOUR_FORM_ID') > -1) {
      e.preventDefault();
      st.textContent = 'This form is not connected yet. Add your form endpoint to send messages.';
    }
  });
})();
  
