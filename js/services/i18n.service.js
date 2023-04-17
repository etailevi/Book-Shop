'use strict'

var gTrans = {
    'main-title': {
        en: 'It\'s All About The Books',
        he: 'ספרים זה אנחנו'
    },
    'new-book': {
        en: 'Create new book',
        he: 'הוסף ספר חדש'
    },
    'search-box-placeholder': {
        en: 'Search by name',
        he: 'חפש ספר לפי שם'
    },
    'max-price': {
        en: 'Max Price:',
        he: 'מחיר מקס\':'
    },
    'min-rate': {
        en: 'Min Rate:',
        he: 'דירוג מינ\':'
    },
    id: {
        en: 'Id',
        he: 'סידורי'
    },
    'book-title': {
        en: 'Title',
        he: 'שם הספר '
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },
    read: {
        en: 'Read',
        he: 'קרא'
    },
    update: {
        en: 'Update',
        he: 'עדכן'
    },
    delete: {
        en: 'Delete',
        he: 'מחק'
    },
    prev: {
        en: 'Previous',
        he: 'הקודם'
    },
    next: {
        en: 'Next',
        he: 'הבא'
    },
    rate: {
        en: 'Book Rate: ',
        he: 'דירוג הספר: '
    },
    summary: {
        en: 'Book Summary: ',
        he: 'תקציר: '
    },
    'change-rate': {
        en: 'Change rate: ',
        he: 'שנה דירוג: '
    },
    'close-modal': {
        en: 'Close',
        he: 'סגור'
    }
}

var gCurrLang = 'en'

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    var transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        if (el.placeholder) {
            console.log('el', el, transTxt)
            el.placeholder = transTxt
        } else {
            el.innerText = transTxt
        }
    })
}

function setLang(lang) {
    gCurrLang = lang
}