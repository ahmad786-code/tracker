// import React, { useState, useEffect } from 'react';
// import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// function ScreenshotGallery({ userId }) {
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 const storage = getStorage(); // Get the default storage instance
//                 const imagesRef = ref(storage, `screenshots/${userId}`); // Create a reference to the storage path
//                 const snapshot = await listAll(imagesRef); // List all items in the reference
//                 const urls = await Promise.all(
//                     snapshot.items.map(item => getDownloadURL(item)) // Map over the items and get download URL for each
//                 );
//                 setImages(urls);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching images:", error);
//                 setLoading(false);
//             }
//         };

//         fetchImages();
//     }, [userId]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             {images.map((url, index) => (
//                 <img key={index} src={url} alt="Screenshot" style={{ width: '100%', margin: '10px 0' }} />
//             ))}
//         </div>
//     );
// }

// export default ScreenshotGallery;


import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

function ScreenshotGallery() {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all user data from Firestore
    const fetchUserData = async () => {
        const db = getFirestore();
        const usersCollection = collection(db, "users"); // Replace "users" with your collection name
        const snapshot = await getDocs(usersCollection);
        const usersData = snapshot.docs.map(doc => ({
            userId: doc.id, // Assuming doc.id is the userId
            username: doc.data().username // Replace 'username' with the field name in your Firestore
        }));
        return usersData;
    };

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const users = await fetchUserData();
                const allUsersData = await Promise.all(users.map(async user => {
                    const storage = getStorage();
                    const imagesRef = ref(storage, `screenshots/${user.userId}`);
                    try {
                        const snapshot = await listAll(imagesRef);
                        const urls = await Promise.all(
                            snapshot.items.map(item => getDownloadURL(item))
                        );
                        return { ...user, images: urls };
                    } catch (error) {
                        console.error("Error fetching images for user:", user.userId, error);
                        return { ...user, images: [] };
                    }
                }));
                setUsersData(allUsersData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllImages();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {usersData.map((user, index) => (
                <div key={index}>
                    <h2>{ `${user.username}: Employee ScreenShots` || "Unknown User"}</h2> {/* Display username */}
                    <div>
                        {user.images.map((url, idx) => (
                            <img key={idx} src={url} alt={`${user.username}'s Screenshot`} style={{ width: '100%', margin: '10px 0' }} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ScreenshotGallery;

