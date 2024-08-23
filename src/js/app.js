import UploadManager from './api/UploadManager';
const OPTIONS = {
  CONTAINER: '[data-id="app"]',
  ALGORITHMS: [
    {
      NAME: 'MD5',
      TAG: 'md5',
      DEFAULT: false,
    },
    {
      NAME: 'SHA1',
      TAG: 'sha1',
      DEFAULT: false,
    },
    {
      NAME: 'SHA256',
      TAG: 'sha256',
      DEFAULT: true,
    },
    {
      NAME: 'SHA512',
      TAG: 'sha512',
      DEFAULT: false,
    },
  ],
  TEXT: {
    TITLE: `Hasher`,
    DND_AREA: [`Drop file here`, `Or`, `Click to algorithms`],
    ALGORITHMS_TITLE: `Hash Algorithm:`,
    INFO_FILE: {
      TAG: `file`,
      ID: `uploadManagerInfoFile`,
      TITLE: `File Name:`,
    },
    INFO_HASH: {
      TAG: `hash`,
      ID: `uploadManagerInfoHash`,
      TITLE: `File Hash:`,
    },
  },
  TEMP_HASH_TEXT: {
    MAIN: `calculation`,
    ENDING: '.',
  },
};

const uploadManager = new UploadManager(OPTIONS);
uploadManager.initWidget();
