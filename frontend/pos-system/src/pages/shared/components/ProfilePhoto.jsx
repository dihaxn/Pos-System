import PropTypes from "prop-types";

const ProfilePhoto = ({ src, alt, size = 24, border = true }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden ${
        border ? "border-4 border-pink-300 shadow-lg" : ""
      }`}
      style={{ width: `${size}rem`, height: `${size}rem` }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

ProfilePhoto.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  border: PropTypes.bool,
};

export default ProfilePhoto;
