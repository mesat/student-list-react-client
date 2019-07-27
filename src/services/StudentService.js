import Configuration from "./Configuration";
import  { Component } from 'react'


class StudentService extends Component{
   
    constructor() {
        super();
        console.log("constructor start");
        this.config = new Configuration();
        console.log("constructor finish");
      }
      async retrieveStudents(name) {
        
        
        let parameters = "?";
        if (name!==undefined){
          if (isNaN(name))
          parameters+=`name=${name}`
          else
          parameters+=`number=${name}`
        }
        let url = this.config.STUDENT_COLLECTION_URL;
        if (parameters!=="?"){
          url+=parameters
        }
        console.log(url)
                return fetch(url,{
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
        return fetch(studentId)
          .then(response => {
            if (!response.ok) {
                this.handleResponseError(response);
            }
            return response.json();
          })
          .then(student => {
              student["link"] = student._links.self.href;
              return student;
            }
          )
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
        console.log("StudentService.updateStudent():");
        console.log(student);
        return fetch(student.link, {
          method: "PUT",
          mode: "cors",
          headers: {
                "Content-Type": "application/json"
              },
          body: JSON.stringify(student)
        })
          .then(response => {
            if (!response.ok) {
              this.handleResponseError(response);
            }
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

