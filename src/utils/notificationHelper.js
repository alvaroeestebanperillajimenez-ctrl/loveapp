// Notification Helper for PWA Push Notifications

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const isNotificationSupported = () => {
    return 'Notification' in window;
};

export const getNotificationPermission = () => {
    if (!isNotificationSupported()) return 'unsupported';
    return Notification.permission;
};

export const sendNotification = async (title, options = {}) => {
    // Check if we have permission
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
        console.log('Notification permission not granted');
        return;
    }

    // Check if page is visible (don't notify if user is already looking)
    if (document.visibilityState === 'visible') {
        console.log('Page is visible, skipping notification');
        return;
    }

    // Default options
    const defaultOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'love-app-notification',
        requireInteraction: false,
        ...options
    };

    try {
        // Check if service worker is available
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            // Send through service worker for better reliability
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, defaultOptions);
        } else {
            // Fallback to regular notification
            new Notification(title, defaultOptions);
        }
    } catch (error) {
        console.error('Error showing notification:', error);
    }
};

export const sendActivityNotification = async (action, details) => {
    const title = `Nueva actividad ❤️`;
    const body = `${action}: ${details}`;

    await sendNotification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
            url: '/',
            action,
            details
        }
    });
};
