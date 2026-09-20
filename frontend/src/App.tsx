import { Suspense, lazy, useCallback, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';

import { Logo } from './components/landing/Logo';
import { WalletConnect, type WalletConnection } from './components/WalletConnect';
import { Landing } from './pages/Landing';

// Kept in sync with sdk/src/chain.ts, README.md Contract Address table, and
// PROGRESS.md. Inlined here so that a visitor to the landing page (/) does
// not pay the transitive cost of importing the SDK barrel, which pulls
// chain.ts and the ~11MB Midnight WASM stack via its module graph. The
// route chunks below still import the SDK; only the app shell does not.
const NETWORK_ID = 'preprod';
const CONTRACT_ADDRESS =
  '0b24b5da3eaf66860c1b69a6d31f3e86089b5c4af48c2dc4be6f6c5b7f4b34f5';

// Lazy so the Midnight WASM stack (~11MB, pulled transitively via the SDK)
// only downloads when a user actually navigates to a page that needs it.
// Landing (/) stays in the initial chunk because it is the first thing every
// visitor sees; splitting it out would trade one landing-page fetch for two.
const Report = lazy(() =>
  import('./pages/Report').then((m) => ({ default: m.Report })),
);
const Inbox = lazy(() =>
  import('./pages/Inbox').then((m) => ({ default: m.Inbox })),
);
const DeployContract = lazy(() =>
  import('./pages/DeployContract').then((m) => ({ default: m.DeployContract })),
);

const EXPLORER_CONTRACT_URL = `https://${NETWORK_ID}.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`;

/**
 * Placeholder shown while a lazy route chunk (and the Midnight WASM it pulls)
 * is downloading. Matches the app's monochrome idiom so it does not flash a
 * spinner against the black background.
 */
function RouteFallback() {
  return (
    <section className="surface-dark-empty p-10">
      <p className="text-base text-white/55">Loading...</p>
    </section>
  );
}

/**
 * Shared chrome around every route. Wallet connection state lives here so
 * navigating between /report and /inbox does not drop the Lace session.
 */
function Shell() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const handleDisconnect = useCallback(() => setConnection(null), []);
  const { pathname } = useLocation();

  return (
    <div className="min-h-full bg-black">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-6 py-12">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Link
              to="/"
              className="focus-ring inline-flex items-center gap-3 rounded-full"
            >
              <Logo className="size-9 shrink-0 text-white" />
              <h1 className="display text-4xl font-semibold text-white lowercase sm:text-5xl">
                anonymous whispers
              </h1>
            </Link>
            <p
              className="mt-4 text-base leading-relaxed lowercase"
              style={{ color: 'var(--muted-dark)' }}
            >
              report something. prove you did. reveal nothing.
            </p>
          </div>
          {pathname !== '/' && (
            <WalletConnect
              connection={connection}
              onConnect={setConnection}
              onDisconnect={handleDisconnect}
            />
          )}
        </header>

        <main className="mt-14 flex flex-col gap-8">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/report" element={<Report connection={connection} />} />
              <Route path="/inbox" element={<Inbox connection={connection} />} />
              <Route path="/deploy" element={<DeployContract connection={connection} />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="mt-auto pt-16">
          <dl className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <dt className="eyebrow eyebrow-dark">network</dt>
              <dd className="mono text-sm text-white">{NETWORK_ID}</dd>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <dt className="eyebrow eyebrow-dark">contract</dt>
              <dd className="min-w-0">
                <a
                  href={EXPLORER_CONTRACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mono block max-w-72 truncate text-sm text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white sm:max-w-96"
                  title={`${CONTRACT_ADDRESS} (view on Midnight Explorer)`}
                >
                  {CONTRACT_ADDRESS}
                </a>
              </dd>
            </div>
          </dl>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/*
        The landing page is full-bleed and renders outside the Shell: its hero
        is a 100vh section and its scroll scenes need the whole viewport, which
        the Shell's centred max-w-3xl column and wallet header cannot give it.
        Every other route still goes through the Shell exactly as before, so
        /report and /inbox keep their persistent wallet connection.
      */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Shell />} />
      </Routes>
    </BrowserRouter>
  );
}
