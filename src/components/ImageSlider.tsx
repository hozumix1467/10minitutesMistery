import React, { useState, useEffect } from 'react';

interface ImageSliderProps {
  darkMode: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ darkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // srider画像のパス配列
  const images = [
    '/images/srider/srider0.png',
    '/images/srider/srider1.png',
    '/images/srider/srider2.png',
    '/images/srider/srider3.png',
    '/images/srider/srider4.png',
    '/images/srider/srider5.png'
  ];

  // 無限ループ用に画像を複製
  const duplicatedImages = [...images, ...images, ...images];

  // 自動スライド機能（1枚ずつ移動）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000); // 5秒間隔
    return () => clearInterval(timer);
  }, []);

  // 無限ループの実装
  useEffect(() => {
    if (currentSlide >= images.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, images.length]);

  return (
    <div className="relative overflow-hidden">
      {/* スライダーコンテナ */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: `translateX(-${currentSlide * (100 / 4)}%)`,
          width: `${(duplicatedImages.length / 4) * 100}%`
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div 
            key={index}
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / duplicatedImages.length}%` }}
          >
            <div 
              className={`rounded-lg overflow-hidden shadow-md border ${
                darkMode ? 'border-slate-600' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`スライダー画像 ${(index % images.length) + 1}`}
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
