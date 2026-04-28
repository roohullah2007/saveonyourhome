import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import MainLayout from './Layouts/MainLayout';

const appName = import.meta.env.VITE_APP_NAME || 'SaveOnYourHome';

// Reset scroll on every Inertia page change (unless the visit opted into
// preserveScroll). `html { scroll-behavior: smooth }` makes Inertia's
// default reset animate, and the animation gets cancelled when the DOM
// swaps — leaving the user at the prior scroll position. Force an
// instant reset across window + any wrapper that may be a scroll context
// (html/body/#app all set overflow-x:hidden, which can promote
// overflow-y to auto and create a scroll container).
router.on('navigate', (event) => {
  if (event.detail?.visit?.preserveScroll) return;
  const prev = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const appEl = document.getElementById('app');
  if (appEl) appEl.scrollTop = 0;
  document.documentElement.style.scrollBehavior = prev;
});

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
