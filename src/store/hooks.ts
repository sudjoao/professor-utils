import { useDispatch, useSelector, useStore } from 'react-redux';

import { useIsHydrated } from '@/lib/react/useIsHydrated';
import type { AppDispatch, AppStore, RootState } from '@/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

/**
 * Reads state saved in the browser (redux-persist). Next.js hydrates each page segment on its own,
 * so the saved state may already be loaded while a component is still hydrating; returning the
 * initial value until then keeps the first render identical to the server HTML.
 */
export const usePersistedSelector = <Selected>(
  selector: (state: RootState) => Selected,
  initialValue: Selected,
): Selected => {
  const selected = useAppSelector(selector);
  return useIsHydrated() ? selected : initialValue;
};
