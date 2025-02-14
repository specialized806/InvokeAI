import { Progress } from '@invoke-ai/ui-library';
import { useStore } from '@nanostores/react';
import { useCurrentDestination } from 'features/queue/hooks/useCurrentDestination';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetQueueStatusQuery } from 'services/api/endpoints/queue';
import { $isConnected, $lastProgressEvent } from 'services/events/stores';

const ProgressBar = () => {
  const { t } = useTranslation();
  const destination = useCurrentDestination();
  const { data: queueStatus } = useGetQueueStatusQuery();
  const isConnected = useStore($isConnected);
  const lastProgressEvent = useStore($lastProgressEvent);
  const value = useMemo(() => {
    if (!lastProgressEvent) {
      return 0;
    }
    return (lastProgressEvent.percentage ?? 0) * 100;
  }, [lastProgressEvent]);

  const isIndeterminate = useMemo(() => {
    if (!isConnected) {
      return false;
    }

    if (!queueStatus?.queue.in_progress) {
      return false;
    }

    if (!lastProgressEvent) {
      return true;
    }

    if (lastProgressEvent.percentage === null) {
      return true;
    }

    return false;
  }, [isConnected, lastProgressEvent, queueStatus?.queue.in_progress]);

  const colorScheme = useMemo(() => {
    if (destination === 'canvas') {
      return 'invokeGreen';
    } else if (destination === 'gallery') {
      return 'invokeBlue';
    } else {
      return 'base';
    }
  }, [destination]);

  return (
    <Progress
      value={value}
      aria-label={t('accessibility.invokeProgressBar')}
      isIndeterminate={isIndeterminate}
      h={2}
      w="full"
      colorScheme={colorScheme}
    />
  );
};

export default memo(ProgressBar);
