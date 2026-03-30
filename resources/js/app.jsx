import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import MainLayout from './Layouts/MainLayout';

const appName = import.meta.env.VITE_APP_NAME || 'SaveOnYourHome';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );

        // Pages that manage their own layout (no MainLayout wrapper)
        const noLayoutPages = ['Properties'];

        if (!page.default.layout && !noLayoutPages.includes(name)) {
            page.default.layout = (page) => <MainLayout>{page}</MainLayout>;
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
