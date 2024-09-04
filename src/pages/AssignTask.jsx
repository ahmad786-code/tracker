// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, addDoc } from 'firebase/firestore';
// import { db } from '../firebase';
 

// const AssignTask = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Fetch users from Firebase Authentication
//     const fetchUsers = async () => {
//       const usersSnapshot = await getDocs(collection(db, 'users'));
//       setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };

//     fetchUsers();
//   }, []);

//   const handleAssignTask = async (e) => {
//     e.preventDefault();
//     try {
//       // Add task to Firestore
//       await addDoc(collection(db, 'tasks'), {
//         assignedTo: selectedUser,
//         title: taskTitle,
//         description: taskDescription,
//         createdAt: new Date(),
//       });
//       setMessage('Task assigned successfully.');
//       setTaskTitle('');
//       setTaskDescription('');
//       setSelectedUser('');
//     } catch (error) {
//       setMessage(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Assign Task</h2>
//       <form onSubmit={handleAssignTask}>
//         <select
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//           required
//         >
//           <option value="" disabled>Select User</option>
//           {users.map(user => (
//             <option key={user.id} value={user.id}>{user.email}</option>
//           ))}
//         </select>
//         <input
//           type="text"
//           value={taskTitle}
//           onChange={(e) => setTaskTitle(e.target.value)}
//           placeholder="Task Title"
//           required
//         />
//         <textarea
//           value={taskDescription}
//           onChange={(e) => setTaskDescription(e.target.value)}
//           placeholder="Task Description"
//           required
//         />
//         <button type="submit">Assign Task</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default AssignTask;

 import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch users from Firebase
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      // Create a new document reference for a task
      const taskRef = doc(collection(db, 'tasks'));
      await setDoc(taskRef, {
        taskId: taskRef.id, // Store the auto-generated ID within the document itself
        assignedTo: selectedUser,
        title: taskTitle,
        description: taskDescription,
        createdAt: new Date(),
      });
      setMessage(`Task assigned successfully. Task ID: ${taskRef.id}`);
      setTaskTitle('');
      setTaskDescription('');
      setSelectedUser('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Assign Task</h2>
      <form onSubmit={handleAssignTask}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
        >
          <option value="" disabled>Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
          required
        />
        <button type="submit">Assign Task</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AssignTask;

