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
  const pathOnly = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : '';
  const pageUrl = url || pathOnly;
  const fullImage = image?.startsWith('http')
    ? image
    : (typeof window !== 'undefined' ? `${window.location.origin}${image}` : image);

  const pageTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta head-key="description" name="description" content={description} />
      {keywords && <meta head-key="keywords" name="keywords" content={keywords} />}
      {noindex && <meta head-key="robots" name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta head-key="og:title" property="og:title" content={pageTitle} />
      <meta head-key="og:description" property="og:description" content={description} />
      <meta head-key="og:image" property="og:image" content={fullImage} />
      {pageUrl && <meta head-key="og:url" property="og:url" content={pageUrl} />}
      <meta head-key="og:type" property="og:type" content={type} />

      {/* Twitter */}
      <meta head-key="twitter:title" name="twitter:title" content={pageTitle} />
      <meta head-key="twitter:description" name="twitter:description" content={description} />
      <meta head-key="twitter:image" name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {children}
    </Head>
  );
}
