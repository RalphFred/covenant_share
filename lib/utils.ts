import { FormData } from "@/components/Form";
import { db } from "../firebase"; 
import { collection, addDoc, doc, updateDoc, getDocs, setDoc } from "firebase/firestore";
import { Submission } from "@/app/board/page";

const COLLECTION_NAME = "ride";



export async function submitForm(data: FormData) {
  const documentId = crypto.randomUUID(); 
  const submission = {
    ...data,
    id: documentId, 
    dateOfFlight: new Date(data.dateOfFlight).toISOString(), 
    timeOfArrival: data.timeOfArrival, 
    status: "still looking", 
  };

  const docRef = doc(db, "submissions", documentId);

  try {
    await setDoc(docRef, submission);
    console.log("Form submitted successfully!");
    return documentId; 
  } catch (error) {
    console.error("Error submitting form:", error);
    throw new Error("Could not submit form. Please try again later.");
  }
}


export const fetchSubmissions = async (): Promise<Submission[]> => {
  const querySnapshot = await getDocs(collection(db, "submissions"));
  const submissions: Submission[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Submission[]; 
  return submissions;
};



export const updateStatus = async (id: string, newStatus: string) => {
  try {
    const docRef = doc(db, "submissions", id);
    await updateDoc(docRef, { status: newStatus });
    console.log("Status updated successfully!");
  } catch (error) {
    console.error("Error updating status:", error);
    throw new Error("Could not update status. Please try again later.");
  }
};
