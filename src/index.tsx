import React, { MouseEventHandler, ReactElement } from "react";
import ReactDOM from "react-dom";
import "./index.css";
// interface Person {
//   name: string
//   color: string
//   busyTime: boolean[]
// }
class Person {
  name: string;
  color: string;
  busyTime: boolean[];
  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
    this.busyTime = new Array(24).fill(false);
  }
}

class PeopleModal extends React.Component<
  { showModal: boolean; submitter: Function; closeModal: MouseEventHandler },
  {
    nameValue: string;
    colorValue: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      nameValue: "",
      colorValue: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    if (event.currentTarget.name === "nameValue") {
      this.setState({ nameValue: event.currentTarget.value });
    } else if (event.currentTarget.name === "colorValue") {
      this.setState({ colorValue: event.currentTarget.value });
    }
  }

  handleSubmit(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.submitter(this.state.nameValue, this.state.colorValue);
  }

  render() {
    return this.props.showModal ? (
      <div
        style={{ top: "5%", left: "5%", width: "90%", height: "90%" }}
        className="fixed  bg-blue-500"
      >
        <form>
          <label>
            Name:
            <input
              autoFocus
              type="text"
              name="nameValue"
              value={this.state.nameValue}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              name="colorValue"
              value={this.state.colorValue}
              onChange={this.handleInputChange}
            />
          </label>
          <button
            onClick={(e) => {
              this.setState({
                colorValue: "",
                nameValue: "",
              });
              this.handleSubmit(e);
              this.props.closeModal(e);
            }}
          >
            Submit
          </button>
        </form>
        <div onClick={this.props.closeModal}>close</div>
      </div>
    ) : null;
  }
}

class PeopleHandler extends React.Component<
  {},
  {
    people: Person[];
    showModal: boolean;
    CPI: number; // current person index
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      people: [new Person("guest", "blue")],
      showModal: false,
      CPI: 0,
    };
    this.addPerson = this.addPerson.bind(this);
    this.changeTime = this.changeTime.bind(this);
  }

  addPerson(name: string, color: string) {
    let s = this.state;
    this.setState({
      CPI: s.people.length,
      people: [...s.people, new Person(name, color)],
    });
  }

  changeCPI(n: number) {
    this.setState({
      CPI: n,
    });
  }

  changeTime(n: number) {
    let p = this.state.people;
    let c = p[this.state.CPI];
    c.busyTime[n] = !c.busyTime[n];
    p[this.state.CPI] = c;
    this.setState({
      people: p,
    });
  }

  render() {
    let people = this.state.people;
    return (
      <div>
        {people.map((v, i) => (
          <div
            key={i}
            style={{ backgroundColor: v.color }}
            onClick={() => this.changeCPI(i)}
          >
            Name: {v.name}
          </div>
        ))}
        <div>Current CPI: {this.state.CPI}</div>
        <div>Current Person: {this.state.people[this.state.CPI].name}</div>
        <button
          className="bg-blue-600"
          onClick={() => this.setState({ showModal: true })}
        >
          Add Person
        </button>
        <PeopleModal
          showModal={this.state.showModal}
          submitter={this.addPerson}
          closeModal={(() => this.setState({ showModal: false })).bind(this)}
        />

        <TimeHandler
          // cpi={this.state.CPI}
          people={this.state.people}
          personTimeEditor={this.changeTime}
        />
      </div>
    );
  }
}

// class TimeHandler extends React.Component<{
//   people:Person[],
//   CPI: number,
//   personTimeEditor:Function,
// }
interface TimeHandlerProps {
  people: Person[];
  // cpi: number;
  personTimeEditor: (timeIndex: number) => void;
}
const TimeHandler: React.FC<TimeHandlerProps> = (
  props: TimeHandlerProps
): ReactElement => {
  return (
    <div className="w-3/5">
      HELLOOOOO
      <div>
        {props.people.map((v, i) => {
          return (
            <div
              key={i}
              className="border-4"
              style={{
                width: String(100 / props.people.length) + "%", // there must be a proper way to do this
                display: "inline-block",
                borderColor: v.color,
              }}
            >
              {v.name}
            </div>
          );
        })}
      </div>
      {Array.from({ length: 24 }).map((v, ai) => {
        return (
          <div
            className="border-4 border-blue-500"
            key={ai}
            onClick={() => props.personTimeEditor(ai)}
          >
            {/* {i} is person[0] busy now:{" "}
            {props.people[0].busyTime[i] ? "yes" : "no"} */}
            {props.people.map((v, i) => {
              return (
                <div
                  key={i}
                  className="border-4"
                  style={{
                    width: String(100 / props.people.length) + "%", // there must be a proper way to do this
                    display: "inline-block",
                    borderColor: v.color,
                  }}
                >
                  is person[{ai}] busy now?
                  {v.busyTime[ai] ? "yes" : "no"}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

class App extends React.Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div>
        <PeopleHandler />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
