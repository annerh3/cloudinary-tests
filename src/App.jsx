import { useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import Axios from "axios";

const App = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const uploadPreset = "images"; // esto lo creé en mi consola en Cloudinary
  const maxSize = 2 * 1024 * 1024; // 2 MB 

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar tamaño del archivo
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. El tamaño máximo permitido es ${maxSize/1024/1024} MB.`);
      return;
    }

    setLoading(true);
    setPreview(URL.createObjectURL(file)); // Mostrar preview antes de subir

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await Axios.post(
        `https://api.cloudinary.com/v1_1/anner/image/upload`,
        formData
      );

      setImageUrl(response.data.secure_url);
      console.log("Imagen subida con éxito:", response.data.secure_url);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="p-6 bg-white shadow-xl rounded-2xl w-80 flex flex-col items-center">
        <label className="group flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 transition duration-300">
          <div className="flex flex-col items-center ">
            <ImageUp className="w-10 h-10 text-gray-500 group-hover:text-blue-400" />
            <p className="mt-2 text-gray-600 text-sm group-hover:text-blue-400">
              {loading ? "Subiendo..." : "Click para subir imagen"}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={loading}
            accept=".png,.jpg,.jpeg"
          />
        </label>

        {/* Vista previa antes de subir */}
        {preview && !imageUrl && (
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Vista previa:</p>
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-40 h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Mensaje de carga */}
        {loading && (
          <div className="mt-4 flex items-center space-x-2 text-blue-500">
            <Loader2 className="animate-spin w-5 h-5" />
            <p>Subiendo imagen...</p>
          </div>
        )}

        {/* Imagen subida con exito */}
        {imageUrl && (
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Imagen subida:</p>
            <img
              src={imageUrl}
              alt="Imagen subida"
              loading="lazy"
              className="mt-2 w-40 h-40 object-cover pointer-events-none rounded-lg shadow-md border border-gray-300"
            />

            <div className="flex space-x-1 mt-2 text-gray-500 text-sm justify-center ">
              <h2>Copia el link</h2>
              <span
                className="text-blue-500 hover:text-blue-400 cursor-pointer "
                onClick={copyToClipboard}
              >
                aquí
              </span>
            </div>
            <span className="flex justify-center h-3 text-green-500">
              {isLinkCopied && "Copiado!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
