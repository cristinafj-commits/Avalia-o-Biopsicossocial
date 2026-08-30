import React from 'react';

interface CmcOfficialLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  color?: 'black' | 'white' | 'darkBlue' | 'currentColor';
}

/**
 * Marca Oficial da Câmara Municipal de Curitiba (CMC)
 * Arquitetura fiel do Palácio Rio Branco + Barra Divisória + Tipografia Oficial "Câmara de Curitiba"
 * Baseada estritamente no arquivo institucional oficial "horizontal_preto_pequeno.png".
 */
export const CmcOfficialLogo: React.FC<CmcOfficialLogoProps> = ({
  className = '',
  height = 36,
  width = 'auto',
  color = 'black'
}) => {
  const isWhite = color === 'white';
  const mainColor = isWhite ? '#FFFFFF' : color === 'darkBlue' ? '#042749' : color === 'black' ? '#000000' : 'currentColor';
  const cutoutColor = isWhite ? '#042749' : '#FFFFFF';

  return (
    <svg
      viewBox="0 0 240 85"
      height={height}
      width={width}
      className={`inline-block shrink-0 align-middle ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Câmara de Curitiba"
      role="img"
    >
      {/* SÍMBOLO PALÁCIO RIO BRANCO (OFICIAL CMC) */}
      <g fill={mainColor}>
        {/* Cobertura Esquerda */}
        <polygon points="6,17 9,10 27,10 30,17" />
        {/* Cobertura Direita */}
        <polygon points="74,17 77,10 95,10 98,17" />
        {/* Ático / Cobertura Central */}
        <polygon points="35,17 38,8 66,8 69,17" />
        
        {/* Friso Horizontal Superior */}
        <rect x="4" y="17" width="96" height="4" />

        {/* Corpo Principal das Paredes */}
        <rect x="6" y="21" width="92" height="36" />

        {/* Viga Base Inferior do Palácio */}
        <rect x="4" y="57" width="96" height="4" />

        {/* Blocos Laterais da Escadaria (Alvenaria / Pedestais) */}
        {/* Bloco Esquerdo */}
        <polygon points="4,61 17,61 17,75 10,75 10,71 4,71" />
        {/* Bloco Direito */}
        <polygon points="99,61 87,61 87,75 94,75 94,71 100,71" />

        {/* Escadarias Centrais (Degraus) */}
        <rect x="17" y="61" width="70" height="3.5" />
        <rect x="17" y="65.5" width="70" height="3.5" />
        <rect x="17" y="70" width="70" height="3.5" />
        <rect x="10" y="74.5" width="84" height="2" />
      </g>

      {/* VAZADOS EM BRANCO (JANELAS E ARCOS) */}
      <g fill={cutoutColor}>
        {/* Janela Torre Esquerda */}
        <path d="M 12 32 A 4.5 4.5 0 0 1 21 32 L 21 57 L 12 57 Z" />

        {/* 3 Arcos Centrais do Palácio */}
        <path d="M 33 36 A 3.5 3.5 0 0 1 40 36 L 40 57 L 33 57 Z" />
        <path d="M 48.5 36 A 3.5 3.5 0 0 1 55.5 36 L 55.5 57 L 48.5 57 Z" />
        <path d="M 64 36 A 3.5 3.5 0 0 1 71 36 L 71 57 L 64 57 Z" />

        {/* Janela Torre Direita */}
        <path d="M 83 32 A 4.5 4.5 0 0 1 92 32 L 92 57 L 83 57 Z" />

        {/* Linhas Brancas Divisórias dos Degraus Centrais */}
        <rect x="17" y="64.5" width="70" height="1" />
        <rect x="17" y="69" width="70" height="1" />
        <rect x="10" y="73.5" width="84" height="1" />
      </g>

      {/* BARRA VERTICAL SEPARADORA OFICIAL */}
      <line
        x1="116"
        y1="8"
        x2="116"
        y2="76"
        stroke={mainColor}
        strokeWidth="2.2"
        strokeLinecap="square"
      />

      {/* TIPOGRAFIA INSTITUCIONAL OFICIAL "Câmara de Curitiba" */}
      <g fill={mainColor}>
        <text
          x="128"
          y="41"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="27"
          letterSpacing="-0.8px"
        >
          Câmara
        </text>
        <text
          x="129"
          y="66"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          de Curitiba
        </text>
      </g>
    </svg>
  );
};
