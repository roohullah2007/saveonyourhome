# Component Structure Guide

This guide explains the structure of the homepage components in the OK BY OWNER Laravel React application.

## Directory Structure

```
resources/js/
├── Components/
│   ├── Header.jsx                          # Main header component
│   └── Sections/
│       └── Homepage/
│           └── HeroSection.jsx             # Homepage hero section
├── Pages/
│   └── Home.jsx                            # Homepage that uses Header and HeroSection
└── ...
```

## Components Overview

### 1. Header Component
**Location**: `resources/js/Components/Header.jsx`

The Header component contains:
- Logo
- Login/Register links
- Favorites (Heart icon)
- "List Your Property" button
- Main navigation menu with links to:
  - Home
  - Properties
  - Buyers
  - Sellers
  - FAQs
  - Testimonials
  - About us
  - Contact us

**Usage:**
```jsx
import Header from '@/Components/Header';

function MyPage() {
  return <Header />;
}
```

### 2. HeroSection Component
**Location**: `resources/js/Components/Sections/Homepage/HeroSection.jsx`

The HeroSection component contains:
- Hero banner with background image
- Main headline: "Sell Your Oklahoma Property And Save Thousands!"
- Call-to-action buttons (Search Listings, List Your Property)
- Bottom red section promoting MLS packages

**Usage:**
```jsx
import HeroSection from '@/Components/Sections/Homepage/HeroSection';

function MyPage() {
  return <HeroSection />;
}
```

### 3. Home Page
**Location**: `resources/js/Pages/Home.jsx`

The Home page combines both components:
```jsx
import Header from '@/Components/Header';
import HeroSection from '@/Components/Sections/Homepage/HeroSection';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      {/* Add more sections here */}
    </>
  );
}
```

## Fonts

The project uses two custom fonts:
- **Poppins**: Main font for most text
- **Roboto**: Used for some header links

These are imported via Google Fonts in `resources/css/app.css` and configured in `tailwind.config.js`.

### Using Fonts in Components:
```jsx
<p className="font-poppins">Text in Poppins font</p>
<p className="font-roboto">Text in Roboto font</p>
```

## Images

Place your images in the `public/images/` directory:

### Required Images:
1. **Logo**: `public/images/logo.png` (189px × 45px)
2. **Hero Background**: `public/images/hero-bg.jpg` (1920px × 800px recommended)

### Referencing Images:
```jsx
<img src="/images/logo.png" alt="Logo" />
```

## Color Scheme

The main brand color is: `#A52A3D` (Burgundy Red)

You can use it in Tailwind classes:
```jsx
<div className="bg-[#A52A3D]">...</div>
<div className="text-[#A52A3D]">...</div>
```

## Routes

The home page is configured in `routes/web.php`:

```php
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');
```

## Navigation with Inertia

All links use Inertia's `Link` component for SPA-like navigation:

```jsx
import { Link } from '@inertiajs/react';

<Link href="/properties">Properties</Link>
```

## Development

### Start Development Server:
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server (hot reload)
npm run dev
```

### Build for Production:
```bash
npm run build
```

## Adding More Sections

To add more homepage sections:

1. Create a new component in `resources/js/Components/Sections/Homepage/`
2. Import and use it in `resources/js/Pages/Home.jsx`:

```jsx
import Header from '@/Components/Header';
import HeroSection from '@/Components/Sections/Homepage/HeroSection';
import FeaturesSection from '@/Components/Sections/Homepage/FeaturesSection';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
```

## Tips

1. **Reusing Header**: The Header component can be reused across different pages
2. **Responsive Design**: Add responsive classes as needed (sm:, md:, lg:, xl:)
3. **Icons**: Use `lucide-react` for icons (already installed)
4. **State Management**: Use React hooks for component state
5. **Props**: Pass data to components as props when needed

## Example: Using Header with Props

If you need to pass user data or auth state to the Header:

```jsx
// In Home.jsx
export default function Home({ auth }) {
  return (
    <>
      <Header user={auth.user} />
      <HeroSection />
    </>
  );
}

// In Header.jsx
const Header = ({ user }) => {
  return (
    // ... use user data in header
  );
};
```
