const stale = document.querySelector('#stale');
if (stale) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = name => parts.find(p => p.type === name).value;
  const today = new Date(`${part('year')}-${part('month')}-${part('day')}T12:00:00Z`);
  today.setUTCDate(today.getUTCDate() - ((today.getUTCDay() + 4) % 7));
  stale.hidden = stale.dataset.week >= today.toISOString().slice(0, 10);
}
let openDetails = [];
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', async () => {
  const article = document.getElementById(button.dataset.print);
  button.disabled = true;
  await Promise.all([...article.querySelectorAll('img')].map(img => {
    img.loading = 'eager';
    return img.decode().catch(() => {});
  }));
  document.body.classList.add('printing-recipe');
  article.classList.add('print-target');
  window.print();
  button.disabled = false;
}));
window.addEventListener('beforeprint', () => {
  openDetails = [...document.querySelectorAll('details[open]')];
  document.querySelectorAll('details').forEach(d => { d.open = true; });
});
window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing-recipe');
  document.querySelectorAll('.print-target').forEach(a => a.classList.remove('print-target'));
  document.querySelectorAll('details').forEach(d => { d.open = openDetails.includes(d); });
});
