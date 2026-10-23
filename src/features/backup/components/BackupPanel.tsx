'use client';

import { Download, Upload } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';

import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { INITIAL_BACKUP_STATE, selectBackupState } from '@/features/backup/backupSlice';
import { useBackup } from '@/features/backup/hooks/useBackup';
import { summarizeBackup } from '@/features/backup/services/backup';
import { selectClassDraft } from '@/features/classroom/classDraftSlice';
import { selectClassrooms } from '@/features/classroom/classroomSlice';
import {
  getStudentNames,
  INITIAL_CLASS_FORM_VALUES,
} from '@/features/classroom/services/classForm';
import type { Classroom } from '@/features/classroom/types';
import { headerImageStorage } from '@/features/reports/headerImageStorage';
import {
  INITIAL_REPORT_SETTINGS,
  selectReportSettings,
} from '@/features/reports/reportSettingsSlice';
import { formatLongDate } from '@/lib/date/isoDate';
import { useStoredValue } from '@/lib/storage/useStoredValue';
import { pluralize } from '@/lib/text/pluralize';
import { usePersistedSelector } from '@/store/hooks';

const NO_CLASSROOMS: Classroom[] = [];

export const BackupPanel = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const { saveBackup, restoreBackup, saveNotice, restoreNotice } = useBackup();
  const classrooms = usePersistedSelector(selectClassrooms, NO_CLASSROOMS);
  const classDraft = usePersistedSelector(selectClassDraft, INITIAL_CLASS_FORM_VALUES);
  const reportSettings = usePersistedSelector(selectReportSettings, INITIAL_REPORT_SETTINGS);
  const { lastBackupAt } = usePersistedSelector(selectBackupState, INITIAL_BACKUP_STATE);
  const headerImage = useStoredValue(headerImageStorage);

  const summary = summarizeBackup({ classrooms, reportSettings, headerImage });
  const draftStudentCount = getStudentNames(classDraft).length;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) {
      setError(await restoreBackup(file));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="text-base">
        <CardContent className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">
            O que está guardado neste navegador
          </h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              {pluralize(summary.classroomCount, 'turma salva', 'turmas salvas')} (
              {pluralize(summary.studentCount, 'aluno', 'alunos')} ao todo)
            </li>
            <li>
              Turma sendo preparada: {classDraft.classroomName.trim() || 'sem nome'},{' '}
              {pluralize(draftStudentCount, 'aluno', 'alunos')}
            </li>
            <li>
              Dados da escola para o relatório:{' '}
              {summary.hasSchoolData ? 'preenchidos' : 'ainda não'}
            </li>
            <li>
              Imagem do cabeçalho: {summary.hasHeaderImage ? 'escolhida por você' : 'brasão do DF'}
            </li>
          </ul>
          <p className="text-muted-foreground">
            Isso fica só neste navegador. Em outro computador, ou se o histórico do navegador for
            apagado, não aparece. Por isso vale a pena guardar uma cópia.
          </p>
        </CardContent>
      </Card>

      <Card className="text-base">
        <CardContent className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Salvar uma cópia no computador</h2>
          <p>
            Baixa um arquivo com tudo isso. Guarde num pendrive, no Google Drive ou mande por e-mail
            para você mesmo.
          </p>
          <p className="text-muted-foreground">
            {lastBackupAt
              ? `Última cópia: ${formatLongDate(lastBackupAt)}.`
              : 'Você ainda não salvou nenhuma cópia.'}
          </p>
          <Button size="lg" className="h-12 px-5 text-base" onClick={saveBackup}>
            <Download data-icon="inline-start" className="size-5" />
            Salvar uma cópia no computador
          </Button>
          <UndoNotice
            notice={saveNotice.notice}
            onUndo={saveNotice.undo}
            onDismiss={saveNotice.dismiss}
          />
        </CardContent>
      </Card>

      <Card className="text-base">
        <CardContent className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Carregar uma cópia</h2>
          <p>
            Para usar em outro computador: abra esta página lá e escolha o arquivo da cópia. O que
            estiver guardado neste navegador é trocado pelo que está na cópia (dá para desfazer).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-5 text-base"
            aria-describedby={error ? 'backup-error' : undefined}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload data-icon="inline-start" className="size-5" />
            Escolher o arquivo da cópia
          </Button>
          {error && (
            <p id="backup-error" role="alert" className="font-medium text-destructive">
              {error}
            </p>
          )}
          <UndoNotice
            notice={restoreNotice.notice}
            onUndo={restoreNotice.undo}
            onDismiss={restoreNotice.dismiss}
          />
        </CardContent>
      </Card>
    </div>
  );
};
