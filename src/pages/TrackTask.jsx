import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const TrackTask = () => {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksQuery = query(collection(db, 'tasks'));
        const querySnapshot = await getDocs(tasksQuery);
        const userCache = {};
        const tasksByUser = {};
    
        await Promise.all(querySnapshot.docs.map(async (taskDoc) => {
          const taskData = taskDoc.data();
          console.log("Task Data:", taskData); // Log to see what task data is being processed
    
          if (!taskData.assignedTo) {
            console.log("No assignedTo ID for task:", taskData);
          }
    
          let userName = "Unknown User";
    
          if (taskData.assignedTo && typeof taskData.assignedTo === 'string') {
            if (userCache[taskData.assignedTo]) {
              userName = userCache[taskData.assignedTo];
            } else {
              const userDocRef = doc(db, 'users', taskData.assignedTo);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                userName = userDoc.data().username;
                userCache[taskData.assignedTo] = userName;
              } else {
                console.log("User not found for ID:", taskData.assignedTo); // Log if user ID does not return a valid user
              }
            }
          }
    
          const formattedTime = `${taskData.trackingData?.timeElapsed?.hours ?? 0}h ${taskData.trackingData?.timeElapsed?.minutes ?? 0}m ${taskData.trackingData?.timeElapsed?.seconds ?? 0}s`;
    
          if (!tasksByUser[userName]) {
            tasksByUser[userName] = [];
          }
          tasksByUser[userName].push({
            id: taskDoc.id,
            title: taskData.title,
            description: taskData.description,
            timeSpent: formattedTime,
            mouseMoves: taskData.trackingData?.mouseCount ?? 0,
            keyPresses: taskData.trackingData?.keyPressCount ?? 0,
          });
        }));
    
        setTasks(tasksByUser);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div>
      <h2>Tracked Tasks Overview</h2>
      {Object.keys(tasks).map(userName => (
        <div key={userName}>
          <h3>{userName}</h3>
          <table>
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Description</th>
                <th>Time Spent</th>
                <th>Mouse Movements</th>
                <th>Keypress Events</th>
              </tr>
            </thead>
            <tbody>
              {tasks[userName].map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.timeSpent}</td>
                  <td>{task.mouseMoves}</td>
                  <td>{task.keyPresses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TrackTask;


// import React, { useState, useEffect } from 'react';
// import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';

// const TrackTask = () => {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const tasksQuery = query(collection(db, 'tasks'));
//       const querySnapshot = await getDocs(tasksQuery);
//       const tasksData = await Promise.all(querySnapshot.docs.map(async (taskDoc) => {
//         const taskData = taskDoc.data();
//         // Use 'assignedTo' to get the corresponding user document from the 'users' collection
//         const userDocRef = doc(db, 'users', taskData.assignedTo);
//         const userDoc = await getDoc(userDocRef);
//         // Check if the user document exists and extract the name
//         return {
//           ...taskData,
//           id: taskDoc.id,
//           userName: userDoc.exists() ? userDoc.data().username : "Unknown User"  // Use the name field from the user document
//         };
//       }));
//       setTasks(tasksData);
//     };

//     fetchTasks();
//   }, []);

//   return (
//     <div>
//       <h2>Tracked Tasks Overview</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>User Name</th>
//             <th>Task Title</th>
//             <th>Description</th>
//             <th>Time Spent (seconds)</th>
//             <th>Mouse Movements</th>
//             <th>Keypress Events</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map(task => (
//             <tr key={task.id}>
//               <td>{task.userName}</td> 
//               <td>{task.title}</td>
//               <td>{task.description}</td>
//               <td>{task.timeLogs}</td>
//               <td>{task.mouseMoves}</td>
//               <td>{task.keyPresses}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TrackTask;
