import React from 'react'
import './Title.css'

const Title = ({text1, text2}) => {
  return (
    <div className='title-container'>
        <p className='title-text'>
          <span className='title-text-primary'>{text1}</span>
          <span className='title-text-secondary'>{text2}</span>
        </p>
        <p className='title-line'></p>
    </div>
  )
}

export default Title