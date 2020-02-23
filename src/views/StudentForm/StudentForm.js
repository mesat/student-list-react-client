import React, { Component } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import StudentService from '../../services/StudentService';
import { stdcolumntype } from '../StudentList/StudentList';

class StudentForm extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      newStudent: {schoolNo:10,schoolStatus:true},
      loading: true
    };
    this.studentService = new StudentService();
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  setStudent = () => {
    console.log(`creating student: ${this.state.newStudent}`);
    this.setState({ loading: true });
    console.log(this.state.newStudent)
    this.studentService.createStudent(this.state.newStudent).then(response => {
      console.log(`then response: ${response}`);
      if (response.ok) {
        console.log("response ok")
      }
      else
        console.log("response false")
      this.setState({ newRecord: false });

    }
    ).then(console.log("finished"));

  }
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  handleOnChange(type, event) {

    if (['medicalReport', 'photo', 'idCard', 'birthCertificate'].indexOf(type) >= 0){
      this.getBase64(event.target.files.item(0)).then((result)=>{this.setState({
        newStudent: { ...this.state.newStudent, [type]: result }
      })});
      
    }
    else
      this.setState({
        newStudent: { ...this.state.newStudent, [type]: event.target.value }
      })
    console.log(`${type} ${event}`)
    console.log(event.target.form)
    console.log(event.target.formValue)
    console.log(`${type} ${event.target.value}`)


  }
  setStudent2 = () => {
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
    ).then(console.log("finished"));

  }

  render() {
    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="6">
            <Card>
              <CardHeader>
                <strong>Yeni Öğrenci Kayıt Formu</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label>Öğrenci No</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">{this.state.newStudent.schoolNo}</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Adı</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.name)} type="text" id="text-input-name" name="text-input" placeholder="Öğrenci Adı" />
                      <FormText >Lütfen adını giriniz</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Soyadı</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.surname)} type="text" id="text-input-surname" name="text-input" placeholder="Öğrenci Soyadı" />
                      <FormText color="muted"></FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Sınıfı</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.stdclass)} type="text" id="text-input-stdclass" name="text-input" placeholder="Sınıfı" />
                      <FormText color="muted">Öğrencinin sınıfını seçiniz</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">TC Kimlik No</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.no)} type="text" id="text-input-no" name="text-input-no" placeholder="" />
                      <FormText color="muted">Lütfen geçerli bir TCKN giriniz</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Anne Bilgileri</Label>
                    </Col>
                    <Col xs="12" md="3">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.motherName)} type="text" id="text-input-motherName" name="text-input" placeholder="anne adı" />
                      <FormText color="muted">Anne Adı</FormText>
                    </Col>
                    <Col xs="12" md="3">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.motherCell)} type="text" id="text-input-motherCell" name="text-input" placeholder="anne tel no" />
                      <FormText color="muted">Telefon No</FormText>
                    </Col>
                    <Col xs="12" md="3">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.motherJob)} type="tel" id="text-input-motherJob" name="text-input" placeholder="anne meslek" />
                      <FormText color="muted">Anne Meslek</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Baba Bilgileri</Label>
                    </Col>
                    <Col xs="12" md="3">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.fatherName)} type="text" id="text-input-fatherName" name="text-input" placeholder="baba adı" />
                      <FormText color="muted">Baba Adı</FormText>
                    </Col>
                    <Col xs="12" md="3">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.fatherCell)} type="tel" id="text-input-fatherCell" name="text-input" placeholder="baba tel no" />
                      <FormText color="muted">Baba Tel No</FormText>
                    </Col>
                    <Col xs="12" md="3">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.fatherJob)} type="tel" id="text-input-fatherJob" name="text-input" placeholder="baba meslek" />
                      <FormText color="muted">Baba Meslek</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Adres Bilgileri</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.address)} type="textarea" name="textarea-input-address" id="textarea-input" rows="4"
                        placeholder="Content..." />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Hocası</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.teacher)} type="text" id="text-input-teacher" name="text-input-teacher" placeholder="" />
                      <FormText color="muted"></FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Sağlık Bilgileri</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.healthInfo)} type="text" id="text-input-healthInfo" name="text-input" placeholder="" />
                      <FormText color="muted"></FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Okul Durumu</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.schoolStatus)} type="select" name="select" id="select-schoolStatus">
                        <option value="0">Lütfen Seçiniz</option>
                        <option value="1">Örgün</option>
                        <option value="2">Donuk</option>
                        <option value="3">Örgün Lise</option>
                        <option value="3">Açık İlahiyat-1</option>
                        <option value="3">Açık İlahiyat-2</option>
                        <option value="3">İlitam-1</option>
                        <option value="3">İlitam-2</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Sistem Durumu</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.systemStatus)} type="select" name="select" id="select-systemStatus">
                        <option value="false">Aktif</option>
                        <option value="true">Pasif</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Fotograf</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.photo)} type="file" id="file-input-photo" name="file-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Kimlik Fotokopisi</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.idCard)} type="file" id="file-input-idCard" name="file-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Sağlık Raporu</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.medicalReport)} type="file" id="file-input-medicalReport" name="file-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Aile Nüfus Kayıt Örneği</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.birthCertificate)} type="file" id="file-input-birthCertificate" name="file-input" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="email-input">Referanslar</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input onChange={this.handleOnChange.bind(this, stdcolumntype.referances)} type="text-input" id="text-input-referances" name="text-input" placeholder="" />
                      <FormText className="help-block"></FormText>
                    </Col>
                  </FormGroup>

                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" onClick={this.setStudent} size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Kaydet</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Sıfırla</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default StudentForm;
