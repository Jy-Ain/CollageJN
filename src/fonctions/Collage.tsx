import { useRef, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ImageFile {
  url: string;
  name: string;
}

interface CollageProps {
  images: ImageFile[];
}

const Collage: React.FC<CollageProps> = ({ images }) => {
  const canvasesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    if (images.length === 0) return;

    // Taille A4 en pixels (300 DPI)
    const A4_WIDTH = 2480;
    const A4_HEIGHT = 3508;
    const PADDING = (0.5 / 2.54) * 300; // 0.5 cm ≈ 59 pixels
    const MARGIN = PADDING; // Marge entre images
    const BORDER_WIDTH = 3; // Contour noir

    // 2x2 images par page
    const IMAGE_WIDTH = (A4_WIDTH - PADDING * 3) / 2;
    const IMAGE_HEIGHT = (A4_HEIGHT - PADDING * 3) / 2;

    const totalPages = Math.ceil(images.length / 4);

    const drawCollage = async () => {
      for (let page = 0; page < totalPages; page++) {
        const canvas = canvasesRef.current[page];
        if (!canvas) continue;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        canvas.width = A4_WIDTH;
        canvas.height = A4_HEIGHT;

        // Fond blanc
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

        // Contour noir
        ctx.strokeStyle = "black";
        ctx.lineWidth = BORDER_WIDTH;
        ctx.strokeRect(0, 0, A4_WIDTH, A4_HEIGHT);

        // Dessiner les images sur la page actuelle
        for (let i = 0; i < 4; i++) {
          const imgIndex = page * 4 + i;
          if (imgIndex >= images.length) break;

          const img = new Image();
          img.src = images[imgIndex].url;
          await new Promise((resolve) => (img.onload = resolve));

          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = PADDING + col * (IMAGE_WIDTH + MARGIN);
          const y = PADDING + row * (IMAGE_HEIGHT + MARGIN);

          ctx.drawImage(img, x, y, IMAGE_WIDTH, IMAGE_HEIGHT);
        }
      }
    };

    drawCollage();
  }, [images]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const totalPages = Math.ceil(images.length / 4);

    for (let page = 0; page < totalPages; page++) {
      const canvas = canvasesRef.current[page];
      if (!canvas) continue;

      const imgData = canvas.toDataURL("image/jpeg"); // Convertir en JPEG
      const base64Data = imgData.split(",")[1]; // Extraire la partie base64

      zip.file(`collage_page_${page + 1}.jpg`, base64Data, { base64: true }); // Ajouter à ZIP
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "collages.zip"); // Télécharger le fichier ZIP
    });
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Collage A4</h2>
      {Array.from({ length: Math.ceil(images.length / 4) }).map((_, index) => (
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
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Télécharger tous les collages
      </button>
    </div>
  );
};

export default Collage;
