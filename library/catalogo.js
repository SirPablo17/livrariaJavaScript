// catalogo.js (Versão Completa e Robusta)

document.addEventListener('DOMContentLoaded', () => {
    const catalogContainer = document.getElementById('book-catalog');
    
    // --- Referências aos elementos do Modal ---
    const modal = document.getElementById('book-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalAuthor = document.getElementById('modal-author');
    const modalDescription = document.getElementById('modal-description');

    let books = []; // Armazena os livros carregados

    const getBooksFromStorage = () => {
        const booksJSON = localStorage.getItem('booksDB');
        books = booksJSON ? JSON.parse(booksJSON) : []; 
    };

    const renderCatalog = () => {
        if (!catalogContainer) return;
        catalogContainer.innerHTML = ''; 

        if (books.length === 0) {
            catalogContainer.innerHTML = `<div class="empty-message"><h2>Ops!</h2><p>Nenhum livro foi encontrado.</p></div>`;
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <h3>${book.title}</h3>
                <p class="author">por ${book.author}</p>
                <button class="btn-ler" data-id="${book.id}">Ler Mais</button>
            `;
            catalogContainer.appendChild(card);
        });
    };
    
    // --- Funções do Modal ---
    const openModal = (bookId) => {
        const book = books.find(b => b.id === Number(bookId));
        if (!book) return;

        modalTitle.textContent = book.title;
        modalAuthor.textContent = `por ${book.author}`;
        modalDescription.textContent = book.description || 'Nenhuma descrição disponível.';
        modal.classList.add('show-modal');
    };

    const closeModal = () => {
        modal.classList.remove('show-modal');
    };

    // --- Event Listeners ---
    if (catalogContainer) {
        catalogContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-ler')) {
                const bookId = event.target.dataset.id;
                openModal(bookId);
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // --- Inicialização ---
    getBooksFromStorage();
    renderCatalog();
});