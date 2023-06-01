import React from 'react';
import { AuthProvider } from './AuthProvider';
import Routes from './Routes';
import { store } from '../store/store';

export default function Providers() {
  return (
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  );
}