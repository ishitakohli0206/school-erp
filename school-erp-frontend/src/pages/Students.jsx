import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data));
  }, []);

  return (
    <div>
      <h2>Students</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Class ID</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.user_id}</td>
              <td>{s.class_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
