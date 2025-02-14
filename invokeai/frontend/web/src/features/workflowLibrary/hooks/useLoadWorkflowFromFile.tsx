import { useLogger } from 'app/logging/useLogger';
import { useAppDispatch } from 'app/store/storeHooks';
import { workflowLoadRequested } from 'features/nodes/store/actions';
import { toast } from 'features/toast/toast';
import { workflowLoadedFromFile } from 'features/workflowLibrary/store/actions';
import type { RefObject } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type useLoadWorkflowFromFileOptions = {
  resetRef: RefObject<() => void>;
  onSuccess?: () => void;
};

type UseLoadWorkflowFromFile = (options: useLoadWorkflowFromFileOptions) => (file: File | null) => void;

export const useLoadWorkflowFromFile: UseLoadWorkflowFromFile = ({ resetRef, onSuccess }) => {
  const dispatch = useAppDispatch();
  const logger = useLogger('workflows');
  const { t } = useTranslation();
  const loadWorkflowFromFile = useCallback(
    (file: File | null) => {
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const rawJSON = reader.result;

        try {
          dispatch(workflowLoadRequested({ data: { workflow: String(rawJSON), graph: null }, asCopy: true }));
          dispatch(workflowLoadedFromFile());
          onSuccess && onSuccess();
        } catch (e) {
          // There was a problem reading the file
          logger.error(t('nodes.unableToLoadWorkflow'));
          toast({
            id: 'UNABLE_TO_LOAD_WORKFLOW',
            title: t('nodes.unableToLoadWorkflow'),
            status: 'error',
          });
          reader.abort();
        }
      };

      reader.readAsText(file);

      // Reset the file picker internal state so that the same file can be loaded again
      resetRef.current?.();
    },
    [dispatch, logger, resetRef, t, onSuccess]
  );

  return loadWorkflowFromFile;
};
