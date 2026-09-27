"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { getEventTypes, updateEventType } from '@/lib/api';
import type { EventTypePayload } from '@/types/event-types';

type EventTypeForm = EventTypePayload;

export default function EditEventTypePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [form, setForm] = useState<EventTypeForm>({
    title: '',
    slug: '',
    duration: 30,
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all, find this one (quick MVP approach since no specific GET by ID)
    // Could alternatively just fetch the public endpoint /api/public/om/slug
    // Wait, let's fetch event-types again
    const fetchEvent = async () => {
      try {
        const data = await getEventTypes();
        const eventType = data.find((event) => event.id === Number(id));
        if (eventType) {
          setForm({
            title: eventType.title,
            slug: eventType.slug,
            duration: eventType.duration,
            description: eventType.description ?? '',
            isActive: eventType.isActive ?? true,
          });
        }
        else setError('Not found');
      } catch {
        setError('Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEventType(Number(id), form);
      router.push('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError((err.response?.data as { error?: string } | undefined)?.error || 'Failed to update event type');
      } else {
        setError('Failed to update event type');
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded shadow-sm border mt-8">
      <h1 className="text-2xl font-bold">Edit Event Type</h1>
      {error && <div className="text-red-500">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <input
            required
            type="text"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">URL slug</label>
           <div className="flex bg-gray-50 border rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
             <span className="p-2 text-gray-500 border-r">calclo-clone.com/om/</span>
             <input
               required
               type="text"
               className="w-full p-2 outline-none"
               value={form.slug}
               onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
             />
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <select 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={form.isActive} 
            onChange={e => setForm({...form, isActive: e.target.checked})} 
            id="isActive"
          />
          <label htmlFor="isActive" className="text-sm font-medium">Event is active and bookable</label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-full">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-full">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
