import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {
    render() {
        //console.log(this.props.isBold)
        return (
        <button className="square"  style={{color:this.props.isBold?'red':'black'}} onClick={this.props.onClick}>{this.props.value}</button>
        )
    }
}
  
class Board extends React.Component {
    renderSquare(i,isBold) {
        //console.log(isBold)
      return (
            <Square
                key={i} 
                value={this.props.squares[i]}
                onClick={()=>this.props.onClick(i)}   
                isBold={isBold}
            />
        );
    }
  
    render() {
        //const status = 'Next player: '+(this.state.xIsNext?'X':'O')
        let content=[]
        const [x,y,z]=this.props.win_pos
        for(let i=0;i<3;i++){
            let temp=[]
            for(let j=i*3;j<(i+1)*3;j++){
                if((x!==null && x===j) || (y!==null && y===j) || (z!==null && z===j)){
                    temp.push(this.renderSquare(j,true))
                }else{
                    temp.push(this.renderSquare(j,false))
                }
                
            }
            content.push(<div key={i} className="board-row" >{temp}</div>)
        }
        return (
            <div>
                {content}
            </div>
        )       
    }
}
  
class Game extends React.Component {
    constructor(props){
        super(props)
        this.state={
            history:[{squares:Array(9).fill(null),position:Array(2).fill(null),char:''}],
            xIsNext:true,
            stepNumber:0,
            order:true
        }
    }

    handleClick(i){
        //console.log('in handleclick')
        const history=this.state.history.slice(0,this.state.stepNumber+1)
        const current=history[history.length-1]
        const squares=current.squares.slice()
        if (calculateWinner(squares)[0] || squares[i]) return null

        squares[i]=this.state.xIsNext? 'X':'O'
        this.setState({
            history:history.concat({squares:squares,position:[Math.floor(i/3),i%3],char:squares[i]}),
            stepNumber:history.length,
            xIsNext:!this.state.xIsNext,
        })
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)===0,
        })
    }

    toggleOrder(){
        this.setState({
            order:!this.state.order
        })
    }


    //the render funciton will be called every time the setState is called
    //that's why we can see the changes
    render() {
        const history=this.state.history
        const current=history[this.state.stepNumber]
        const [winner,a,b,c]=calculateWinner(current.squares)
        //console.log(winner)
        const moves=history.map((step,move)=>{
            const desc=move?'Go to move # '+move+ ` ${history[move].char} (${history[move].position[0]},${history[move].position[1]})` :'Go to game start'
            return(
                <li key={move}>
                    <button className={'moveButton'} onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        if (!this.state.order){
            moves.reverse()
        }


        let status
        if(winner){
            status='Winner is: '+winner
        }else{
            if(this.state.stepNumber===9){
                status='Draw'
            }else{
                status='Next move is: '+(this.state.xIsNext?'X':'O')
            }
            
        }
        //console.log(status)
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i)=>this.handleClick(i)}
                        win_pos={[a,b,c]}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div>
                    <button className='toggle' onClick={()=>this.toggleOrder()}>Change order of moves</button> 
                </div>
            </div>
        )
    }   
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares){
    const lines=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for(let i=0;i<lines.length;i++){
        const[a,b,c]=lines[i]
        if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
            return [squares[a],a,b,c]
        }
    }
    return Array(4).fill(null)
}
  