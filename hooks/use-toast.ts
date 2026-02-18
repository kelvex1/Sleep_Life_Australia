'use client';

import * as React from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactElement;
}

interface ToastInput {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactElement;
}

interface ToastState {
  toasts: ToastProps[];
}

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(state: ToastState) {
  memoryState = state;
  listeners.forEach((listener) => listener(state));
}

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function toast(input: ToastInput) {
  const id = generateId();
  const newToast: ToastProps = { id, ...input };
  dispatch({ toasts: [newToast, ...memoryState.toasts].slice(0, 5) });

  setTimeout(() => {
    dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) });
  }, 5000);

  return { id };
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toasts: state.toasts, toast };
}

export { toast, useToast };
export type { ToastProps, ToastInput };
