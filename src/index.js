// import login from './utils/login';
import './app.scss';

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
            inputs[i].addEventListener('change', checkForText);
        }
        document.querySelector('#send').addEventListener('click', sendForm);
        document.querySelector('.accordion').addEventListener('click', accordionClicked);
    } catch (err) {
        console.error('No chayns environment found', err);
    }
};

const $list = document.querySelector('.list');

const getData = () => {
    fetch('https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=50')
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log('parsed json', json);
            createList(json.Data);
        }).catch(function (ex) {
            console.log('parsing failed', ex);
        });
};

const setName = () => {
    document.querySelector('#firstName').value = chayns.env.user.firstName;
    document.querySelector('#lastName').value = chayns.env.user.lastName;
    checkForText();
};

function createList(data) {
    for (const website of data) {
        const element = document.createElement('div');
        const name = document.createElement('p');
        const background = document.createElement('div');
        const img = document.createElement('div');

        element.classList.add('listElement');
        name.innerHTML = website.appstoreName.substr(0, 15);
        background.classList.add('background');
        img.style = `background-image: url(https://sub60.tobit.com/l/${website.locationId}?size=70); z-index: 1000; width: 70px; height: 70px;`;
        background.addEventListener('click', () => { chayns.openUrlInBrowser(`https://chayns.net/${website.siteId}`); });

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
};

function accordionClicked() {
    if (!chayns.env.user.isAuthenticated) {
        chayns.addAccessTokenChangeListener(setName);
        chayns.login();
    }
}

function sendForm() {
    const $firstName = document.querySelector('#firstName');
    const $lastName = document.querySelector('#lastName');
    const $eMail = document.querySelector('#eMail');
    const $address = document.querySelector('#address');
    const $postcode = document.querySelector('#postcode');
    const $place = document.querySelector('#place');
    const $siteName = document.querySelector('#siteName');
    const $comment = document.querySelector('#comment');
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
    } else {
        if ($comment.value === '') {
            message = `${personalData} \n ${fullAddress} \n hat ${$siteName.value} vorgeschlagen`;
        } else {
            message = `${personalData} \n ${fullAddress} \n hat ${$siteName.value} vorgeschlagen \n "${$comment.value}"`;
        }
    }
    if ($firstName.value === '' || $lastName.value === '' || $eMail.value === '' || $siteName.value === '') {
        chayns.dialog.alert('', 'Bitte fülle alle Pflichtfelder aus.');
    } else {
        chayns.intercom.sendMessageToPage(
            {
                text: message
            }
        ).then(function (result) {
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

init();
