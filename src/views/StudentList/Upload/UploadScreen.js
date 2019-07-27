import React, { Component } from "react";
import "./UploadScreen.css";
import Upload from "./upload/Upload";

class UploadScreen extends Component {
  render() {
    return (
      
      <div className="UploadScreen">
        <div className="Card">
          <Upload />
        </div>
      </div>
    );
  }
}

export default UploadScreen;