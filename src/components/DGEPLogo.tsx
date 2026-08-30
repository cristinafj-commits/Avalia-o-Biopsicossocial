import React from 'react';

interface DGEPLogoProps {
  className?: string;
  size?: number;
}

export const DGEPLogo: React.FC<DGEPLogoProps> = ({ 
  className = '', 
  size = 56 
}) => {
  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-[#042749] select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title="Câmara de Curitiba - Diretoria de Gestão de Pessoas"
    >
      <img
        src="/logo-dgep.svg"
        alt="Logo Diretoria de Gestão de Pessoas - Câmara de Curitiba"
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
