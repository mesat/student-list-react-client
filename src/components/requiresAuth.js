import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";
import * as sessionActions from '../redux/actions';

export default function (ComposedComponent) {
  class Authenticate extends React.Component {
    // static propTypes = {
    //   authenticated: PropTypes.bool,
    //   // redirect: PropTypes.func.isRequired
    // };

    componentDidMount() {
      this._checkAndRedirect();
    }

    componentDidUpdate() {
      this._checkAndRedirect();
    }

    _checkAndRedirect() {
      // const { isAuthenticated, redirect  } = this.props;
      // console.log(`isAuth: ${isAuthenticated}`)

      // if (!isAuthenticated) {

      // }
    }

    render() {
      const { authenticated } = this.props;
      console.log(authenticated)
      if (!authenticated) {
        return (
          <Redirect to="/login" />
        )

      }
      console.log("ComposedComponent")
      console.log(ComposedComponent)
      return (
        <div>
          {this.props.authenticated ? <ComposedComponent {...this.props} /> : null}
        </div>
      );
    }
  }

  // const mapStateToProps = (state) => {
  //   return {
  //     isAuthenticated: state.auth.isAuthenticated
  //   };
  // };

  // const mapDispatchToProps = dispatch => bindActionCreators({

  //   redirect: 
  //   () => {
  //      console.log(`push signin`);
  //     push('/signin')}
  //  }
  // , dispatch)

  const { object, bool } = PropTypes;

  Authenticate.propTypes = {
    actions: object.isRequired,
    user: object.isRequired,
    authenticated: bool.isRequired
  };
  const mapState = (state) => ({
    user: state.session.user,
    authenticated: state.session.authenticated
  });

  const mapDispatch = (dispatch) => {
    return {
      actions: bindActionCreators(sessionActions, dispatch)
    };
  };


  return connect(
    mapState,mapDispatch
  )(Authenticate);
}