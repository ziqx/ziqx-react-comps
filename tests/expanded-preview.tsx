import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Input,
  Select,
  DatePicker,
  Popover,
  PopoverClose,
} from "../src/index.js";
import { fr } from "react-day-picker/locale";

function App() {
  const [submitted, setSubmitted] = useState("");
  const [controlled, setControlled] = useState("active");
  const [due, setDue] = useState("2026-09-08");
  return (
    <main>
      <h1>Shared controls</h1>
      <p>Date picker · Select · Popover</p>
      <form
        id="demo"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(
            JSON.stringify(
              Object.fromEntries(new FormData(event.currentTarget)),
            ),
          );
        }}
      >
        <section>
          <h2>Native forms</h2>
          <div className="grid">
            <Select
              label="Owner"
              name="owner"
              defaultValue=""
              options={[
                { value: "", label: "Unassigned" },
                { value: "alice", label: "Alice" },
                { value: "bob", label: "Bob" },
                { value: "__ziqx_empty_value__", label: "Literal sentinel" },
                { value: "disabled", label: "Unavailable", disabled: true },
              ]}
              description="Includes an empty option and a disabled option."
            />
            <DatePicker
              label="Due date"
              name="due"
              defaultValue="2026-09-08"
              minDate="2026-09-01"
              maxDate="2026-09-30"
              description="Limited to September 2026."
            />
            <Select
              label="Required priority"
              name="priority"
              required
              options={[
                { value: "low", label: "Low" },
                { value: "high", label: "High" },
              ]}
              placeholder="Choose priority"
            />
            <DatePicker
              label="Required date"
              name="requiredDate"
              required
              minDate="2026-09-01"
              maxDate="2026-09-30"
            />
          </div>
          <div className="row">
            <Button type="submit">Submit form</Button>
            <Button type="reset" bgColor="#fff" fgColor="#171717">
              Reset form
            </Button>
          </div>
          <output id="submitted">{submitted}</output>
        </section>
      </form>
      <section>
        <h2>Controlled and constrained</h2>
        <div className="grid">
          <Select
            label="Status"
            value={controlled}
            onValueChange={setControlled}
            options={[
              { value: "active", label: "Active" },
              { value: "done", label: "Done" },
            ]}
          />
          <output id="controlled">{controlled}</output>
          <DatePicker
            label="Weekdays only"
            value={due}
            onValueChange={setDue}
            disabledDates={{ dayOfWeek: [0, 6] }}
            calendarProps={{
              defaultMonth: new Date(2026, 8, 1),
              today: new Date(2026, 8, 12),
            }}
          />
          <DatePicker
            label="Future only"
            minDate="2030-01-01"
            maxDate="2030-12-31"
          />
          <DatePicker
            label="French calendar"
            locale={fr}
            clearLabel="Effacer"
            todayLabel="Aujourd’hui"
            placeholder="Choisir une date"
            calendarProps={{
              captionLayout: "dropdown",
              startMonth: new Date(2020, 0),
              endMonth: new Date(2030, 11),
            }}
          />
          <Select
            label="Long list"
            options={Array.from({ length: 60 }, (_, i) => ({
              value: String(i),
              label: `Option ${i + 1}`,
            }))}
          />
        </div>
      </section>
      <section className="dark">
        <h2>Dark surface and compact controls</h2>
        <div className="grid">
          <Select
            label="Dark select"
            bgColor="#171717"
            fgColor="#f5f5f5"
            defaultValue="one"
            options={[
              { value: "one", label: "Option one" },
              { value: "two", label: "Option two" },
            ]}
          />
          <DatePicker
            label="Dark date"
            bgColor="#171717"
            fgColor="#f5f5f5"
            defaultValue="2026-09-08"
          />
          <Select
            label="Disabled select"
            bgColor="#171717"
            fgColor="#f5f5f5"
            disabled
            options={[]}
          />
          <DatePicker
            label="Disabled date"
            bgColor="#171717"
            fgColor="#f5f5f5"
            disabled
          />
        </div>
      </section>
      <section>
        <h2>Popover</h2>
        <div className="row">
          <Popover
            trigger={<Button>Open filters</Button>}
            ariaLabel="Filter tasks"
          >
            <strong>Filter tasks</strong>
            <Input label="Search tasks" placeholder="Search…" />
            <PopoverClose asChild>
              <Button>Done</Button>
            </PopoverClose>
          </Popover>
          <Popover
            trigger={<Button bgColor="#171717">Nested controls</Button>}
            ariaLabel="Task settings"
          >
            <Select
              label="Nested priority"
              options={[
                { value: "low", label: "Low" },
                { value: "high", label: "High" },
              ]}
            />
            <DatePicker label="Nested date" defaultValue="2026-09-08" />
          </Popover>
        </div>
      </section>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
