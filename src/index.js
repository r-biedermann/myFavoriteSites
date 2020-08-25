/* eslint-disable camelcase */
/* eslint-disable no-empty */
/* eslint-disable no-plusplus */
// import login from './utils/login';
import './app.scss';

const defaultSearch = 'love';
let searchString = defaultSearch;
let timeout;
let hideListItems = true;

const $list = document.querySelector('.list');
const $firstName = document.querySelector('#firstName');
const $firstName_label = document.querySelector('#firstName-label');
const $lastName = document.querySelector('#lastName');
const $lastName_label = document.querySelector('#lastName-label');
const $eMail = document.querySelector('#eMail');
const $eMail_label = document.querySelector('#eMail-label');
const $siteName = document.querySelector('#siteName');
const $siteName_label = document.querySelector('#siteName-label');
const $search = document.querySelector('#search');
const $address = document.querySelector('#address');
const $postcode = document.querySelector('#postcode');
const $place = document.querySelector('#place');
const $comment = document.querySelector('#comment');
const $accordion = document.querySelector('.accordion');
const $toggle = document.querySelector('#toggle');

const getData = () => {
    $accordion.classList.add('hidden');
    chayns.showWaitCursor();
    while ($list.firstElementChild !== null) {
        $list.firstElementChild.remove();
    }
    fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${searchString}&Skip=0&Take=60`)
        .then(response => response.json()).then((json) => {
            createList(json.Data);
        }).catch(() => {
            chayns.hideWaitCursor();
        })
        .then(() => {
            $accordion.classList.remove('hidden');
            chayns.hideWaitCursor();
            hideListItems = true;
            toggleList();
        });
};

const setName = () => {
    $firstName.value = chayns.env.user.firstName;
    $lastName.value = chayns.env.user.lastName;
    checkForText();
};

const searchInput = () => {
    clearTimeout(timeout);
    timeout = setTimeout(search, 500);
};

const search = () => {
    if ($search.value === '') {
        searchString = defaultSearch;
    } else {
        searchString = $search.value;
    }
    getData();
};

const toggleList = () => {
    const items = $list.children;
    if (hideListItems) {
        for (let i = 30; i < items.length; i++) {
            items[i].classList.add('hidden');
        }
        $toggle.innerHTML = 'Mehr';
        hideListItems = false;
    } else {
        for (let i = 30; i < items.length; i++) {
            items[i].classList.remove('hidden');
        }
        $toggle.innerHTML = 'Weniger';
        hideListItems = true;
    }
};

function createList(data) {
    for (let i = 0; i < data.length; i++) {
        const element = document.createElement('div');
        const name = document.createElement('p');
        const background = document.createElement('div');
        const img = document.createElement('div');

        element.classList.add('listElement');
        name.innerHTML = data[i].appstoreName.substr(0, 15);
        background.classList.add('background');
        img.style = `background-image: url(https://sub60.tobit.com/l/${data[i].locationId}?size=70); z-index: 1000; width: 70px; height: 70px; background-size: cover;`;
        element.addEventListener('click', () => { chayns.openUrlInBrowser(`https://chayns.net/${data[i].siteId}`); });

        $list.appendChild(element);
        element.appendChild(background);
        background.appendChild(img);
        element.appendChild(name);
    }
}

const checkForText = () => {
    const divs = document.querySelectorAll('.input-group');
    for (let i = 0; i < divs.length; i++) {
        if (divs[i].firstElementChild.value === '') {
            divs[i].classList.remove('labelRight');
        } else {
            divs[i].classList.add('labelRight');
        }
    }
    if ($firstName.value === '') {
        $firstName.classList.add('wrong');
        $firstName_label.classList.add('wrong');
    } else {
        $firstName.classList.remove('wrong');
        $firstName_label.classList.remove('wrong');
    }
    if ($lastName.value === '') {
        $lastName.classList.add('wrong');
        $lastName_label.classList.add('wrong');
    } else {
        $lastName.classList.remove('wrong');
        $lastName_label.classList.remove('wrong');
    }
    if ($eMail.value === '') {
        $eMail.classList.add('wrong');
        $eMail_label.classList.add('wrong');
    } else {
        $eMail.classList.remove('wrong');
        $eMail_label.classList.remove('wrong');
    }
    if ($siteName.value === '') {
        $siteName.classList.add('wrong');
        $siteName_label.classList.add('wrong');
    } else {
        $siteName.classList.remove('wrong');
        $siteName_label.classList.remove('wrong');
    }
};

function buttonClicked() {
    if (chayns.env.user.isAuthenticated) {
        sendForm();
    } else {
        chayns.addAccessTokenChangeListener(sendForm);
        chayns.login();
    }
}

function sendForm() {
    let message = '';
    let fullAddress = '';
    if ($address.value !== '' || $postcode.value !== '' || $place.value !== '') {
        fullAddress = `${$address.value}, ${$postcode.value} ${$place.value}`;
    }
    const personalData = `${$firstName.value} ${$lastName.value}: ${$eMail.value}`;
    if (fullAddress === '') {
        if ($comment.value === '') {
            message = `${personalData} \n hat ${$siteName.value} vorgeschlagen`;
        } else {
            message = `${personalData} \n hat ${$siteName.value} vorgeschlagen \n "${$comment.value}"`;
        }
    } else if ($comment.value === '') {
        message = `${personalData} \n ${fullAddress} \n hat ${$siteName.value} vorgeschlagen`;
    } else {
        message = `${personalData} \n ${fullAddress} \n hat ${$siteName.value} vorgeschlagen \n "${$comment.value}"`;
    }
    if ($firstName.value === '' || $lastName.value === '' || $eMail.value === '' || $siteName.value === '') {
        chayns.dialog.alert('', 'Bitte fülle alle Pflichtfelder aus.');
    } else {
        chayns.intercom.sendMessageToPage(
            {
                text: message
            }
        ).then((result) => {
            if (result.ok) {
                chayns.dialog.alert('', 'Die Nachricht wurde versendet.');
                $firstName.value = '';
                $lastName.value = '';
                $eMail.value = '';
                $address.value = '';
                $postcode.value = '';
                $place.value = '';
                $siteName.value = '';
                $comment.value = '';
                checkForText();
            } else {
                chayns.dialog.alert('', 'Ein Fehler ist aufgetreten.');
            }
        });
    }
}

const init = async () => {
    try {
        await chayns.ready;
        getData();
        if (chayns.env.user.isAuthenticated) {
            setName();
        }
        chayns.ui.initAll();
        const inputs = document.querySelectorAll('.form-item');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', checkForText);
        }
        document.querySelector('#send').addEventListener('click', buttonClicked);
        $search.addEventListener('input', searchInput);
        $toggle.addEventListener('click', toggleList);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
};

init();
