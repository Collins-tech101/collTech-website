export function handleSearch() {
  const searchInput = document.querySelector('.search-bar');
  const searchQuery = searchInput.value.trim();
  if (searchQuery) {
    window.location.href = `amazon.html?search=${searchQuery}`;
  }
}
  document.querySelector('.search-button').addEventListener('click', (e) => {
    e.preventDefault();
    handleSearch();
  })

  document.querySelector('.search-bar').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });