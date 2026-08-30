import React from 'react';
import { CMC_OFFICIAL_LOGO_BASE64 } from './cmcLogoData';

interface CmcOfficialLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  color?: 'black' | 'white' | 'darkBlue' | 'currentColor';
}

/**
 * Marca Oficial da Câmara Municipal de Curitiba (CMC)
 * Utiliza o arquivo original fornecido "horizontal_preto_pequeno.png".
 */
export const CmcOfficialLogo: React.FC<CmcOfficialLogoProps> = ({
  className = '',
  height = 36,
  width = 'auto',
  color = 'black'
}) => {
  const isWhite = color === 'white';

  return (
    <img
      src={CMC_OFFICIAL_LOGO_BASE64}
      alt="Câmara Municipal de Curitiba"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        filter: isWhite ? 'brightness(0) invert(1)' : undefined
      }}
      className={`inline-block shrink-0 object-contain align-middle ${className}`}
    />
  );
};

