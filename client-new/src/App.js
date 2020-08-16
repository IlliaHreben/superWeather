import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      historyWeather: {}
    }
  }

  componentDidMount() {
    window.fetch(`/api/showhistory`)
      .then(res => res.text())
      .then(JSON.parse)
      .then(body => {
        if (body.ok) {
          return body.data
        }
        throw body.error
      })
      .catch(err => {
        console.log(err)
      })
      .then(data => {
        this.setState({historyWeather: data})
      })
  }

  render () {
    return (<div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>)
  };
}

export default App;
