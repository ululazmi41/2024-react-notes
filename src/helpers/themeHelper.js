function initTheme() {
  const localTheme = localStorage.getItem('darkmode');
  return localTheme || false;
}

function setTheme(newValue) {
  localStorage.setItem('darkmode', newValue);
}

export {
  initTheme,
  setTheme,
}
