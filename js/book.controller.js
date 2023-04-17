'use strict'


function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    console.log('gBooks', gBooks)
}

function renderBooks() {
    var books = getBooks()
    var strHtmls = books.map(book => `
    <tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <th>${book.price}$</th>
    <td class="read-class"><button onclick="onReadBook(${book.id})">Read</button></td>
    <td class="update-class"><button onclick="onUpdateBook(${book.id})">Update</button></td>
    <td class="delete-class"><button onclick="onRemoveBook(${book.id})">Delete</button></td>
    </tr>
    `
    )
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onAddBook() {
    var name = prompt('What is the name of the book?')
    var price = +prompt('What is the price of the book? ($)')
    if (name && price) {
        const book = addBook(name, price)
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    } else {
        flashMsg('Some details are missing!')
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('What is the new price?', book.price)
    if (newPrice && book.price !== newPrice) {
        const updatedBook = updateBook(bookId, newPrice)
        renderBooks()
        flashMsg(`Price updated to: ${updatedBook.price}$`)
    }
}

function onReadBook(bookId) {
    showModal(bookId)
}

function showModal(bookId) {
    var book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    const strHtml = `
    <h3><span>Book Title: ${book.name}</span></h3>
    <h4>Book Price: $${book.price}</h4>
    <h5>Book Rate: ${book.rate}</h5>
    <p>Book summry: ${book.description}</p>
    <div class="change-rate">Change rate:
    <button onclick="onDowngradeRate(${book.id})">-</button>
        <span>${book.rate}</span>
    <button onclick="onUpgradeRate(${book.id})">+</button></div>
    <button class="close-btn" onclick="onCloseModal(${book.id})">close</button>`
    elModal.innerHTML = strHtml
    elModal.classList.add('open')
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onUpgradeRate(bookId) {
    const book = upgradeRate(bookId)
    var dynamicRate = document.querySelector('.change-rate span')
    dynamicRate.innerText = book.rate
}

function onDowngradeRate(bookId) {
    const book = downgradeRate(bookId)
    var dynamicRate = document.querySelector('.change-rate span')
    dynamicRate.innerText = book.rate
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?name=${filterBy.name}&maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        name: queryStringParams.get('name') || '',
        maxPrice: +queryStringParams.get('maxPrice') || 0,
        minRate: +queryStringParams.get('minRate') || 0
    }

    if (!filterBy.name && !filterBy.maxPrice && !filterBy.minRate) return

    document.querySelector('.search-box').value = filterBy.name
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onPrevPage() {
    prevPage()
    renderBooks()
}

function onNextPage() {
    nextPage()
    renderBooks()
}