import Container from '@/components/shared/container/container';
import { useGetTestimonialsQuery } from '@/redux/api';

function HomePage() {
  const { data, isLoading, isError } = useGetTestimonialsQuery();

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
