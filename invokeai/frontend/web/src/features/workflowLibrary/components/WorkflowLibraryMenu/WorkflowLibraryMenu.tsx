import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  useDisclosure,
  useGlobalMenuClose,
  useShiftModifier,
} from '@invoke-ai/ui-library';
import DownloadWorkflowMenuItem from 'features/workflowLibrary/components/WorkflowLibraryMenu/DownloadWorkflowMenuItem';
import LoadWorkflowFromGraphMenuItem from 'features/workflowLibrary/components/WorkflowLibraryMenu/LoadWorkflowFromGraphMenuItem';
import { NewWorkflowMenuItem } from 'features/workflowLibrary/components/WorkflowLibraryMenu/NewWorkflowMenuItem';
import SaveWorkflowAsMenuItem from 'features/workflowLibrary/components/WorkflowLibraryMenu/SaveWorkflowAsMenuItem';
import SaveWorkflowMenuItem from 'features/workflowLibrary/components/WorkflowLibraryMenu/SaveWorkflowMenuItem';
import SettingsMenuItem from 'features/workflowLibrary/components/WorkflowLibraryMenu/SettingsMenuItem';
import UploadWorkflowMenuItem from 'features/workflowLibrary/components/WorkflowLibraryMenu/UploadWorkflowMenuItem';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PiDotsThreeOutlineFill } from 'react-icons/pi';

const WorkflowLibraryMenu = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shift = useShiftModifier();
  useGlobalMenuClose(onClose);
  return (
    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <MenuButton
        as={IconButton}
        aria-label={t('workflows.workflowEditorMenu')}
        icon={<PiDotsThreeOutlineFill />}
        pointerEvents="auto"
      />
      <MenuList pointerEvents="auto">
        <NewWorkflowMenuItem />
        <UploadWorkflowMenuItem />
        <MenuDivider />
        <SaveWorkflowMenuItem />
        <SaveWorkflowAsMenuItem />
        <DownloadWorkflowMenuItem />
        <MenuDivider />
        <SettingsMenuItem />
        {shift && <MenuDivider />}
        {shift && <LoadWorkflowFromGraphMenuItem />}
      </MenuList>
    </Menu>
  );
};

export default memo(WorkflowLibraryMenu);
