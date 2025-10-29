import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, useAtom, createStore } from 'jotai';
import { describe, it, expect, vi } from 'vitest';

// mock Picture to avoid Konva complexity
vi.mock('@/components/Picture', () => ({
  default: () => <div data-testid="mock-picture" />,
}));

import LoadedImageItem from '@/components/LoadedImageItem';
import { selectedIdAtom } from '@/state/imageState';
import { LoadedImage } from '@/type/imageState';

const DummySelectedViewer = () => {
  const [selectedId] = useAtom(selectedIdAtom);
  return <div data-testid="selected">{String(selectedId)}</div>;
};

describe('LoadedImageItem', () => {
  it('renders name and selects on click and shows delete on hover', () => {
    const img = new Image();
    const loadedImage = {
      id: Symbol('id1'),
      originImage: img,
      editedImage: img,
      imageColor: 'default',
      name: 'my-image.png',
      scalebarColor: 'white',
      scalebarBackground: false,
      scalebarBackgroundPadding: 10,
      microscopeType: 'upright',
      objLens: 'x200',
    } as unknown as LoadedImage;

    const store = createStore();
    store.set(selectedIdAtom, undefined as unknown as Symbol | undefined);
    render(
      <Provider store={store}>
        <DummySelectedViewer />
        <LoadedImageItem loadedImage={loadedImage} active={false} />
      </Provider>
    );

    // name visible
    expect(screen.getByText('my-image.png')).toBeInTheDocument();

    // click should set selectedId (rendered by DummySelectedViewer)
    const container = screen.getByText('my-image.png').closest('div') as HTMLElement;
    fireEvent.click(container);
    const selected = screen.getByTestId('selected');
    // should contain 'Symbol' string
    expect(selected.textContent).toContain('Symbol');

    // hover to show delete button
    fireEvent.mouseOver(container);
    // delete button contains DeleteIcon; it is a button element
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
