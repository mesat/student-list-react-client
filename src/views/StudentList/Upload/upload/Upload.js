import React, { Component } from "react";
import Dropzone from "../dropzone";
import "./Upload.css";
import Progress from "../progress";
import * as upload from '../../../../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import { request } from "https";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    console.log (`upload actions: ${this.props.actions}`)
    const { upload } = this.props.actions;
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      console.log(`starting upload file`)
      promises.push(this.sendRequest(file).then((result) => 
      {
        console.log (`file upload result:`)
        console.log(result)
        upload(result)
        console.log (`file upload result: ${result}`)
      }));
    });
    try {
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
      console.log(`successfully uploaded: ${this.state.successfullUploaded} uploading ${this.state.uploading}`)
    } catch (e) {
      
      console.log(`error on post-uploadfiles ${e}`)
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file) {
    console.log (`sending file request`)
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.responseType = "json"
      req.onload = ()=>{
        console.log(`request load eventListener started`)
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        var jsonResponse = req.response;
        console.log (jsonResponse)
        resolve(jsonResponse);

        console.log(`request load eventListener completed`)
        console.log(req)
        console.log(req.response)

      }
   
      req.upload.addEventListener("load", event => {
        
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file, file.name);

      req.open("POST", "http://localhost:8080/upload");
      req.send(formData);
      console.log("sendRequest finished")
    })
    
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <button
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Temizle
        </button>
      );
    } else {
      return (
        <button
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Yükle
        </button>
      );
    }
  }

  render() {
    return (
      <div className="Upload">
        <span className="Title">Excel'den Veri Aktarımı</span>
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map(file => {
              return (
                <div key={file.name} className="Row">
                  <span className="Filename">{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  }
}

const { object } = PropTypes;

Upload.propTypes = {
    actions: object.isRequired    
  };

  const mapDispatch = (dispatch) => {
    return {
      actions: bindActionCreators(upload, dispatch)
    };
  };

export default connect(null,mapDispatch)(Upload);