export default class Render {
  constructor(container) {
    this.container = container;
    this.page = {
      container: null,
      header: null,
      form: {
        container: null,
        dnd: {
          container: null,
          input: null,
          area: null,
        },
        algorithms: {
          container: null,
          title: null,
          value: null,
          list: null,
        },
      },
      info: {
        container: null,
        file: {
          container: null,
          title: null,
          value: null,
        },
        hash: {
          container: null,
          title: null,
          value: null,
        },
      },
    };
    this.eventListeners = {
      algorithmValue: {
        click: new Set(),
      },
      algorithmList: {
        click: new Set(),
      },
      dnd: {
        drop: new Set(),
      },
      dndInput: {
        change: new Set(),
      },
      widget: {
        click: new Set(),
        dragenter: new Set(),
        drop: new Set(),
      },
    };
  }

  registerEventListeners() {
    this.page.form.dnd.container.addEventListener('drop', (event) => {
      this.eventListeners.dnd.drop.forEach((item) => item(event));
      event.preventDefault();
    });

    this.page.form.dnd.input.addEventListener('change', (event) => {
      this.eventListeners.dndInput.change.forEach((item) => item(event));
    });

    this.page.form.algorithms.value.addEventListener('click', (event) => {
      this.eventListeners.algorithmValue.click.forEach((item) => item(event));
    });

    this.page.form.algorithms.list.addEventListener('click', (event) => {
      this.eventListeners.algorithmList.click.forEach((item) => item(event));
    });

    document.addEventListener('click', (event) => {
      this.eventListeners.widget.click.forEach((item) => item(event));
    });
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    document.addEventListener('dragenter', (event) => {
      this.eventListeners.widget.dragenter.forEach((item) => item(event));
    });
    document.addEventListener('drop', (event) => {
      this.eventListeners.widget.drop.forEach((item) => item(event));
      event.preventDefault();
    });
  }

  renderPage(text) {
    this.page.container = document.createElement('main');
    this.page.container.classList.add(`container`, `upload-manager`);

    this.page.header = this.createTitle(text);
    this.page.form.container = this.createForm(text);
    this.page.info.container = this.createInfo(text);

    this.page.container.append(
      this.page.header,
      this.page.form.container,
      this.page.info.container,
    );
    this.container.append(this.page.container);
  }

  createTitle(text) {
    const header = document.createElement('h2');
    header.classList.add(`upload-manager__title`);
    header.textContent = text.TITLE;

    return header;
  }

  createForm(text) {
    const form = document.createElement('form');
    form.classList.add(`upload-manager__form`);
    form.setAttribute(`action`, `#`);
    form.dataset.id = `uploadManagerForm`;

    this.page.form.dnd.container = this.createFormDnd(text);
    this.page.form.algorithms.container = this.createFormAlgohritms(text);

    form.append(
      this.page.form.dnd.container,
      this.page.form.algorithms.container,
    );

    return form;
  }

  createFormDnd(text) {
    const formDnd = document.createElement(`label`);
    formDnd.classList.add(`upload-manager__form__dnd`);
    formDnd.dataset.id = `uploadFormDnd`;

    (this.page.form.dnd.input = this.createFormDndInput()),
      (this.page.form.dnd.area = this.createFormDndArea(text));

    formDnd.append(this.page.form.dnd.input, this.page.form.dnd.area);

    return formDnd;
  }

  createFormDndInput() {
    const formDndInput = document.createElement(`input`);
    formDndInput.classList.add(
      `upload-manager__form__dnd__input`,
      `hidden-item`,
    );
    formDndInput.setAttribute(`type`, `file`);
    formDndInput.dataset.id = `uploadManagerFormDndInput`;
    formDndInput.dataset.algorithm = ``;

    return formDndInput;
  }

