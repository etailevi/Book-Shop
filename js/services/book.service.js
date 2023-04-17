'use strict'

const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 4


var gBooks
var gNames = ['Alice in Wonderland', 'Eat, Pray, Love', 'The Holy Bible', 'Lion King', 'Pinocchio']
var gPrices = [16.99, 30.50, 65.50, 22.10, 26.70]
var gFilterBy = { maxPrice: 100, minRate: 0, name: '' }
var gPageIdx = 0

_createBooks()

function getBookNames() {
    return gNames
}

function getBooks() {
    var books
    if (gFilterBy.name) {
        books = gBooks.filter(book =>
            book.name.toLowerCase().includes(gFilterBy.name.toLowerCase()))
    } else {
        books = gBooks.filter(book =>
            book.price <= gFilterBy.maxPrice &&
            book.rate >= gFilterBy.minRate)
    }
    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < gNames.length; i++) {
            var name = gNames[i]
            var price = gPrices[i]
            books.push(_createBook(name, price))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(name, price) {
    return {
        id: +makeId(),
        name,
        price,
        description: makeLorem(),
        rate: 0,
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    console.log('gBooks[0].id', gBooks[0].id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function upgradeRate(bookId) {
    const book = getBookById(bookId)
    if (book.rate >= 10) return book
    book.rate++
    _saveBooksToStorage()
    return book
}

function downgradeRate(bookId) {
    const book = getBookById(bookId)
    if (book.rate <= 0) return book
    book.rate--
    _saveBooksToStorage()
    return book
}

function setBookFilter(filterBy) {
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    gPageIdx = 0
    return gFilterBy
}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= 0) {
        gPageIdx = 0
        document.querySelector('.prev-page').disabled = true
    }
    document.querySelector('.next-page').disabled = false
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) gPageIdx--
    if ((gPageIdx + 1) * PAGE_SIZE > gBooks.length) {
        document.querySelector('.next-page').disabled = true
    }
    document.querySelector('.prev-page').disabled = false
}


