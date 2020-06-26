import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function HomeCarousel() {
      return (
        <Carousel>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="First slide"
                />
                <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt=" slide"
                />
                <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://images.pexels.com/photos/318540/pexels-photo-318540.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt=" slide"
                />
                <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
        
    );
}
  
const Home = () => ( 
    <div>
        <h1>Welcome to AWS Amplify!</h1>
        <HomeCarousel/>
    </div>
);
export default Home;
