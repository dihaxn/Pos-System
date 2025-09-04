import PropTypes from 'prop-types'
import '../../index.css'

const Subtopic = ({text1}) => {
  return (
    <div>
      <p className='text-center text-[40px] font-bold mb-10 font-quicksand'>{text1}</p>
    </div>
  )
}

Subtopic.propTypes = {
  text1: PropTypes.string.isRequired,
}

export default Subtopic
