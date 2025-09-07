import ReactDOM from 'react-dom/client';
import { Layout } from './Components/LayoutArea/Layout/Layout';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store'; // import persistor
import { PersistGate } from 'redux-persist/integration/react'; // import PersistGate
import { interceptor } from './Utils/Interceptor';

interceptor.create();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

reportWebVitals();
