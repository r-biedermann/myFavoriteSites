// import login from './utils/login';
import './app.scss';

const init = async () => {
    try {
        await chayns.ready;
        getData();
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

init();
