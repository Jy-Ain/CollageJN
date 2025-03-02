import { useState } from "react";
import Loader from "../Loader/Loader";

interface ImageFile {
  url: string;
  name: string;
}

interface ImageImporterProps {
  onImagesLoaded: (images: ImageFile[]) => void;
}

const ImageImporter: React.FC<ImageImporterProps> = ({ onImagesLoaded }) => {
  const [imageCount, setImageCount] = useState<number>(0);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Etat pour afficher le loader

  const handleSelectFolder = async () => {
    if (!window.showDirectoryPicker) {
      alert("Votre navigateur ne supporte pas l'importation de dossiers.");
      return;
    }

    setLoading(true); // Afficher le loader

    try {
      const dirHandle = await window.showDirectoryPicker();
      const imageFiles: ImageFile[] = [];

      const readFiles = async (directory: FileSystemDirectoryHandle) => {
        for await (const entry of directory.values()) {
          if (entry.kind === "file") {
            const file = await (entry as FileSystemFileHandle).getFile();
            if (file.type.startsWith("image/")) {
              imageFiles.push({ url: URL.createObjectURL(file), name: file.name });
            }
          } else if (entry.kind === "directory") {
            await readFiles(entry as FileSystemDirectoryHandle);
          }
        }
      };

      await readFiles(dirHandle);
      setImages(imageFiles);
      setImageCount(imageFiles.length);
      onImagesLoaded(imageFiles);
    } catch (error) {
      console.error("Erreur lors de la sélection du dossier :", error);
    } finally {
      setLoading(false); // Masquer le loader après l'importation
    }
  };

  return (
    <div className="p-4 border rounded text-center">
      <button onClick={handleSelectFolder} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sélectionner un dossier
      </button>

      {loading ? (
        <Loader /> // Afficher le loader pendant le traitement
      ) : (
        imageCount > 0 && (
          <div className="mt-4">
            <p className="text-lg font-bold">{imageCount} images importées</p>
            <button
              onClick={() => onImagesLoaded(images)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Démarrer le collage
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ImageImporter;
