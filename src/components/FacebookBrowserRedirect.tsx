'use client'

import { useEffect } from 'react'

export default function FacebookBrowserRedirect() {
    useEffect(() => {
        // Check if user is in Facebook's in-app browser
        const isFacebookBrowser = /FB_IAB|FBAN|FBAV/.test(navigator.userAgent);

        if (isFacebookBrowser) {
            const currentURL = window.location.href;

            // For iOS
            if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                window.location.href = `x-web-search://?${currentURL}`;
                // Fallback to Safari if x-web-search doesn't work
                setTimeout(() => {
                    window.location.href = currentURL;
                }, 500);
            }
            // For Android
            else {
                window.location.href = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
            }
        }
    }, []);

    return null;
} 