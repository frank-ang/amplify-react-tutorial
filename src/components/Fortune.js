import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify'
import {decode} from 'html-entities';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Fortune (props) {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const apiName = 'FortuneApi';
    const path = '/fortune/redis'; 

    useEffect(() => {
        // no-op.
    });
    
    function getFortune(e) {
        e.preventDefault();
        console.log('Getting fortune...');
        API
          .get(apiName, path)
          .then(response => {
            // Add your code here
            console.log("### got API response...");
            setQuote(decode(response.Quote))
            setAuthor(response.Author)
            setGenre(response.Genre)
            console.log(response);
          })
          .catch(error => {
            console.log("### got error...");
            console.log(error);
         });
    }

    return (
        <div>
            <Card>
                <Card.Header>
                    Fortune
                    <Button variant="outline-primary" className="float-right" onClick={getFortune}>Get Fortune</Button>
                </Card.Header>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col sm="1" md="1" lg="1" xl="1">
                                <span style={{"color":"green", "font-size":"54px", "font-weight":"700", "font-family":"Georgia, Times New Roman, Times, serif", "margin-bottom":"-30px" }}>&ldquo;</span>
                            </Col>
                            <Col >
                                <blockquote class="blockquote text-left">
                                <p class="mb-0">
                                    {quote}
                                </p>
                                <footer class="blockquote-footer">{author}</footer>
                                </blockquote>

                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
                <Card.Footer className="text-muted">genre: {genre}</Card.Footer>
            </Card>
        </div>
    )
}
export default Fortune