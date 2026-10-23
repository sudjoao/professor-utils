import { Scissors } from 'lucide-react';

import { getNoteFontSize } from '@/features/parentNotes/services/buildParentNotes';
import type { NotesPerPage, ParentNote } from '@/features/parentNotes/types';
import { cn } from '@/lib/utils';

type ParentNoteViewProps = {
  note: ParentNote;
  notesPerPage: NotesPerPage;
  isPrint?: boolean;
};

/** One note, with the optional "Ciente" stub to cut and send back signed. */
export const ParentNoteView = ({ note, notesPerPage, isPrint = false }: ParentNoteViewProps) => (
  <article
    aria-label={`Bilhete de ${note.studentName}`}
    className={cn(
      'flex flex-col bg-white font-sans text-black',
      isPrint ? 'h-full overflow-hidden px-[8mm] py-[6mm]' : 'rounded-md border p-6 shadow-sm',
    )}
    style={{ fontSize: `${getNoteFontSize(notesPerPage)}pt` }}
  >
    <div className="flex-1 space-y-2">
      {note.schoolName && <p className="text-[0.85em] font-semibold">{note.schoolName}</p>}
      {note.title && <h2 className="text-[1.25em] font-bold">{note.title}</h2>}
      <div className="space-y-1">
        {note.paragraphs.length > 0 ? (
          note.paragraphs.map((paragraph, index) => <p key={index}>{paragraph || ' '}</p>)
        ) : (
          <p className="text-gray-500 italic">(o texto do bilhete aparece aqui)</p>
        )}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <p>{note.dateLine}</p>
        {note.signature && (
          <p className="text-center">
            ______________________________
            <br />
            {note.signature}
          </p>
        )}
      </div>
    </div>

    {note.includeReceipt && (
      <div className="mt-3 space-y-1 border-t-2 border-dashed border-gray-500 pt-2 text-[0.9em]">
        <p className="flex items-center gap-1 text-[0.8em] text-gray-600">
          <Scissors className="size-3" aria-hidden />
          Recorte e devolva assinado
        </p>
        <p>
          Eu, responsável por <strong>{note.studentName}</strong>, estou ciente do bilhete
          {note.title ? ` "${note.title}"` : ''}.
        </p>
        <p>Assinatura: ______________________________ Data: ___/___/______</p>
      </div>
    )}
  </article>
);
