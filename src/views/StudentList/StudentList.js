import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import ReactModal from 'react-modal';
import AutosizeInput from 'react-input-autosize';
import {
    Alert, Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Input,
    InputGroup, InputGroupAddon, Pagination, PaginationItem, PaginationLink, Row
}
    from 'reactstrap';
import StudentService from '../../services/StudentService';
import "./StudentList.css";
import PropTypes from 'prop-types'
import UploadScreen from './Upload';
import { connect } from 'react-redux'
import Popup from "reactjs-popup";
import { bindActionCreators } from 'redux';
import * as upload from '../../redux/actions';



const StudentForm = React.lazy(() => import('../StudentForm'));


  

export const stdcolumntype = {
    id: '',
    schoolNo: 'schoolNo',
    name: 'name',
    surname: 'surname',
    teacher: 'teacher',
    stdclass: 'stdclass',
    no: 'no',
    schoolStatus: 'schoolStatus',
    city: 'city',
    fatherCell: 'fatherCell',
    motherCell: 'motherCell',
    address: 'address',
    healthInfo: 'healthInfo',
    systemStatus: 'systemStatus',
    photo: 'photo',
    idCard: 'idCard',
    medicalReport: 'medicalReport',
    birthCertificate: 'birthCertificate',
    referances: 'referances',
    fatherName:'fatherName',
    motherName:'motherName',
    fatherJob:'fatherJob',
    motherJob:'motherJob',
    documents:{}
}


class StudentList extends Component {

    constructor(props) {

        super(props)
        console.log('constructor starting')
        this.pageSize = 50;

        this.state = {
            stdcolumntype: PropTypes.oneOf(['id', 'schoolNo', 'name', 'surname', 'teacher', 'stdclass', 'no', 'schoolStatus', 'city']),
            actualType: PropTypes.oneOf(['id', 'schoolNo', 'name', 'surname', 'teacher', 'stdclass', 'no', 'schoolStatus', 'city']),
            students: [],
            loading: true,
            newRecord: false,
            newStudent: {
                id: "", schoolNo: "", name: "", surname: "", teacher: "", stdclass: "", no: "", schoolStatus: "", city: "", fatherCell:"",
                motherCell:"", address:"", healthInfo :"", systemStatus: false, photoPath: "", identityCard : "", healthReport: "", birthCertificate : "",
                referances: "", fatherName:"",motherName:"",fatherJob:"",motherJob:""
              },
            onInput: false,
            showModal: false,
            onInputIsCurrent: false,
            editRowId: "",
            currentPage: 0,
            totalCount: 150,
            //pagesCount : Math.ceil(this.state.totalCount / this.pageSize)
            open: false,
            textResponse: "",
            redirectToStudentForm :false

        }
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleOnBlur = this.handleOnBlur.bind(this)
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.studentService = new StudentService();
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        console.log('constructor finishing')


    }
    onDismiss() {
        this.setState({ visible: false });
      }
    openModal() {
        const { uploadResponse } = this.props
        const textResp = JSON.stringify(uploadResponse)
        this.setState({ textResponse: textResp });
        this.setState({ open: true });

    }
    closeModal() {
        const { upload } = this.props.actions;
        upload(null)
        this.setState({ open: false });
    }

