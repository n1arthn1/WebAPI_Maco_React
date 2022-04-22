import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import './App.css';

function App() {

  const baseUrl = 'https://localhost:7216/api/Courses'

  const [data, setData] = useState([]);

  const [selectedCourse, SetSelectedCourse] = useState({
    id: '',
    name: '',
    description: ''
  })

  const [openCreateModal, setCreateModalOpen] = useState(false);
  const toggleCreateModal = () => {
    setCreateModalOpen(!openCreateModal);
  }

  const [openEditModal, setEditModalOpen] = useState(false);
  const toggleEditModal = (course) => {
    SetSelectedCourse(course);
    setEditModalOpen(!openEditModal);
  }

  const [openDelModal, setDelModalOpen] = useState(false);
  const toggleDelModal = (course) => {
    SetSelectedCourse(course);
    setDelModalOpen(!openDelModal);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    SetSelectedCourse({
      ...selectedCourse, [name]: value
    });
  }

  const getCourse = async () => {
    await axios.get(baseUrl)
      .then(res => {
        setData(res.data);
      }).catch(err => {
        console.log(err);
      })
  }

  const addCourse = async () => {
    delete selectedCourse.id;
    await axios.post(baseUrl, selectedCourse)
      .then(
        res => {
          setData(data.concat(res.data));
          toggleCreateModal();
        }
      ).catch(err => {
        console.log(err);
      })
  }

  const updateCourse = async () => {
    await axios.put(baseUrl + '/' + selectedCourse.id, selectedCourse)
      .then(res => {
        var resp = res.data;
        var auxData = data;
        console.log(resp);
        auxData.map(course => {
          if (course.id === selectedCourse.id) {
            course.name = resp.name;
            course.description = resp.description;
          }
        });
        toggleEditModal();
      }).catch(err => {
        console.log(err);
      })
  }

  const delCourse = async () => {
    await axios.delete(baseUrl + '/' + selectedCourse.id)
      .then(res => {
        setData(data.filter(course => course.id !== selectedCourse.id));
        toggleDelModal();
      }).catch(err => {
        console.log(err);
      })
  }


  useEffect(() => {
    getCourse();
  }, [])


  return (
    <div className="App d-flex flex-column align-items-center">
      <br />
      <h3 className='title p-4'>Cadastro de Cursos</h3>
      <header>
        <button className='btn btn-success m-4' onClick={toggleCreateModal}>Incluir novo Curso</button>
      </header>

      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Criação</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {data.map(course => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.createdAt}</td>
              <td>
                <button className='btn btn-primary m-2' onClick={() => toggleEditModal(course)} >Editar</button>
                <button className='btn btn-danger m-2' onClick={() => toggleDelModal(course)} >Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={openCreateModal}>
        <ModalHeader>Incluir Cursos</ModalHeader>
        <ModalBody>
          <div className='form' >
            <label>Nome: </label>
            <br />
            <input type='text' className='form-control' name='name' onChange={handleChange} />
            <label>Descrição: </label>
            <br />
            <input type='text' className='form-control' name='description' onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={addCourse}>Incluir</button>
          <button className='btn btn-primary' onClick={toggleCreateModal} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={openEditModal}>
        <ModalHeader>Editar Cursos</ModalHeader>
        <ModalBody>
          <div className='form' >
            <label>Nome: </label>
            <br />
            <input type='text' className='form-control' name='name' onChange={handleChange}
              value={selectedCourse && selectedCourse.name}
            />
            <label>Descrição: </label>
            <br />
            <input type='text' className='form-control' name='description' onChange={handleChange}
              value={selectedCourse && selectedCourse.description}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={updateCourse}>Editar</button>
          <button className='btn btn-primary' onClick={toggleEditModal} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={openDelModal}>
        <ModalBody>
          Confirma a exclusão deste Curso: {selectedCourse && selectedCourse.name}
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={delCourse}>Sim</button>
          <button className='btn btn-secondary' onClick={toggleDelModal}>Não</button>

        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
