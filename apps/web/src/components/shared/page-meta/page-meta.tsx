export interface PageMetaProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const DEFAULT_DESCRIPTION =
  'Discover a world of delicious recipes and improve your culinary skills with Foodies.';

export function PageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  type = 'website',
}: PageMetaProps) {
  const fullTitle = `${title} | Foodies`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
    </>
  );
}

export default PageMeta;
