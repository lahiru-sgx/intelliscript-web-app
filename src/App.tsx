import './App.css'
// src/App.tsx
import React, {PropsWithChildren} from 'react';
import Chat from './components/Chat';
import {AuthProvider, useAuth} from 'oidc-react';
import {AuthProviderProps} from "oidc-react/build/src/AuthContextInterface";

const oidcConfig: AuthProviderProps = {
  onSignIn: (user) => {
    if (user) {
      const accessToken = user.access_token;
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

const PrivateRoute = (props: PropsWithChildren) => {
  const { isLoading, userData, signIn } = useAuth();
  console.log(isLoading, userData, signIn)

  return props.children
}


const App: React.FC = () => {
  return (
    <AuthProvider {...oidcConfig}>
      <div className="App">
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      </div>
    </AuthProvider>
  );
};

export default App;

