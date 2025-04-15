import { api } from './index';

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

export const searchUnsplashImages = async (
  query: string,
  page: number = 1
): Promise<UnsplashImage[]> => {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&page=${page}&per_page=6`,
    {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Unsplash images");
  }

  const data = await response.json();
  return data.results;
};

export const uploadToS3 = async (file: File | Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.data.fileUrl) {
    throw new Error('Failed to upload image');
  }

  return response.data.fileUrl;
};

export const downloadAndUploadUnsplashImage = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return uploadToS3(blob);
};

export const generateAIImage = async (prompt: string): Promise<{ base64: string; previewUrl: string }> => {
  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
        cfg_scale: 7,
        height: 768,
        width: 1344,
        steps: 30,
        samples: 1,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate AI image");
  }

  const data = await response.json();
  // The API returns base64 encoded image
  const base64Data = data.artifacts[0].base64;
  return {
    base64: base64Data,
    previewUrl: `data:image/png;base64,${base64Data}`
  };
};
