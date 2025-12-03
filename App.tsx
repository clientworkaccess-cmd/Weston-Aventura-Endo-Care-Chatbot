import React from 'react';
import { ChatWindow } from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#F7FAFD]">
      <ChatWindow />
    </div>
  );
};

export default App;