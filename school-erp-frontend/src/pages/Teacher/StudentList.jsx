import { useEffect, useState } from "react";
import { getTeacherStudents } from "../../services/teacherAPI";

const StudentsList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getTeacherStudents().then((res) => setStudents(res.data));
  }, []);

  return (
    <div>
      <h2>My Students</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.User?.name}</td>
              <td>{s.roll_no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;