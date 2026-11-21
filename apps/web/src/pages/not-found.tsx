import Button from '@/components/shared/button/button';
import PageHeader from '@/components/shared/page-header/page-header';
import Section from '@/components/shared/section/section';

function NotFoundPage() {
  return (
    <Section isFirst withContainer aria-label="Page not found">
      <title>Not Found | Foodies</title>
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]}
        title="Page not found"
        subtitle="The page you are looking for does not exist or has been moved."
      />
      <div style={{ marginTop: 24 }}>
        <Button to="/">Back to home</Button>
      </div>
    </Section>
  );
}

export default NotFoundPage;
