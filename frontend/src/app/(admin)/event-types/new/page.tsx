"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createEventType } from '@/lib/api';
import type { EventTypePayload } from '@/types/event-types';

export default function NewEventTypePage() {
  const router = useRouter();
  const [form, setForm] = useState<EventTypePayload>({
    title: '',
    slug: '',
    duration: 30,
    description: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm({ ...form, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEventType(form);
      router.push('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError((err.response?.data as { error?: string } | undefined)?.error || 'Failed to create event type');
      } else {
        setError('Failed to create event type');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded shadow-sm border mt-8">
      <h1 className="text-2xl font-bold">Add New Event Type</h1>
      {error && <div className="text-red-600 bg-red-50 p-3 rounded text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
          <input
            required
            type="text"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. 15 Minute Chat"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
           <div className="flex bg-gray-50 border rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
             <span className="p-2 text-gray-500 border-r text-sm">localhost:3000/om/</span>
             <input
               required
               type="text"
               className="w-full p-2 outline-none bg-white text-sm"
               value={form.slug}
               onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
               placeholder="15-min-chat"
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
            <option value={90}>90 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what this meeting is for..."
          />
        </div>

        <div className="flex items-center gap-3 py-2">
          <input 
            type="checkbox" 
            id="isActive"
            checked={form.isActive} 
            onChange={e => setForm({...form, isActive: e.target.checked})} 
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Event is active and bookable
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-full">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-full disabled:opacity-50">
            {submitting ? 'Creating...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
