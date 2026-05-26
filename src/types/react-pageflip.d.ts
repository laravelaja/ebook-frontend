declare module 'react-pageflip-enhanced' {
  import * as React from 'react';

  export interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startPage?: number;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    onFlip?: (flipEvent: { data: number }) => void;
    onChangeOrientation?: (orientationEvent: { data: 'portrait' | 'landscape' }) => void;
    onChangeState?: (stateEvent: { data: 'user_fold' | 'fold_corner' | 'flipping' | 'read' }) => void;
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<HTMLFlipBookProps & React.RefAttributes<any>>;
  export default HTMLFlipBook;
}
