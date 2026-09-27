'use client';
import { useSearchParams } from 'next/navigation';
export default function RescheduleSuccessPage() {
  const params = useSearchParams();
  return <main className="min-h-screen bg-clay/5 p-8 text-center"><h1 className="font-display text-3xl font-bold text-ink">Booking rescheduled</h1><p className="mt-3 text-ink/70">Your updated meeting time is confirmed.</p><p className="mt-2 text-sm text-ink/60">{params.get('startTime')}</p></main>;
}
