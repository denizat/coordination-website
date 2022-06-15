import React, { MouseEventHandler, ReactElement } from "react";
import ReactDOM from "react-dom";
import "./index.css";
// https://random.responsiveimages.io/
// https://tailwindcss.com/docs/customizing-colors
// https://www.freecodecamp.org/news/how-to-center-anything-with-css-align-a-div-text-and-more/

const randomColor = () => {
  let c = "#" + Math.floor(Math.random() * 16777215).toString(16);
  if (c.length < 7) {
    c += "0";
  }

  return c;
};

const randomName = () => {
  return (
    Math.random().toString(36).substring(2, 7) +
    " " +
    Math.random().toString(36).substring(2, 7)
  );
};

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

interface ButtonProps {
  onClick: MouseEventHandler;
  text: string;
}
const Button: React.FC<ButtonProps> = (props: ButtonProps): ReactElement => {
  return (
    <div
      className="cursor-pointer bg-blue-200 hover:bg-blue-500 text-black rounded-md w-min p-2"
      onClick={props.onClick}
    >
      <pre>{props.text}</pre>
    </div>
  );
};

class PeopleModal extends React.Component<
  { showModal: boolean; submitter: Function; closeModal: Function },
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
    let modalName = String(Math.random());
    return this.props.showModal ? (
      <div
        className="fixed top-0 left-0 w-full h-full z-40 bg-opacity-90 bg-black"
        onClick={(e) => {
          if (e.target !== document.getElementById(modalName)) {
            this.props.closeModal(e);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            this.props.closeModal(e);
          }
        }}
      >
        <div
          id={modalName}
          style={{ top: "20%", left: "20%", width: "40%", height: "40%" }}
          className="fixed  bg-blue-500 z-40 text-black"
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
          {/* <Button onClick={this.props.closeModal} text="close" /> */}
        </div>
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
      people: [new Person("guest", randomColor())],
      showModal: false,
      CPI: 0,
    };
    this.addPerson = this.addPerson.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.changeCPI = this.changeCPI.bind(this);
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
        {/* {people.map((v, i) => (
          <div
            key={i}
            style={{ backgroundColor: v.color }}
            onClick={() => this.changeCPI(i)}
          >
            Name: {v.name}
          </div>
        ))}
        <div>Current CPI: {this.state.CPI}</div>
        <div>Current Person: {this.state.people[this.state.CPI].name}</div> */}
        <Button
          onClick={() => this.setState({ showModal: true })}
          text="Add Person"
        />
        <Button
          onClick={() => {
            this.addPerson(randomName(), randomColor());
          }}
          text="Add Random"
        />
        <PeopleModal
          showModal={this.state.showModal}
          submitter={this.addPerson}
          closeModal={(() => this.setState({ showModal: false })).bind(this)}
        />

        <TimeHandler
          // cpi={this.state.CPI}
          people={this.state.people}
          personTimeEditor={this.changeTime}
          changeCPI={this.changeCPI}
        />
      </div>
    );
  }
}

interface TimeHandlerProps {
  people: Person[];
  // cpi: number;
  personTimeEditor: (timeIndex: number) => void;
  changeCPI: (i: number) => void;
}
const TimeHandler: React.FC<TimeHandlerProps> = (
  props: TimeHandlerProps
): ReactElement => {
  // total percent of people busy at a time index
  const busyAt = (index: number) => {
    let res =
      props.people.filter((person) => person.busyTime[index]).length /
      props.people.length;

    return res * 100;
  };
  // daytime hours mean 7am to 10pm
  return (
    <div className="w-1/2 left-1/4 absolute">
      <div className="border-4 border-purple-400 flex flex-row">
        <Button onClick={() => {}} text="Daytime" />
        <Button onClick={() => {}} text="Nighttime" />
        <Button onClick={() => {}} text="All" />
        <Button onClick={() => {}} text="AM/PM" />
        <Button onClick={() => {}} text="24Hr" />
      </div>
      <div className="flex flex-row cursor-pointer">
        {props.people.map((v, i) => {
          return (
            <div
              key={i}
              className="border-4  "
              onClick={() => props.changeCPI(i)}
              style={{
                width: String(100 / props.people.length) + "%", // there must be a proper way to do this
                display: "inline-block",
                borderColor: v.color,
                backgroundColor: v.color,
              }}
            >
              <div className="bg-gray-800 w-min m-auto rounded-md h-full text-lg p-2 flex justify-center items-center">
                {v.name}
              </div>
            </div>
          );
        })}
      </div>
      <div className="cursor-pointer">
        {Array.from({ length: 24 }).map((v, ai) => {
          return (
            <div
              className="border-4 border-blue-500 flex flex-row"
              key={ai}
              onClick={() => props.personTimeEditor(ai)}
            >
              <div
                className="inline-block select-none flex justify-center items-center absolute h-16"
                style={{
                  left: "-10%",
                  width: "10%",
                  backgroundColor: `hsl(0,100%,${100 - busyAt(ai) / 2}%`,
                }}
              >
                {ai % 12} {}
              </div>

              {props.people.map((v, i) => {
                return (
                  <div
                    key={i}
                    className="border-4 h-16"
                    style={{
                      width: String(100 / props.people.length) + "%", // there must be a proper way to do this
                      display: "inline-block",
                      borderColor: v.color,
                      backgroundColor: v.busyTime[ai] ? v.color : undefined,
                    }}
                  ></div>
                );
              })}

              {
                <div
                  className="inline-block select-none flex justify-center items-center absolute h-16"
                  style={{
                    left: "100%",
                    width: "10%",
                    backgroundColor: `hsl(0,100%,${100 - busyAt(ai) / 2}%`,
                  }}
                >
                  busy
                </div>
              }
            </div>
          );
        })}
      </div>
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
