const accountBtn = document.getElementById('accountBtn');
const accountPanel = document.getElementById('accountPanel');
const closePanelBtn = document.getElementById('closePanelBtn');

accountBtn.addEventListener('click', (e) => {
  e.preventDefault();
  accountPanel.classList.add('open');
});

closePanelBtn.addEventListener('click', () => {
  accountPanel.classList.remove('open');
});

document.addEventListener('click', (e) => {
  if (!accountPanel.contains(e.target) && !accountBtn.contains(e.target)) {
    accountPanel.classList.remove('open');
  }
});