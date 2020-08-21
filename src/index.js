// import login from './utils/login';
import './app.scss';

const init = async () => {
    try {
        await chayns.ready;
    } catch (err) {
        console.error('No chayns environment found', err);
    }
};

init();
