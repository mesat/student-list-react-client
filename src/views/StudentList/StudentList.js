import React, { Component } from 'react';
import ReactModal from 'react-modal';
import {
    Badge, Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Input,
    InputGroup, InputGroupAddon, Pagination, PaginationItem, PaginationLink, Row, Table
} from 'reactstrap';
import StudentService from '../../services/StudentService';
import "./style.css";
import PropTypes from 'prop-types'
import UploadScreen from './Upload/UploadScreen';

const stdcolumntype = {
    id: '',
    name: 'name',
    surname: 'surname',
    teacher: 'teacher',
    stdclass: 'stdclass',
    stdnumber: 'stdnumber',
    schoolstatus:'schoolStatus',
    city:'city'
}


class StudentList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            stdcolumntype: PropTypes.oneOf(['id', 'name', 'surname', 'teacher', 'stdclass', 'stdnumber','schoolStatus','city']),
            actualType: PropTypes.oneOf(['id', 'name', 'surname', 'teacher', 'stdclass', 'stdnumber','schoolStatus','city']),
            students: [],
            loading: true,
            newRecord: false,
            newStudent: { name: "", surname: "", teacher: "", stdclass: "", stdnumber: "" ,schoolStatus:"",city:""},
            onInput: false,
            showModal: false
        }
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleOnBlur = this.handleOnBlur.bind(this)
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        console.log('constructr')
        this.studentService = new StudentService();


    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }
    handleOnBlur(event, type) {

        if (type === this.state.actualType) {

            console.log("handleOnBlur1")
            console.log(this.state.actualType)
            console.log("handleOnBlur2")
            console.log(this.state.newStudent)
            console.log(type)
            console.log(event.target.value)
            this.setState({
                newStudent: { ...this.state.newStudent, [type]: event.target.value },
                onInput: false,
                actualType: stdcolumntype.id
            })
            console.log(this.state.newStudent)
            console.log("handleOnBlur3")
            console.log(this.state.actualType)
        }

    }
    handleOnClick(type) {
        console.log("handleOnClick1")
        console.log("handleOnClick2")
        console.log(type)
        this.setState({
            onInput: true,
            actualType: type

        })
        console.log("handleOnClick3")
        console.log("actual type: ")

        console.log("handleOnClick4")
        console.log(this.state.actualType)
    }

    getStudents = (event) => {
        console.log(`loading: ${this.state.loading}`)
        console.log(event)
        console.log(`getStudent event.target.value: ${event}`)
        this.setState({ loading: true })
        this.studentService.retrieveStudents(event === undefined ? event : event.target.value).then(students => {
            console.log(`loading: ${this.state.loading}`)
            console.log(`retrieved students: ${students}`)

            if (students) {
                this.setState({ students: students });
                this.setState({ loading: false });

            }
            console.log(`this.state.students: ${this.state.students}`)
        }
        )
        // .then(res =>{
        //     console.log(`loading: ${this.state.loading}`)
        //     this.setState({ loading: false })});
        // console.log(`loading: ${this.state.loading}`)
    }
    setStudent = () => {
        console.log(`creating student: ${this.state.newStudent}`);
        this.setState({ loading: true });
        this.studentService.createStudent(this.state.newStudent).then(response => {
            console.log(`then response: ${response}`);
            if (response.ok) {
                console.log("response ok")
            }
            else
                console.log("response false")
            this.setState({ newRecord: false });

        }
        ).then(this.getStudents());

    }
    componentDidMount() {
        this.getStudents();

        ReactModal.setAppElement('#mainclass1')

    }


    Form(onInput, eventClick, eventBlur, datatype) {

        if (datatype === this.state.actualType) {
            if (onInput) {
                console.log(onInput)
                console.log("Form creation datatype: ")
                console.log(datatype)
                return (
                    <td className="tdElem" onClick={() => eventClick(datatype)} >
                        <div>
                            <input autoComplete autoFocus defaultValue={this.state.newStudent[datatype]}
                                className="col-sm-4 input" type="text" onBlur={(event) => eventBlur(event, datatype)} />
                        </div>
                    </td>

                )
            }

        }
        else {
            //console.log(`this.state.newStudent.${datatype}`)
            console.log(this.state.newStudent)
            return (
                <td onClick={() => eventClick(datatype)} >
                    {this.state.newStudent[datatype]}
                    {/* {`this.state.newStudent.${datatype}`}  */}
                </td>
            )
        }



    }
    fillTable(load, stud) {
        if (load) {
            console.log("loading")
            return <tr>loading</tr>
        }
        else {
            return stud.map((student) => {
                // console.log(`loading: ${this.state.loading}`)
                // console.log(`return list ${this.state.students} ${student.id}`)
                console.log(`return list ${student.id}`)
                return (

                    <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.surname}</td>
                        <td>{student.stdclass}</td>
                        <td>{student.schoolStatus}</td>
                        <td>{student.stdnumber}</td>
                        <td>{student.teacher}</td>
                        <td>{student.city}</td>
                        <td>
                            <Button size="sm" color="primary"><i className="cui-calendar"></i></Button>
                            <Button size="sm" color="primary"><i className="cui-pencil"></i></Button>
                            <Button size="sm" color="primary"><i className="cui-options"></i></Button>
                        </td>
                    </tr>);
            })
        }

    }
    newRecordButtons = (newRecords) => {
        console.log(`newRecord: ${newRecords}`);

        if (newRecords === true) {
            return (<Row className="align-items-center">
                <Col col="3" offset-sm-1 sm="2" md="2" xl className="mb-3 mb-xl-0">
                    <ButtonToolbar >

                        <Button onClick={this.setStudent} size="sm" color="primary"><i className="fa fa-file-excel-o"></i>Kaydet</Button>
                        <Button onClick={() => this.setState({ 'newRecord': "false" })} size="sm" color="primary"><i className="cui-print"></i>Iptal</Button>
                    </ButtonToolbar>

                </Col>
            </Row>)
        }
        return (null)
    }

    newRecordRow() {
        if (this.state.newRecord === true) {
            return (
                <tr  >
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.name)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.surname)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdclass)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolstatus)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdnumber)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.teacher)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.city)}



                    <td>
                        <Button size="sm" color="primary"><i className="cui-calendar"></i></Button>
                        <Button size="sm" color="primary"><i className="cui-pencil"></i></Button>
                        <Button size="sm" color="primary"><i className="cui-options"></i></Button>
                    </td>
                </tr>)
        }
        else {
            console.log("returned null for newRecordRow")
            return null
        }

    }


    render() {


        const stud = this.state.students;
        const newRecords = this.state.newRecord;
        console.log(`stud: ${stud}`);
        console.log(`loading: ${this.state.loading}`)
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };



        return (
            <div className="animated fadeIn">
                <Row  >
                    <Col>
                        <Card >
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Hafizlik Ogrenci Listesi
                                <div className="card-header-actions">
                                    {/*eslint-disable-next-line*/}
                                    <a onClick={this.handleOpenModal} className="card-header-action btn btn-setting"><i className="icon-settings"></i></a>
                                    <ReactModal
                                        isOpen={this.state.showModal}
                                        contentLabel="Minimal Modal Example"
                                        onRequestClose={this.handleCloseModal}
                                        shouldCloseOnOverlayClick={true}
                                        style={{
                                            overlay: {
                                                backgroundColor: 'papayawhip'
                                            },
                                            content: {
                                                color: 'lightsteelblue',
                                                top: '50%',
                                                left: '50%',
                                                right: 'auto',
                                                bottom: 'auto',
                                                marginRight: '-50%',
                                                transform: 'translate(-50%, -50%)',
                                                height: '500px', // <-- This sets the height
                                                overlfow: 'scroll' // <-
                                            }
                                        }}


                                    >
                                        <div><UploadScreen ></UploadScreen></div>
                                        <div>
                                            <button onClick={this.handleCloseModal}>Close Modal</button>
                                        </div>
                                    </ReactModal>
                                    {/*eslint-disable-next-line*/}
                                    <a onClick={this.handleCloseModal} className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></a>
                                    {/*eslint-disable-next-line*/}
                                    <a onClick={this.createModal} className="card-header-action btn btn-close" ><i className="icon-close"></i></a>

                                </div>
                            </CardHeader>
                            <CardBody id='mainclass1'>
                                <p>
                                    <Row className="align-items-center">
                                        <Col col="3" offset-sm-1="true" sm="2" md="2" xl className="mb-3 mb-xl-0">
                                            <ButtonToolbar >
                                                <Button id="yeniKayit" disabled={false} onClick={() => this.setState({ "newRecord": true })} size="sm" color="primary"><i className="cui-print"></i>Yeni Kayit</Button>

                                                <Button size="sm" color="primary"><i className="cui-paperclip"></i>Kopyala</Button>

                                                <Button size="sm" color="primary"><i className="fa fa-file-excel-o"></i>Excele Kaydet</Button>

                                                <Button size="sm" color="primary"><i className="cui-print"></i>Yazdir</Button>
                                            </ButtonToolbar>

                                        </Col>
                                        <div className="controls">
                                            <InputGroup>
                                                <Input onChange={this.getStudents} id="appendedInputButton" size="16" type="text" />
                                                <InputGroupAddon addonType="append">
                                                    <Button onClick={this.getStudents} color="secondary">Git!</Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </Row>
                                    <h6></h6>
                                    {this.newRecordButtons(newRecords)}

                                </p>

                                <Table hover bordered striped responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>Ad</th>
                                            <th>Soyad</th>
                                            <th>Sinif</th>
                                            <th>Durum</th>
                                            <th>No</th>
                                            <th>Ogretmen</th>
                                            <th>Sehir</th>
                                            <th>Islemler</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.newRecordRow()
                                        }
                                        {
                                            this.fillTable(this.state.loading, stud)



                                        }
                                    </tbody>
                                </Table>
                                <nav>
                                    <Pagination>
                                        <PaginationItem><PaginationLink previous tag="button">Onceki</PaginationLink></PaginationItem>
                                        <PaginationItem active>
                                            <PaginationLink tag="button">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink next tag="button">Sonraki</PaginationLink></PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}


export default StudentList;
