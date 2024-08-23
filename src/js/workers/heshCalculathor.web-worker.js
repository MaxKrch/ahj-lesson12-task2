import CryptoJS from 'crypto-js';
import md5 from 'crypto-js/md5';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import sha512 from 'crypto-js/sha512';

self.addEventListener('message', async (event) => {
  const { file, algorithm } = event.data;
  const readedFile = readingFile(file);
  const hash = calculationFileHash(readedFile, algorithm);
  self.postMessage({
    hash,
  });
});

const readingFile = (file) => {
  const reader = new FileReaderSync();
  const result = reader.readAsArrayBuffer(file);

  return result;
};

const calculationFileHash = (file, algorithm) => {
  try {
    let hash;
    const fileWordArray = CryptoJS.lib.WordArray.create(file);

    switch (algorithm) {
      case 'md5':
        hash = md5(fileWordArray);
        break;

      case 'sha1':
        hash = sha1(fileWordArray);
        break;

      case 'sha256':
        hash = sha256(fileWordArray);
        break;

      case 'sha512':
        hash = sha512(fileWordArray);
        break;

      default:
        return 'Unknown Hash Algorithm';
    }

    return hash.toString(CryptoJS.enc.Base64);
  } catch {
    return 'Error Hash Calculation';
  }
};
