import axios from 'axios';
import FormData from 'form-data';

export default async function predictImage(image) {
  try {
    const form = new FormData();
    form.append('file', image, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });

    const response = await axios.post('https://apnr-ml-994118876089.asia-southeast2.run.app/predict', form, {
        headers: {
          ...form.getHeaders(),
        },
    });

    const { annotated_image, plates } = response.data;

    if (!plates || plates.length === 0) {
      throw new Error('No plate detected');
    }

    const plate = plates[0];

    return {
      plateNumber: plate.plate_number,
      region: plate.region,
      annotatedImage: annotated_image
    };

  } catch (error) {

    if (error.message === 'No plate detected') {
      throw new Error('No plate detected');
    }
    throw error;
  }
}
