import { articleActionTypes } from "./articleActionTypes";
import * as services from "./../../services/articleApi";

///////////// GET ARTICLES ///////////
export function getArticlesStart() {
  return {
    type: articleActionTypes.GET_ARTICLES_START,
  };
}
export function getArticlesSuccess(articles) {
  return {
    type: articleActionTypes.GET_ARTICLES_SUCCESS,
    payload: articles,
    message: { type: "success", text: "Successfully fetched articles" },
  };
}
export function getArticlesError(err) {
  return {
    type: articleActionTypes.GET_ARTICLES_ERROR,
    message: { type: "error", text: err || "Error fetching articles" },
  };
}

export function getArticles(query) {
  return (dispatch) => {
    dispatch(getArticlesStart());
    services.getArticlesService(query).then(
      (response) => {
        dispatch(getArticlesSuccess(response.data.data));
      },
      (err) => {
        const { response } = err;
        const { request, ...errorObject } = response;
        dispatch(getArticlesError(errorObject.data.message || errorObject.data));
      }
    );
  };
}
