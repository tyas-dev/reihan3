import { useState } from 'react';
import prisma from '../lib/prisma'; // Pastikan prisma diatur dengan benar

export async function getServerSideProps() {
  const students = await prisma.mahasiswa.findMany();
  return {
    props: {
      students,
    },
  };
}

const HomePage = ({ students }) => {
  const [data, setData] = useState(students);
  const [formMode, setFormMode] = useState('create');
  const [currentStudent, setCurrentStudent] = useState({
    NIM: '',
    NamaMahasiswa: '',
    Kelas: '',
    Email: '',
  });

  const handleInputChange = (e) => {
    setCurrentStudent({
      ...currentStudent,
      [e.target.name]: e.target.value,
    });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/mahasiswa', {
      method: 'POST',
      body: JSON.stringify(currentStudent),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    setData([...data, result.student]);
    resetForm();
  };

  const loadStudent = (student) => {
    setCurrentStudent(student);
    setFormMode('update');
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/mahasiswa/${currentStudent.NIM}`, {
      method: 'PUT',
      body: JSON.stringify(currentStudent),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const updatedStudent = await response.json();
    setData(
      data.map((student) => (student.NIM === updatedStudent.updatedStudent.NIM ? updatedStudent.updatedStudent : student))
    );
    resetForm();
  };

  const deleteStudent = async (NIM) => {
    await fetch(`/api/mahasiswa/${NIM}`, {
      method: 'DELETE',
    });
    setData(data.filter((student) => student.NIM !== NIM));
  };

  const resetForm = () => {
    setCurrentStudent({ NIM: '', NamaMahasiswa: '', Kelas: '', Email: '' });
    setFormMode('create');
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>PEMOGRAMAN PERANGKAT BERGERAK</p>

      <h2>Daftar Mahasiswa</h2>

      {/* Form tambah dan update mahasiswa */}
      <form onSubmit={formMode === 'create' ? addStudent : updateStudent}>
        <input
          type="text"
          name="NIM"
          placeholder="NIM"
          value={currentStudent.NIM}
          onChange={handleInputChange}
          disabled={formMode === 'update'}
        />
        <input
          type="text"
          name="NamaMahasiswa"
          placeholder="Nama"
          value={currentStudent.NamaMahasiswa}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="Kelas"
          placeholder="Kelas"
          value={currentStudent.Kelas}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={currentStudent.Email}
          onChange={handleInputChange}
        />
        <button type="submit">{formMode === 'create' ? 'Tambah Mahasiswa' : 'Update Mahasiswa'}</button>
        {formMode === 'update' && <button type="button" onClick={resetForm}>Batal</button>}
      </form>

      {/* Tabel mahasiswa */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>NIM</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.NIM}>
              <td>{student.NIM}</td>
              <td>{student.NamaMahasiswa}</td>
              <td>{student.Kelas}</td>
              <td>{student.Email}</td>
              <td>
                <button onClick={() => loadStudent(student)}>Edit</button> |{' '}
                <button onClick={() => deleteStudent(student.NIM)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
