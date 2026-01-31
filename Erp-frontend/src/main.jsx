import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// to use notistack for Notifications Msg
import { SnackbarProvider } from 'notistack';
// to use tanstack/react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
// redux configuration
import { Provider } from 'react-redux'
import store from './redux/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime : 30000,
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>                                {/*from redux*/}

      <SnackbarProvider autoHideDuration={3000} >           {/* SnackbarProvider + QueryClientProvider - do before redux din in @tanstack/react-query*/}
        <QueryClientProvider client = {queryClient} >
          <App />
        </QueryClientProvider> {/*wrapper get twise*/}
      </SnackbarProvider>                                   {/* SnackbarProvider + QueryClientProvider - do before redux din in @tanstack/react-query*/}

    </Provider>

  </StrictMode>,
)
