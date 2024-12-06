import { getUserPlateData, getVehicleById, saveToFirestore } from "./firestore.js";
import uploadToGCS from "./gcs.js";
import dummyMLModel from "./ml.js";

export async function handleDetect (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { uid } = req.cookies

    const result = await dummyMLModel(req.file.buffer);
    const { plateNumber, region } = result;
    const timestamp = Date.now()

    const fileName = `${plateNumber}-${timestamp}.jpg`;
    const publicUrl = await uploadToGCS(req.file.buffer, fileName, req.file.mimetype);

    const plateDataID = await saveToFirestore(uid, plateNumber, region, publicUrl, timestamp);

    return res.status(200).json({ message: 'Success', redirect: plateDataID });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Failed' });
  }
}

export async function handleGetList(req, res) {
  try {
    const { uid } = req.cookies;

    const result = await getUserPlateData(uid);

    if (result.message) {
      return res.status(200).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleGetDetail(req, res) {
  try {
    const { uid } = req.cookies;
    const { plateDataId } = req.params

    const result = await getVehicleById(plateDataId);

    if (result.owner !== uid) {
      return res.status(403).json({ error: "You do not have permission to access this resource." });
    }

    if (result.message) {
      return res.status(200).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}