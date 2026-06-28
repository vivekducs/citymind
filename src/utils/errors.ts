export function getFriendlyErrorMessage(err: any): string {
  if (!err) return "An unknown error occurred. Please try again.";

  // Handle string errors
  if (typeof err === 'string') {
    if (err.includes('Failed to fetch') || err.includes('NetworkError') || err.includes('Network request failed')) {
      return "Network connection issue detected. Please check your internet connectivity and try again.";
    }
    return err;
  }

  const message = err.message || "";
  const code = err.code || "";

  // Firebase Authentication & Authorization errors
  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) {
    return "Invalid email address or password. Please verify your credentials and try again.";
  }
  if (code.includes('auth/email-already-in-use')) {
    return "This email address is already registered. Please sign in instead.";
  }
  if (code.includes('auth/weak-password')) {
    return "Your password is too weak. Please use a minimum of 6 characters containing letters and numbers.";
  }
  if (code.includes('auth/invalid-email')) {
    return "Please enter a valid email address.";
  }
  if (code.includes('auth/too-many-requests')) {
    return "This account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.";
  }
  if (code.includes('auth/network-request-failed') || message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('Network request failed')) {
    return "Network connection issue detected. Please check your internet connectivity and try again.";
  }
  if (code.includes('permission-denied') || message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
    return "Access Denied: You do not have sufficient permissions to perform this action.";
  }
  if (code.includes('quota-exceeded')) {
    return "The server is currently experiencing high traffic and has hit resource limits. Please retry in a few minutes.";
  }

  // Format and strip any Firebase code wrappers for other errors
  if (message.includes('FirebaseError:') || message.includes('gRPC') || message.includes('Error:')) {
    return message
      .replace(/FirebaseError:\s*/gi, '')
      .replace(/Error:\s*/gi, '')
      .replace(/\[.*?\]/g, '') // remove brackets like [code=permission-denied]
      .trim();
  }

  return message || "An unexpected error occurred. Please try again.";
}

import { toast } from 'react-hot-toast';

/**
 * Centrally processes any error, logs it appropriately, and alerts the user with a clean, high-level toast.
 */
export function handleError(err: any, context?: string): string {
  console.error(`[Error Service] Caught in context: ${context || 'Unknown'}`, err);
  const friendlyMessage = getFriendlyErrorMessage(err);
  
  // Show clean, user-friendly toast. Prevent spam by using a unique toast ID based on message content.
  const toastId = `err-${friendlyMessage.slice(0, 30).replace(/\s+/g, '-')}`;
  toast.error(friendlyMessage, { id: toastId });
  
  return friendlyMessage;
}

/**
 * Registers global listeners for unhandled errors and promise rejections
 * to automatically present clean user-facing toasts.
 */
export function registerGlobalErrorHandlers() {
  if (typeof window === 'undefined') return () => {};

  const handleGlobalError = (event: ErrorEvent) => {
    const errorObj = event.error || event.message;
    
    // Ignore benign Vite HMR / websocket errors
    if (typeof errorObj === 'string' && (errorObj.includes('vite') || errorObj.includes('websocket'))) {
      return;
    }
    if (errorObj?.message && (errorObj.message.includes('vite') || errorObj.message.includes('websocket'))) {
      return;
    }

    event.preventDefault();
    handleError(errorObj, 'Global Uncaught Exception');
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    // Ignore benign websocket or hot-reload connection errors
    const reason = event.reason;
    if (reason && (reason.message?.includes('vite') || reason.message?.includes('websocket'))) {
      return;
    }

    event.preventDefault();
    handleError(event.reason, 'Unhandled Promise Rejection');
  };

  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  return () => {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
}
