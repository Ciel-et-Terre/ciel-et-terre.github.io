// Gestion des textes dans localStorage

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('texts-list');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-select');

  function loadTexts() {
    const texts = JSON.parse(localStorage.getItem('texts') || '[]');
    return texts.sort((a, b) => a.date - b.date); // tri par date ascendant
  }

  function saveTexts(texts) {
    localStorage.setItem('texts', JSON.stringify(texts));
  }

  function renderTexts() {
    if (!listContainer) return;
    const texts = loadTexts();
    listContainer.innerHTML = '';
    let filtered = texts;
    if (categoryFilter && categoryFilter.value) {
      filtered = texts.filter(t => t.category === categoryFilter.value);
    }
    const sortType = sortSelect ? sortSelect.value : 'date';
    if (sortType === 'alpha') {
      filtered.sort((a,b) => a.title.localeCompare(b.title));
    }
    filtered.forEach(text => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${text.title}</h3>
        <p><strong>Auteur:</strong> ${text.author || 'Anonyme'}</p>
        <p><em>${text.category}</em> - ${new Date(text.date).toLocaleDateString()}</p>
        <p>${text.content.replace(/\n/g,'<br>')}</p>
        <button class="copy-btn">Copier ce texte</button>
      `;
      card.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(text.content);
      });
      listContainer.appendChild(card);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderTexts);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', renderTexts);
  }

  renderTexts();

  // gestion du formulaire d'ajout
  const form = document.getElementById('text-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = form.author.value.trim();
      const title = form.title.value.trim();
      const category = form.category.value;
      const content = form.content.value.trim();
      if (!title || !category || !content) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      const texts = loadTexts();
      texts.push({
        id: Date.now(),
        author,
        title,
        category,
        content,
        date: Date.now()
      });
      saveTexts(texts);
      form.reset();
      const message = document.getElementById('success-msg');
      if (message) {
        message.style.display = 'block';
        setTimeout(() => message.style.display = 'none', 2000);
      }
    });
  }
});
