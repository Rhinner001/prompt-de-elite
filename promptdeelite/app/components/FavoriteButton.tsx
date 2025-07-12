// app/components/FavoriteButton.tsx (CORRIGIDO)
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/src/components/context/AuthContext'; // Este caminho está correto, pois aponta para o seu contexto
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // << CAMINHO CORRIGIDO
import { FaHeart, FaRegHeart } from 'react-icons/fa';

// ... (O resto do seu código, que já está correto, permanece igual)
interface FavoriteButtonProps { promptId: string; }
export default function FavoriteButton({ promptId }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    const checkFavoriteStatus = async () => {
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', promptId);
      const docSnap = await getDoc(favoriteRef);
      setIsFavorited(docSnap.exists());
      setIsLoading(false);
    };
    checkFavoriteStatus();
  }, [user, promptId]);
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { alert('Você precisa estar logado para favoritar prompts.'); return; }
    const favoriteRef = doc(db, 'users', user.uid, 'favorites', promptId);
    if (isFavorited) { await deleteDoc(favoriteRef); setIsFavorited(false); } 
    else { await setDoc(favoriteRef, { favoritedAt: new Date() }); setIsFavorited(true); }
  };
  if (isLoading) { return <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse" />; }
  return <button onClick={toggleFavorite} className="text-2xl text-red-500 hover:scale-110 transition-transform duration-200 z-10" aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>{isFavorited ? <FaHeart /> : <FaRegHeart className="text-gray-400" />}</button>;
}