import React from 'react'
import ReactDOM from 'react-dom'
import "./index.css"

// https://stackoverflow.com/questions/35537229/how-can-i-update-the-parents-state-in-react
// https://www.digitalocean.com/community/tutorials/react-modal-component
// https://www.educative.io/edpresso/what-is-global-state-with-react

interface Person {
    name: string
    color: string
    busyTime: number[] | null
}

class Hour extends React.Component<{ index: Number, person: Person }, { isFree: boolean }> {
    constructor(props: any) {
        super(props)
        this.state = {
            isFree: true
        }
    }

    render() {
        return (
            <div
                onClick={() => this.setState({ isFree: !this.state.isFree })}
                // style={this.state.isFree ?
                //     { backgroundColor: 'yellow' } : { backgroundColor: 'purple' }}>
                style={{ backgroundColor: this.state.isFree ? 'yellow' : this.props.person.color, margin: '4px' }}>
                <span
                    style={{ backgroundColor: 'yellow' }}
                // {/* style={{ backgroundColor: this.state.isFree ? 'yellow' : 'purple', margin: '4px' }} */}
                >{this.state.isFree ? 'Free' : 'Busy'}</span>
                Hour: {this.props.index}
            </div>
        )
    }
}

class PeopleHandler extends React.Component<{ setter: Function, firstPerson: Person }, { people: Person[], showModal: boolean, nameValue: string, colorValue: string }> {
    constructor(props: any) {
        super(props)
        this.state = { people: [this.props.firstPerson], showModal: false, nameValue: '', colorValue: '' }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        if (event.currentTarget.name === 'nameValue') {
            this.setState({ nameValue: event.currentTarget.value })
        }
        else if (event.currentTarget.name === 'colorValue') {
            this.setState({ colorValue: event.currentTarget.value })
        }
    }

    handleSubmit(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()
        let person: Person = { color: this.state.colorValue, name: this.state.nameValue, busyTime: null }
        this.setState({ people: [...this.state.people, person] })
        this.props.setter(person)
    }

    render() {
        return (
            <div>
                {
                    this.state.people.map((v, i) =>
                        <div key={i} style={{ backgroundColor: v.color }}
                            onClick={() => this.props.setter(v)}>Name: {v.name}</div>
                    )
                }
                <button className='bg-blue-600' onClick={() => this.setState({ showModal: true })} >Add Person</button>
                {this.state.showModal ?
                    <div style={{ top: '5%', left: '5%', width: '90%', height: '90%' }} className='fixed  bg-blue-500'>
                        <form>
                            <label>
                                Name:
                                <input type="text" name="nameValue" value={this.state.nameValue} onChange={this.handleInputChange} />
                            </label>
                            <label>
                                Color:
                                <input type="text" name="colorValue" value={this.state.colorValue} onChange={this.handleInputChange} />
                            </label>
                            <button onClick={this.handleSubmit}>Submit</button>
                        </form>
                        <div onClick={() => this.setState({ showModal: false })}>close</div>
                    </div>
                    : null}
            </div>
        )
    }
}

class App extends React.Component<{}, { currentPerson: Person }>{
    firstPerson: Person
    constructor(props: any) {
        super(props)
        this.firstPerson = { name: 'guest', color: 'pink', busyTime: null }

        this.setPerson = this.setPerson.bind(this)
        this.state = { currentPerson: this.firstPerson }
    }

    setPerson(person: Person) {
        this.setState({
            currentPerson: person
        })
    }

    render() {
        return (
            <div>
                <PeopleHandler setter={this.setPerson} firstPerson={this.firstPerson} />
                {
                    Array.from({ length: 24 }).map((v, i) => <Hour key={i} index={i} person={this.state.currentPerson} />)
                }
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));