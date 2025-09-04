import React from 'react'
import PropTypes from 'prop-types'
import '../../index.css'

const Title = ({text2}) => {
  return (
    <div>  
        <p className='text-[#F4952C] mt-20 text-center text-[35px] mb-3 font-pacifico'>{text2}</p>
    </div>
  )
}

Title.propTypes = {
  text2: PropTypes.string.isRequired,
}

export default Title
