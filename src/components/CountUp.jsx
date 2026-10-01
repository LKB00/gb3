import { useCountUp } from '../lib/useCountUp';

// <CountUp value={score} />  rolls from 0 up to the number.
export default function CountUp({ value, ms }) {
  return <>{useCountUp(value, { fromZero: true, ms })}</>;
}
