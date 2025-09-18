import React from 'react';
import { render } from '@react-email/render';
import { Newsletter } from '@/types/newsletter';

export const generatePreview = async (newsletter: Newsletter, TemplateComponent: React.ComponentType<any>) => {
  try {
    return await render(React.createElement(TemplateComponent, { newsletter }));
  } catch (error) {
    console.error('Error rendering email preview:', error);
    return '<div>Error rendering preview</div>';
  }
};

export const getFontSizeClass = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm': return '14px';
    case 'md': return '16px';
    case 'lg': return '18px';
    default: return '16px';
  }
};

export const getAlignmentStyle = (alignment: 'left' | 'center' | 'right') => {
  return { textAlign: alignment };
};