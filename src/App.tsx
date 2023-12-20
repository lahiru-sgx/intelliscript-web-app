// src/App.tsx
import React from 'react';
import ChatMain from './components/ChatMain';
import { AuthProvider, useAuth, AuthProviderProps } from 'oidc-react';

// Define the User type
type User = {
  access_token: string;
  // Add other properties if needed
};

const oidcConfig: AuthProviderProps = {
  onSignIn: (userData: User | null) => {
    if (userData) {
      const accessToken = userData.access_token;
      alert(accessToken);
      // Use the access token as needed
    }
  },
  authority: 'https://idp.syntaxgenie.com/realms/intelliscript',
  clientId: 'is-chat-app-dev',
  redirectUri: 'http://localhost:5170',
  responseType: 'code',
  scope: 'openid profile email',
};

// Adjust the type to include the 'children' prop
const PrivateRoute: React.FC<{ children?: React.ReactNode }> = (props) => {
  const { isLoading, userData, signIn } = useAuth();
  console.log(isLoading, userData, signIn);

  return <>{props.children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider {...oidcConfig}>
      <div className="App">
        <PrivateRoute>
          <ChatMain />
        </PrivateRoute>
      </div>
    </AuthProvider>
  );
};

export default App;





