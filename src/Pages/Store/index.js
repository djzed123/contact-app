import { createStore } from 'redux';

// let initialState = {
//   muffins: [
//     { name: 'Chocolate chip muffin', id: 1 },
//     { name: 'Blueberry muffin', id: 2 },
//   ],
// };

let initialState = {
  transfers: [
    { item: 'test', id: 99,  serialnumber: 'blah' },
  ],
};

const transferAssetsReducer = (state = initialState, action) => {
  if (action.type === 'add') {
    let { transfer } = action.payload;
    return {
      ...state,
      transfers: [...transfer],
    };
  }

  // if (action.type === 'add') {
  //   let { muffin } = action.payload;
  //   return {
  //     ...state,
  //     muffins: [...state.muffins, muffin],
  //   };
  // }

  if (action.type === 'remove') {
    let { muffin } = action.payload;

    //finding the index of the id to be deleted
    // const idToRemove = state.muffins.map(function(e) { return e.id; }).indexOf(muffin.id);

    const idToRemove = state.muffins.findIndex(function (wizard) {
      return wizard.id === muffin.id;
    });
    
    //if the id does exist we remove it, then return the updated array
    if (idToRemove > -1) {
      state.muffins.splice(idToRemove, 1); 
    }
    return {
      ...state,
      muffins: [...state.muffins],
    };
  }

  return state;
  
};

// const transferAssetsReducer = (state = { assetName: 'Test', serialNumber: 'cb-222' }, action) => {
//   if (action.type === 'add') {
//     return {
//       assetName: action.blah,
//       serialNumber: action.blow
//     }
//   }

//   return state;
  
// };

const store = createStore(transferAssetsReducer);

export default store;