  createFormDndArea(text) {
    const formDndArea = document.createElement(`div`);
    formDndArea.classList.add(`upload-manager__form__dnd__area`);
    const formDndAreaContent = [];

    text.DND_AREA.forEach((string) => {
      const stringEl = this.createFormDndAreaString(string);
      formDndAreaContent.push(stringEl);
    });

    formDndArea.append(...formDndAreaContent);

    return formDndArea;
  }

  createFormDndAreaString(string) {
    const stringEl = document.createElement(`p`);
    stringEl.classList.add(`upload-manager__form__dnd__area-p`);
    stringEl.textContent = string;

    return stringEl;
  }

  createFormAlgohritms(text) {
    const formAlgohritms = document.createElement(`div`);
    formAlgohritms.classList.add(`upload-manager__form__algorithms`);

    this.page.form.algorithms.title = this.createFormAlgohritmsTitle(text);
    this.page.form.algorithms.value = this.createFormAlgohritmsValue();
    this.page.form.algorithms.list = this.createFormAlgohritmsList();

    formAlgohritms.append(
      this.page.form.algorithms.title,
      this.page.form.algorithms.value,
      this.page.form.algorithms.list,
    );

    return formAlgohritms;
  }

  createFormAlgohritmsTitle(text) {
    const formAlgohritmsTitle = document.createElement(`div`);
    formAlgohritmsTitle.classList.add(
      `upload-manager__form__algorithms__title`,
    );
    formAlgohritmsTitle.textContent = text.ALGORITHMS_TITLE;

    return formAlgohritmsTitle;
  }

  createFormAlgohritmsValue() {
    const formAlgohritmsValue = document.createElement(`div`);
    formAlgohritmsValue.classList.add(
      `upload-manager__form__algorithms__value`,
    );
    formAlgohritmsValue.dataset.id = `uploadManagerFormalgorithmsValue`;
    formAlgohritmsValue.dataset.algorithm = ``;

    return formAlgohritmsValue;
  }

  createFormAlgohritmsList() {
    const formAlgohritmsList = document.createElement(`ul`);
    formAlgohritmsList.classList.add(
      `upload-manager__form__algorithms__list`,
      `hidden-item`,
    );
    formAlgohritmsList.dataset.id = `uploadManagerFormalgorithmsList`;

    return formAlgohritmsList;
  }

  createInfo(text) {
    const info = document.createElement(`div`);
    info.classList.add(`upload-manager__info`);

    (this.page.info.file.container = this.createInfoBlock(text.INFO_FILE)),
      (this.page.info.hash.container = this.createInfoBlock(text.INFO_HASH)),
      info.append(this.page.info.file.container, this.page.info.hash.container);

    return info;
  }

  createInfoBlock(block) {
    const infoBlock = document.createElement(`div`);
    infoBlock.classList.add(
      `upload-manager__info__block`,
      `upload-manager__info__${block.TAG}`,
    );
    infoBlock.dataset.id = block.ID;

    this.page.info[block.TAG].title = this.createInfoTitle(block);
    this.page.info[block.TAG].value = this.createInfoValue(block);

    infoBlock.append(
      this.page.info[block.TAG].title,
      this.page.info[block.TAG].value,
    );

    return infoBlock;
  }

  createInfoTitle(block) {
    const infoTitle = document.createElement(`p`);
    infoTitle.classList.add(
      `upload-manager__info__title`,
      `upload-manager__info__${block.TAG}__title`,
    );
    infoTitle.textContent = block.TITLE;

    return infoTitle;
  }

  createInfoValue(block) {
    const infoValue = document.createElement(`p`);
    infoValue.classList.add(
      `upload-manager__info__value`,
      `upload-manager__info__${block.TAG}__value`,
    );
    infoValue.textContent = ``;

    return infoValue;
  }

