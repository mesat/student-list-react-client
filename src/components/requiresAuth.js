import React from 'react';  
import { connect } from 'react-redux';  
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";

export default function (ComposedComponent) {  
  class Authenticate extends React.Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool,
      // redirect: PropTypes.func.isRequired
    };

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
      const { isAuthenticated} = this.props;
      console.log(isAuthenticated)
      if (!isAuthenticated) {
        return(
          <Redirect to="/login" />
        )
        
      }
      console.log("ComposedComponent")
      console.log(ComposedComponent)
      return (
        <div>
          { this.props.isAuthenticated ? <ComposedComponent {...this.props} /> : null }
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  };
  
  // const mapDispatchToProps = dispatch => bindActionCreators({
    
  //   redirect: 
  //   () => {
  //      console.log(`push signin`);
  //     push('/signin')}
  //  }
  // , dispatch)
  

  return connect(
    mapStateToProps
  )(Authenticate);
}