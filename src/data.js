// export const collections = {
//   kyoto: ['kyoto1.jpg', 'kyoto2.jpg', 'kyoto3.jpg', 'kyoto4.jpg', 'kyoto5.jpg', 'kyoto6.jpg', 'kyoto7.jpg', 'kyoto8.jpg', 'kyoto9.jpg', 'kyoto10.jpg', 'kyoto11.jpg', 'kyoto12.jpg', 'kyoto13.jpg', 'kyoto14.jpg', 'kyoto15.jpg', 'kyoto16.jpg', 'kyoto17.jpg', 'kyoto18.jpg', 'kyoto19.jpg', 'kyoto20.jpg', 'kyoto21.jpg', 'kyoto22.jpg', 'kyoto23.jpg', 'kyoto24.jpg', 'kyoto25.jpg'],
//   tokyo: ['tokyo1.jpg', 'tokyo2.jpg', 'tokyo3.jpg', 'tokyo4.jpg', 'tokyo5.jpg', 'tokyo6.jpg', 'tokyo9.jpg', 'tokyo10.jpg', 'tokyo11.jpg', 'tokyo12.jpg', 'tokyo13.jpg', 'tokyo14.jpg', 'tokyo15.jpg', 'tokyotower1.jpg', 'tokyotower2.jpg', 'teamlab1.jpg', 'teamlab2.jpg', 'meiji1.jpg', 'meiji2.jpg', 'hachiko.jpg', 'fujisan.jpg', 'odaiba1.jpg', 'odaiba2.jpg'],
//   takayama: ['takayama1.jpg', 'takayama2.jpg', 'takayama3.jpg', 'takayama4.jpg', 'takayama5.jpg', 'takayama6.jpg', 'takayama7.jpg', 'takayama8.jpg', 'takayama9.jpg'],
//   kanazawa: ['kanazawa1.jpg', 'kanazawa2.jpg', 'kanazawa3.jpg', 'kanazawa4.jpg'],
//   nara: ['nara1.jpg', 'nara2.jpg', 'nara3.jpg', 'nara4.jpg', 'nara5.jpg', 'nara6.jpg'],
//   osaka: ['osaka1.jpg', 'osaka2.jpg', 'osaka3.jpg', 'osaka4.jpg', 'osaka5.jpg', 'osaka6.jpg'],
//   shirakawago: ['shirakawago1.jpg', 'shirakawago2.jpg', 'shirakawago3.jpg', 'shirakawago4.jpg'],
//   thailandia: ['thailandia1.jpg', 'thailandia2.jpg', 'thailandia3.jpg', 'thailandia4.jpg', 'thailandia5.jpg', 'thailandia6.jpg']
// };

export const collections = {
  "Kyoto": {
      path: "/images/kyoto/",
      count: 25  // numero di immagini nella collezione Kyoto
  },
  "Tokyo": {
      path: "/images/tokyo/",
      count: 4  // numero di immagini nella collezione Tokyo
  },
  "Takayama": {
      path: "/images/takayama/",
      count: 9  // numero di immagini nella collezione Takayama
  },
  "Kanazawa": {
      path: "/images/kanazawa/",
      count: 4  // numero di immagini nella collezione Kanazawa
  },
  "Nara": {
      path: "/images/nara/",
      count: 6  // numero di immagini nella collezione Nara
  },
  "Osaka": {
      path: "/images/osaka/",
      count: 6  // numero di immagini nella collezione Osaka
  },
  "Shirakawago": {
      path: "/images/shirakawago/",
      count: 4  // numero di immagini nella collezione Shirakawago
  },
  "Thailandia": {
      path: "/images/thailandia/",
      count: 6  // numero di immagini nella collezione Thailandia
  }
  // Aggiungi altre collezioni qui
};

// Funzione per generare i percorsi delle immagini
export const generateImagePaths = (collection) => {
  const { path, count } = collections[collection];
  return Array.from({ length: count }, (_, index) => `${path}${collection.toLowerCase()}${index + 1}.jpg`);
};
