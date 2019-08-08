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
      const { isAuthenticated} = this.props;
      // console.log(`isAuth: ${isAuthenticated}`)

      // if (!isAuthenticated) {
        
      // }
    }

    render() {
      if (!this.isAuthenticated) {
        return(
          <Redirect to="/login" />
        )
        
      }
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