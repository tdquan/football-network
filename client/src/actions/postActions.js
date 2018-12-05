import axios from 'axios';

import {
	ADD_POST,
	GET_POSTS,
	POST_LOADING,
	GET_ERRORS,
	DELETE_POST,
	SHOW_POST,
	CLEAR_ERRORS
} from './types';

// Add a new post
export const addPost = postData => dispatch => {
	dispatch(clearErrors());
	axios
		.post('/api/posts', postData)
		.then(res =>
			dispatch({
				type: ADD_POST,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Get all posts
export const getPosts = () => dispatch => {
	dispatch(setPostLoading());
	axios
		.get('/api/posts')
		.then(res =>
			dispatch({
				type: GET_POSTS,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_POSTS,
				payload: null
			})
		);
};

// Show post
export const showPost = id => dispatch => {
	dispatch(setPostLoading());
	axios
		.get(`/api/posts/${id}`)
		.then(res =>
			dispatch({
				type: SHOW_POST,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: SHOW_POST,
				payload: null
			})
		);
};

// Delete post
export const deletePost = id => dispatch => {
	axios
		.delete(`/api/posts/${id}`)
		.then(res =>
			dispatch({
				type: DELETE_POST,
				payload: id
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Upvote post
export const upvotePost = id => dispatch => {
	axios
		.post(`/api/posts/upvote/${id}`)
		.then(res => dispatch(getPosts()))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Downvote post
export const downvotePost = id => dispatch => {
	axios
		.post(`/api/posts/downvote/${id}`)
		.then(res => dispatch(getPosts()))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Add a new comment
export const addComment = (postId, commentData) => dispatch => {
	dispatch(clearErrors());
	axios
		.post(`/api/posts/${postId}/comments`, commentData)
		.then(res =>
			dispatch({
				type: SHOW_POST,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Delete comment
export const deleteComment = (postId, commentId) => dispatch => {
	axios
		.delete(`/api/posts/${postId}/comments/${commentId}`)
		.then(res =>
			dispatch({
				type: SHOW_POST,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set loading state
export const setPostLoading = () => {
	return {
		type: POST_LOADING
	};
};

// Clear errors
export const clearErrors = () => {
	return {
		type: CLEAR_ERRORS
	};
};
