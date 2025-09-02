// Centralized image imports using direct imports for better Vite compatibility
import closeButtonIcon from './icons/closeButton.png';
import loadImageIcon from './icons/LoadImage.png';
import cashierIcon from './icons/cashier.png';
import closeIcon from './orderhistory/close.png';
import backgroundImage from './orderhistory/bg2.jpg';
import footerImage from './footerimg.png';
import emptyImage from './Empty-image.jpg';

export const images = {
  // Icons
  closeButton: closeButtonIcon,
  loadImage: loadImageIcon,
  cashier: cashierIcon,
  
  // Order history
  closeIcon: closeIcon,
  backgroundImage: backgroundImage,
  
  // Other assets
  footerImage: footerImage,
  emptyImage: emptyImage,
};

// Default placeholder image
export const defaultImage = images.loadImage;
