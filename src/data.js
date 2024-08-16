const collectionFileName = {
  kyoto: ['kyoto0.jpg', 'kyoto1.jpg', 'kyoto2.jpg', 'kyoto3.jpg', 'kyoto4.jpg', 'kyoto5.jpg', 'kyoto6.jpg', 'kyoto7.jpg', 'kyoto8.jpg', 'kyoto9.jpg', 'kyoto10.jpg', 'kyoto11.jpg', 'kyoto12.jpg', 'kyoto13.jpg', 'kyoto14.jpg', 'kyoto15.jpg', 'kyoto16.jpg', 'kyoto17.jpg', 'kyoto18.jpg', 'kyoto19.jpg', 'kyoto20.jpg', 'kyoto21.jpg', 'kyoto22.jpg', 'kyoto23.jpg', 'kyoto24.jpg'],
  tokyo: ['tokyo0.jpg','tokyo1.jpg', 'tokyo2.jpg', 'tokyo3.jpg', 'tokyo4.jpg', 'tokyo5.jpg', 'tokyo6.jpg', 'tokyo9.jpg', 'tokyo10.jpg', 'tokyo11.jpg', 'tokyo12.jpg', 'tokyo13.jpg', 'tokyo14.jpg', 'tokyo15.jpg','tokyo16.jpg','tokyo17.jpg','tokyo18.jpg','tokyo19.jpg','tokyo20.jpg','tokyo21.jpg','tokyo22.jpg','tokyo23.jpg','tokyo24.jpg','tokyo25.jpg'],
  takayama: ['takayama1.jpg', 'takayama2.jpg', 'takayama3.jpg', 'takayama4.jpg', 'takayama5.jpg', 'takayama6.jpg', 'takayama7.jpg', 'takayama8.jpg', 'takayama9.jpg'],
  kanazawa: ['kanazawa1.jpg', 'kanazawa2.jpg', 'kanazawa3.jpg', 'kanazawa4.jpg'],
  nara: ['nara1.jpg', 'nara2.jpg', 'nara3.jpg', 'nara4.jpg', 'nara5.jpg', 'nara6.jpg', 'nara7.mp4'],
  osaka: ['osaka1.jpg', 'osaka2.jpg', 'osaka3.jpg', 'osaka4.jpg', 'osaka5.jpg', 'osaka6.jpg'],
  shirakawago: ['shirakawago1.jpg', 'shirakawago2.jpg', 'shirakawago3.jpg', 'shirakawago4.jpg'],
  thailandia: ['thailandia1.jpg', 'thailandia2.jpg', 'thailandia3.jpg', 'thailandia4.jpg', 'thailandia5.jpg', 'thailandia6.jpg']
};

const basePath = process.env.PUBLIC_URL;

export const collections = {
  "Kyoto": {
      path: `${basePath}/images/kyoto/`,
      count: 25  // numero di immagini nella collezione Kyoto
  },
  "Tokyo": {
      path: `${basePath}/images/tokyo/`,
      count: 26 // numero di immagini nella collezione Tokyo
  },
  "Takayama": {
      path: `${basePath}/images/takayama/`,
      count: 9  // numero di immagini nella collezione Takayama
  },
  "Kanazawa": {
      path: `${basePath}/images/kanazawa/`,
      count: 4  // numero di immagini nella collezione Kanazawa
  },
  "Nara": {
      path: `${basePath}/images/nara/`,
      count: 7  // numero di immagini nella collezione Nara
  },
  "Osaka": {
      path: `${basePath}/images/osaka/`,
      count: 6  // numero di immagini nella collezione Osaka
  },
  "Shirakawago": {
      path: `${basePath}/images/shirakawago/`,
      count: 4  // numero di immagini nella collezione Shirakawago
  },
  "Thailandia": {
      path: `${basePath}/images/thailandia/`,
      count: 6  // numero di immagini nella collezione Thailandia
  }
};

// Funzione per generare i percorsi delle immagini
export const generateImagePaths = (collection) => {
  const { path } = collections[collection];
  return collectionFileName[collection.toLowerCase()].map((fileName) => `${path}${fileName}`);
//   return Array.from({ length: count }, (_, index) => `${path}${collection.toLowerCase()}${index + 1}.jpg`);
};
