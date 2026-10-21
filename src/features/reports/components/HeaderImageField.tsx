import Image from 'next/image';
import { useRef, useState, type ChangeEvent } from 'react';

import { FieldGroup } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { DEFAULT_HEADER_IMAGE, MAX_HEADER_IMAGE_BYTES } from '@/features/reports/constants';
import { ACCEPTED_HEADER_IMAGE_TYPES } from '@/features/reports/services/headerImage';
import { readAsDataUrl } from '@/lib/files/readAsDataUrl';

type HeaderImageFieldProps = {
  headerImage: string | null;
  onChange: (headerImage: string | null) => void;
};

export const HeaderImageField = ({ headerImage, onChange }: HeaderImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }
    if (!ACCEPTED_HEADER_IMAGE_TYPES.includes(file.type)) {
      setError('Essa imagem não serve. Escolha uma foto ou imagem do tipo PNG ou JPG.');
      return;
    }
    if (file.size > MAX_HEADER_IMAGE_BYTES) {
      setError('Essa imagem é grande demais. Escolha uma com no máximo 1 MB.');
      return;
    }

    setError('');
    onChange(await readAsDataUrl(file));
  };

  return (
    <FieldGroup
      id="report-header-image"
      legend="Imagem do topo da página"
      optional
      hint="Aparece no topo de todas as páginas. Se não trocar, vai o brasão do DF. A imagem escolhida fica salva neste computador."
      error={error}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Image
          src={headerImage ?? DEFAULT_HEADER_IMAGE}
          alt={headerImage ? 'Imagem escolhida para o topo' : 'Brasão do Distrito Federal'}
          width={64}
          height={76}
          unoptimized
          className="h-[76px] w-16 rounded-md border object-contain p-1"
        />
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_HEADER_IMAGE_TYPES.join(',')}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="lg"
            className="h-10"
            onClick={() => inputRef.current?.click()}
          >
            Escolher outra imagem
          </Button>
          {headerImage && (
            <Button variant="ghost" size="lg" className="h-10" onClick={() => onChange(null)}>
              Voltar para o brasão do DF
            </Button>
          )}
        </div>
      </div>
    </FieldGroup>
  );
};
