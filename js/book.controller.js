'use strict'

var gLanguage = 'en'
var gOptions = { style: 'currency', currency: 'USD' }

function onInit() {
    renderFilterByQueryStringParams()
    updateQueryString()
    renderBooks()
}

function renderBooks() {
    var books = getBooks()
    var strHtmls = books.map(book => `
    <tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <th>${formatCurrency(book.price)}</th>
    <td class="read-class"><button onclick="onReadBook(${book.id})" data-trans="read">Read</button></td>
    <td class="update-class"><button onclick="onUpdateBook(${book.id})" data-trans="update">Update</button></td>
    <td class="delete-class"><button onclick="onRemoveBook(${book.id})" data-trans="delete">Delete</button></td>
    </tr>
    `
    )
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
    doTrans()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    var msg = (gLanguage === 'en') ? 'Book Deleted' : 'הספר נמחק בהצלחה'
    flashMsg(msg)
}

function onAddBook() {
    var msg = ''
    if (gLanguage === 'en') {
        var name = prompt('What is the name of the book?')
        var price = +prompt('What is the price of the book? ($)')
    } else {
        var name = prompt('מהו שם הספר?')
        var price = +prompt('מהו מחיר הספר? (₪)')
    }
    if (name && price) {
        const book = addBook(name, price)
        renderBooks()
        msg = (gLanguage === 'en') ? `Book Added (id: ${book.id})` : `נוסף ספר חדש (מס"ד: ${book.id})`
        flashMsg(msg)
    } else {
        msg = (gLanguage === 'en') ? 'Some details are missing!' : 'חסרים פרטים בהזנת הספר החדש'
        flashMsg(msg)
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var promptMsg = (gLanguage === 'en') ? 'What is the new price?' : 'מהו המחיר החדש?'
    var newPrice = +prompt(promptMsg, book.price)
    if (newPrice && book.price !== newPrice) {
        const updatedBook = updateBook(bookId, newPrice)
        renderBooks()
        var msg = (gLanguage === 'en') ? `Price updated to: ${formatCurrency(book.price)}` : `המחיר עודכן ל: ${formatCurrency(book.price)}`
        flashMsg(msg)
    }
}

function onReadBook(bookId) {
    showModal(bookId)
}

function showModal(bookId) {
    var book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    const strHtml = `
    <h3><span data-trans="book-title">Title</span>${book.name}</h3>
    <h4><span data-trans="price">Book Price:</span>${formatCurrency(book.price)}</h4>
    <h5><span data-trans="rate">Book Rate:</span>${book.rate}</h5>
    <p><span data-trans="summary">Book Summary:</span>${book.description}</p>
    <div class="change-rate"><div data-trans="change-rate">Change rate:</div>
    <button onclick="onDowngradeRate(${book.id})">-</button>
        <span> ${book.rate} </span>
    <button onclick="onUpgradeRate(${book.id})">+</button></div>
    <button data-trans="close-modal" class="close-btn" onclick="onCloseModal(${book.id})">Close</button>`
    elModal.innerHTML = strHtml
    elModal.classList.add('open')
    doTrans()
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

function updateQueryString() {
    const filterBy = getFilterBy()
    const queryStringParams = `?lang=${gLanguage}&name=${filterBy.name}&maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
    updateQueryString()
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

function onSetLang(lang) {
    setLang(lang)
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    gLanguage = lang
    gOptions.currency = (gLanguage === 'en') ? 'USD' : 'ILS'
    updateQueryString()
    renderBooks()
}

function formatCurrency(num) {
    return new Intl.NumberFormat(gLanguage, gOptions).format(num)
}