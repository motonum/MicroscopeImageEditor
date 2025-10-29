import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import { describe, expect, it } from 'vitest';

describe('Header component', () => {
  it('renders title text', () => {
    render(<Header />);
    expect(screen.getByText('顕微鏡画像編集屋さん')).toBeInTheDocument();
  });
});
