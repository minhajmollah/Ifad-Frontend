import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from '../../store';

export function withRedux(Component) {
    return ({...props}) => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Component {...props} />
            </PersistGate>
        </Provider>
    );
}