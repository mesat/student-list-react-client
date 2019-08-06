import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';



const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
class Login extends Component {


  constructor(props) {
    super(props)

  }
  


  render() {
    console.log(this.props)
    const isAuthenticated = this.props.isAuthenticated;
    console.log(`Login render started with isAuth: ${isAuthenticated}`)

    if (isAuthenticated) {
      console.log(`authenticated`)
      return (
        <Redirect to="/" />
      )

    } else return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button onClick={(e)=>{e.preventDefault();this.props.dispatch(signin())}} color="primary" className="px-4">Login</Button>
                    

                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                          
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(signin, dispatch) }
}
const mapStateToProps = state=>  {
  console.log(state)
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

// const mapDispatchToProps = dispatch => bindActionCreators(signin, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Login);
