import React from 'react';
import PropTypes from 'prop-types';
import './imagePreview.css';

export const ImagePreview = ({ dataUri, size }) => {
  var className;
  switch(size) {
    case "FULL":
      className="demo-image-preview-fullscreen"
      break;
    case "S":
      className="demo-image-preview-s"
      break;
    case "XS":
        className="demo-image-preview-xs"
        break;
    default:
      className="demo-image-preview"
  }

  return (
    <div className={className}>
      <img src={dataUri}/>
    </div>
  );
};

ImagePreview.propTypes = {
  dataUri: PropTypes.string,
  size: PropTypes.string,
};

export default ImagePreview;