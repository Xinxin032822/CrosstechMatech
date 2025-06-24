import React from 'react'
import "../Styles/About.css"
import CardAbouts from '../Component/CardAbouts/CardAbouts'


function About() {

  const products = [
    {
      image: 'src/assets/img/award.svg',
      title: 'Hydraulic Excavator',
      description: 'High-performance excavator for construction and earthmoving projects',
    },
    {
      image: 'src/assets/img/handshake.svg',
      title: 'Tower Crane',
      description: 'Heavy-duty tower crane for high-rise construction projects',
    },
    {
      image: 'src/assets/img/shipping-fast.svg',
      title: 'Bulldozer',
      description: 'Powerful bulldozer for earthmoving and site preparation',
    },
    
  ];

  return (
    <div className='MainElementClass'>
      
      <div className='MainClassUpperSection'>
        <div className='HeaderSectionMainClassUpperSection'>
          <p className='FirstHeaderTitleMainClass'>About Matech</p>
          <p className='HeaderDescMainClass'>Discover our story, values, and commitment to excellence in heavy equipment <br /> solutions across the Philippines</p>
        </div>
        <div className='HeaderSectionMainClassUpperSection'>
          <p className='SecondHeaderTitleMainClass'>Our Mission</p>
          <p className='HeaderDescMainClass'>Founded in the heart of Davao, Matech has been at the forefront of providing premium heavy equipment <br /> solutions to businesses across the Philippines. Our mission is to empower industries with reliable, high <br />-quality machinery that drives productivity and success.</p>
          <p className='HeaderDescMainClass'>From our humble beginnings in Davao, we've grown into a trusted partner for construction companies, <br /> mining operations, and industrial enterprises nationwide. We believe in building lasting relationships <br /> through exceptional service and unwavering commitment to quality.</p>
        </div>
      </div>

      <div className='OurCoreValuesSection'>
        <div className='CardSectionAboutUsMain'>
          {products.map((item, index) => (
            <CardAbouts
              key={index}
              svg={item.image}
              title={item.title}
              desc={item.description}
            />
          ))}
        </div>
      </div>

      <div className='OurTeamSectionAboutPage'>
          <div className='FirstChildOurTeamSectionAboutPage'>
            <p className='OurTeamHeaderTitle'>Our Team</p>
            <p className='OurTeamHeaderDesc'>Behind Matech's success is a dedicated team of professionals who bring decades of combined experience in heavy equipment and industrial solutions. Our experts understand the unique challenges faced by Filipino businesses and work tirelessly to provide tailored solutions. From our sales consultants to our technical support staff, every team member is committed to delivering exceptional service and building long-term partnerships with our clients.</p>
          </div>
          <div className='SecondChildOurTeamSectionAboutPage'>
            <img src="src\assets\ourTeam.png" alt="About our team" className='About-Our-Team-Image'/>
          </div>
      </div>

      <div className='OurFacilities'>
          <div className="ChildOurFacilitiesSEctionAboutPage">
            <img src="src\assets\ourFacilities.png" alt="" />
          </div>
          <div className="ChildOurFacilitiesSEctionAboutPage">
            <p>Our Facilities</p>
            <p>Our state-of-the-art facility in Davao serves as the hub for our operations across the Philippines. Equipped with modern storage, maintenance bays, and logistics capabilities, we ensure every piece of equipment is properly maintained and ready for deployment. Our strategic location allows us to efficiently serve clients from Luzon to Mindanao, with dedicated logistics partners ensuring safe and timely delivery of equipment to any location in the Philippines.</p>
            <ul>
              <li className="ListOurFacilities">Climate-controlled storage facility</li>
              <li className="ListOurFacilities">On-site maintenance and inspection</li>
              <li className="ListOurFacilities">Nationwide delivery network</li>
            </ul>
          </div>
      </div>
    </div>
  )
}

export default About