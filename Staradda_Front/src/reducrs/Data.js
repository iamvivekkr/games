export const initialState = {
    loginParam:""
};

export const ChangeData = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_PARAMS": return {
            ...state,
            loginParam:action.payload
        }
    }
}