  fillingFormAlgohritmsList(algorithms) {
    const defaultAlgorithm =
      algorithms.find((item) => item.DEFAULT) || algorithms[0];
    const algorithmElements = [];
    this.activeAlgorithm = defaultAlgorithm;

    algorithms.forEach((algorithm) => {
      const algorithmElement = this.createAlgorithmItem(algorithm);
      if (algorithm === defaultAlgorithm) {
        algorithmElement.classList.add(
          `upload-manager__form__algorithms__item_active`,
        );
      }
      algorithmElements.push(algorithmElement);
    });

    this.page.form.algorithms.list.append(...algorithmElements);
  }

  createAlgorithmItem(algorithm) {
    const algorithmElement = document.createElement(`li`);
    algorithmElement.classList.add(`upload-manager__form__algorithms__item`);
    algorithmElement.dataset.algorithm = algorithm.TAG;
    algorithmElement.dataset.name = `uploadManagerFormalgorithmsItem`;
    algorithmElement.dataset.id = `uploadManagerFormalgorithmsItem${algorithm.NAME}`;
    algorithmElement.innerHTML = `
			<label 
				class="upload-manager__form__algorithms__item__label">

					<input 
						class="upload-manager__form__algorithms__item__input hidden-item" 
						name="hash-algorithm" 
						type="radio" 
						value="${algorithm.TAG}" 
						data-name="uploadManagerFormalgorithmsItemInput"
						data-id="uploadManagerFormalgorithmsItemInput${algorithm.NAME}">
								
					<p 
						class="upload-manager__form__algorithms__item__text" 
						data-name="uploadManagerFormalgorithmsItemText" 
						data-id="uploadManagerFormalgorithmsItemText${algorithm.NAME}">
							${algorithm.NAME}
					</p>
			</label>
		`;
    return algorithmElement;
  }

  get infoFileName() {
    return this.page.info.file.value.textContent;
  }

  set infoFileName(name) {
    this.page.info.file.value.textContent = name;
  }

  get infoFileHash() {
    return this.page.info.hash.value.textContent;
  }

  set infoFileHash(hash) {
    this.page.info.hash.value.textContent = hash;
  }

  set activeAlgorithm(algorithm) {
    this.page.form.dnd.input.dataset.algorithm = algorithm.TAG;
    this.page.form.algorithms.value.dataset.algorithm = algorithm.TAG;
    this.page.form.algorithms.value.textContent = algorithm.NAME;
  }

  get activeAlgorithm() {
    return this.page.form.dnd.input.dataset.algorithm;
  }

  addBacklightFormDndArea() {
    this.page.form.dnd.area.classList.add(
      `upload-manager__form__dnd__area_active`,
    );
  }

  removeBacklightFormDndArea() {
    this.page.form.dnd.area.classList.remove(
      `upload-manager__form__dnd__area_active`,
    );
  }

  changeActiveAlgorithm(algorithm) {
    this.activeAlgorithm = algorithm;

    this.page.form.algorithms.list
      .querySelector(`.upload-manager__form__algorithms__item_active`)
      .classList.remove(`upload-manager__form__algorithms__item_active`);

    this.page.form.algorithms.list
      .querySelector(`[data-algorithm="${algorithm.TAG}"]`)
      .classList.add(`upload-manager__form__algorithms__item_active`);
  }

  showListAlgorithms() {
    this.page.form.algorithms.value.classList.add(
      `upload-manager__form__algorithms__value_active`,
    );
    this.page.form.algorithms.value.classList.add(
      `upload-manager__form__algorithms__value_show-list`,
    );
    this.page.form.algorithms.list.classList.remove(`hidden-item`);
  }

  hideListAlgorithms() {
    this.page.form.algorithms.value.classList.remove(
      `upload-manager__form__algorithms__value_active`,
    );
    this.page.form.algorithms.value.classList.remove(
      `upload-manager__form__algorithms__value_show-list`,
    );
    this.page.form.algorithms.list.classList.add(`hidden-item`);
  }

  addNewEventListener(target, event, callback) {
    const targetField = this.eventListeners[target];
    targetField[event].add(callback);
  }
}
