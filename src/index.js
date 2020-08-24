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

        element.classList.add('listElement');
        name.innerHTML = website.appstoreName;
        
        $list.appendChild(element);
        element.appendChild(name);
    }
}

init();
