import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useId, useState } from 'react';

import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { READY_PHRASES, STUDENT_PLACEHOLDER } from '@/features/reports/constants';
import {
  addCustomPhrase,
  type CustomPhrase,
  INITIAL_PHRASE_BANK,
  putCustomPhrase,
  removeCustomPhrase,
  selectCustomPhrases,
} from '@/features/reports/phraseBankSlice';
import { useUndoNotice } from '@/lib/react/useUndoNotice';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

type PhrasePickerProps = {
  /** Shown in the phrases in place of `[ALUNO]`; without it, `[ALUNO]` stays. */
  studentName?: string;
  onInsert: (phrase: string) => void;
};

const fillName = (phrase: string, studentName?: string): string =>
  studentName ? phrase.replaceAll(STUDENT_PLACEHOLDER, studentName) : phrase;

/** Ready-made and saved phrases, inserted where the cursor is with one click. */
export const PhrasePicker = ({ studentName, onInsert }: PhrasePickerProps) => {
  const dispatch = useAppDispatch();
  const customPhrases = usePersistedSelector(
    selectCustomPhrases,
    INITIAL_PHRASE_BANK.customPhrases,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const notice = useUndoNotice();
  const panelId = useId();
  const newPhraseId = useId();

  const insert = (phrase: string) => {
    onInsert(fillName(phrase, studentName));
    setIsOpen(false);
  };

  const savePhrase = () => {
    if (newPhrase.trim()) {
      dispatch(addCustomPhrase(newPhrase));
      setNewPhrase('');
      notice.show('Frase guardada em "Minhas frases".');
    }
  };

  const removePhrase = (phrase: CustomPhrase) => {
    const index = customPhrases.indexOf(phrase);
    dispatch(removeCustomPhrase(phrase.id));
    notice.show('Frase apagada de "Minhas frases".', () =>
      dispatch(putCustomPhrase({ phrase, index })),
    );
  };

  const groups = [
    ...(customPhrases.length > 0
      ? [{ title: 'Minhas frases', phrases: customPhrases.map(({ text }) => text) }]
      : []),
    ...READY_PHRASES,
  ];

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="lg"
        className="h-10"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <ChevronDown
          data-icon="inline-start"
          className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
        />
        {isOpen ? 'Fechar as frases prontas' : 'Inserir uma frase pronta'}
      </Button>

      {isOpen && (
        <div id={panelId} className="space-y-4 rounded-xl border-2 bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Clique numa frase para colocá-la onde está o cursor. Depois, ajuste o texto ao aluno.
          </p>
          {groups.map(({ title, phrases }) => (
            <section key={title} className="space-y-2" aria-label={title}>
              <h4 className="font-semibold">{title}</h4>
              <ul className="space-y-1">
                {phrases.map((phrase, index) => {
                  const custom = title === 'Minhas frases' ? customPhrases[index] : undefined;
                  return (
                    <li key={`${title}-${index}`} className="flex items-start gap-1">
                      <button
                        type="button"
                        className="flex-1 rounded-lg border px-3 py-2 text-left hover:bg-muted"
                        onClick={() => insert(phrase)}
                      >
                        {fillName(phrase, studentName)}
                      </button>
                      {custom && (
                        <Button
                          variant="ghost"
                          size="icon-lg"
                          aria-label={`Apagar a frase "${custom.text}"`}
                          onClick={() => removePhrase(custom)}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor={newPhraseId} className="text-base">
              Guardar uma frase sua para usar de novo
            </Label>
            <p className="text-sm text-muted-foreground">
              Escreva {STUDENT_PLACEHOLDER} onde entra o nome do aluno.
            </p>
            <div className="flex flex-wrap gap-2">
              <Input
                id={newPhraseId}
                className="h-10 min-w-64 flex-1 text-base md:text-base"
                value={newPhrase}
                placeholder={`Ex.: ${STUDENT_PLACEHOLDER} gosta de ajudar os colegas.`}
                onChange={(event) => setNewPhrase(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && savePhrase()}
              />
              <Button variant="outline" size="lg" className="h-10" onClick={savePhrase}>
                <Plus data-icon="inline-start" />
                Guardar a frase
              </Button>
            </div>
          </div>
        </div>
      )}

      <UndoNotice notice={notice.notice} onUndo={notice.undo} onDismiss={notice.dismiss} />
    </div>
  );
};
