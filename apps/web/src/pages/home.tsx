import { useTestimonialsQuery } from '@/api/testimonials/testimonials.queries';
import Container from '@/components/shared/container/container';

function HomePage() {
  const { data, isLoading, isError } = useTestimonialsQuery();

  return (
    <>
      <Container>
        <h1>Home</h1>

        {isLoading && <p>Завантаження...</p>}
        {isError && <p>Не вдалося завантажити відгуки.</p>}

        {!!data?.items.length && (
          <ul>
            {data.items.map(({ id, testimonial }) => (
              <li key={id}>{testimonial}</li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}

export default HomePage;
