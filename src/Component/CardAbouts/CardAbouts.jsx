import React from 'react'
import "./CardAbouts.css"
function CardAbouts({svg, title, desc}) {
  return (
    <div className='mainCardAboutSection'>
        <div className='ImageContainerAboutSection'>
            <img src={svg} alt={title}  className='imgCardAbout'/>
        </div>
        <div>
            <h3 className='TitleCardAboutUsSection'>{title}</h3>
            <p className='DescCardAboutUsSection'>{desc}</p>
        </div>
    </div>
  )
}

export default CardAbouts