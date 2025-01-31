// // eslint-disable-next-line no-unused-vars
// import React from 'react';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import RegistrationForm from './components/RegistrationForm';
// import OrganizationSetup from './components/OrganizationSetup';
// import ChatbotIntegration from './components/ChatbotIntegration';

// const App = () => {
//   return (
//     <GoogleOAuthProvider clientId="arcane-trilogy-449216-b8">
//       <Router>
//         <Routes>
//           <Route path="/register" element={<RegistrationForm />} />
//           <Route path="/organization-setup" element={<OrganizationSetup />} />
//           <Route path="/" element={<Navigate to="/register" replace />} />
//           <Route path="/chatbot-integration" element={<ChatbotIntegration/>}/>
//         </Routes>
//       </Router>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import OrganizationSetup from './components/OrganizationSetup';
import ChatbotIntegration from './components/ChatbotIntegration';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="arcane-trilogy-449216-b8">
      <Router>
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/organization-setup" element={<OrganizationSetup />} />
          <Route path="/chatbot-integration" element={<ChatbotIntegration/>}/>
          <Route path="/" element={<Navigate to="/register" replace />} />
          {/* Add this line to catch all other routes */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;