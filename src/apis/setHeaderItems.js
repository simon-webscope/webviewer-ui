import actions from 'actions';

export default store => callback => {
  const state = store.getState();
  const headerGroups = Object.keys(state.viewer.headers);
  let header = Object.create(Header).initialize(state.viewer, store.dispatch);

  callback(header);
  headerGroups.forEach(headerGroup => {
    store.dispatch(actions.setHeaderItems(headerGroup, [ ...header.headers[headerGroup] ]));
  });
};

const Header = {
  initialize(viewerState, dispatch) {
    this.headers = viewerState.headers;
    this.toolButtonObjects = viewerState.toolButtonObjects;
    this.headerGroup = 'default'; 
    this.index = -1;
    this.dispatch = dispatch;
    return this;
  },
  get(dataElement) {
    if (this.index !== -1) {
      // get(dataElement) has been called before so we need to reset this
      const item = this.headers[this.headerGroup][this.index];
      Object.keys(item).forEach(key => {
        delete this[key];
      });
    }

    this._setIndex(dataElement);

    if (this.index === -1) {
      console.warn(`${dataElement} does not exist in ${this.headerGroup} header`);
    } else {
      const item = this.headers[this.headerGroup][this.index];
      Object.keys(item).forEach(key => this[key] = item[key]);
    }

    return this;
  },
  getItems() {
    return this.headers[this.headerGroup];
  },
  getHeader(headerGroup) {
    const headerGroups = Object.keys(this.headers);

    if (headerGroups.includes(headerGroup)) {
      this.headerGroup = headerGroup;
      this._resetIndex();
    } else {
      console.warn(`Header must be one of: ${headerGroups.join(' or ')}.`);
    }
    
    return this;
  },
  insertBefore(newItem) {
    if (this.index === -1) {
      console.warn('Please use .get(dataElement) first before using insertBefore');
    } else {
      this.headers[this.headerGroup].splice(this.index, 0, newItem);
    }

    return this;
  },
  insertAfter(newItem) {
    if (this.index === -1) {
      console.warn('Please use .get(dataElement) first before using insertAfter');
    } else {
      this.index++;
      this.headers[this.headerGroup].splice(this.index, 0, newItem);
    }

    return this;
  },
  delete(arg) {
    let index;

    if (typeof arg === 'number') {
      index = arg;
    } else if (typeof arg === 'string') {
      if (this._getIndexOfElement(arg) === -1) {
        console.warn(`${arg} does not exist in ${this.headerGroup} header`);
      } else {
        index = this._getIndexOfElement(arg);
      }
    } else if (typeof arg === 'undefined') {
      if (this.index === -1) {
        console.warn('Please use .get(dataElement) first before using delete()');
      } else {
        index = this.index;
      }
    } else if (Array.isArray(arg)) {
      arg.forEach(arg => {
        if (typeof arg === 'number' || typeof arg === 'string') {
          this.delete(arg);
        }
      });
    } else {
      console.warn('Argument must be empty, a number, a string or an array');
    }

    if (index) {
      this.headers[this.headerGroup].splice(index, 1);
      this._resetIndex();
    }
  },
  shift() {
    this.headers[this.headerGroup].shift();
    
    return this;
  },
  unshift(...newItem) {
    this.headers[this.headerGroup].unshift(...newItem);
    
    return this;
  },
  push(...newItem) {
    let existingItem = null;
    Object.keys(this.headers[this.headerGroup]).forEach((item) => {
      if (this.headers[this.headerGroup][item]['dataElement'] === newItem[0]['dataElement']){
        existingItem = this.headers[this.headerGroup][item];
      }
    })
    // if header item already exists, override its properties
    if (existingItem) {
      existingItem = [{ ...existingItem, ...newItem[0] }];
    } else {
      existingItem = newItem;
    }
    
    if (newItem[0].group !== undefined){
      this.dispatch(actions.addActionButtonObject(...existingItem));
    } else {
      if (existingItem){
        if (newItem[0].type === 'GroupButton') {
          this.delete(existingItem[0]['dataElement']);
          this.headers[this.headerGroup].push(...existingItem);
        }
        this.get(existingItem[0]['dataElement']).insertAfter(...existingItem);
        this.delete(existingItem[0]['dataElement']);
      } else {
        this.headers[this.headerGroup].push(...existingItem);
      }
    }
    return this;
  },
  pop() {
    this.headers[this.headerGroup].pop();
    
    return this;
  },
  /* rethink update later */
  update(arg) {
    // if (typeof arg === 'object') {
    //   this._updateItem(arg);
    // }
    if (Array.isArray(arg)) {
      this._updateItems(arg);
    } else {
      console.warn('Argument must be an array');
    }

    return this;
  },
  // _updateItem(obj) {
  //   if (this.index === -1) {
  //     console.warn('Please use .get(dataElement) first before using update');
  //   } else {
  //     const item = this.headers[this.headerGroup][this.index];

  //     Object.keys(obj).forEach(key => {
  //       item[key] = obj[key];
  //     });
  //   }

  //   return this;
  // },
  _updateItems(items) {
    this.headers[this.headerGroup] = items;
    
    return this;
  },
  _setIndex(dataElement) {
    this.index = this._getIndexOfElement(dataElement);
  },
  _getIndexOfElement(dataElement) {
    return this.headers[this.headerGroup].findIndex(item => {
      let dataElementOfItem;
      
      if (item.type === 'toolButton') {
        dataElementOfItem = this.toolButtonObjects[item.toolName].dataElement;
      } else {
        dataElementOfItem = item.dataElement;
      }
      
      return dataElementOfItem === dataElement;
    }); 
  },
  _resetIndex() {
    this.index = -1;
  }
};