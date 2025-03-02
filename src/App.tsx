import { useState } from "react";
import ImageImporter from "./fonctions/ImageImporter";
import Collage from "./fonctions/Collage";

const App: React.FC = () => {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [startCollage, setStartCollage] = useState<boolean>(false);

  const handleImagesLoaded = (importedImages: { url: string; name: string }[]) => {
    setImages(importedImages);
    setStartCollage(false); // Réinitialiser si on importe de nouvelles images
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Générateur de Collage A4</h1>
      <ImageImporter onImagesLoaded={handleImagesLoaded} />

      {images.length > 0 && !startCollage && (
        <button
          onClick={() => setStartCollage(true)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Générer le collage
        </button>
      )}

      {startCollage && <Collage images={images} />}
    </div>
  );
};

export default App;
