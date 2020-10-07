import { h, render } from 'preact';
import { Provider } from 'redux-zero/preact';
import App from './App';
import store from './store';
import './messaging';

render(
    // @ts-ignore
    <Provider store={store}><App /></Provider>,
    document.body
);
