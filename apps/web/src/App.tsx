import { type LivenessResponse, LivenessResponseSchema } from '@repo/shared';
import { useEffect, useState } from 'react';

import { clientEnv } from './env';

export function App() {
  const [health, setHealth] = useState<LivenessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${clientEnv.VITE_API_URL}/healthz`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const parsed = LivenessResponseSchema.safeParse(data);
        if (parsed.success) {
          setHealth(parsed.data);
        } else {
          setError('Invalid response schema from API');
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('API offline');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 720,
        margin: '3rem auto',
        padding: '0 1rem',
      }}
    >
      <h1>Kung Food Pandas</h1>
      <p>React SPA + Vite + TypeScript monorepo foundation.</p>
      <section style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <h2>API Status ({clientEnv.VITE_API_URL})</h2>
        {health && (
          <p>
            Status: {health.status} (uptime: {health.uptime.toFixed(1)}s)
          </p>
        )}
        {error && <p>Status: {error}</p>}
        {!health && !error && <p>Checking API liveness...</p>}
      </section>
    </main>
  );
}
