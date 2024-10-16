export const MESSAGES = {
    API_MESSAGES: {
        SIGN_UP: {
            200: {
                TYPE: 'success',
                TITLE: 'Registration successful!',
                MESSAGE: 'You can now log in.'
            },
            400: {
                TYPE: 'error',
                TITLE: 'Registration failed!',
                MESSAGE: 'Username or email already exists.'
            },
            500: {
                TYPE: 'error',
                TITLE: 'Registration failed!',
                MESSAGE: 'Something went wrong.'
            }
        },
        POST_QUIZ: {
            200: {
                TYPE: 'success',
                TITLE: 'Quiz created successfully!',
                MESSAGE: 'You can now view your quiz.'
            },
            400: {
                TYPE: 'error',
                TITLE: 'Quiz creation failed!',
                MESSAGE: 'Something went wrong.'
            },
            500: {
                TYPE: 'error',
                TITLE: 'Quiz creation failed!',
                MESSAGE: 'Something went wrong.'
            }
        }
    },    
    ERROR: {
        STATUS_MESSAGES: {
            401: "You are not authorized to access the resource.",
            403: "You are not authorized to access the resource. Try logging in or registering",
        },        
        FEATURE_MESSAGES: {
            FETCH_QUIZZES: 'There was an error retrieving your quizzes',
            LOGIN: 'Unable to login',
            INVALID_CREDENTIALS: 'Invalid Credentials: check your credentials and try again.',
            DEFAULT_ERROR: 'There was an error performing you request. Try again later and, if the problem persist, contact support.'
        },
        DEFAULT_TITLE: 'There was an error:'
        
    }
}