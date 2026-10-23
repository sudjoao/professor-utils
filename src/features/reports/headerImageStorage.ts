import { createStoredValue } from '@/lib/storage/createStoredValue';

/** The header image chosen by the teacher (a data URL of up to ~1.4 MB), kept on its own. */
export const headerImageStorage = createStoredValue('professor-utils:header-image');
