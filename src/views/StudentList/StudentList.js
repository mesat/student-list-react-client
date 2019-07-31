import React, { Component } from 'react';
import ReactModal from 'react-modal';
import AutosizeInput from 'react-input-autosize';
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
    schoolstatus: 'schoolStatus',
    city: 'city'
}


class StudentList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            stdcolumntype: PropTypes.oneOf(['id', 'name', 'surname', 'teacher', 'stdclass', 'stdnumber', 'schoolStatus', 'city']),
            actualType: PropTypes.oneOf(['id', 'name', 'surname', 'teacher', 'stdclass', 'stdnumber', 'schoolStatus', 'city']),
            students: [],
            loading: true,
            newRecord: false,
            newStudent: { id:"",name: "", surname: "", teacher: "", stdclass: "", stdnumber: "", schoolStatus: "", city: "" },
            onInput: false,
            showModal: false,
            onInputIsCurrent: false,
            editRowId: ""
        }
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleOnBlur = this.handleOnBlur.bind(this)
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
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
        console.log(`handleonBLur`)
        console.log(this.state.newStudent)

        if (type === this.state.actualType) {

            console.log("handleOnBlur1")
            console.log(this.state.actualType)
            console.log("handleOnBlur2")
            console.log(this.state.newStudent)
            console.log(type)
            console.log(event.target.value)
            if (this.state.onInputIsCurrent) {
                this.setState({
                    newStudent: { ...this.state.newStudent, [type]: event.target.value },
                    actualType: stdcolumntype.id
                })
            }
            else
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
            actualType: type

        })
        if (this.state.newRecord && !this.state.onInputIsCurrent) {

            this.setState({
                onInput: true,

            })
        }       
        console.log("handleOnClick3")
        console.log("actual type: ")

        console.log("handleOnClick4")
        console.log(this.state.actualType)
    }
    handleOnChange(type,event) {
        console.log(event.target.value)
        console.log(this.state.newRecord)
        console.log(this.state.onInputIsCurrent)
       
        if (!this.state.newRecord && this.state.onInputIsCurrent) {

            this.setState({
                newStudent: { ...this.state.newStudent, [type]: event.target.value }

            })
            console.log(this.state.newStudent.name)
            console.log(type)
        }
       
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


    Form(onInput, eventClick, eventBlur, datatype, onInputIsCurrent) {
        if (onInputIsCurrent) {
            console.log(`oninputiscurrent in Form: ${onInputIsCurrent}`)

            return (
                <div className="divTableCell"  >

                    <AutosizeInput minLength={5} minWidth={5} autoComplete onClick={() => eventClick(datatype)} autoFocus value={this.state.newStudent[datatype]}
                        onChange={this.handleOnChange.bind(this,datatype)} onBlur={(event) => eventBlur(event, datatype)} />

                </div>

            )
        }

        if (datatype === this.state.actualType) {
            if (onInput) {
                console.log(onInput)
                console.log("Form creation datatype: ")
                console.log(datatype)
                return (
                    <div className="divTableCell" onClick={() => eventClick(datatype)} >

                        <AutosizeInput autoComplete autoFocus defaultValue={this.state.newStudent[datatype]}
                            onBlur={(event) => eventBlur(event, datatype)} />

                    </div>

                )
            }


        }
        else {
            //console.log(`this.state.newStudent.${datatype}`)
            console.log(this.state.newStudent)
            return (
                <div className="divTableCell" onClick={() => eventClick(datatype)} >
                    {this.state.newStudent[datatype]}
                    {/* {`this.state.newStudent.${datatype}`}  */}
                </div>
            )
        }



    }
    fillTable(load, stud) {
        if (load) {
            console.log("loading")
            return <div>loading</div>
        }
        else {
            return stud.map((student) => {
                // console.log(`loading: ${this.state.loading}`)
                // console.log(`return list ${this.state.students} ${student.id}`)
                console.log(`return list ${student.id}`)
                if (!this.state.onInput && this.state.onInputIsCurrent && this.state.editRowId === student.id) {
                    if (student.id !== this.state.newStudent.id) {//if we set the values before we should not set again to be able to change the new values
                        this.state.newStudent = student;// don't render
                        
                    }



                    return (
                        <div className="divTableRow" key={student.id}>
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.name, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.surname, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdclass, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolstatus, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdnumber, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.teacher, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.city, this.state.onInputIsCurrent)}



                            <div className="divTableCell">
                                <Button size="sm" color="primary"><i className="cui-check"></i></Button>
                                <Button size="sm" color="primary"><i className="cui-circle-x"></i></Button>
                                <Button size="sm" color="primary"><i className="cui-trash"></i></Button>
                            </div>

                        </div>);
                }

                return (

                    <div className="divTableRow" key={student.id}>
                        <div className="divTableCell">{student.name}</div>
                        <div className="divTableCell">{student.surname}</div>
                        <div className="divTableCell">{student.stdclass}</div>
                        <div className="divTableCell">{student.schoolStatus}</div>
                        <div className="divTableCell">{student.stdnumber}</div>
                        <div className="divTableCell">{student.teacher}</div>
                        <div className="divTableCell">{student.city}</div>
                        <div className="divTableCell">
                            <Button size="sm" color="primary"><i className="cui-calendar"></i></Button>
                            <Button onClick={() => { this.setState({ editRowId: student.id, onInputIsCurrent: true, onInput: false, newRecord: false }) }} size="sm" color="primary"><i className="cui-pencil"></i></Button>
                            <Button size="sm" color="primary"><i className="cui-options"></i></Button>
                        </div>
                    </div>);
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
        if (this.state.newRecord === true && !this.state.onInputIsCurrent) {
            return (
                <div className="divTableRow">
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.name)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.surname)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdclass)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolstatus)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdnumber)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.teacher)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.city)}



                    <div className="divTableCell">
                        <Button size="sm" color="primary"><i className="cui-calendar"></i></Button>
                        <Button size="sm" color="primary"><i className="cui-pencil"></i></Button>
                        <Button size="sm" color="primary"><i className="cui-options"></i></Button>
                    </div>
                </div>)
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
                                <i className="fa fa-align-justify"></i> Öğrenci Listesi
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
                                            <button onClick={this.handleCloseModal}>Kapat</button>
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
                                                <Button id="yeniKayit" disabled={false} onClick={() => this.setState({ "newRecord": true, "onInputIsCurrent": false, "onInput": true })} size="sm" color="primary"><i className="cui-print"></i>Yeni Kayit</Button>

                                                <Button size="sm" color="primary"><i className="cui-paperclip"></i>Kopyala</Button>

                                                <Button size="sm" color="primary"><i className="fa fa-file-excel-o"></i>Excele Kaydet</Button>

                                                <Button size="sm" color="primary"><i className="cui-print"></i>Yazdir</Button>
                                            </ButtonToolbar>

                                        </Col>
                                        <div className="controls">
                                            <InputGroup>
                                                <Input onChange={this.getStudents} id="appendedInputButton" size="16" type="text" />
                                                <InputGroupAddon addonType="append" >
                                                    <Button onClick={this.getStudents} color="secondary">Git!</Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </Row>
                                    <h6></h6>
                                    {this.newRecordButtons(newRecords)}

                                </p>

                                <div className="divTable blueTable">
                                    <div className="divTableHeading">
                                        <div className="divTableRow">
                                            <div className="divTableHead">Ad</div>
                                            <div className="divTableHead">Soyad</div>
                                            <div className="divTableHead">Sınıf</div>
                                            <div className="divTableHead">Durum</div>
                                            <div className="divTableHead">No</div>
                                            <div className="divTableHead">Öğretmen</div>
                                            <div className="divTableHead">Şehir</div>
                                            <div className="divTableHead">İşlemler</div>
                                        </div>
                                    </div>
                                    {
                                        this.newRecordRow()
                                    }
                                    {
                                        this.fillTable(this.state.loading, stud)
                                    }



                                    <nav>
                                        <Pagination>
                                            <PaginationItem><PaginationLink previous tag="button">Önceki</PaginationLink></PaginationItem>
                                            <PaginationItem active>
                                                <PaginationLink tag="button">1</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                                            <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                                            <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                                            <PaginationItem><PaginationLink next tag="button">Sonraki</PaginationLink></PaginationItem>
                                        </Pagination>
                                    </nav>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}


export default StudentList;
