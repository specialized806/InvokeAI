import type { AppStartListening } from 'app/store/middleware/listenerMiddleware';
import { selectionChanged } from 'features/gallery/store/gallerySlice';
import { imagesApi } from 'services/api/endpoints/images';
import type { ImageDTO } from 'services/api/types';

export const addImagesUnstarredListener = (startAppListening: AppStartListening) => {
  startAppListening({
    matcher: imagesApi.endpoints.unstarImages.matchFulfilled,
    effect: (action, { dispatch, getState }) => {
      const { updated_image_names: unstarredImages } = action.payload;

      const state = getState();

      const { selection } = state.gallery;
      const updatedSelection: ImageDTO[] = [];

      selection.forEach((selectedImageDTO) => {
        if (unstarredImages.includes(selectedImageDTO.image_name)) {
          updatedSelection.push({
            ...selectedImageDTO,
            starred: false,
          });
        } else {
          updatedSelection.push(selectedImageDTO);
        }
      });
      dispatch(selectionChanged(updatedSelection));
    },
  });
};
