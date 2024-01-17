import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";


const fetchPhotoURL = async (photoURL) => {
    try {
        const photoRef = ref(storage, photoURL);
        const url = await getDownloadURL(photoRef);

        return url;
    } catch (error) {
        console.error("Error fetching photo:", error);
        throw error;
    }
};


export { fetchPhotoURL };