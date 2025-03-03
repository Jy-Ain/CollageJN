import { useState } from 'react';
import ImageImporter from './fonctions/ImageImporter';
import Collage from './fonctions/Collage';

const App: React.FC = () => {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [startCollage, setStartCollage] = useState<boolean>(false);
  const [mode, setMode] = useState<4 | 9>(9);

  const handleImagesLoaded = (importedImages: { url: string; name: string }[]) => {
    setImages(importedImages);
    setStartCollage(false); // Réinitialiser si on importe de nouvelles images
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center border-1">
      <h1 className="text-xl font-bold mb-4">JN FILM COLLAGE</h1>
      <ImageImporter onImagesLoaded={handleImagesLoaded} />

      {images.length > 0 && !startCollage && (
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
      )}

      {images.length > 0 && !startCollage && (
        <button onClick={() => setStartCollage(true)} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Générer le collage
        </button>
      )}

      {startCollage && <Collage images={images} mode={mode} />}
    </div>
  );
};

export default App;
