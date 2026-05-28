import { useState } from 'react';
import { AppProvider } from './context';
import HomePage from './pages/HomePage';
import FolderPage from './pages/FolderPage';

type View =
  | { page: 'home' }
  | { page: 'folder'; folderId: string };

export default function App() {
  const [view, setView] = useState<View>({ page: 'home' });

  return (
    <AppProvider>
      {view.page === 'home' && (
        <HomePage onSelectFolder={id => setView({ page: 'folder', folderId: id })} />
      )}
      {view.page === 'folder' && (
        <FolderPage
          folderId={view.folderId}
          onBack={() => setView({ page: 'home' })}
        />
      )}
    </AppProvider>
  );
}
