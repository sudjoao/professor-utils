'use client';

import { HardDriveDownload } from 'lucide-react';
import Link from 'next/link';

import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import {
  backupReminderPostponed,
  INITIAL_BACKUP_STATE,
  selectBackupState,
} from '@/features/backup/backupSlice';
import { useBackup } from '@/features/backup/hooks/useBackup';
import { shouldRemindBackup } from '@/features/backup/services/backup';
import { selectClassrooms } from '@/features/classroom/classroomSlice';
import type { Classroom } from '@/features/classroom/types';
import { addDays } from '@/lib/date/isoDate';
import { useToday } from '@/lib/date/useToday';
import { pluralize } from '@/lib/text/pluralize';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

const NO_CLASSROOMS: Classroom[] = [];
const POSTPONE_DAYS = 7;

/** Asks, now and then, for a copy of the saved classrooms; they only live in this browser. */
export const BackupReminder = () => {
  const dispatch = useAppDispatch();
  const today = useToday();
  const classrooms = usePersistedSelector(selectClassrooms, NO_CLASSROOMS);
  const { lastBackupAt, remindAfter } = usePersistedSelector(
    selectBackupState,
    INITIAL_BACKUP_STATE,
  );
  const { saveBackup, saveNotice } = useBackup();

  const isDue =
    today !== null &&
    shouldRemindBackup({ classroomCount: classrooms.length, lastBackupAt, remindAfter, today });

  if (!isDue) {
    // Keeps the confirmation of a copy just saved from here.
    return (
      <UndoNotice
        notice={saveNotice.notice}
        onUndo={saveNotice.undo}
        onDismiss={saveNotice.dismiss}
      />
    );
  }

  return (
    <section
      aria-labelledby="backup-reminder-title"
      className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-note bg-card p-4"
    >
      <HardDriveDownload className="size-6 shrink-0" aria-hidden />
      <div className="min-w-56 flex-1 space-y-1">
        <h2 id="backup-reminder-title" className="font-semibold">
          Guarde uma cópia das suas turmas
        </h2>
        <p>
          Você tem {pluralize(classrooms.length, 'turma salva', 'turmas salvas')} só neste
          navegador. Uma cópia no computador evita perder tudo.{' '}
          <Link href="/data" className="underline underline-offset-4">
            Saiba mais
          </Link>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={saveBackup}>
          Salvar uma cópia agora
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => today && dispatch(backupReminderPostponed(addDays(today, POSTPONE_DAYS)))}
        >
          Lembrar daqui a uma semana
        </Button>
      </div>
    </section>
  );
};
