import Configuration from "./Configuration";
import { Component } from 'react'


class StudentService extends Component {

  constructor() {
    super();
    console.log("constructor start");
    this.config = new Configuration();
    console.log("constructor finish");
  }
  async retrieveStudents(name, page, limit) {


    let parameters = "?";
    if (page === undefined) {
      page = "0"

    }
    if (limit === undefined) {
      limit = 10;
    }
    parameters += `p=${page}&l=${limit}`
    if (name !== undefined) {
      if (isNaN(name))
        parameters += `&name=${name}`
      else
        parameters += `&number=${name}`
    }
    let url = this.config.STUDENT_COLLECTION_URL;
    if (parameters !== "?") {
      url += parameters
    }
    console.log(url)
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .then(json => {
        console.log("Retrieved students:");
        console.log(json);
        return json;
      })
      .catch(error => {
        this.handleError(error);
      });



  }
  async getStudent(studentId) {
    console.log("StudentService.getStudent():");
    console.log("Student: " + studentId);
    let url = this.config.STUDENT_GET_URL+studentId;
    return fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .then(json => {
        console.log("Retrieved students:");
        console.log(json);
        return json;
      })
      .catch(error => {
        this.handleError(error);
      });
  }
  async createStudent(newstudent) {
    console.log("StudentService.createStudent():");
    console.log(newstudent);
    return fetch(this.config.STUDENT_COLLECTION_SET_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newstudent)
    })
      .then(response => {
        if (!response) {
          this.handleResponseError(response);
        }
        console.log(response)
        return response.json();
      })
      .catch(error => {
        this.handleError(error);
      });
  }
  async sendRequest(newStudent) {
    let idCard = newStudent.idCard;
    let photo = newStudent.photo;
    let medicalReport = newStudent.medicalReport;
    let birthCertificate = newStudent.birthCertificate;
    console.log(`sending file request`)
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();



      req.responseType = "json"
      req.onload = () => {
        console.log(`request load eventListener started`)
        var jsonResponse = req.response;
        console.log(jsonResponse)
        resolve(jsonResponse);

        console.log(`request load eventListener completed`)
        console.log(req)
        console.log(req.response)

      }

      req.upload.addEventListener("load", event => {

      });

      req.upload.addEventListener("error", event => {

        reject(req.response);
      });

      const formData = new FormData();
      console.log(this.fileListToArray(idCard)[0])
      if (isNaN(idCard))
        formData.append("idCard", this.fileListToArray(idCard)[0], "idCard");
      if (isNaN(photo))
        formData.append("photo", this.fileListToArray(photo)[0], "photo");
      if (isNaN(medicalReport))
        formData.append("medicalReport", this.fileListToArray(medicalReport)[0], "medicalReport");
      if (isNaN(birthCertificate))
        formData.append("birthCertificate", this.fileListToArray(birthCertificate)[0], "birthCertificate");
      console.log(newStudent)
      if (isNaN(newStudent)) {
        console.log(newStudent)
      } 
      formData.append("student", newStudent);


      console.log(formData.values())
      req.open("POST", this.config.STUDENT_COLLECTION_SET_URL);
      req.send(formData);
      req.
      console.log("sendRequest finished")
    })

  }
  fileListToArray(list) {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  }
  
  async deleteStudent(studentlink) {
    console.log("StudentService.deleteStudent():");
    console.log("student: " + studentlink);
    return fetch(studentlink, {
      method: "DELETE",
      mode: "cors"
    })
      .then(response => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
      })
      .catch(error => {
        this.handleError(error);
      });
  }
  async updateStudent(student) {
    console.log("StudentService.createStudent():");
    console.log(student);
    return fetch(this.config.STUDENT_COLLECTION_SET_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    })
      .then(response => {
        if (!response) {
          this.handleResponseError(response);
        }
        console.log(response)
        return response.json();
      })
      .catch(error => {
        this.handleError(error);
      });
  }
  handleResponseError(response) {
    throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
    console.log(error.message);
  }
}
export default StudentService;

