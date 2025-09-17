// admin.js (Versão Completa e Revisada - Setembro 2025)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNÇÕES DE INTERAÇÃO COM O LOCALSTORAGE ---
    const getBooksFromStorage = () => {
        const booksJSON = localStorage.getItem('booksDB');
        if (!booksJSON) {
            const sampleBooks = [
                { id: 1, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', description: 'Em uma terra fantástica e única, um hobbit recebe de presente de seu tio um anel mágico e maligno que precisa ser destruído antes que caia nas mãos do mal. Uma grande jornada se inicia.' },
                { id: 2, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', description: 'Arthur Dent tem sua casa e seu planeta destruídos em um mesmo dia, e parte em uma louca jornada pela galáxia com seu amigo Ford Prefect, que acaba de revelar ser um alienígena.' }
            ];
            localStorage.setItem('booksDB', JSON.stringify(sampleBooks));
            return sampleBooks;
        }
        return JSON.parse(booksJSON);
    };

    const saveBooksToStorage = (books) => {
        localStorage.setItem('booksDB', JSON.stringify(books));
    };

    // --- 2. MODELO DE DADOS E ESTADO DA APLICAÇÃO ---
    let books = getBooksFromStorage();
    let isEditing = false;

    // --- 3. REFERÊNCIAS AOS ELEMENTOS DO DOM ---
    const form = document.getElementById('bookForm');
    const bookIdInput = document.getElementById('bookId');
    const bookTitleInput = document.getElementById('bookTitle');
    const bookAuthorInput = document.getElementById('bookAuthor');
    const bookDescriptionInput = document.getElementById('bookDescription'); // VERIFIQUE SE O ID NO HTML ESTÁ CORRETO
    const tableBody = document.getElementById('book-table-body');
    const submitButton = form.querySelector('.btn-primary');
    const cancelButton = document.getElementById('cancelUpdate');

    // --- 4. FUNÇÕES AUXILIARES (UI/UX) ---
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.classList.add('show'); }, 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.remove(); }, 500);
        }, 3000);
    };

    const renderTable = () => {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (books.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum livro cadastrado.</td></tr>';
            return;
        }
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `<td data-label="ID">${book.id}</td><td data-label="Título">${book.title}</td><td data-label="Autor">${book.author}</td><td data-label="Ações"><div class="actions-cell"><button class="btn btn-edit" data-id="${book.id}"><i class="fas fa-pencil-alt"></i></button><button class="btn btn-delete" data-id="${book.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
            tableBody.appendChild(row);
        });
    };
    
    const resetForm = () => {
        if (!form) return;
        isEditing = false;
        form.reset();
        bookIdInput.value = '';
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Livro';
        cancelButton.style.display = 'none';
    };

    // --- 5. FUNÇÕES PRINCIPAIS DO CRUD ---
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const title = bookTitleInput.value.trim();
        const author = bookAuthorInput.value.trim();
        const description = bookDescriptionInput.value.trim();
        const id = bookIdInput.value;

        if (!title || !author) {
            showToast('Por favor, preencha pelo menos o título e o autor.', 'error');
            return;
        }

        if (isEditing) {
            books = books.map(book => book.id === Number(id) ? { id: book.id, title, author, description } : book);
            showToast('Livro atualizado com sucesso!', 'success');
        } else {
            const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
            books.push({ id: newId, title, author, description });
            showToast('Livro adicionado com sucesso!', 'success');
        }
        
        saveBooksToStorage(books);
        resetForm();
        renderTable();
    };
    
    const startEdit = (id) => {
        const bookToEdit = books.find(book => book.id === id);
        if (!bookToEdit) return;
        isEditing = true;
        bookIdInput.value = bookToEdit.id;
        bookTitleInput.value = bookToEdit.title;
        bookAuthorInput.value = bookToEdit.author;
        bookDescriptionInput.value = bookToEdit.description || '';
        submitButton.innerHTML = '<i class="fas fa-save"></i> Atualizar Livro';
        cancelButton.style.display = 'inline-block';
        bookTitleInput.focus();
    };

    const deleteBook = (id) => {
        if (confirm('Tem certeza de que deseja excluir este livro?')) {
            books = books.filter(book => book.id !== id);
            saveBooksToStorage(books);
            renderTable();
            showToast('Livro excluído com sucesso.', 'success');
        }
    };
    
    const handleTableClick = (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        const id = Number(target.dataset.id);
        if (target.classList.contains('btn-edit')) {
            startEdit(id);
        } else if (target.classList.contains('btn-delete')) {
            deleteBook(id);
        }
    };

    // --- 6. EVENT LISTENERS E INICIALIZAÇÃO ---
    if(form) {
        form.addEventListener('submit', handleFormSubmit);
        cancelButton.addEventListener('click', resetForm);
    }
    if(tableBody) {
        tableBody.addEventListener('click', handleTableClick);
    }
    
    renderTable();
    resetForm(); 
});