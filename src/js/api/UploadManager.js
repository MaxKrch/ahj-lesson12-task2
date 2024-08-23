import Render from '../ui/UploadManagerRender';
import HashCalculathor from '../workers/heshCalculathor.web-worker';

export default class HeshCalculathor {
  constructor({ CONTAINER, ALGORITHMS, TEXT, TEMP_HASH_TEXT }) {
    this.container = document.querySelector(CONTAINER);
    this.algorithms = ALGORITHMS;
    this.text = TEXT;
    (this.tempHashText = TEMP_HASH_TEXT),
      (this.render = new Render(this.container));
    this.algorithmList = {
      show: false,
    };
    this.hashCalculathor = {
      worker: null,
      uploadFile: null,
      tempHash: {
        interval: null,
        count: 0,
        max: 9,
        time: 250,
      },
    };
  }

  initWidget() {
    this.renderPage();
    this.addEventListeners();
    this.stoppedPropagationInput();
    this.render.registerEventListeners();
  }

  renderPage() {
    this.render.renderPage(this.text);
    this.render.fillingFormAlgohritmsList(this.algorithms);
  }

  stoppedPropagationInput() {
    const inputAlgorithmArray =
      this.render.page.form.algorithms.list.querySelectorAll(
        `.upload-manager__form__algorithms__item__input`,
      );

    inputAlgorithmArray.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    });
  }

  addEventListeners() {
    this.render.addNewEventListener(
      `dnd`,
      `drop`,
      this.onDropFormDnd.bind(this),
    );

    this.render.addNewEventListener(
      `dndInput`,
      `change`,
      this.onChangeDndInput.bind(this),
    );

    this.render.addNewEventListener(
      `algorithmValue`,
      `click`,
      this.onClickAlgorithmValue.bind(this),
    );

    this.render.addNewEventListener(
      `algorithmList`,
      `click`,
      this.onClickAlgorithmList.bind(this),
    );

    this.render.addNewEventListener(
      `widget`,
      `click`,
      this.onClickWidget.bind(this),
    );
    this.render.addNewEventListener(
      `widget`,
      `dragenter`,
      this.onDragenterWidget.bind(this),
    );
    this.render.addNewEventListener(
      `widget`,
      `drop`,
      this.onDropWidget.bind(this),
    );
  }

  onChangeDndInput(event) {
    try {
      const file = event.target.files[0];
      this.processingUploadFile(file);
    } catch (err) {
      console.log(`Что-то пошло не так: ${err}`);
    }
  }

  onClickAlgorithmValue() {
    this.algorithmList.show === true
      ? this.hideListAlgorithms()
      : this.showListAlgorithms();
  }

  onClickAlgorithmList(event) {
    this.selectNewAlgorithm(event);
    this.hideListAlgorithms();
  }

  onClickWidget(event) {
    if (event.target.closest(`.upload-manager__form__algorithms__value`)) {
      return;
    }

    if (this.algorithmList.show === true) {
      const isAlgorithmItem = event.target.closest(
        `.upload-manager__form__algorithms__item`,
      )
        ? true
        : false;

      if (isAlgorithmItem) {
        return;
      }

      this.hideListAlgorithms();
    }
  }

  onDropFormDnd(event) {
    try {
      const file = event.dataTransfer.files[0];
      this.processingUploadFile(file);
    } catch (err) {
      console.log(`Что-то пошло не так: ${err}`);
    }
  }

  onDragenterWidget(event) {
    event.target.closest(`.upload-manager__form__dnd`)
      ? this.render.addBacklightFormDndArea()
      : this.render.removeBacklightFormDndArea();
  }

  onDropWidget() {
    this.render.removeBacklightFormDndArea();
  }

  showListAlgorithms() {
    this.algorithmList.show = true;
    this.render.showListAlgorithms();
  }

  hideListAlgorithms() {
    this.algorithmList.show = false;
    this.render.hideListAlgorithms();
  }

  selectNewAlgorithm(event) {
    const elementLi = event.target.closest(
      `.upload-manager__form__algorithms__item`,
    );

    if (!elementLi) {
      return;
    }

    const isActiveAlgorithm = elementLi.classList.contains(
      `upload-manager__form__algorithms__item_active`,
    )
      ? true
      : false;

    if (!isActiveAlgorithm) {
      const algorithm = elementLi.dataset.algorithm;
      const selectedFile = this.getUploadFile();
      this.changeActiveAlgorithm(algorithm);

      if (selectedFile) {
        const algorithm = this.render.activeAlgorithm;
        this.calculationNewHash(selectedFile, algorithm);
      }
    }
  }

  processingUploadFile(file) {
    const algorithm = this.render.page.form.dnd.input.dataset.algorithm;
    const name = file.name;

    this.uploadFile = file;
    this.setNameActiveFile(name);
    this.calculationNewHash(file, algorithm);
  }

  changeActiveAlgorithm(newAlgorithm) {
    const algorithm = this.algorithms.find((item) => item.TAG === newAlgorithm);
    this.render.changeActiveAlgorithm(algorithm);
  }

  setNameActiveFile(name) {
    this.render.infoFileName = name;
  }

  getUploadFile() {
    try {
      const selectedFile = this.uploadFile;
      return selectedFile;
    } catch (err) {
      console.log(`Что-то пошло не так: ${err}`);
      return false;
    }
  }

  calculationNewHash(file, algorithm) {
    if (this.hashCalculathor.worker) {
      this.terminateActiveWorker();
    }
    this.updateTempHashText();
    this.createNewWorkerHashCalculathor();
    this.hashCalculathor.worker.postMessage({
      file,
      algorithm,
    });
  }

  createNewWorkerHashCalculathor() {
    this.hashCalculathor.worker = new HashCalculathor();
    this.hashCalculathor.worker.addEventListener(
      'message',
      this.onGetMessageFromWorket.bind(this),
    );
  }

  terminateActiveWorker() {
    this.hashCalculathor.worker.terminate();
    this.hashCalculathor.worker = null;
  }

  updateTempHashText() {
    this.clearTempHashText();
    this.render.infoFileHash = this.tempHashText.MAIN;
    this.hashCalculathor.tempHash.interval = setInterval(
      this.addNewTempHashText.bind(this),
      this.hashCalculathor.tempHash.time,
    );
  }

  addNewTempHashText() {
    if (
      this.hashCalculathor.tempHash.count < this.hashCalculathor.tempHash.max
    ) {
      this.hashCalculathor.tempHash.count += 1;
      this.render.infoFileHash =
        this.render.infoFileHash + this.tempHashText.ENDING;

      return;
    }

    this.hashCalculathor.tempHash.count = 0;
    this.render.infoFileHash = this.tempHashText.MAIN;
  }

  clearTempHashText() {
    clearInterval(this.hashCalculathor.tempHash.interval);
    this.hashCalculathor.tempHash.interval = null;
    this.hashCalculathor.tempHash.count = 0;
  }

  onGetMessageFromWorket(event) {
    this.clearTempHashText();
    this.render.infoFileHash = event.data.hash;
    this.terminateActiveWorker();
  }
}
