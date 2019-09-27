import { UPLOAD_RESPONSE} from "../actionTypes";



const uploadReducer = (state = { uploadResponse: [],uploaded:false }, action) => {
  switch (action.type) {
    case UPLOAD_RESPONSE:
      console.log(action.payload)
        console.log(`type: ${action.type} , state: ${state.uploadResponse}, payload ${action.payload.text}`)
        console.log(action.payload.response)
        console.log(action.payload.uploaded)
      return { ...state, uploadResponse:action.payload.response,uploaded:action.payload.uploaded  };
    
    default:
      return state;
  }
};
export default uploadReducer;