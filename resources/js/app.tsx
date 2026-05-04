import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useStore } from '@/store/useStore';

// Listen for Inertia flash messages globally
router.on('finish', (event) => {
    const flash = event.detail.page.props.flash as any;
    if (flash) {
        if (flash.success || flash.message) {
            useStore.getState().addNotification(flash.success || flash.message, 'success');
        }
        if (flash.error) {
            useStore.getState().addNotification(flash.error, 'error');
        }
    }
});

const updateThemeClass = (theme: string) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

// Initial load
updateThemeClass(useStore.getState().theme);

// Listen for state changes
useStore.subscribe((state) => {
    updateThemeClass(state.theme);
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import GlobalNotification from '@/Components/GlobalNotification';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Sync Auth User dari Laravel ke Zustand Store
        const authUser = (props.initialPage.props.auth as any)?.user;
        if (authUser) {
            useStore.getState().login(authUser);
        }

        root.render(
            <>
                <App {...props} />
                <GlobalNotification />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
