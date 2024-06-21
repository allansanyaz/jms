import React from 'react';

// React Children Props
export interface IChildrenProps {
    children: React.ReactNode;
}
// Error Props
export interface IErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}