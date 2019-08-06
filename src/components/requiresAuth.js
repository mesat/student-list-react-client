import React from 'react';  
import { connect } from 'react-redux';  
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

export default function (ComposedComponent) {  
  class Authenticate extends React.Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool,
      redirect: PropTypes.func.isRequired
    };

    componentDidMount() {
      this._checkAndRedirect();
    }

    componentDidUpdate() {
      this._checkAndRedirect();
    }

    _checkAndRedirect() {
      const { isAuthenticated, redirect } = this.props;

      if (!isAuthenticated) {
        //redirect();
      }
    }

    render() {
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
  
  const mapDispatchToProps = dispatch => bindActionCreators({
    //redirect: () => push('/login')
  }, dispatch)
  

  return connect(
    mapStateToProps, 
    null
  )(Authenticate);
}