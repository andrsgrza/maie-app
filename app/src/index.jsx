import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QuizCreator from './components/QuizCreator';

class Maie extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className='maie-header'>
                    <h1>Maie</h1>
                </div>
                <QuizCreator />
            </React.Fragment>
        );
    }
}

const rootElement = document.getElementById('app');
const root = ReactDOM.createRoot(rootElement);
root.render(<Maie />);
