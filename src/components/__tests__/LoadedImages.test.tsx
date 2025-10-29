import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { describe, it, expect, vi } from 'vitest';

// mock LoadedImageItem (and thus avoid importing Konva/react-konva)
vi.mock('@/components/LoadedImageItem', () => ({
  default: (props: any) => <div data-testid="item">{props.loadedImage?.name}</div>,
}));

import LoadedImages from '@/components/LoadedImages';
import { imageAtom } from '@/state/imageState';
import { LoadedImage } from '@/type/imageState';

describe('LoadedImages', () => {
  it('disables "すべて保存" when no images and enables when images exist', () => {
    const storeEmpty = createStore();
    storeEmpty.set(imageAtom, [] as LoadedImage[]);
    const { rerender } = render(
      <Provider store={storeEmpty}>
        <LoadedImages />
      </Provider>
    );

    const saveAllBtn = screen.getByText('すべて保存');
    expect(saveAllBtn).toBeDisabled();

    const storeWith = createStore();
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
    storeWith.set(imageAtom, [loadedImage]);

    rerender(
      <Provider store={storeWith}>
        <LoadedImages />
      </Provider>
    );

    expect(screen.getByText('すべて保存')).not.toBeDisabled();
  });
});
