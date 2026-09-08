import { useState, createRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Input,
  DotsLoader,
  BeatLoader,
  ZiqxLoader,
} from "../src/index.js";

const inputRef = createRef<HTMLInputElement>();
const Icon = ({ color, className }: { color?: string; className?: string }) => (
  <svg
    className={className}
    color={color}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
function App() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [clicks, setClicks] = useState(0);
  return (
    <main>
      <h1>Ziqx components</h1>
      <p>Shared React primitives · 0.1.0</p>
      <section>
        <h2>Buttons</h2>
        <div className="row">
          <Button>Default button</Button>
          <Button bgColor="#07815d" suffix={Icon}>
            Create task
          </Button>
          <Button bgColor="#2c67cb" prefix={Icon}>
            Continue
          </Button>
          <Button bgColor="#ffffff" fgColor="#171717">
            Light button
          </Button>
        </div>
        <div className="row">
          <Button bgColor="#07815d" variant="secondary">
            Secondary
          </Button>
          <Button bgColor="#ffffff" fgColor="#07815d" variant="outline">
            Outline
          </Button>
          <Button bgColor="#ffffff" fgColor="#07815d" variant="ghost">
            Ghost
          </Button>
          <Button disabled prefix={Icon}>
            Disabled
          </Button>
          <Button bgColor="#07815d" loading>
            Loading
          </Button>
        </div>
        <div className="row">
          <Button id="toggle" onClick={() => setLoading(!loading)}>
            Toggle loading
          </Button>
          <Button
            id="load-target"
            loading={loading}
            loadingLabel="Saving changes"
            bgColor="#07815d"
            onClick={() => setClicks(clicks + 1)}
          >
            Save changes
          </Button>
          <Button
            id="aria-disabled"
            aria-disabled
            onClick={() => setClicks(clicks + 1)}
          >
            Aria disabled
          </Button>
          <output id="clicks">{clicks}</output>
        </div>
      </section>
      <section>
        <h2>Inputs</h2>
        <div className="grid">
          <Input
            ref={inputRef}
            id="title"
            label="Task title"
            placeholder="What needs to be done?"
            prefix={Icon}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            description="Focus to see the inset ring."
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@ziqx.cc"
            error="Enter a valid email address"
          />
          <Input
            label="Disabled"
            defaultValue="Not editable"
            disabled
            suffix={Icon}
          />
          <Input label="Read only" defaultValue="TASK-1024" readOnly />
        </div>
        <div className="row">
          <Button onClick={() => inputRef.current?.focus()}>
            Focus input using ref
          </Button>
          <output id="value">{value}</output>
        </div>
      </section>
      <section style={{ background: "#171717", color: "#fff" }}>
        <h2>Dark surfaces</h2>
        <div className="row">
          <Button bgColor="#ffffff" fgColor="#171717">
            Light button
          </Button>
          <Button bgColor="#171717" fgColor="#ffffff" variant="outline">
            Outline
          </Button>
          <Button bgColor="#ffffff" fgColor="#171717" disabled>
            Disabled
          </Button>
          <Button bgColor="#ffffff" fgColor="#171717" loading>
            Loading
          </Button>
        </div>
        <Input
          label="Workspace"
          bgColor="#171717"
          fgColor="#ffffff"
          placeholder="Search workspaces"
          suffix={Icon}
        />
      </section>
      <section>
        <h2>Loaders</h2>
        <div className="row">
          <DotsLoader label="Dots" showLabel />
          <BeatLoader label="Beat" showLabel style={{ color: "#07815d" }} />
          <ZiqxLoader label="Ziqx" size="sm" />
        </div>
      </section>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
