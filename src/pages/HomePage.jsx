import ScanForm from "../components/ScanForm";

const HomePage = () => {
  return (
    <section className="p-8 text-center">
      <h2 className="text-2xl font-bold font-orbitron">Welcome to Website Security Checker</h2>
      <div id="get-started" className="mt-4 mb-8">
        <h3 className="text-xl font-orbitron">Get started</h3>

      </div>
      <ScanForm onStartScan={(url) => console.log("Starting scan for:", url)} />

    </section>
  );
};

export default HomePage;
