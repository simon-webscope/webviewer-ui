import { addActionButtonObject } from 'actions/internalActions';

export default store => (actionButtonObject) => {
  store.dispatch(addActionButtonObject(actionButtonObject));
}