import "./App.css";
import MultiSelect from "./components/MultiSelect";

function App() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[600px]">
      <h1 className="text-3xl">Rick And Morthy, MultiSelect Component Demo</h1>
      <MultiSelect />
    </div>
  );
}

export default App;
