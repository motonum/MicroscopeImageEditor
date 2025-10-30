import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import { describe, expect, it } from 'vitest';

describe('Header コンポーネント', () => {
  it('タイトルテキストが表示されること', () => {
    render(<Header />);
    expect(screen.getByText('顕微鏡画像編集屋さん')).toBeInTheDocument();
  });
});
