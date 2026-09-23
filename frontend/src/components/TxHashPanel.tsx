/**
 * Panel that surfaces the on-chain transaction hash after a circuit call
 * (submit_encrypted_report or register_recipient), with an explicit label,
 * a copy button, and a note that steers users to the tx hash and away from
 * the report hash, which is the mistake real users make when asked for
 * on-chain evidence.
 */
import { useCallback, useState } from 'react';

type Props = {
  txHash: string;
  /** Extra sentence shown under the hash. Use to distinguish flows. */
  hint?: string;
};

export function TxHashPanel({ txHash, hint }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked (permissions, insecure context). The hash is
      // still visible on screen for manual copy, so no fallback needed here.
    }
  }, [txHash]);

  return (
    <div className="surface-dark flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow eyebrow-dark">
          transaction hash (paste this in the feedback form)
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-solid focus-ring px-4 py-1.5 text-sm"
        >
          {copied ? 'Copied' : 'Copy tx hash'}
        </button>
      </div>
      <p className="mono text-sm leading-relaxed break-all text-white">{txHash}</p>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--muted-dark)' }}
      >
        {hint ??
          'This is the on-chain evidence that your wallet called our contract. It is different from the report hash: the report hash commits to your message content, the tx hash identifies your submission on the Preprod ledger.'}
      </p>
    </div>
  );
}
