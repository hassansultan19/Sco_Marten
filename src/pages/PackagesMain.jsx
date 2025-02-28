import Packages from "../components/Packages";

export default function PackagesMain() {
  return (
    <main className="min-h-screen bg-black">
      <div className="py-20 bg-gradient-to-b from-red-700 to-red-800">
        <h1 className="text-5xl font-bold text-center text-white mb-4">Elevate Your Online Presence</h1>
        <p className="text-xl text-center text-white">with our Feature Profile Packages</p>
      </div>
      <Packages />
    </main>
  )
}

