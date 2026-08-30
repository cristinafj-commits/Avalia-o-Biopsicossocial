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
      <svg 
        viewBox="0 0 400 400" 
        width="100%" 
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Fundo Azul Oficial DGEP / CMC */}
        <rect width="400" height="400" fill="#042749" rx="36" />
        
        {/* Fachada Palácio Rio Branco (Câmara de Curitiba) */}
        <g fill="#FFFFFF">
          {/* Platibanda / Telhado Superior */}
          <path d="M 115 88 L 100 88 L 112 68 L 140 68 L 148 76 L 252 76 L 260 68 L 288 68 L 300 88 L 285 88 Z" />
          <rect x="95" y="88" width="210" height="8" rx="1" />
          
          {/* Corpo Principal do Edifício */}
          <rect x="102" y="96" width="46" height="88" />
          <rect x="148" y="96" width="104" height="88" />
          <rect x="252" y="96" width="46" height="88" />
          
          {/* Rodapé Base do Prédio */}
          <rect x="96" y="184" width="208" height="6" />
          
          {/* Escadarias Frontais */}
          <rect x="108" y="190" width="184" height="4.5" />
          <rect x="120" y="194.5" width="160" height="4.5" />
          <rect x="132" y="199" width="136" height="4.5" />
          <rect x="144" y="203.5" width="112" height="4.5" />
        </g>
        
        {/* Aberturas / Arcos e Janelas em Fundo Azul */}
        <g fill="#042749">
          <rect x="114" y="112" width="22" height="64" rx="11" />
          <rect x="159" y="122" width="20" height="54" rx="10" />
          <rect x="190" y="122" width="20" height="54" rx="10" />
          <rect x="221" y="122" width="20" height="54" rx="10" />
          <rect x="264" y="112" width="22" height="64" rx="11" />
          <rect x="156" y="96" width="88" height="8" />
        </g>

        {/* Tipografia Oficial DGEP */}
        <text 
          x="200" 
          y="256" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="46" 
          fontWeight="900" 
          fill="#FFFFFF" 
          textAnchor="middle" 
          letterSpacing="4"
        >
          DGEP
        </text>

        {/* Linha Divisória */}
        <rect x="80" y="278" width="240" height="3.5" fill="#38BDF8" rx="2" />

        {/* Subtítulos */}
        <text 
          x="200" 
          y="306" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="17.5" 
          fontWeight="700" 
          fill="#E2E8F0" 
          textAnchor="middle" 
          letterSpacing="1.2"
        >
          DIRETORIA DE GESTÃO DE PESSOAS
        </text>

        <text 
          x="200" 
          y="332" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="14.5" 
          fontWeight="600" 
          fill="#94A3B8" 
          textAnchor="middle" 
          letterSpacing="2.2"
        >
          CÂMARA MUNICIPAL DE CURITIBA
        </text>
      </svg>
    </div>
  );
};
