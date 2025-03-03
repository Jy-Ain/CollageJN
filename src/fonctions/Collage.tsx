import { useRef, useEffect, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ImageFile {
  url: string;
  name: string;
}

interface CollageProps {
  images: ImageFile[];
}

interface CollageProps {
  images: ImageFile[];
  mode: 4 | 9;
}

const Collage: React.FC<CollageProps> = ({ images }) => {
  const canvasesRef = useRef<HTMLCanvasElement[]>([]);
  const [mode, setMode] = useState<4 | 9>(9);

  useEffect(() => {
    if (images.length === 0) return;

    // Taille A4 en pixels (300 DPI)
    const A4_WIDTH = 2480;
    const A4_HEIGHT = 3508;
    const PADDING = (0.5 / 2.54) * 300; // 0.5 cm ≈ 59 pixels
    const MARGIN = PADDING;
    const BORDER_WIDTH = 3;

    let IMAGE_WIDTH, IMAGE_HEIGHT, IMAGES_PER_PAGE;

    if (mode === 4) {
      IMAGE_WIDTH = (A4_WIDTH - PADDING * 3) / 2;
      IMAGE_HEIGHT = (A4_HEIGHT - PADDING * 3) / 2;
      IMAGES_PER_PAGE = 4;
    } else {
      IMAGE_WIDTH = (6.5 / 2.54) * 300; // 6.5 cm en pixels
      IMAGE_HEIGHT = (9.5 / 2.54) * 300; // 9.5 cm en pixels
      IMAGES_PER_PAGE = 9;
    }

    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);

    const drawCollage = async () => {
      for (let page = 0; page < totalPages; page++) {
        const canvas = canvasesRef.current[page];
        if (!canvas) continue;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        canvas.width = A4_WIDTH;
        canvas.height = A4_HEIGHT;

        // Fond blanc
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

        // Contour noir
        ctx.strokeStyle = 'black';
        ctx.lineWidth = BORDER_WIDTH;
        ctx.strokeRect(0, 0, A4_WIDTH, A4_HEIGHT);

        for (let i = 0; i < IMAGES_PER_PAGE; i++) {
          const imgIndex = page * IMAGES_PER_PAGE + i;
          if (imgIndex >= images.length) break;

          const img = new Image();
          img.src = images[imgIndex].url;
          await new Promise((resolve) => (img.onload = resolve));

          let col, row;
          if (mode === 4) {
            col = i % 2;
            row = Math.floor(i / 2);
          } else {
            col = i % 3;
            row = Math.floor(i / 3);
          }

          const x = PADDING + col * (IMAGE_WIDTH + MARGIN);
          const y = PADDING + row * (IMAGE_HEIGHT + MARGIN);

          ctx.drawImage(img, x, y, IMAGE_WIDTH, IMAGE_HEIGHT);
        }
      }
    };

    drawCollage();
  }, [images, mode]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const totalPages = Math.ceil(images.length / (mode === 4 ? 4 : 9));

    for (let page = 0; page < totalPages; page++) {
      const canvas = canvasesRef.current[page];
      if (!canvas) continue;

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const base64Data = imgData.split(',')[1];
      zip.file(`collage_page_${page + 1}.jpg`, base64Data, { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'collages.zip');
    });
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Collage A4</h2>
      <div className="mb-4">
        <label className="mr-4">
          <input type="radio" name="mode" value="4" checked={mode === 4} onChange={() => setMode(4)} />
          Mode 4 images
        </label>
        <label>
          <input type="radio" name="mode" value="9" checked={mode === 9} onChange={() => setMode(9)} />
          Mode 9 images
        </label>
      </div>
      {Array.from({ length: Math.ceil(images.length / (mode === 4 ? 4 : 9)) }).map((_, index) => (
        <div key={index} className="mb-6">
          <canvas
            ref={(el) => {
              if (el) canvasesRef.current[index] = el;
            }}
            className="border shadow-md"
          />
        </div>
      ))}
      <button
        onClick={handleDownloadAll}
        disabled={images.length === 0}
        className={`mt-4 px-4 py-2 rounded ${
          images.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'
        }`}
      >
        Télécharger tous les collages
      </button>
    </div>
  );
};

export default Collage;
