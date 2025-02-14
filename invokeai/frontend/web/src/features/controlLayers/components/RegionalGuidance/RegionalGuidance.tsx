import { Spacer } from '@invoke-ai/ui-library';
import { CanvasEntityContainer } from 'features/controlLayers/components/CanvasEntityList/CanvasEntityContainer';
import { CanvasEntityHeader } from 'features/controlLayers/components/common/CanvasEntityHeader';
import { CanvasEntityHeaderCommonActions } from 'features/controlLayers/components/common/CanvasEntityHeaderCommonActions';
import { CanvasEntityPreviewImage } from 'features/controlLayers/components/common/CanvasEntityPreviewImage';
import { CanvasEntityEditableTitle } from 'features/controlLayers/components/common/CanvasEntityTitleEdit';
import { RegionalGuidanceBadges } from 'features/controlLayers/components/RegionalGuidance/RegionalGuidanceBadges';
import { RegionalGuidanceSettings } from 'features/controlLayers/components/RegionalGuidance/RegionalGuidanceSettings';
import { CanvasEntityStateGate } from 'features/controlLayers/contexts/CanvasEntityStateGate';
import { RegionalGuidanceAdapterGate } from 'features/controlLayers/contexts/EntityAdapterContext';
import { EntityIdentifierContext } from 'features/controlLayers/contexts/EntityIdentifierContext';
import type { CanvasEntityIdentifier } from 'features/controlLayers/store/types';
import { memo, useMemo } from 'react';

type Props = {
  id: string;
};

export const RegionalGuidance = memo(({ id }: Props) => {
  const entityIdentifier = useMemo<CanvasEntityIdentifier<'regional_guidance'>>(
    () => ({ id, type: 'regional_guidance' }),
    [id]
  );

  return (
    <EntityIdentifierContext.Provider value={entityIdentifier}>
      <RegionalGuidanceAdapterGate>
        <CanvasEntityStateGate entityIdentifier={entityIdentifier}>
          <CanvasEntityContainer>
            <CanvasEntityHeader>
              <CanvasEntityPreviewImage />
              <CanvasEntityEditableTitle />
              <Spacer />
              <RegionalGuidanceBadges />
              <CanvasEntityHeaderCommonActions />
            </CanvasEntityHeader>
            <RegionalGuidanceSettings />
          </CanvasEntityContainer>
        </CanvasEntityStateGate>
      </RegionalGuidanceAdapterGate>
    </EntityIdentifierContext.Provider>
  );
});

RegionalGuidance.displayName = 'RegionalGuidance';
