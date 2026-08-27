import AppRouter from './router/AppRouter'
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay'
import { useLoading } from './context/LoadingContext'

export default function App() {
  const { isLoading } = useLoading();

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <AppRouter />
    </>
  );
}