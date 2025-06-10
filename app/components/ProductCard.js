'use client';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ title, description, image, href }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-64">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          style={{
            objectFit: 'cover'
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          href={href}
          className="inline-block bg-primary-color text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-300"
        >
          Detaylar
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 