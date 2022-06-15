import React, {
  MouseEventHandler,
  ReactElement,
  useState,
  useRef,
} from "react";
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
const Button: React.FC<ButtonProps> = (props) => {
  return (
    <div
      className="cursor-pointer bg-blue-200 hover:bg-blue-500 text-black rounded-md w-min p-2"
      onClick={props.onClick}
    >
      <pre>{props.text}</pre>
    </div>
  );
};

const UselessButton: React.FC<{ text: string }> = (props) => {
  return (
    <div className="border-4 bg-red-600 border-red-600 w-min rounded-md">
      <Button onClick={() => {}} text={props.text} />
    </div>
  );
};

const FunctionalPeopleModal: React.FC<{
  showModal: boolean;
  submitter: Function;
  closeModal: Function;
}> = (props) => {
  const [nameValue, setNameValue] = useState("");
  const [colorValue, setColorValue] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  let modalName = String(Math.random());
  return props.showModal ? (
    <div
      className="fixed top-0 left-0 w-full h-full z-40 bg-opacity-90 bg-black"
      onClick={(e) => {
        if (e.target !== modalRef.current) {
          props.closeModal(e);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          props.closeModal(e);
        }
      }}
    >
      <div
        ref={modalRef}
        style={{ top: "20%", left: "20%", width: "60%", height: "60%" }}
        className="fixed bg-gray-800 z-40 text-black"
      >
        <form>
          <label>
            Name:
            <input
              autoFocus
              type="text"
              name="nameValue"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              name="colorValue"
              value={colorValue}
              onChange={(e) => setColorValue(e.target.value)}
            />
          </label>
          <button
            onClick={(e) => {
              setColorValue("");
              setNameValue("");
              e.preventDefault();
              props.submitter(nameValue, colorValue);
              props.closeModal(e);
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

const FunctionalPeopleHandler: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([
    new Person("guest", randomColor()),
  ]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [CPI, setCPI] = useState<number>(0);

  const addPerson = (name: string, color: string) => {
    setPeople([...people, new Person(name, color)]);
    setCPI(people.length);
  };

  const changeTime = (n: number) => {
    let p = people;
    let c = p[CPI];
    c.busyTime[n] = !c.busyTime[n];
    p[CPI] = c;
    // https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
    setPeople([...p]);
  };

  const reset = () => {
    setPeople([new Person("guest", randomColor())]);
    setCPI(0);
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)} text="Add Person" />
      <Button
        onClick={() => {
          addPerson(randomName(), randomColor());
        }}
        text="Add Random"
      />
      <Button text="Reset" onClick={reset} />
      <UselessButton text="Save to Server" />
      <UselessButton text="Load from Server" />
      <FunctionalPeopleModal
        showModal={showModal}
        submitter={addPerson}
        closeModal={() => setShowModal(false)}
      />

      <TimeHandler
        people={people}
        personTimeEditor={changeTime}
        changeCPI={setCPI}
      />
    </div>
  );
};

interface TimeHandlerProps {
  people: Person[];
  // cpi: number;
  personTimeEditor: (timeIndex: number) => void;
  changeCPI: (i: number) => void;
}

const TimeHandler: React.FC<TimeHandlerProps> = (props: TimeHandlerProps) => {
  const [hoursMode, setHoursMode] = useState<"daytime" | "nighttime" | "all">(
    "all"
  );
  const [timeMode, setTimeMode] = useState<"ampm" | "24hr">("ampm");
  // total percent of people busy at a time index
  const busyAt = (index: number) => {
    let res =
      props.people.filter((person) => person.busyTime[index]).length /
      props.people.length;

    return res * 100;
  };
  // daytime hours mean 7am to 10pm
  return (
    <div className=" absolute" style={{ width: "60%", left: "20%" }}>
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
              <div className="bg-gray-800 w-min m-auto rounded-md h-16 text-lg p-2 flex justify-center items-center">
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

const App: React.FC = () => {
  return (
    <div>
      <FunctionalPeopleHandler />
      {/* <PeopleHandler /> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
