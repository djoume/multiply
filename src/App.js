import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { score: 0, guess: '', num1: 2, num2: 2, history: [], timeleft: 10 };

    this.onSubmit = this.onSubmit.bind(this);
    this.onGuessChange = this.onGuessChange.bind(this);
    this.generateRandom = this.generateRandom.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  render() {
    const { score, guess, num1, num2, history, timeleft } = this.state
    return (
      <div className="App">
        <div>
          <h2>Revise tes tables de multiplications!</h2>
            <form onSubmit={this.onSubmit}>
              {num1} x {num2} = 
              <input
                type="text"
                value={guess}
                onChange={this.onGuessChange}
              />
            </form>
          <h2>Ton score: {score} - Niveau {this.level()} - Temps restant: { timeleft }</h2>
        </div>
        <div className="App-history">
          { history.map(item => <div key={item.timestamp}><code>{item.message}</code></div>) }
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.generateRandom();
    this.startTimer();
  }

  onGuessChange(event) {
    this.setState({
      guess: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const { guess, num1, num2 } = this.state
    if (guess == num1 * num2) {
      this.updateScore(`Bravo!`, 4);
      this.setState({ guess: ''});
      this.generateRandom();
    } else {
      this.updateScore(`Mauvaise réponse! ${num1} x ${num2} n'est pas égal à ${guess}!`, -5);
    }
    console.log(this.state);
  }

  generateRandom() {
    this.setState({
      num1: this.random(),
      num2: this.random(),
    })
  }

  updateScore(message, score_diff) {
    const { history, score } = this.state;
    let new_score = score + score_diff;
    if (new_score > score)
      message += ` ${this.happyFace()} Yes! +`;
    else
      message += ` ${this.sadFace()} Oh no! `;
    message += `${new_score - score} point(s). Ton score: ${new_score}`;
    history.unshift({timestamp: Date.now() , message });
    this.setState({
      score: new_score,
      history
    });
    this.stopTimer();
    if (new_score >= 100) {
      history.unshift({timestamp: Date.now(), message: 'GAME OVER!!!'});
    } else {
      this.startTimer();
    }
  }

  random() {
    return 2 + Math.round(Math.random() * 10);
  }

  startTimer() {
    if (this.timerId) return;
    this.setState({ timeleft: this.timeAvailable()});
    this.timerId = setInterval(() => {
      let { timeleft } = this.state;
      timeleft -= 1;
      if (timeleft < 0) {
        this.updateScore("Trop lent!", - 1);
        timeleft = this.timeAvailable();
      }
      this.setState({ timeleft });
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.timerId);
    this.timerId = null;
  }

  level() {
    const { score } = this.state;
    if (score < 5)
      return 1
    if (score < 10)
      return 2
    if (score < 15)
      return 3
    if (score < 20)
      return 4
    if (score < 35)
      return 5
    if (score < 60)
      return 6
    if (score < 85)
      return 7
    if (score < 100)
      return 8
  }

  timeAvailable() {
    let level = this.level();
    if (level > 6)
      return 3
    if (level > 5)
      return 5
    if (level > 4)
      return 6
    if (level > 3)
      return 7
    if (level > 2)
      return 8
    return 10
  }

  happyFace() {
    switch(this.level()) {
    case 1:
      return '🙂'
    case 2:
      return '😀'
    case 3:
      return '😁'
    case 4:
      return '😛'
    case 5:
      return '😍'
    case 6:
      return '🤩'
    case 7:
      return '😎'
    default:
      return '🤓'
    }
  }

  sadFace() {
    let faces = ['🤔', '😐', '😢', '😕', '😱', '😡'];
    return faces[Math.round(Math.random() * (faces.length - 1))];
  }
}

export default App;
