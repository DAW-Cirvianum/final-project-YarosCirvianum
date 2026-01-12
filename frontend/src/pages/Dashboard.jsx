import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DevicesList from "../components/DevicesList";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

          <DevicesList />
        </main>
      </div>
    </div>
  );
}