    handlePageClick(e, index) {
        e.preventDefault();

        console.log(index)

        this.setState({
            currentPage: index
        }, () => this.pageClick());

    }
    pageClick() {

        console.log(`currentPage: ${this.state.currentPage}, pageSize: ${this.pageSize}`)
        this.getStudents(undefined, this.state.currentPage, this.pageSize)
        // this.incrementPages();

    }
    incrementPages() {

        //check if the last page is full (indicates that there may be more data)
        //increment the totalCount if the condition is true
        console.log(`currentPage: ${this.state.currentPage} , page: ${Math.ceil(this.state.totalCount / this.pageSize) - 1}`)
        if (this.state.currentPage >= Math.ceil(this.state.totalCount / this.pageSize) - 1) {
            console.log(`stdLength: ${this.state.students.length} , pageSize: ${this.pageSize}`)
            if (this.state.students.length >= this.pageSize) {
                this.setState((state) => ({ totalCount: state.totalCount + this.pageSize * 1 }), () => {
                    console.log(`totalCount: ${this.state.totalCount}`)
                });

            }
        }

        console.log(`students length: ${this.state.students.length}`)
        if (this.state.students.length === 0) {
            this.setState((state) => ({ totalCount: state.totalCount - (this.state.totalCount - this.state.currentPage * this.pageSize) }), () => {
                console.log(`totalCount: ${this.state.totalCount}`)
            });


        }
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

            console.log("type = state.actualType")
            console.log(this.state.actualType)
            console.log(this.state.newStudent)
            console.log(`type: ${type}`)
            console.log(` handleOnBlur event.target.value ${event.target.value}`)
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
            console.log(`this.state.newStudent ${this.state.newStudent}`)
            console.log("handleOnBlur finishing")
            console.log(`state.actualType: ${this.state.actualType}`)
        }

    }
    handleOnClick(type) {
        console.log("handleOnClick starting")
        console.log(`type parameter: ${type}`)
        this.setState({
            actualType: type

        })
        if (this.state.newRecord && !this.state.onInputIsCurrent) {

            this.setState({
                onInput: true,

            })
        }
        console.log("handleOnClick finishing")
        console.log(`actual type: ${this.state.actualType}`)
    }
    handleOnChange(type, event) {
        console.log(`handleOnChange event.target.value: ${event.target.value}`)
        console.log(`handleOnChange state.newRecord ${this.state.newRecord}`)
        console.log(`handleOnChange state.onInputIsCurrent ${this.state.onInputIsCurrent}`)
        this.setState({
            newStudent: { ...this.state.newStudent, [type]: event.target.value }

        })
        console.log(`handleOnChange state.newStudent.name ${this.state.newStudent.name}`)
        console.log(`handleOnChange finishing`)


    }

    getStudents = (event, page, limit) => {
        console.log(`loading: ${this.state.loading}`)
        console.log(`getStudents event: ${event}`)
        console.log(`getStudents event.target.value: ${event}`)
        console.log(`currentPage: ${this.state.currentPage}, pageSize: ${this.pageSize} , page: ${page},limit: ${limit}`)
        if (page === undefined) {
            page = "0"

        }
        if (limit === undefined) {
            limit = 10;
        }
        this.setState({ loading: true },
            this.retriveStudents(event, page, limit)
        )
    }
    retriveStudents(event, page, limit) {
        this.studentService.retrieveStudents(event === undefined ? event : event.target.value, page, limit).then(students => {
            console.log(`loading: ${this.state.loading}`)
            console.log(`retrieved students: ${students}`)

            if (students) {
                this.setState({ students: students }, () => {
                    this.setState({ loading: false }, () => {
                        this.incrementPages();
                    });

                });

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
    updateStudent = () => {
        console.log(`creating student: ${this.state.newStudent}`);
        this.setState({ loading: true });
        this.studentService.updateStudent(this.state.newStudent).then(response => {
            console.log(`then response: ${response}`);
            if (response.ok) {
                console.log("response ok")
            }
            else
                console.log("response false")
            this.setState({ newRecord: false });

        }
        ).then(this.setState({ onInputIsCurrent: false })).then(this.getStudents());

    }
    componentDidMount() {
        this.getStudents(undefined, this.state.currentPage, this.pageSize);

        ReactModal.setAppElement('#mainclass1')

    }


    Form(onInput, eventClick, eventBlur, datatype, onInputIsCurrent) {
        console.log(datatype === stdcolumntype.schoolNo ? "table-flex-row-first" : "table-flex-row")
        if (onInputIsCurrent) {
            console.log(`oninputiscurrent in Form: ${onInputIsCurrent}`)

            return (
                <div className={datatype === stdcolumntype.schoolNo ? "table-flex-row-first" : "table-flex-row"} role="cell"  >

                    <AutosizeInput
                        inputStyle={{ minWidth: 23, border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14 }}
                        autoComplete onClick={() => eventClick(datatype)} autoFocus value={this.state.newStudent[datatype]}
                        onChange={this.handleOnChange.bind(this, datatype)} onBlur={(event) => eventBlur(event, datatype)} />

                </div>

            )
        }

        if (datatype === this.state.actualType) {
            console.log(datatype === stdcolumntype.schoolNo ? "table-flex-row-first" : "table-flex-row")
            if (onInput) {
                console.log(onInput)
                console.log("Form creation datatype: ")
                console.log(datatype)
                return (
                    <div className="table-flex-row" role="cell" onClick={() => eventClick(datatype)} >

                        <AutosizeInput
                            inputStyle={{ minWidth: 23, border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14 }}
                            autoComplete autoFocus value={this.state.newStudent[datatype]}
                            onChange={this.handleOnChange.bind(this, datatype)} onBlur={(event) => eventBlur(event, datatype)} />

                    </div>

                )
            }


        }
        else {
            console.log(datatype === stdcolumntype.schoolNo ? "table-flex-row-first" : "table-flex-row")
            //console.log(`this.state.newStudent.${datatype}`)
            console.log(this.state.newStudent)
            return (
                <div className="table-flex-row" role="cell" onClick={() => eventClick(datatype)} >
                    {this.state.newStudent[datatype]}
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
                //console.log(`return list ${student.id}`)
                if (!this.state.onInput && this.state.onInputIsCurrent && this.state.editRowId === student.id) {
                    if (student.id !== this.state.newStudent.id) {//if we set the values before we should not set again to be able to change the new values
                        this.state.newStudent = student;// don't render

                    }



                    return (
                        <div className="flex-table row" role="rowgroup" key={student.id}>
                            {/* {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolNo, this.state.onInputIsCurrent)} */}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.name, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.surname, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdclass, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolstatus, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.no, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.teacher, this.state.onInputIsCurrent)}
                            {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.photo, this.state.onInputIsCurrent)}



                            <div className="table-flex-row button-group" role="cell">
                                <Button className="cui-check button-single m-0 btn-sm p-0" onClick={this.updateStudent} color="primary"></Button>
                                <Button className="cui-circle-x button-single m-0 btn-sm p-0" onClick={() => this.setState({ onInputIsCurrent: false })} color="primary"></Button>
                                <Button className="cui-trash button-single m-0 btn-sm p-0" color="primary"></Button>
                            </div>

                        </div>);
                }

                return (

                    <div className="flex-table row" role="rowgroup" key={student.id}>
                        {/* {(() => {
                            let mouseInter = true;
                            return (
                                <div onMouseOver={()=>{console.log(`mouseover : ${mouseInter}`);mouseInter = true}} onMouseLeave={()=>{console.log(`mouseover : ${mouseInter}`);mouseInter = false}} className="table-flex-row-first" role="cell">{
                                    ((mouseInter) => {
                                        if (mouseInter) {
                                            return (<div className="table-flex-row button-group" role="cell">
                                                <Button className="cui-check button-single m-0 btn-sm p-0" onClick={this.updateStudent} color="primary"></Button>
                                                <Button className="cui-circle-x button-single m-0 btn-sm p-0" onClick={() => this.setState({ onInputIsCurrent: false })} color="primary"></Button>
                                                <Button className="cui-trash button-single m-0 btn-sm p-0" color="primary"></Button>
                                            </div>)
                                        }
                                        else return (student.schoolNo)

                                    }).call(mouseInter)

                                }</div>
                            )
                        }).call()} */}

                        <div className="table-flex-row" role="cell">{student.name}</div>
                        <div className="table-flex-row" role="cell">{student.surname}</div>
                        <div className="table-flex-row" role="cell">{student.stdclass}</div>
                        <div className="table-flex-row" role="cell">{student.schoolStatus}</div>
                        <div className="table-flex-row" role="cell">{student.no}</div>
                        <div className="table-flex-row" role="cell">{student.teacher}</div>
                        <div className="table-flex-row" role="cell"><img  className = "img" width="100%" height="100%" src={student.photo}></img></div>
                        <div className="table-flex-row button-group" role="cell">


                            <Button className="cui-calendar button-single m-0 btn-sm p-0" color="primary" ></Button>
                            {/* <Button className="cui-pencil button-single m-0 btn-sm p-0" onClick={() => { this.setState({ editRowId: student.id, onInputIsCurrent: true, onInput: false, newRecord: false }) }} color="primary"></Button> */}
                            <Button className="cui-pencil button-single m-0 btn-sm p-0" onClick={() => {this.props.history.push(`/students/${student.id}`)}} color="primary"></Button>
                            <Button className="cui-options button-single m-0 btn-sm p-0" color="primary"></Button>

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
                <div className="flex-table row" role="rowgroup" >
                    {/* {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolNo)} */}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.name)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.surname)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.stdclass)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.schoolstatus)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.no)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.teacher)}
                    {this.Form(this.state.onInput, this.handleOnClick, this.handleOnBlur, stdcolumntype.city)}



                    <div className="table-flex-row button-group" role="cell">
                        <Button disabled className="cui-calendar button-single m-0 btn-sm p-0" color="primary"></Button>
                        <Button disabled className="cui-pencil button-single m-0 btn-sm p-0" color="primary"></Button>
                        <Button disabled className="cui-options button-single m-0 btn-sm p-0" color="primary"></Button>
                    </div>
                </div>)
        }
        else {
            console.log("returned null for newRecordRow")
            return null
        }

    }
    runCoo(){
        console.log(`authenticated`)
        return (
          <Redirect to="/" />
        )
    }

    render() {


        const stud = this.state.students;
        const newRecords = this.state.newRecord;
        const { currentPage } = this.state;
        console.log(`stud: ${stud}`);
        console.log(`loading: ${this.state.loading}`)
        const { uploaded, uploadResponse } = this.props;
        console.log("uploaded: ")
        console.log(uploaded)
        console.log(uploadResponse)

       

        if (uploaded && !this.state.open) {
            this.handleCloseModal()
            this.openModal()
        }
        if(this.state.redirectToStudentForm){
            return(
                <Redirect to="/students/new" />
            )
        }

        return (
            
            <div className="main_list animated fadeIn">
                {/* <ReactModal
                    isOpen={this.state.open}
                    closeOnDocumentClick
                    onRequestClose={this.closeModal}
                    style={{
                        // overlay: {
                        //     backgroundColor: 'papayawhip'
                        // },
                        content: {
                            color: 'lightsteelblue',
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            height: `auto`, // <-- This sets the height
                            overlfow: 'scroll' // <-
                        }
                    }}
                >
                    <div className="Card">
                        <a className="close" onClick={this.closeModal}>
                            &times;
            </a>

                        {`${uploadResponse==null?"":uploadResponse.length} adet öğrenci güncellenmiştir.`}
                        
                    </div>
                    <div className="Action" >
                            <button
                                onClick={this.closeModal}
                            >
                                Kapat
        </button>
                        </div>
                </ReactModal> */}
                <Row>
                    <Col>
                        <Card >

                    <Alert color="info" isOpen={this.state.open} toggle={this.closeModal}>
                    {`${uploadResponse==null?"":uploadResponse.length} adet öğrenci güncellenmiştir.`}
                </Alert>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Öğrenci Listesi
                                <div className="card-header-actions">
                                    <Button color="white" onClick={()=>{this.setState({redirectToStudentForm:"true"})}} className="card-header-action btn btn-setting"><i className="fa fa-user-plus fa-lg mt-2"></i>Yeni Kayıt</Button>
                                   <Button  color="white" onClick={this.handleOpenModal} className="card-header-action btn btn-setting"><i className="fa fa-cloud-upload fa-lg mt-2"></i>Toplu Yükle</Button>
                                    <ReactModal
                                        isOpen={this.state.showModal}
                                        contentLabel="Minimal Modal Example"
                                        onRequestClose={this.handleCloseModal}
                                        shouldCloseOnOverlayClick={true}
                                        style={{
                                            // overlay: {
                                            //     backgroundColor: 'papayawhip'
                                            // },
                                            content: {
                                                color: 'lightsteelblue',
                                                top: '50%',
                                                left: '50%',
                                                right: 'auto',
                                                bottom: 'auto',
                                                marginRight: '-50%',
                                                transform: 'translate(-50%, -50%)',
                                                height: `auto`, // <-- This sets the height
                                                overlfow: 'scroll' // <-
                                            }
                                        }}


                                    >
                                        <div><UploadScreen ></UploadScreen></div>
                                        {/* <div>
                                            <button onClick={this.handleCloseModal}>Kapat</button>
                                        </div> */}
                                    </ReactModal>
                                    {/*eslint-disable-next-line*/}
                                    {/* <a onClick={this.handleCloseModal} className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></a> */}
                                    {/*eslint-disable-next-line*/}
                                    {/* <a onClick={this.createModal} className="card-header-action btn btn-close" ><i className="icon-close"></i></a> */}

                                </div>
                            </CardHeader>
                            <CardBody id='mainclass1'>
                                <p>
                                    <Row className="align-items-center">
                                        <Col col="3" offset-sm-1="true" sm="2" md="2" xl className="mb-3 mb-xl-0">
                                            <ButtonToolbar role="rowgroup">
                                                <Button id="yeniKayit" disabled={false} onClick={() => this.setState({ "newRecord": true, "onInputIsCurrent": false, "onInput": true })} size="sm" color="primary"><i className="fa fa-id-badge fa-lg mt-2"></i>Yeni Kayit</Button>

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
                                    {/* <h6></h6> */}
                                    {this.newRecordButtons(newRecords)}

                                </p>

                                <div className="table-container" role="table" aria-label="Destinations">
                                    <div className="flex-table header" role="rowgroup">
                                        {/* <div className="table-flex-row-first" role="columnheader">No</div> */}
                                        <div className="table-flex-row" role="columnheader">Ad</div>
                                        <div className="table-flex-row" role="columnheader">Soyad</div>
                                        <div className="table-flex-row" role="columnheader">Sınıf</div>
                                        <div className="table-flex-row" role="columnheader">Durum</div>
                                        <div className="table-flex-row" role="columnheader">TCKN</div>
                                        <div className="table-flex-row" role="columnheader">Öğretmen</div>
                                        <div className="table-flex-row" role="columnheader">Resim</div>
                                        <div className="table-flex-row" role="columnheader">İşlemler</div>
                                    </div>
                                    {
                                        this.newRecordRow()
                                    }
                                    {
                                        this.fillTable(this.state.loading, stud)
                                    }



                                </div>
                                <div><nav>
                                    {/* <Pagination  >
                                        <PaginationItem ><PaginationLink previous tag="button">Önceki</PaginationLink></PaginationItem>
                                        <PaginationItem active>
                                            <PaginationLink tag="button">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink href="#/dashboard" next tag="button">Sonraki</PaginationLink></PaginationItem>
                                    </Pagination> */}
                                    <Pagination aria-label="Page navigation example">

                                        <PaginationItem disabled={currentPage <= 0}>

                                            <PaginationLink
                                                onClick={e => this.handlePageClick(e, currentPage - 1)}
                                                previous
                                                href="#"
                                            />

                                        </PaginationItem>

                                        {[...Array(Math.ceil(this.state.totalCount / this.pageSize))].map((page, i) =>
                                            <PaginationItem active={i === currentPage} key={i}>
                                                <PaginationLink onClick={e => this.handlePageClick(e, i)} href="#">
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )}

                                        <PaginationItem disabled={currentPage >= Math.ceil(this.state.totalCount / this.pageSize) - 1}>

                                            <PaginationLink
                                                onClick={e => this.handlePageClick(e, currentPage + 1)}
                                                next
                                                href="#"
                                            />

                                        </PaginationItem>

                                    </Pagination>
                                </nav></div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}

const { object, bool, array } = PropTypes;

StudentList.propTypes = {
    uploaded: bool.isRequired,
    uploadResponse: array.isRequired,
    actions: object.isRequired 
};


  const mapDispatch = (dispatch) => {
    return {
      actions: bindActionCreators(upload, dispatch)
    };
  };
export default connect(
    state => ({ isAuthenticated: state.auth.isAuthenticated, uploadResponse: state.upload.uploadResponse, uploaded: state.upload.uploaded }),
    mapDispatch
)(StudentList);

