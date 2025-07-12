// /app/components/ui/TestimonialCard.tsx
'use client';

import Image from 'next/image';

interface TestimonialProps {
  name: string;
  role: string;
  text: string;
  image?: string;
  result?: string;
  rating?: number;
}

export default function TestimonialCard({ 
  name, 
  role, 
  text, 
  image, 
  result, 
  rating = 5 
}: TestimonialProps) {
  // Fallback para avatar com iniciais se não tiver imagem
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGradientColor = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500', 
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-cyan-500 to-blue-500',
      'from-pink-500 to-rose-500'
    ];
    
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={`Foto de ${name}`}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback se imagem não carregar
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-r ${getGradientColor(name)} rounded-full flex items-center justify-center text-white font-semibold ${image ? 'hidden' : ''}`}>
            {getInitials(name)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        &ldquo;{text}&rdquo;
      </p>
      
      {result && (
        <div className="text-green-400 font-semibold text-sm mb-3">
          {result}
        </div>
      )}
      
      <div className="flex text-yellow-400">
        {Array.from({ length: rating }, (_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>
    </div>
  );
}
