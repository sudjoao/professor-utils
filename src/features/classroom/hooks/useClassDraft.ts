import { selectClassDraft, updateClassDraft } from '@/features/classroom/classDraftSlice';
import {
  CLASS_FORM_KEYS,
  INITIAL_CLASS_FORM_VALUES,
} from '@/features/classroom/services/classForm';
import type { ClassFormValues } from '@/features/classroom/types';
import { hasEntries, splitByKeys } from '@/lib/object/splitByKeys';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

/**
 * Connects a tool form to the shared class draft. `splitChanges` takes the changes of the whole
 * form, saves the class part in the draft and returns the rest for the form to keep.
 */
export const useClassDraft = () => {
  const dispatch = useAppDispatch();
  const classDraft = usePersistedSelector(selectClassDraft, INITIAL_CLASS_FORM_VALUES);

  const splitChanges = <Changes extends Partial<ClassFormValues>>(changes: Changes) => {
    const [classChanges, otherChanges] = splitByKeys(changes, CLASS_FORM_KEYS);

    if (hasEntries(classChanges)) {
      dispatch(updateClassDraft(classChanges));
    }
    return otherChanges;
  };

  return { classDraft, splitChanges };
};
