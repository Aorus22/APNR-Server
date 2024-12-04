export default async function dummyMLModel(imageBuffer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        plateNumber: 'B1234XYZ',
        region: 'Jakarta',
      });
    }, 1000);
  });
};