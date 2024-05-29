import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'

class Maie extends React.Component{
    render(){
        return(
            <h1>Maie</h1>
        )
    }
}
const rootElement = document.getElementById("app")
const root = ReactDOM.createRoot(rootElement)
root.render(<Maie />)