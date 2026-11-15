/** Compact form on the home page: hands the details to /calculator/ via sessionStorage. */
import { setPending } from '../lib/session';
import ReadingForm from './reading/ReadingForm';
import './reading/reading.css';

export default function QuickReading() {
  return (
    <ReadingForm
      compact
      idPrefix="quick"
      submitLabel="Reveal my numbers"
      onSubmit={(input) => {
        setPending(input);
        window.location.href = '/calculator/#reading';
      }}
    />
  );
}
