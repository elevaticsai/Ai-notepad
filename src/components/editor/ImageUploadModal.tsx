import { Upload, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  UnsplashImage,
  generateAIImage,
  searchUnsplashImages,
  uploadToS3,
  downloadAndUploadUnsplashImage,
} from "../../services/imageService";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (url: string) => void;
}

const ImageUploadModal = ({
  isOpen,
  onClose,
  onImageSelect,
}: ImageUploadModalProps) => {
  const [activeTab, setActiveTab] = useState<"upload" | "magic">("upload");
  const [magicType, setMagicType] = useState<"unsplash" | "ai" | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<{ base64: string; previewUrl: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const imageUrl = await uploadToS3(file);
      onImageSelect(imageUrl);
      onClose();
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsplashImageSelect = async (imageUrl: string) => {
    try {
      setLoading(true);
      setError(null);
      const s3Url = await downloadAndUploadUnsplashImage(imageUrl);
      onImageSelect(s3Url);
      onClose();
    } catch (err) {
      setError("Failed to save image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsplashSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const images = await searchUnsplashImages(prompt, currentPage);
      setUnsplashImages(images);
    } catch (err) {
      setError("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIImageSelect = async () => {
    if (!generatedImage) return;

    try {
      setLoading(true);
      setError(null);
      const blob = await fetch(generatedImage.previewUrl).then(res => res.blob());
      const s3Url = await uploadToS3(blob);
      onImageSelect(s3Url);
      onClose();
    } catch (err) {
      setError("Failed to save image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIGeneration = async () => {
    try {
      setLoading(true);
      setError(null);
      const imageUrl = await generateAIImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[500px] max-w-[90vw]">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Add Image</h2>
            <button
              onClick={() => {
                setActiveTab("upload");
                setMagicType(null);
                setPrompt("")
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === "upload"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Upload size={18} />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveTab("magic")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === "magic"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Wand2 size={18} />
              <span>Magic Media</span>
            </button>
          </div>

          {activeTab === "upload" ? (
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload an image</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          ) : (
            <div>
              {!magicType ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMagicType("unsplash")}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8 mx-auto mb-2 text-blue-400"
                      fill="currentColor"
                    >
                      <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z" />
                    </svg>
                    <span className="text-sm font-normal text-blue-400">
                      Unsplash Images
                    </span>
                  </button>
                  <button
                    onClick={() => setMagicType("ai")}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-center"
                  >
                    <Wand2 size={32} className="mx-auto mb-2 text-blue-400" />
                    <span className="text-sm font-normal text-blue-400">
                      AI Generation
                    </span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        magicType === "unsplash"
                          ? "Search Unsplash images..."
                          : "Describe the image you want to generate..."
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {magicType === "unsplash" && unsplashImages.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {unsplashImages.map((image) => (
                          <button
                            key={image.id}
                            onClick={() => handleUnsplashImageSelect(image.urls.regular)}
                            className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={image.urls.small}
                              alt={image.alt_description}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            handleUnsplashSearch();
                          }}
                          disabled={currentPage === 1 || loading}
                          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage((p) => p + 1);
                            handleUnsplashSearch();
                          }}
                          disabled={loading}
                          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {magicType === "ai" && generatedImage && (
                    <div className="mb-4 h-[300px]">
                      <div style={{ height: "300px" }} className="relative  overflow-hidden rounded-lg">
                        <img
                          src={generatedImage.previewUrl}
                          alt="Generated image"
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={handleAIImageSelect}
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <span className="text-white">Select</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setMagicType(null);
                        setUnsplashImages([]);
                        setGeneratedImage(null);
                        setError(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (magicType === "unsplash") {
                          handleUnsplashSearch();
                        } else {
                          handleAIGeneration();
                        }
                      }}
                      disabled={!prompt || loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                      <span>{magicType === "unsplash" ? "Search" : "Generate"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
