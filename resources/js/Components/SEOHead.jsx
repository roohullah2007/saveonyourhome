import { Head } from '@inertiajs/react';

const SITE_NAME = 'SaveOnYourHome';
const DEFAULT_DESCRIPTION = 'Sell your home for free with SaveOnYourHome. No commissions, no hidden fees. List your FSBO property, connect with buyers, and save thousands.';
const DEFAULT_IMAGE = '/images/saveonyourhome-logo.png';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  keywords,
  children,
  noindex = false,
  jsonLd,
}) {
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImage = image?.startsWith('http') ? image : (typeof window !== 'undefined' ? `${window.location.origin}${image}` : image);

  return (
    <Head>
      <title>{title ? `${title} - ${SITE_NAME}` : SITE_NAME}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title ? `${title} - ${SITE_NAME}` : SITE_NAME} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:title" content={title ? `${title} - ${SITE_NAME}` : SITE_NAME} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {children}
    </Head>
  );
}
