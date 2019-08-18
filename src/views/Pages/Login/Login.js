import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as sessionActions from '../../../redux/actions';



const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      user: {
        email: '',
        password: ''
      },
      authenticated:false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(history) {
    const { user } = this.state;
    const { login } = this.props.actions;
    console.log(login)
    login(user, history);
  }

  onChange(e) {
    const { value, name } = e.target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }


  render() {
    const { user: { email, password },authenticated } = this.state;
    console.log(this.props)
    // const isAuthenticated = this.props.isAuthenticated;
    console.log(`Login render started with isAuth: ${authenticated}`)


    const SubmitButton = withRouter(({ history }) => (
      <Button
        onClick={() => this.onSubmit(history)}
        color="primary" 
        className="px-4">Giriş Yap
      </Button>
    ));

    if (authenticated) {
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
                        <Input
                          name="email"
                          value={email}
                          label="Email"
                          type="email"
                          onChange={this.onChange}
                          placeholder="Username"
                          autoComplete="username"
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          name="password"
                          value={password}
                          label="Password"
                          onChange={this.onChange}
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          {/* <Button onClick={(e) => { e.preventDefault(); this.props.dispatch(signin()) }} color="primary" className="px-4">Login</Button> */}
                          <SubmitButton/>

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

// //not need to use dispatch https://react-redux.js.org/using-react-redux/connect-mapdispatch
// // function mapDispatchToProps(dispatch) {
// //   return { actions: bindActionCreators(signin, dispatch) }
// // }
// const mapStateToProps = state => {
//   console.log(state)
//   return {
//     isAuthenticated: state.auth.isAuthenticated
//   };
// };

// Login.propTypes = propTypes;
// Login.defaultProps = defaultProps;

// // const mapDispatchToProps = dispatch => bindActionCreators(signin, dispatch)

// export default connect(mapStateToProps)(Login);


const { object } = PropTypes;

Login.propTypes = {
  actions: object.isRequired
};

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(null, mapDispatch)(Login);
