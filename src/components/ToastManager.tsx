import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { IOSToast } from './IOSToast';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

let toastId = 0;
let showToastCallback: ((message: string, type: Toast['type'], duration?: number) => void) | null = null;

export const showToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
  if (showToastCallback) {
    showToastCallback(message, type, duration);
  }
};

export const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast['type'], duration = 3000) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  React.useEffect(() => {
    showToastCallback = show;
    return () => {
      showToastCallback = null;
    };
  }, [show]);

  return (
    <View style={styles.container} pointerEvents="none">
      {toasts.map((toast) => (
        <IOSToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
