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
        const element = document.createElement('DIV');
        const name = document.createElement('P');
        const img = document.createElement('IMG');
        const link = document.createElement('A');

        element.classList.add('listElement');
        name.innerHTML = website.appstoreName.substr(0, 20);
        img.src = `https://sub60.tobit.com/l/${website.locationId}?size=70`;
        link.addEventListener('click', () => { chayns.openUrlInBrowser(`https://chayns.net/${website.siteId}`); });
        link.classList.add('link');

        $list.appendChild(element);
        element.appendChild(link);
        link.appendChild(img);
        element.appendChild(name);
    }
}

init();
