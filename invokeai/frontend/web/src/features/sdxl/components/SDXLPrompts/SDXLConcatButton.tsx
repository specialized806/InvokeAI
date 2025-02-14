import { IconButton, Tooltip } from '@invoke-ai/ui-library';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { selectShouldConcatPrompts, shouldConcatPromptsChanged } from 'features/controlLayers/store/paramsSlice';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PiLinkSimpleBold, PiLinkSimpleBreakBold } from 'react-icons/pi';

export const SDXLConcatButton = memo(() => {
  const shouldConcatPrompts = useAppSelector(selectShouldConcatPrompts);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleShouldConcatPromptChange = useCallback(() => {
    dispatch(shouldConcatPromptsChanged(!shouldConcatPrompts));
  }, [dispatch, shouldConcatPrompts]);

  const label = useMemo(
    () => (shouldConcatPrompts ? t('sdxl.concatPromptStyle') : t('sdxl.freePromptStyle')),
    [shouldConcatPrompts, t]
  );

  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        onClick={handleShouldConcatPromptChange}
        icon={shouldConcatPrompts ? <PiLinkSimpleBold size={14} /> : <PiLinkSimpleBreakBold size={14} />}
        variant="promptOverlay"
        fontSize={12}
        px={0.5}
      />
    </Tooltip>
  );
});

SDXLConcatButton.displayName = 'SDXLConcatButton';
