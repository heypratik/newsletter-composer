'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NewsletterEditor } from '@/components/editor/NewsletterEditor';

export default function EditorPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return <NewsletterEditor onBack={handleBack} />;
}