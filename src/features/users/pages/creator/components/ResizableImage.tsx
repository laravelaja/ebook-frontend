import { useState, useRef, useCallback } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { IconGripVertical, IconCrop, IconCheck, IconX } from '@tabler/icons-react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export const ResizableImage = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const startX = useRef(0);
  const startWidth = useRef(0);

  const width = node.attrs.width || 'auto';
  const align = node.attrs.align || 'center';

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = imgRef.current?.offsetWidth || 300;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + diff);
      updateAttributes({ width: `${newWidth}px` });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes]);

  const setAlignment = (newAlign: string) => {
    updateAttributes({ align: newAlign });
  };

  const startCrop = () => {
    setIsCropping(true);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const applyCrop = () => {
    if (!completedCrop || !cropImgRef.current) {
      setIsCropping(false);
      return;
    }

    const image = cropImgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
    updateAttributes({ src: croppedBase64, width: 'auto' });
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const justifyClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

  // Crop mode
  if (isCropping) {
    return (
      <NodeViewWrapper className="flex justify-center my-2 relative">
        <div className="relative inline-block bg-slate-900/5 rounded-lg p-2">
          {/* Crop toolbar */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Mode Crop</span>
            <button
              type="button"
              onClick={applyCrop}
              disabled={!completedCrop || completedCrop.width === 0}
              className="h-6 px-2.5 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold cursor-pointer border-none flex items-center gap-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <IconCheck size={11} />
              <span>Terapkan</span>
            </button>
            <button
              type="button"
              onClick={cancelCrop}
              className="h-6 px-2.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold cursor-pointer border-none flex items-center gap-1 transition-colors"
            >
              <IconX size={11} />
              <span>Batal</span>
            </button>
          </div>

          {/* Crop area */}
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              ref={cropImgRef}
              src={node.attrs.src}
              className="max-w-full max-h-[400px] rounded-md"
              alt="Crop"
              draggable={false}
            />
          </ReactCrop>

          <p className="text-[9px] text-slate-400 text-center mt-2 m-0">
            Seret untuk memilih area yang ingin dipertahankan
          </p>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={`flex ${justifyClass} my-2 relative`}>
      <div className={`relative inline-block group ${selected ? 'ring-2 ring-sky-400 rounded-lg' : ''}`}>
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{ width: width === 'auto' ? undefined : width }}
          className="rounded-lg max-w-full h-auto block"
          draggable={false}
        />

        {/* Toolbar - show on select */}
        {selected && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg px-1 py-0.5 z-50">
            {/* Alignment */}
            <button type="button" onClick={() => setAlignment('left')} className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none text-[10px] font-bold transition-colors ${align === 'left' ? 'bg-sky-100 text-sky-700' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`} title="Kiri">◧</button>
            <button type="button" onClick={() => setAlignment('center')} className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none text-[10px] font-bold transition-colors ${align === 'center' ? 'bg-sky-100 text-sky-700' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`} title="Tengah">◫</button>
            <button type="button" onClick={() => setAlignment('right')} className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none text-[10px] font-bold transition-colors ${align === 'right' ? 'bg-sky-100 text-sky-700' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`} title="Kanan">◨</button>

            <div className="w-px h-4 bg-slate-200 mx-0.5" />

            {/* Size presets */}
            <button type="button" onClick={() => updateAttributes({ width: '100%' })} className="px-1.5 h-6 rounded flex items-center justify-center cursor-pointer border-none text-[9px] font-bold bg-transparent text-slate-500 hover:bg-slate-100 transition-colors">100%</button>
            <button type="button" onClick={() => updateAttributes({ width: '50%' })} className="px-1.5 h-6 rounded flex items-center justify-center cursor-pointer border-none text-[9px] font-bold bg-transparent text-slate-500 hover:bg-slate-100 transition-colors">50%</button>
            <button type="button" onClick={() => updateAttributes({ width: 'auto' })} className="px-1.5 h-6 rounded flex items-center justify-center cursor-pointer border-none text-[9px] font-bold bg-transparent text-slate-500 hover:bg-slate-100 transition-colors">Auto</button>

            <div className="w-px h-4 bg-slate-200 mx-0.5" />

            {/* Crop button */}
            <button
              type="button"
              onClick={startCrop}
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none bg-transparent text-slate-500 hover:bg-slate-100 transition-colors"
              title="Crop Gambar"
            >
              <IconCrop size={13} />
            </button>
          </div>
        )}

        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-10 rounded-md bg-white border border-slate-300 shadow-sm flex items-center justify-center cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity ${
            isResizing ? 'opacity-100 bg-sky-50 border-sky-300' : ''
          }`}
        >
          <IconGripVertical size={10} className="text-slate-400" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
