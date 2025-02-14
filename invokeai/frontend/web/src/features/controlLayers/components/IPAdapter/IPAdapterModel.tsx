import type { ComboboxOnChange } from '@invoke-ai/ui-library';
import { Combobox, Flex, FormControl, Tooltip } from '@invoke-ai/ui-library';
import { useAppSelector } from 'app/store/storeHooks';
import { useGroupedModelCombobox } from 'common/hooks/useGroupedModelCombobox';
import { selectBase, selectIsFLUX } from 'features/controlLayers/store/paramsSlice';
import type { CLIPVisionModelV2 } from 'features/controlLayers/store/types';
import { isCLIPVisionModelV2 } from 'features/controlLayers/store/types';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIPAdapterModels } from 'services/api/hooks/modelsByType';
import type { AnyModelConfig, IPAdapterModelConfig } from 'services/api/types';
import { assert } from 'tsafe';

// at this time, ViT-L is the only supported clip model for FLUX IP adapter
const FLUX_CLIP_VISION = 'ViT-L';

const CLIP_VISION_OPTIONS = [
  { label: 'ViT-H', value: 'ViT-H' },
  { label: 'ViT-G', value: 'ViT-G' },
  { label: FLUX_CLIP_VISION, value: FLUX_CLIP_VISION },
];

type Props = {
  modelKey: string | null;
  onChangeModel: (modelConfig: IPAdapterModelConfig) => void;
  clipVisionModel: CLIPVisionModelV2;
  onChangeCLIPVisionModel: (clipVisionModel: CLIPVisionModelV2) => void;
};

export const IPAdapterModel = memo(({ modelKey, onChangeModel, clipVisionModel, onChangeCLIPVisionModel }: Props) => {
  const { t } = useTranslation();
  const currentBaseModel = useAppSelector(selectBase);
  const [modelConfigs, { isLoading }] = useIPAdapterModels();
  const selectedModel = useMemo(() => modelConfigs.find((m) => m.key === modelKey), [modelConfigs, modelKey]);

  const _onChangeModel = useCallback(
    (modelConfig: IPAdapterModelConfig | null) => {
      if (!modelConfig) {
        return;
      }
      onChangeModel(modelConfig);
    },
    [onChangeModel]
  );

  const _onChangeCLIPVisionModel = useCallback<ComboboxOnChange>(
    (v) => {
      assert(isCLIPVisionModelV2(v?.value));
      onChangeCLIPVisionModel(v.value);
    },
    [onChangeCLIPVisionModel]
  );

  const isFLUX = useAppSelector(selectIsFLUX);

  const getIsDisabled = useCallback(
    (model: AnyModelConfig): boolean => {
      const isCompatible = currentBaseModel === model.base;
      const hasMainModel = Boolean(currentBaseModel);
      return !hasMainModel || !isCompatible;
    },
    [currentBaseModel]
  );

  const { options, value, onChange, noOptionsMessage } = useGroupedModelCombobox({
    modelConfigs,
    onChange: _onChangeModel,
    selectedModel,
    getIsDisabled,
    isLoading,
  });

  const clipVisionOptions = useMemo(() => {
    return CLIP_VISION_OPTIONS.map((option) => ({
      ...option,
      isDisabled: isFLUX && option.value !== FLUX_CLIP_VISION,
    }));
  }, [isFLUX]);

  const clipVisionModelValue = useMemo(() => {
    return CLIP_VISION_OPTIONS.find((o) => o.value === clipVisionModel);
  }, [clipVisionModel]);

  return (
    <Flex gap={2}>
      <Tooltip label={selectedModel?.description}>
        <FormControl isInvalid={!value || currentBaseModel !== selectedModel?.base} w="full">
          <Combobox
            options={options}
            placeholder={t('common.placeholderSelectAModel')}
            value={value}
            onChange={onChange}
            noOptionsMessage={noOptionsMessage}
          />
        </FormControl>
      </Tooltip>
      {selectedModel?.format === 'checkpoint' && (
        <FormControl isInvalid={!value || currentBaseModel !== selectedModel?.base} width="max-content" minWidth={28}>
          <Combobox
            options={clipVisionOptions}
            placeholder={t('common.placeholderSelectAModel')}
            value={clipVisionModelValue}
            onChange={_onChangeCLIPVisionModel}
          />
        </FormControl>
      )}
    </Flex>
  );
});

IPAdapterModel.displayName = 'IPAdapterModel';
