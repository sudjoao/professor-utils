import Image from 'next/image';
import { useState, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { DEFAULT_HEADER_IMAGE, MAX_HEADER_IMAGE_BYTES } from '@/features/reports/constants';
import { ACCEPTED_HEADER_IMAGE_TYPES } from '@/features/reports/services/headerImage';
import { readAsDataUrl } from '@/lib/files/readAsDataUrl';

type HeaderImageFieldProps = {
  headerImage: string | null;
  onChange: (headerImage: string | null) => void;
};

export const HeaderImageField = ({ headerImage, onChange }: HeaderImageFieldProps) => {
  const [error, setError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }
    if (!ACCEPTED_HEADER_IMAGE_TYPES.includes(file.type)) {
      setError('Use uma imagem PNG ou JPG.');
      return;
    }
    if (file.size > MAX_HEADER_IMAGE_BYTES) {
      setError('A imagem deve ter no máximo 1 MB.');
      return;
    }

    setError('');
    onChange(await readAsDataUrl(file));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Imagem do cabeçalho</legend>
      <div className="flex flex-wrap items-center gap-4">
        <Image
          src={headerImage ?? DEFAULT_HEADER_IMAGE}
          alt="Imagem do cabeçalho do relatório"
          width={64}
          height={76}
          unoptimized
          className="h-[76px] w-16 rounded-md border object-contain p-1"
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" render={<label />} nativeButton={false}>
            Trocar imagem
            <input
              type="file"
              accept={ACCEPTED_HEADER_IMAGE_TYPES.join(',')}
              className="sr-only"
              onChange={handleFileChange}
            />
          </Button>
          {headerImage && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
              Usar brasão do DF
            </Button>
          )}
        </div>
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Aparece no topo de todas as páginas. A imagem escolhida fica salva neste navegador.
        </p>
      )}
    </fieldset>
  );
};
