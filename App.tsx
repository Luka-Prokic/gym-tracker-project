import React from 'react';
import Layout from './app/_layout';

// Suppress findDOMNode warning from third-party libraries
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && args[0].includes && args[0].includes('findDOMNode is deprecated')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export default function App() {
    return <Layout />;
}