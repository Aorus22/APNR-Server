export default async function dummyMLModel(imageBuffer) {
  const generateRandomPlateNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = Math.floor(1000 + Math.random() * 9000); 
    const randomLetters = `${letters.charAt(Math.floor(Math.random() * letters.length))}${letters.charAt(Math.floor(Math.random() * letters.length))}${letters.charAt(Math.floor(Math.random() * letters.length))}`;
    return `B${numbers}${randomLetters}`;
  };

  const getRandomRegion = () => {
    const regions = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Yogyakarta', 'Bali'];
    return regions[Math.floor(Math.random() * regions.length)];
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        plateNumber: generateRandomPlateNumber(),
        region: getRandomRegion(),
      });
    }, 1000);
  });
};
