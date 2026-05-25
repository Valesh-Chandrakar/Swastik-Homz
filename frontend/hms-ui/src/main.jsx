import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store/store'
import './index.css'

// NOTE: React.StrictMode is intentionally omitted in development to prevent every
// useEffect from firing twice. StrictMode is a useful sanity check in production-like
// builds but in dev it doubles every API call, doubles every toast, and forces us
// to add deduplication everywhere. Re-enable for a strict-mode audit any time.
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc' },
        duration: 3000
      }} />
    </BrowserRouter>
  </Provider>
)
