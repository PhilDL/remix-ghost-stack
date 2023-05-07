import { useState } from "react";

type CounterProps = {
  initialValue: number;
};

export function Counter({ initialValue }: CounterProps) {
  let [count, setCount] = useState(initialValue);
  return (
    <div className="border-bg-gray-300 border-1 relative my-4 flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-6 shadow-lg">
      <span className="absolute right-3 top-1.5 font-mono text-sm text-gray-200">
        Button.tsx
      </span>
      <div className="flex gap-3">
        <button
          onClick={() => setCount((current) => current - 1)}
          type="button"
          className="border-bg-cornflower-600 rounded-lg bg-cornflower-500 px-4 py-1 text-white"
        >
          Decrement
        </button>
        <output className="flex w-10 items-center justify-center rounded-lg bg-black p-2 text-white">
          {count}
        </output>
        <button
          onClick={() => setCount((current) => current + 1)}
          type="button"
          className="border-bg-cornflower-600 rounded-lg bg-cornflower-500 px-3 py-1 text-white"
        >
          Increment
        </button>
      </div>
    </div>
  );
}

export let scheme = {
  render: Counter.name,
  description: "Displays a counter with the initial value provided",
  children: [],
  attributes: {
    initialValue: {
      type: Number,
      default: 0,
    },
  },
};
