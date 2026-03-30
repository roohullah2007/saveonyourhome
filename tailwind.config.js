import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                manrope: ['Manrope', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
                instrument: ['Instrument Sans', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
        },
    },

    plugins: [forms],
};
