import { app } from "./firebaseConfig.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Initialize Firebase Storage
const storage = getStorage(app);

const uploadImage = async (file, path) => {
  const storageRef = ref(storage, `${path}/${file.name}_${Date.now()}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export { uploadImage };
