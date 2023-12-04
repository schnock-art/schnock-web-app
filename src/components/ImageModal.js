import PropTypes from 'prop-types';
import { StorageImage } from '@aws-amplify/ui-react-storage';

// ImageModal component displays an image from AWS Amplify's storage.
// Props:
// - imgKey: Key of the image in storage.
// - onClose: Function to call when the modal is closed.

//const IMAGE_FILE_REGEX = /\.(jpg|JPG|png)$/;

const ImageModal = ({ imgKey, onClose }) => {
    //if (!imgKey || !IMAGE_FILE_REGEX.test(imgKey)) {
    //    return null;
    //}
    
    return (
      <div className="image-modal" onClick={onClose}>
        <StorageImage
          imgKey={imgKey}
          accessLevel="public"
          className="image-storage" // Using class for styling
        />
      </div>
    );
};

ImageModal.propTypes = {
    imgKey: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default ImageModal;
